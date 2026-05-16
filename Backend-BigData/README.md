# Backend BigData — API de Analytics

Backend desenvolvido com **FastAPI** para disponibilizar os dados processados pelo pipeline Spark.

A API lê os arquivos JSON gerados pelo projeto `Spark-BigData` em `data/refined/geral` e expõe endpoints para consumo pelo frontend.

---

## Tecnologias utilizadas

- Python
- FastAPI
- Uvicorn
- Docker
- Docker Compose

---

## Estrutura do projeto

```txt
Backend-BigData/
├── app/
│   ├── routes/
│   │   ├── area.py
│   │   ├── companies.py
│   │   ├── problems.py
│   │   ├── sentimento.py
│   │   └── uf.py
│   │
│   ├── services/
│   │   └── loader.py
│   │
│   ├── config.py
│   └── main.py
│
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── README.md
```

---

## Objetivo

O backend tem como função:

- Ler os arquivos JSON gerados pelo Spark.
- Carregar dados em formato JSON Lines.
- Agregar informações por total.
- Disponibilizar os dados através de endpoints HTTP.
- Servir os dados para o frontend.

---

## Fonte dos dados

Os dados consumidos pela API devem ser gerados antes pelo projeto Spark.

Exemplo de saída esperada:

```txt
Spark-BigData/
└── data/
    └── refined/
        └── geral/
            ├── area.json
            ├── sentimento.json
            ├── top-companies.json
            ├── top-problems.json
            └── uf.json
```

O backend acessa esses arquivos através de volume Docker.

---

## Configuração do volume

No `docker-compose.yml`, o backend deve apontar para a pasta `refined` gerada pelo Spark:

```yaml
volumes:
  - ../Spark-BigData/data/refined:/app/data/refined:ro
```

A variável de ambiente usada pela aplicação é:

```yaml
environment:
  DATA_BASE_PATH: /app/data/refined
```

---

## Como executar o projeto

Entre na pasta do backend:

```bash
cd Backend-BigData
```

Suba o container:

```bash
docker compose up --build
```

Caso esteja no Linux e precise de permissão:

```bash
sudo docker compose up --build
```

Para rodar em background:

```bash
docker compose up -d --build
```

ou:

```bash
sudo docker compose up -d --build
```

---

## Acessar a API

Após subir o container, acesse:

```txt
http://localhost:8001
```

ou:

```txt
http://127.0.0.1:8001
```

---

## Documentação Swagger

A documentação automática da API fica disponível em:

```txt
http://localhost:8001/docs
```

ou:

```txt
http://127.0.0.1:8001/docs
```

---

## Endpoints disponíveis

### Área

```txt
GET /area/
GET /area/top
GET /area/bottom
```

### UF

```txt
GET /uf/
GET /uf/top
GET /uf/bottom
GET /uf/average
```

### Sentimento

```txt
GET /sentimento/
GET /sentimento/top
```

### Empresas

```txt
GET /companies/
GET /companies/top
```

### Problemas

```txt
GET /problems/
GET /problems/top
```

---

## Exemplo de resposta

```json
[
  {
    "uf": "SP",
    "total": 3200
  },
  {
    "uf": "PR",
    "total": 870
  }
]
```

---

## Fluxo da aplicação

```txt
CSV bruto
  ↓
Spark processa os dados
  ↓
Spark gera JSON em data/refined/geral
  ↓
Backend lê os arquivos JSON
  ↓
FastAPI expõe os endpoints
  ↓
Frontend consome a API
```

---

## Comandos úteis

Subir a API:

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

Ver logs:

```bash
docker compose logs -f
```

Rebuild completo:

```bash
docker compose down
docker compose up --build
```

---

## Observação

Antes de iniciar o backend, é necessário executar o pipeline Spark para gerar os arquivos dentro de:

```txt
Spark-BigData/data/refined/geral/
```

Sem esses arquivos, a API poderá retornar erro de arquivo não encontrado.
