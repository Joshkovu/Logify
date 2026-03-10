import os

from testcontainers.postgres import PostgresContainer

_postgres_container = None


def pytest_configure():
    global _postgres_container
    if _postgres_container is None:
        _postgres_container = PostgresContainer("postgres:15.3")
        _postgres_container.start()
        os.environ["POSTGRES_DB"] = _postgres_container.dbname
        os.environ["POSTGRES_USER"] = _postgres_container.username
        os.environ["POSTGRES_PASSWORD"] = _postgres_container.password
        os.environ["POSTGRES_HOST"] = _postgres_container.get_container_host_ip()
        os.environ["POSTGRES_PORT"] = str(_postgres_container.get_exposed_port(5432))
        os.environ["POSTGRES_SSLMODE"] = "disable"


def pytest_unconfigure():
    global _postgres_container
    if _postgres_container is not None:
        _postgres_container.stop()
        _postgres_container = None
