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
