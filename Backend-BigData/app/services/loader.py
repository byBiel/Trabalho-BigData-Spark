import json
from pathlib import Path

from fastapi import HTTPException


def load_json_lines(path: str | Path) -> list[dict]:
    file_path = Path(path)

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Arquivo não encontrado: {file_path}"
        )

    if not file_path.is_file():
        raise HTTPException(
            status_code=400,
            detail=f"O caminho informado não é um arquivo: {file_path}"
        )

    data: list[dict] = []

    try:
        with file_path.open("r", encoding="utf-8") as file:
            for line in file:
                line = line.strip()

                if not line:
                    continue

                data.append(json.loads(line))

        return data

    except json.JSONDecodeError as error:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao interpretar JSON em {file_path}: {error}"
        )


def load_all_json_lines(base_path: str | Path, filename: str) -> list[dict]:
    base = Path(base_path)

    if not base.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Pasta base não encontrada: {base}"
        )

    files = sorted(base.glob(f"**/{filename}"))

    if not files:
        raise HTTPException(
            status_code=404,
            detail=f"Nenhum arquivo {filename} encontrado em {base}"
        )

    result: list[dict] = []

    for file in files:
        result.extend(load_json_lines(file))

    return result


def load_and_group_by_total(
    base_path: str | Path,
    filename: str,
    group_key: str,
    limit: int | None = None,
) -> list[dict]:
    data = load_all_json_lines(base_path, filename)

    grouped: dict[str, int | float] = {}

    for item in data:
        key = item.get(group_key)
        total = item.get("total", 0)

        if key is None:
            continue

        grouped[str(key)] = grouped.get(str(key), 0) + total

    result = [
        {
            group_key: key,
            "total": total,
        }
        for key, total in grouped.items()
    ]

    result.sort(key=lambda item: item["total"], reverse=True)

    if limit is not None:
        return result[:limit]

    return result