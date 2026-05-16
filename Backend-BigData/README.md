# API Spark

Projeto desenvolvido para a disciplina de **Big Data** da pós-graduação em Engenharia de Software da UFRJ.

O objetivo do trabalho é realizar o tratamento e processamento de dados utilizando Apache Spark, disponibilizando posteriormente os dados tratados através de uma API para consumo no front-end..

---

## Tecnologias utilizadas

- Python
- FastAPI
- Apache Spark
- Docker
- Docker Compose

---

## Como executar o projeto

### Subindo os containers

### Com docker

```
docker compose up --build
```

### Com sudo docker (caso não tenha permissão)

```
sudo docker compose up --build
```

### Para rodar o container em background

```
sudo docker compose up -d --build
```

## Para acessar a API

```
http://localhost:8001
```
ou
```
http://127.0.0.1:8001/
```

## Para acessar a API com docmentação swagger

```
http://localhosfit:8001/docs
```
ou
```
http://127.0.0.1:8001/docs
```

