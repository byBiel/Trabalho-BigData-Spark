from pathlib import Path
import shutil

from pyspark.sql import DataFrame
from pyspark.sql import functions as F


def _remove_path(path: Path) -> None:
    if path.exists():
        if path.is_dir():
            shutil.rmtree(path)
        else:
            path.unlink()


def _write_single_json(df: DataFrame, output_file: str) -> None:
    output_path = Path(output_file)
    temp_path = output_path.parent / f"_{output_path.stem}_tmp"

    count = df.count()
    print(f"[LOAD] Writing {count} records to {output_path}", flush=True)

    output_path.parent.mkdir(parents=True, exist_ok=True)

    _remove_path(temp_path)
    _remove_path(output_path)

    (
        df.coalesce(1)
        .write
        .mode("overwrite")
        .json(str(temp_path))
    )

    part_file = next(temp_path.glob("part-*.json"), None)

    if part_file is None:
        _remove_path(temp_path)
        raise FileNotFoundError(f"Nenhum arquivo part-*.json encontrado em {temp_path}")

    shutil.move(str(part_file), str(output_path))

    _remove_path(temp_path)

    print(f"[LOAD] Done → {output_path}", flush=True)


def load(df: DataFrame, year: str, month: str | None = None) -> None:
    suffix = f"{year}/{month}" if month else year

    trusted_base = f"data/trusted/{suffix}"
    refined_base = f"data/refined/{suffix}"

    _write_single_json(
        df,
        f"{trusted_base}/dados.json",
    )

    _write_single_json(
        df.groupBy("sentimento")
        .count()
        .withColumnRenamed("count", "total")
        .orderBy(F.col("total").desc()),
        f"{refined_base}/sentimento.json",
    )

    _write_single_json(
        df.groupBy("UF")
        .count()
        .withColumnRenamed("UF", "uf")
        .withColumnRenamed("count", "total")
        .orderBy(F.col("total").desc()),
        f"{refined_base}/uf.json",
    )

    _write_single_json(
        df.groupBy("Área")
        .count()
        .withColumnRenamed("Área", "area")
        .withColumnRenamed("count", "total")
        .orderBy(F.col("total").desc()),
        f"{refined_base}/area.json",
    )

    _write_single_json(
        df.groupBy("Nome Fantasia")
        .count()
        .withColumnRenamed("Nome Fantasia", "empresa")
        .withColumnRenamed("count", "total")
        .orderBy(F.col("total").desc())
        .limit(20),
        f"{refined_base}/top-companies.json",
    )

    _write_single_json(
        df.groupBy("Problema")
        .count()
        .withColumnRenamed("Problema", "problema")
        .withColumnRenamed("count", "total")
        .orderBy(F.col("total").desc())
        .limit(20),
        f"{refined_base}/top-problems.json",
    )