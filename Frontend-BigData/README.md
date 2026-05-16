# Frontend BigData — Dashboard Consumidor.gov.br

Dashboard desenvolvido com **React + Vite + TypeScript** para visualizar os dados processados pelo pipeline Spark e disponibilizados pela API FastAPI.

O frontend consome os endpoints do backend, transforma os dados para gráficos e exibe uma visão geral das reclamações da base **Consumidor.gov.br**.

---

## Tecnologias utilizadas

- React
- Vite
- TypeScript
- Axios
- Recharts
- Lucide React
- Docker
- Docker Compose
- Nginx

---

## Estrutura do projeto

```txt
Frontend-BigData/
├── src/
│   ├── assets/
│   ├── components/
│   ├── services/
│   │   ├── api.ts
│   │   └── dashboard.service.ts
│   ├── types/
│   │   └── dashboard-api.types.ts
│   ├── App.tsx
│   └── main.tsx
│
├── Dockerfile
├── nginx.conf
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Objetivo

O frontend tem como função:

- Consumir os dados da API.
- Exibir gráficos e indicadores do dashboard.
- Mostrar análises por área, sentimento, empresa, problema e UF.
- Centralizar a visualização dos dados processados pelo Spark.
- Facilitar a leitura dos principais agrupamentos da base.

---

## Fonte dos dados

O frontend não lê arquivos diretamente.

O fluxo correto é:

```txt
CSV bruto
  ↓
Spark processa os dados
  ↓
Backend lê os JSONs gerados
  ↓
Frontend consome a API
  ↓
Dashboard exibe os gráficos
```

A API precisa estar disponível em:

```txt
http://localhost:8001
```

---

## Variável de ambiente

Crie ou ajuste o arquivo `.env` na raiz do frontend:

```env
VITE_API_URL=http://localhost:8001
```

Essa variável é usada pelo Axios para acessar o backend.

Exemplo do arquivo `src/services/api.ts`:

```ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
});
```

---

## Instalação local

Entre na pasta do frontend:

```bash
cd Frontend-BigData
```

Instale as dependências:

```bash
npm install
```

Execute em modo desenvolvimento:

```bash
npm run dev
```

Acesse no navegador:

```txt
http://localhost:5173
```

---

## Executar com Docker

Build da imagem:

```bash
docker build -t frontend-bigdata:local .
```

Executar o container:

```bash
docker run --rm -it -p 8080:80 frontend-bigdata:local
```

Acesse:

```txt
http://localhost:8080
```

---

## Executar com Docker Compose

Na raiz do projeto completo, execute:

```bash
docker compose up --build
```

O frontend será exposto em:

```txt
http://localhost:8080
```

A API será exposta em:

```txt
http://localhost:8001
```

---

## Integração com a API

O frontend consome os seguintes endpoints:

```txt
GET /area/
GET /sentimento/
GET /companies/
GET /problems/
GET /uf/
```

Com a variável:

```env
VITE_API_URL=http://localhost:8001
```

as chamadas finais ficam:

```txt
http://localhost:8001/area/
http://localhost:8001/sentimento/
http://localhost:8001/companies/
http://localhost:8001/problems/
http://localhost:8001/uf/
```

---

## Formato esperado da API

### Área

```json
[
  {
    "area": "Produtos e Serviços",
    "total": 1500
  }
]
```

### Sentimento

```json
[
  {
    "sentimento": "negativo",
    "total": 2300
  }
]
```

### Empresas

```json
[
  {
    "empresa": "Empresa X",
    "total": 450
  }
]
```

### Problemas

```json
[
  {
    "problema": "Cobrança indevida",
    "total": 700
  }
]
```

### UF

```json
[
  {
    "uf": "SP",
    "total": 3200
  }
]
```

---

## Scripts principais

```bash
npm install
```

Instala as dependências do projeto.

```bash
npm run dev
```

Executa o frontend em modo desenvolvimento.

```bash
npm run build
```

Gera a versão final para produção.

```bash
npm run preview
```

Executa uma prévia local da versão de produção.

---

## Build de produção

Para gerar a versão final:

```bash
npm run build
```

O Vite irá gerar os arquivos estáticos na pasta:

```txt
dist/
```

No Docker, esses arquivos são servidos pelo Nginx.

---

## Observação importante sobre Vite

Variáveis `VITE_*` são aplicadas no momento do build.

Se alterar o `.env`, é necessário rebuildar o frontend:

```bash
docker compose build --no-cache frontend
docker compose up
```

Ou:

```bash
docker compose down
docker compose up --build
```

---

## Comandos úteis

Subir todos os containers:

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
docker compose logs -f frontend
```

Rebuild apenas do frontend:

```bash
docker compose build --no-cache frontend
docker compose up frontend
```

---

## Resumo

O frontend é responsável apenas pela visualização dos dados.

Para funcionar corretamente:

1. O Spark deve gerar os JSONs.
2. O backend deve estar rodando em `http://localhost:8001`.
3. O frontend deve usar `VITE_API_URL=http://localhost:8001`.
4. O dashboard deve ser acessado em `http://localhost:8080` quando executado via Docker.
