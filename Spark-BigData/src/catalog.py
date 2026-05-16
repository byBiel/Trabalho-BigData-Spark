import re
import requests
from dataclasses import dataclass

DATASET_URL = "https://dados.mj.gov.br/dataset/reclamacoes-do-consumidor-gov-br"

MONTH_PT = {
    "janeiro": 1, "fevereiro": 2, "março": 3, "abril": 4,
    "maio": 5, "junho": 6, "julho": 7, "agosto": 8,
    "setembro": 9, "outubro": 10, "novembro": 11, "dezembro": 12,
}


@dataclass
class CatalogEntry:
    title: str
    resource_path: str
    year: int
    month: int | None
    semester: int | None


def _parse_entry(title: str, resource_path: str) -> "CatalogEntry | None":
    if title.startswith("Dicionário"):
        return None

    # Monthly: "Base Completa Consumidor.gov.br - Janeiro_2020"
    m = re.search(r"-\s+([A-Za-záéíóúãõçÁÉÍÓÚÃÕÇ]+)_(\d{4})\s*$", title)
    if m:
        month_name = m.group(1).lower()
        year = int(m.group(2))
        month = MONTH_PT.get(month_name)
        if month is not None:
            return CatalogEntry(title=title, resource_path=resource_path, year=year, month=month, semester=None)

    # Semi-annual: "Dados Consumidor.gov.br - 2018_1ºSemestre"
    m = re.search(r"-\s+(\d{4})_(\d)[ºo°]", title, re.IGNORECASE)
    if m:
        year = int(m.group(1))
        semester = int(m.group(2))
        return CatalogEntry(title=title, resource_path=resource_path, year=year, month=None, semester=semester)

    # Annual: "Dados Consumidor.gov.br - 2014"
    m = re.search(r"-\s+(\d{4})\s*$", title)
    if m:
        year = int(m.group(1))
        return CatalogEntry(title=title, resource_path=resource_path, year=year, month=None, semester=None)

    return None


def build_catalog() -> list[CatalogEntry]:
    print("[EXTRACT] Scraping resource catalog from dataset page...", flush=True)
    resp = requests.get(DATASET_URL, timeout=30)
    resp.raise_for_status()
    html = resp.text

    # Extract resource-item <li> blocks
    li_pattern = re.compile(
        r'<li[^>]*class="[^"]*resource-item[^"]*"[^>]*>(.*?)</li>',
        re.DOTALL,
    )
    title_pattern = re.compile(r'title="([^"]+)"')
    href_pattern = re.compile(r'href="(/dataset/[^"]+/resource/[^"]+)"')

    entries = []
    for li_match in li_pattern.finditer(html):
        block = li_match.group(1)
        title_m = title_pattern.search(block)
        href_m = href_pattern.search(block)
        if not title_m or not href_m:
            continue
        title = title_m.group(1).strip()
        resource_path = href_m.group(1).strip()
        entry = _parse_entry(title, resource_path)
        if entry is not None:
            entries.append(entry)

    entries.sort(key=lambda e: (e.year, e.month or 0, e.semester or 0))
    print(f"[EXTRACT] Catalog built: {len(entries)} data resources found", flush=True)
    return entries


def resolve_period(catalog: list[CatalogEntry], period_str: str) -> list[CatalogEntry]:
    parts = period_str.split("-")
    year = int(parts[0])
    month = int(parts[1]) if len(parts) > 1 else None

    if month is not None:
        matched = [e for e in catalog if e.year == year and e.month == month]
    else:
        matched = [e for e in catalog if e.year == year]

    if not matched:
        raise ValueError(f"No catalog entries found for period '{period_str}'")
    return matched


def newest_period(catalog: list[CatalogEntry]) -> list[CatalogEntry]:
    monthly = [e for e in catalog if e.month is not None]
    if not monthly:
        raise ValueError("No monthly entries in catalog")
    best = max(monthly, key=lambda e: (e.year, e.month))
    return [best]


def period_path(entries: list[CatalogEntry]) -> tuple[str, str]:
    year_str = str(entries[0].year)
    if entries[0].month is not None:
        month_str = f"{entries[0].month:02d}"
    else:
        month_str = ""
    return (year_str, month_str)
