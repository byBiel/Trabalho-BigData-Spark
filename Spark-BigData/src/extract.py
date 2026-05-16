import os
from pathlib import Path

from pyspark.sql import SparkSession, DataFrame

from src.schema import get_schema


def _detect_encoding(path: str) -> str:
    with open(path, "rb") as file:
        sample = file.read(4096)

    try:
        sample.decode("utf-8")
        return "UTF-8"
    except UnicodeDecodeError:
        return "ISO-8859-1"


def _extract_year_from_path(path: Path) -> int:
    parts = path.parts

    for part in parts:
        if part.isdigit() and len(part) == 4:
            return int(part)

    raise ValueError(f"Não foi possível identificar o ano no caminho: {path}")


def _find_csv_files(period_str: str | None = None) -> list[Path]:
    raw_base = Path("data/raw")

    if not raw_base.exists():
        raise FileNotFoundError(f"Pasta não encontrada: {raw_base}")

    if period_str is None:
        search_path = raw_base
    elif "-" in period_str:
        year_str, month_str = period_str.split("-")
        search_path = raw_base / year_str / month_str
    else:
        search_path = raw_base / period_str

    print(f"[EXTRACT] Searching CSV files in: {search_path}", flush=True)

    if not search_path.exists():
        raise FileNotFoundError(f"Pasta não encontrada: {search_path}")

    files = sorted(search_path.rglob("*.csv"))

    if not files:
        raise FileNotFoundError(f"Nenhum CSV encontrado em {search_path}")

    return files


def extract(
    spark: SparkSession,
    period_str: str | None = None,
) -> tuple[DataFrame, tuple[str, str | None]]:
    files = _find_csv_files(period_str)

    print(f"[EXTRACT] Found {len(files)} CSV file(s)", flush=True)

    dfs: list[DataFrame] = []

    for path in files:
        year = _extract_year_from_path(path)
        encoding = _detect_encoding(str(path))

        print(f"[EXTRACT] Reading: {path} | year={year} | encoding={encoding}", flush=True)

        df = (
            spark.read
            .option("header", "true")
            .option("sep", ";")
            .option("encoding", encoding)
            .option("mode", "PERMISSIVE")
            .schema(get_schema(year))
            .csv(str(path))
        )

        dfs.append(df)

    final_df = dfs[0]

    for other_df in dfs[1:]:
        final_df = final_df.unionByName(other_df, allowMissingColumns=True)

    count = final_df.count()

    print(f"[EXTRACT] Loaded {count} records", flush=True)
    print("[EXTRACT] Schema:", flush=True)

    final_df.printSchema()

    if period_str is None:
        return final_df, ("geral", None)

    if "-" in period_str:
        year_str, month_str = period_str.split("-")
        return final_df, (year_str, month_str)

    return final_df, (period_str, None)