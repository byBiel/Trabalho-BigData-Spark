import os
import subprocess
import sys
from typing import Optional

from pyspark.sql import SparkSession


def _java_major(java_home: Optional[str] = None) -> Optional[int]:
    java_exe = os.path.join(java_home, "bin", "java") if java_home else "java"
    try:
        proc = subprocess.run(
            [java_exe, "-version"],
            check=False,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
    except OSError:
        return None

    text = (proc.stderr or "") + "\n" + (proc.stdout or "")
    for line in text.splitlines():
        line = line.strip()
        if "version" not in line:
            continue
        q1 = line.find('"')
        if q1 == -1:
            continue
        q2 = line.find('"', q1 + 1)
        if q2 == -1:
            continue
        version = line[q1 + 1 : q2]
        major_str = version.split(".", 1)[0]
        try:
            return int(major_str)
        except ValueError:
            return None

    return None


def _ensure_supported_java() -> None:
    major = _java_major(os.environ.get("JAVA_HOME"))
    if major is None:
        major = _java_major(None)

    if major is None or major < 23:
        return

    # Spark/Hadoop breaks on Java 23+ due to Subject.getSubject() removal.
    # Try to pick Java 21/17 automatically on macOS.
    if sys.platform == "darwin":
        for v in ("21", "17"):
            try:
                proc = subprocess.run(
                    ["/usr/libexec/java_home", "-v", v],
                    check=False,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True,
                )
            except OSError:
                proc = None

            if not proc or proc.returncode != 0:
                continue

            candidate = (proc.stdout or "").strip()
            if not candidate or not os.path.isdir(candidate):
                continue

            os.environ["JAVA_HOME"] = candidate
            os.environ["PATH"] = os.path.join(candidate, "bin") + os.pathsep + os.environ.get("PATH", "")

            new_major = _java_major(candidate)
            if new_major is not None and new_major < 23:
                return

    raise RuntimeError(
        "Spark/Hadoop is incompatible with Java 23+ (error: getSubject is not supported). "
        "Use Java 17 or 21. If running locally, set JAVA_HOME accordingly. "
        "Example (macOS): export JAVA_HOME=$(/usr/libexec/java_home -v 21)"
    )


def get_spark() -> SparkSession:
    _ensure_supported_java()

    local_cores = os.environ.get("SPARK_LOCAL_CORES")
    driver_memory = os.environ.get("SPARK_DRIVER_MEMORY")
    executor_memory = os.environ.get("SPARK_EXECUTOR_MEMORY")
    shuffle_partitions = os.environ.get("SPARK_SHUFFLE_PARTITIONS")

    master = "local[*]" if not local_cores else f"local[{local_cores}]"

    builder = SparkSession.builder.master(master).appName("SparkETLPOC")

    if driver_memory:
        builder = builder.config("spark.driver.memory", driver_memory)
    if executor_memory:
        builder = builder.config("spark.executor.memory", executor_memory)
    if shuffle_partitions:
        builder = builder.config("spark.sql.shuffle.partitions", shuffle_partitions)

    return builder.getOrCreate()
