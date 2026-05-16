# Trabalho Big Data Spark

Projeto desenvolvido para análise de dados da base **Consumidor.gov.br**, utilizando processamento com **Apache Spark**, API em **FastAPI** e dashboard frontend em **React + Vite**.

O objetivo é processar dados de reclamações de consumidores e apresentar indicadores visuais sobre áreas, sentimentos, empresas, problemas e estados com maior volume de registros.

---

## Estrutura do projeto

```txt
TRABALHO-BIGDATA-SPARK/
├─ Backend-BigData/
│  ├─ app/
│  ├─ refined/
│  ├─ Dockerfile
│  ├─ requirements.txt
│  └─ README.md
│
├─ Frontend-BigData/
│  ├─ public/
│  ├─ src/
│  ├─ Dockerfile
│  ├─ nginx.conf
│  ├─ package.json
│  └─ README.md
│
└─ docker-compose.yml
```

---

## Tecnologias utilizadas

### Backend

- Python
- FastAPI
- Apache Spark
- Docker

### Frontend

- React
- Vite
- TypeScript
- Axios
- Recharts
- Lucide React
- Nginx
- Docker

### Orquestração

- Docker Compose

---

## Como funciona

O projeto possui dois containers principais:

```txt
api       -> FastAPI rodando na porta 8001
frontend  -> React buildado servido pelo Nginx na porta 8080
```

O frontend chama a rota `/api`, e o Nginx encaminha para o container da API.

Fluxo:

```txt
Navegador
  -> http://localhost:8080
  -> Container Frontend / Nginx
  -> /api/*
  -> Container API FastAPI
  -> http://api:8001
```

---

## Como executar o projeto

Na raiz do projeto:

```bash
docker compose up --build
```

Após finalizar o build, acesse:

```txt
http://localhost:8080
```

---

## Testar a API

A API também fica disponível diretamente em:

```txt
http://localhost:8001
```
---

## Resultado esperado

Com os containers rodando, o dashboard deve exibir:

- Total de reclamações analisadas
- Áreas com maior volume de reclamações
- Empresas com maior quantidade de registros
- Principais problemas relatados
- Distribuição por UF
- Classificação de sentimento
- Tabelas de ranking
- Indicadores analíticos

---

## Observações

Para executar o projeto completo, recomenda-se usar o `docker-compose.yml` da raiz.

Os arquivos `docker-compose.yml` dentro das pastas `Backend-BigData` e `Frontend-BigData`, caso existam, podem ser usados apenas para testes individuais de cada aplicação.
# Trabalho Big Data Spark — Consumidor.gov.br

Projeto desenvolvido para a disciplina de **Big Data**, com o objetivo de processar e visualizar dados da base pública **Consumidor.gov.br**.

A solução utiliza **Apache Spark** para processamento dos dados, **FastAPI** para disponibilizar os resultados em formato de API e **React + Vite** para exibir um dashboard com indicadores visuais.

---

## Objetivo do projeto

O objetivo principal é criar um fluxo completo de Big Data, passando por:

```txt
Coleta / entrada dos dados
  ↓
Processamento com Spark
  ↓
Geração de arquivos analíticos
  ↓
Disponibilização via API
  ↓
Visualização em dashboard web
```

A partir dos dados de reclamações de consumidores, o projeto apresenta análises sobre:

- Áreas com maior volume de reclamações.
- Empresas mais citadas.
- Principais problemas relatados.
- Distribuição por UF.
- Classificação de sentimento.
- Rankings e indicadores analíticos.

---

## Tecnologias utilizadas

### Processamento de dados

- Apache Spark
- PySpark
- Python

### Backend

- Python
- FastAPI
- Uvicorn

### Frontend

- React
- Vite
- TypeScript
- Axios
- Recharts
- Lucide React
- Nginx

### Ambiente e execução

- Docker
- Docker Compose

---

## Estrutura geral do projeto

```txt
TRABALHO-BIGDATA-SPARK/
├── Backend-BigData/
│   ├── app/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── config.py
│   │   └── main.py
│   ├── Dockerfile
│   ├── requirements.txt
│   └── README.md
│
├── Frontend-BigData/
│   ├── src/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── README.md
│
├── Spark-BigData/
│   ├── data/
│   │   ├── raw/
│   │   ├── trusted/
│   │   └── refined/
│   ├── src/
│   ├── Dockerfile
│   ├── main.py
│   ├── requirements.txt
│   └── README.md
│
└── docker-compose.yml
```

---

## Como o projeto funciona

O projeto é dividido em três partes principais:

```txt
Spark-BigData      -> Processa os arquivos CSV com PySpark
Backend-BigData    -> Lê os JSONs gerados e expõe os dados via API
Frontend-BigData   -> Consome a API e exibe o dashboard
```

O fluxo completo é:

```txt
1. Arquivos CSV ficam em Spark-BigData/data/raw
2. O Spark processa os CSVs
3. O Spark gera arquivos JSON em Spark-BigData/data/refined/geral
4. O Backend lê esses arquivos JSON
5. A API disponibiliza os dados em endpoints HTTP
6. O Frontend consome a API
7. O dashboard apresenta os gráficos e indicadores
```

---

## Execução geral com Docker Compose

A execução principal do projeto deve ser feita pelo `docker-compose.yml` localizado na raiz.

Na raiz do projeto, execute:

```bash
docker compose up --build
```

Esse comando sobe o ambiente completo:

```txt
spark     -> Executa o processamento dos dados
api       -> Sobe o backend FastAPI na porta 8001
frontend  -> Sobe o frontend React/Nginx na porta 8080
```

Após o build e inicialização dos containers, acesse o dashboard em:

```txt
http://localhost:8080
```

A API ficará disponível em:

```txt
http://localhost:8001
```

A documentação Swagger da API pode ser acessada em:

```txt
http://localhost:8001/docs
```

---

## Execução do Spark

O Spark é responsável por ler os arquivos CSV da pasta:

```txt
Spark-BigData/data/raw/
```

O projeto foi configurado para permitir uma execução geral. Isso significa que não é necessário processar mês a mês.

Ao executar o Spark sem informar período, ele lê todos os arquivos disponíveis em `data/raw`, independentemente de ano ou mês, e gera uma análise consolidada.

A saída principal é gerada em:

```txt
Spark-BigData/data/refined/geral/
```

Arquivos esperados:

```txt
area.json
sentimento.json
top-companies.json
top-problems.json
uf.json
```

---

## Backend FastAPI

O backend lê os arquivos gerados pelo Spark em:

```txt
Spark-BigData/data/refined/geral/
```

Esses arquivos são montados no container da API através de volume Docker.

O backend disponibiliza endpoints como:

```txt
GET /area/
GET /sentimento/
GET /companies/
GET /problems/
GET /uf/
```

A API roda na porta:

```txt
http://localhost:8001
```

---

## Frontend React

O frontend foi desenvolvido com **React + Vite + TypeScript**.

Ele consome a API FastAPI e apresenta os dados em formato de dashboard, utilizando gráficos, cards e rankings.

Quando executado via Docker Compose, o frontend fica disponível em:

```txt
http://localhost:8080
```

A variável de ambiente usada pelo frontend deve apontar para a API:

```env
VITE_API_URL=http://localhost:8001
```

---

## Docker Compose

O `docker-compose.yml` da raiz é responsável por orquestrar todo o projeto.

Exemplo esperado da composição:

```yaml
services:
  spark:
    build:
      context: ./Spark-BigData
    container_name: bigdata-spark
    command: python main.py
    volumes:
      - ./Spark-BigData/data:/app/data
    restart: "no"

  api:
    build:
      context: ./Backend-BigData
    container_name: bigdata-api
    ports:
      - "8001:8001"
    command: uvicorn app.main:app --host 0.0.0.0 --port 8001
    environment:
      DATA_BASE_PATH: /app/data/refined
    volumes:
      - ./Spark-BigData/data/refined:/app/data/refined:ro
    depends_on:
      - spark
    restart: unless-stopped

  frontend:
    build:
      context: ./Frontend-BigData
    container_name: bigdata-frontend
    ports:
      - "8080:80"
    depends_on:
      - api
    restart: unless-stopped
```

---

## Portas utilizadas

| Serviço | Porta | URL |
|--------|-------|-----|
| Frontend | 8080 | `http://localhost:8080` |
| Backend API | 8001 | `http://localhost:8001` |
| Swagger API | 8001 | `http://localhost:8001/docs` |

---

## Resultado esperado

Com os containers rodando, o dashboard deve exibir:

- Total de reclamações analisadas.
- Gráficos por área.
- Distribuição por sentimento.
- Ranking de empresas.
- Ranking de principais problemas.
- Distribuição por UF.
- Indicadores e tabelas analíticas.

---

## Comandos úteis

Subir todo o projeto:

```bash
docker compose up --build
```

Subir em background:

```bash
docker compose up -d --build
```

Parar os containers:

```bash
docker compose down
```

Ver logs de todos os serviços:

```bash
docker compose logs -f
```

Ver logs apenas da API:

```bash
docker compose logs -f api
```

Ver logs apenas do frontend:

```bash
docker compose logs -f frontend
```

Ver logs apenas do Spark:

```bash
docker compose logs -f spark
```

Rebuild completo:

```bash
docker compose down
docker compose up --build
```

---

## Observações importantes

- O projeto deve ser executado preferencialmente pelo `docker-compose.yml` da raiz.
- O Spark deve gerar os arquivos antes da API conseguir retornar os dados corretamente.
- Os arquivos CSV de entrada devem estar em `Spark-BigData/data/raw`.
- A pasta `data/refined` é compartilhada entre Spark e Backend por volume Docker.
- O frontend não lê arquivos diretamente; ele consome apenas a API.
- Os READMEs internos de `Backend-BigData`, `Frontend-BigData` e `Spark-BigData` explicam cada parte do projeto separadamente.

---

## Resumo

Este projeto demonstra um fluxo completo de Big Data:

```txt
CSV + Spark + FastAPI + React + Docker
```

O processamento é feito com Spark, os dados processados são servidos por uma API em FastAPI e a visualização final é feita em um dashboard React.
