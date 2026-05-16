import argparse
import re
import sys

from src.session import get_spark
from src.extract import extract
from src.transform import transform
from src.load import load


_PERIOD_RE = re.compile(r"^\d{4}(-\d{2})?$")


def _validate_period(value: str) -> str:
    if not _PERIOD_RE.match(value):
        raise argparse.ArgumentTypeError(
            f"Período inválido '{value}'. Use YYYY, exemplo 2026, ou YYYY-MM, exemplo 2026-04."
        )

    return value


def main() -> None:
    parser = argparse.ArgumentParser(description="Spark ETL — Consumer Complaints")

    parser.add_argument(
        "--period",
        default=None,
        type=_validate_period,
        metavar="YYYY or YYYY-MM",
        help="Período para processar. Se omitir, processa todos os arquivos em data/raw.",
    )

    args = parser.parse_args()

    spark = get_spark()

    try:
        raw_df, (year, month) = extract(spark, args.period)
        transformed_df = transform(raw_df)
        load(transformed_df, year, month)

    except Exception as error:
        print(f"[ERROR] {error}", file=sys.stderr)
        sys.exit(1)

    finally:
        spark.stop()


if __name__ == "__main__":
    main()