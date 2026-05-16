# Spark ETL — Consumer Complaints

Pipeline ETL em PySpark para processar dados de reclamações de consumidores a partir de arquivos CSV armazenados em `data/raw`.

O projeto foi ajustado para permitir a execução **geral**, ou seja, não é necessário processar mês a mês. Ao rodar sem informar período, o Spark lê automaticamente todos os arquivos CSV existentes dentro de `data/raw`, independente de ano ou mês, e gera uma análise consolidada.

---

## Objetivo

Este projeto tem como objetivo:

- Ler arquivos CSV brutos de reclamações de consumidores.
- Processar os dados com PySpark.
- Padronizar e transformar as informações.
- Gerar arquivos JSON prontos para consumo por uma API ou frontend.
- Permitir análise geral de todos os períodos disponíveis.

---

## Estrutura do projeto

```txt
Spark-BigData/
├── data/
│   ├── raw/
│   │   └── 2026/
│   │       ├── 03/
│   │       │   └── basecompleta2026-03.csv
│   │       └── 04/
│   │           └── basecompleta2026-04.csv
│   │
│   ├── refined/
│   │   └── geral/
│   │       ├── area.json
│   │       ├── sentimento.json
│   │       ├── top-companies.json
│   │       ├── top-problems.json
│   │       └── uf.json
│   │
│   └── trusted/
│       └── geral/
│           └── dados.json
│
├── src/
│   ├── catalog.py
│   ├── extract.py
│   ├── load.py
│   ├── schema.py
│   ├── session.py
│   └── transform.py
│
├── Dockerfile
├── main.py
├── Makefile
├── requirements.txt
└── README.md
```

---

## Pré-requisitos

- Docker instalado
- Opcional: `make`

O uso com Docker é recomendado para evitar problemas com instalação local do Java, Spark e dependências do PySpark.

---

## Como organizar os arquivos CSV

Os arquivos brutos devem ficar dentro da pasta `data/raw`, organizados por ano e mês.

Exemplo:

```txt
data/raw/2026/03/basecompleta2026-03.csv
data/raw/2026/04/basecompleta2026-04.csv
```

O projeto consegue ler todos os arquivos `.csv` dentro de `data/raw`, mesmo que estejam separados por ano e mês.

---

## Executar análise geral

Para processar todos os arquivos disponíveis em `data/raw`, rode o pipeline sem informar período.

### Com Docker

Entre na pasta do projeto:

```bash
cd Spark-BigData
```

Faça o build da imagem:

```bash
docker build -t spark-bigdata:local .
```

Execute o processamento geral:

```bash
docker run --rm -it -v "${PWD}/data:/app/data" spark-bigdata:local python main.py
```

Esse comando vai ler automaticamente todos os CSVs encontrados em:

```txt
data/raw/
```

E gerar os arquivos consolidados em:

```txt
data/refined/geral/
data/trusted/geral/
```

---

## Executar com Makefile

Se o projeto possuir `Makefile`, os comandos podem ser simplificados.

```bash
make build
```

Executar análise geral:

```bash
make run
```

Abrir shell dentro do container:

```bash
make shell
```

---

## Saída dos dados

Quando executado em modo geral, o resultado será salvo em:

```txt
data/
├── trusted/
│   └── geral/
│       └── dados.json
│
└── refined/
    └── geral/
        ├── area.json
        ├── sentimento.json
        ├── top-companies.json
        ├── top-problems.json
        └── uf.json
```

---

## Arquivos gerados

### `trusted/geral/dados.json`

Contém os dados tratados após a etapa de transformação.

Esse arquivo representa a base limpa e padronizada, antes dos agrupamentos analíticos.

### `refined/geral/area.json`

Agrupamento por área da reclamação.

Exemplo:

```json
{"area":"Produtos e Serviços","total":1500}
{"area":"Atendimento","total":920}
```

### `refined/geral/sentimento.json`

Agrupamento pela classificação de sentimento criada no processo de transformação.

Exemplo:

```json
{"sentimento":"negativo","total":2300}
{"sentimento":"neutro","total":800}
```

### `refined/geral/uf.json`

Agrupamento por estado.

Exemplo:

```json
{"uf":"SP","total":3200}
{"uf":"PR","total":870}
```

### `refined/geral/top-companies.json`

Lista das empresas com maior quantidade de reclamações.

Exemplo:

```json
{"empresa":"Empresa X","total":450}
{"empresa":"Empresa Y","total":390}
```

### `refined/geral/top-problems.json`

Lista dos principais problemas identificados nas reclamações.

Exemplo:

```json
{"problema":"Cobrança indevida","total":700}
{"problema":"Produto não entregue","total":520}
```

---

## Etapas do ETL

| Etapa | Arquivo | Descrição |
|------|---------|-----------|
| Extract | `src/extract.py` | Localiza e lê os arquivos CSV dentro de `data/raw` |
| Transform | `src/transform.py` | Padroniza colunas, tipos e adiciona campos derivados |
| Load | `src/load.py` | Gera os arquivos JSON em `trusted` e `refined` |

---

## Funcionamento da execução geral

Quando o comando abaixo é executado:

```bash
docker run --rm -it -v "${PWD}/data:/app/data" spark-bigdata:local python main.py
```

O pipeline faz o seguinte fluxo:

```txt
data/raw/
  ↓
localiza todos os arquivos .csv
  ↓
lê todos com PySpark
  ↓
une os DataFrames
  ↓
transforma os dados
  ↓
gera análise consolidada
  ↓
salva em data/refined/geral/
```

Ou seja, não é necessário executar mês a mês. Basta rodar:

```bash
python main.py
```

E todos os períodos disponíveis serão processados juntos.

---

## Integração com Backend

A API deve consumir os arquivos gerados em:

```txt
data/refined/geral/
```

Arquivos principais para o backend:

```txt
area.json
sentimento.json
top-companies.json
top-problems.json
uf.json
```

Exemplo de volume no `docker-compose.yml` do backend:

```yaml
volumes:
  - ../Spark-BigData/data/refined:/app/data/refined:ro
```

Assim o backend consegue ler os dados gerados pelo Spark sem duplicar arquivos.

---

## Resumo dos comandos principais

```bash
# Entrar na pasta do projeto
cd Spark-BigData

# Build da imagem
docker build -t spark-bigdata:local .

# Rodar análise geral
docker run --rm -it -v "${PWD}/data:/app/data" spark-bigdata:local python main.py
```

---

## Observação

A execução recomendada para o projeto é a geral:

```bash
python main.py
```

Ela processa todos os arquivos disponíveis em `data/raw` e gera uma análise consolidada em `data/refined/geral`, evitando a necessidade de executar o pipeline mês a mês.
