#!/bin/sh
set -eu

python manage.py migrate --noinput

exec gunicorn config.wsgi:application --bind 0.0.0.0:8080
