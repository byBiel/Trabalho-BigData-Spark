# syntax=docker/dockerfile:1

FROM python:3.10-slim

# Spark (via pyspark) requires a compatible Java runtime.
# Depending on the Debian release behind python:*-slim, OpenJDK 21 or 17 may be available.
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates \
    && (apt-get install -y --no-install-recommends openjdk-21-jre-headless \
        || apt-get install -y --no-install-recommends openjdk-17-jre-headless) \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY src /app/src
COPY main.py /app/main.py

# Default command; override at runtime with args, e.g.:
#   docker run ... python main.py --period 2019
CMD ["python", "main.py"]
