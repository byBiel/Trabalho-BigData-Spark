IMAGE ?= spark-mba-pipeline:local
PERIOD ?=
DOCKER_MEMORY ?=

# Spark tuning for Docker runs (override as needed)
SPARK_LOCAL_CORES ?=2
SPARK_DRIVER_MEMORY ?=4g
SPARK_EXECUTOR_MEMORY ?=4g
SPARK_SHUFFLE_PARTITIONS ?=16

.PHONY: build run run-period shell

build:
	docker build -t $(IMAGE) .

run:
	docker run --rm -it \
		$(if $(DOCKER_MEMORY),--memory $(DOCKER_MEMORY),) \
		-v "$(PWD)/data:/app/data" \
		-e SPARK_LOCAL_CORES=$(SPARK_LOCAL_CORES) \
		-e SPARK_DRIVER_MEMORY=$(SPARK_DRIVER_MEMORY) \
		-e SPARK_EXECUTOR_MEMORY=$(SPARK_EXECUTOR_MEMORY) \
		-e SPARK_SHUFFLE_PARTITIONS=$(SPARK_SHUFFLE_PARTITIONS) \
		$(IMAGE)

run-period:
	@if [ -z "$(PERIOD)" ]; then \
		echo "Usage: make run-period PERIOD=YYYY or YYYY-MM"; \
		exit 2; \
	fi
	docker run --rm -it \
		$(if $(DOCKER_MEMORY),--memory $(DOCKER_MEMORY),) \
		-v "$(PWD)/data:/app/data" \
		-e SPARK_LOCAL_CORES=$(SPARK_LOCAL_CORES) \
		-e SPARK_DRIVER_MEMORY=$(SPARK_DRIVER_MEMORY) \
		-e SPARK_EXECUTOR_MEMORY=$(SPARK_EXECUTOR_MEMORY) \
		-e SPARK_SHUFFLE_PARTITIONS=$(SPARK_SHUFFLE_PARTITIONS) \
		$(IMAGE) python main.py --period $(PERIOD)

shell:
	docker run --rm -it \
		$(if $(DOCKER_MEMORY),--memory $(DOCKER_MEMORY),) \
		-v "$(PWD)/data:/app/data" \
		-e SPARK_LOCAL_CORES=$(SPARK_LOCAL_CORES) \
		-e SPARK_DRIVER_MEMORY=$(SPARK_DRIVER_MEMORY) \
		-e SPARK_EXECUTOR_MEMORY=$(SPARK_EXECUTOR_MEMORY) \
		-e SPARK_SHUFFLE_PARTITIONS=$(SPARK_SHUFFLE_PARTITIONS) \
		--entrypoint sh \
		$(IMAGE)
