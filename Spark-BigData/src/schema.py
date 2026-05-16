from pyspark.sql.types import StructType, StructField, StringType, IntegerType

# 2014–2018: ISO-8859-1, dd/MM/yyyy, 38 cols (full dataset with hora cols + admin cols)
SCHEMA_V1 = StructType([
    StructField("Gestor", StringType(), True),
    StructField("Canal de Origem", StringType(), True),
    StructField("Região", StringType(), True),
    StructField("UF", StringType(), True),
    StructField("Cidade", StringType(), True),
    StructField("Sexo", StringType(), True),
    StructField("Faixa Etária", StringType(), True),
    StructField("Ano Abertura", IntegerType(), True),
    StructField("Mês Abertura", IntegerType(), True),
    StructField("Data Abertura", StringType(), True),
    StructField("Hora Abertura", StringType(), True),
    StructField("Data Resposta", StringType(), True),
    StructField("Hora Resposta", StringType(), True),
    StructField("Data Análise", StringType(), True),
    StructField("Hora Análise", StringType(), True),
    StructField("Data Recusa", StringType(), True),
    StructField("Hora Recusa", StringType(), True),
    StructField("Data Finalização", StringType(), True),
    StructField("Hora Finalização", StringType(), True),
    StructField("Prazo Resposta", StringType(), True),
    StructField("Prazo Analise Gestor", IntegerType(), True),
    StructField("Tempo Resposta", IntegerType(), True),
    StructField("Nome Fantasia", StringType(), True),
    StructField("Segmento de Mercado", StringType(), True),
    StructField("Área", StringType(), True),
    StructField("Assunto", StringType(), True),
    StructField("Grupo Problema", StringType(), True),
    StructField("Problema", StringType(), True),
    StructField("Como Comprou Contratou", StringType(), True),
    StructField("Procurou Empresa", StringType(), True),
    StructField("Respondida", StringType(), True),
    StructField("Situação", StringType(), True),
    StructField("Avaliação Reclamação", StringType(), True),
    StructField("Nota do Consumidor", IntegerType(), True),
    StructField("Análise da Recusa", StringType(), True),
    StructField("Edição de Conteúdo", StringType(), True),
    StructField("Interação do Gestor", StringType(), True),
    StructField("Total", StringType(), True),
])

# 2019: UTF-8, dd/MM/yyyy, 20 cols (stripped — no hora cols, no admin cols, no Gestor/Canal)
SCHEMA_V2 = StructType([
    StructField("Região", StringType(), True),
    StructField("UF", StringType(), True),
    StructField("Cidade", StringType(), True),
    StructField("Sexo", StringType(), True),
    StructField("Faixa Etária", StringType(), True),
    StructField("Data Finalização", StringType(), True),
    StructField("Tempo Resposta", IntegerType(), True),
    StructField("Nome Fantasia", StringType(), True),
    StructField("Segmento de Mercado", StringType(), True),
    StructField("Área", StringType(), True),
    StructField("Assunto", StringType(), True),
    StructField("Grupo Problema", StringType(), True),
    StructField("Problema", StringType(), True),
    StructField("Como Comprou Contratou", StringType(), True),
    StructField("Procurou Empresa", StringType(), True),
    StructField("Respondida", StringType(), True),
    StructField("Situação", StringType(), True),
    StructField("Avaliação Reclamação", StringType(), True),
    StructField("Nota do Consumidor", IntegerType(), True),
    StructField("Total", StringType(), True),
])

# 2020+: UTF-8+BOM, mixed dates (dd/MM/yyyy most cols, yyyy-MM-dd for Data Finalização),
# 30 cols — early 2020 months have 29 cols (no Segmento de Mercado); enforceSchema=false
# handles missing col as null via name-based matching.
SCHEMA_V3 = StructType([
    StructField("Gestor", StringType(), True),
    StructField("Canal de Origem", StringType(), True),
    StructField("Região", StringType(), True),
    StructField("UF", StringType(), True),
    StructField("Cidade", StringType(), True),
    StructField("Sexo", StringType(), True),
    StructField("Faixa Etária", StringType(), True),
    StructField("Ano Abertura", IntegerType(), True),
    StructField("Mês Abertura", IntegerType(), True),
    StructField("Data Abertura", StringType(), True),
    StructField("Data Resposta", StringType(), True),
    StructField("Data Análise", StringType(), True),
    StructField("Data Recusa", StringType(), True),
    StructField("Data Finalização", StringType(), True),
    StructField("Prazo Resposta", StringType(), True),
    StructField("Prazo Analise Gestor", IntegerType(), True),
    StructField("Tempo Resposta", IntegerType(), True),
    StructField("Nome Fantasia", StringType(), True),
    StructField("Segmento de Mercado", StringType(), True),
    StructField("Área", StringType(), True),
    StructField("Assunto", StringType(), True),
    StructField("Grupo Problema", StringType(), True),
    StructField("Problema", StringType(), True),
    StructField("Como Comprou Contratou", StringType(), True),
    StructField("Procurou Empresa", StringType(), True),
    StructField("Respondida", StringType(), True),
    StructField("Situação", StringType(), True),
    StructField("Avaliação Reclamação", StringType(), True),
    StructField("Nota do Consumidor", IntegerType(), True),
    StructField("Análise da Recusa", StringType(), True),
])


def get_schema(year: int) -> StructType:
    if year >= 2020:
        return SCHEMA_V3
    if year == 2019:
        return SCHEMA_V2
    return SCHEMA_V1


