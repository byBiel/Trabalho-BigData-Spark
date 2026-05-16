from pyspark.sql import DataFrame
from pyspark.sql import functions as F
from pyspark.sql.types import IntegerType, BooleanType, StringType


DATE_FORMAT = "dd/MM/yyyy"

# Columns still string after schema-enforced read — parsed here in transform
DATE_COLS = [
    "Data Abertura",
    "Data Resposta",
    "Data Análise",
    "Data Recusa",
    "Data Finalização",
    "Prazo Resposta",
]

# Only Total remains string after schema enforcement; others cast at read time
INT_COLS = [
    "Total",
]

BOOL_COLS = [
    "Procurou Empresa",
    "Respondida",
    "Edição de Conteúdo",
    "Interação do Gestor",
]


def transform(df: DataFrame) -> DataFrame:
    count_in = df.count()
    print(f"[TRANSFORM] Input: {count_in} records", flush=True)

    existing_cols = set(df.columns)

    for col in DATE_COLS:
        if col not in existing_cols:
            continue
        df = df.withColumn(
            col,
            F.coalesce(
                F.try_to_date(F.col(f"`{col}`"), DATE_FORMAT),
                F.try_to_date(F.col(f"`{col}`"), "yyyy-MM-dd"),
            ),
        )

    for col in INT_COLS:
        if col in existing_cols:
            df = df.withColumn(col, F.col(f"`{col}`").cast(IntegerType()))

    for col in BOOL_COLS:
        if col in existing_cols:
            df = df.withColumn(col, (F.col(f"`{col}`") == "S").cast(BooleanType()))

    df = df.withColumn(
        "sentimento",
        F.when(F.col("Nota do Consumidor") >= 4, "POSITIVO")
         .when(F.col("Nota do Consumidor") <= 2, "NEGATIVO")
         .otherwise("NEUTRO")
        .cast(StringType()),
    )

    print("[TRANSFORM] Schema:", flush=True)
    df.printSchema()

    count_out = df.count()
    print(f"[TRANSFORM] Output: {count_out} records", flush=True)

    return df
