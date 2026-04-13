import pytest


@pytest.fixture(scope="session")
def postgres_container():
    """Start a PostgreSQL testcontainer once per test session."""
    from testcontainers.postgres import PostgresContainer

    container = PostgresContainer("postgres:15.3")
    try:
        container.start()
    except Exception as exc:
        raise RuntimeError(
            "Docker is required to run backend tests. Start Docker and rerun pytest."
        ) from exc
    try:
        yield container
    finally:
        container.stop()


@pytest.fixture(scope="session")
def django_db_modify_db_settings(postgres_container):
    """Override pytest-django's settings hook to point Django at the testcontainer.

    This fixture runs before pytest-django's django_db_setup creates the test
    database, ensuring Django uses the container's connection details instead
    of the localhost defaults in settings.py.
    """
    from django.conf import settings

    host = postgres_container.get_container_host_ip()
    port = postgres_container.get_exposed_port(5432)
    if not host or not port:
        pytest.fail("Testcontainer did not expose a valid host/port for PostgreSQL.")

    settings.DATABASES["default"].update(
        {
            "NAME": postgres_container.dbname,
            "USER": postgres_container.username,
            "PASSWORD": postgres_container.password,
            "HOST": host,
            "PORT": port,
            "OPTIONS": {
                "sslmode": "disable",
                "channel_binding": "disable",
            },
        }
    )
    yield
