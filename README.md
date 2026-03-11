## Logify – Internship Logging & Evaluation System

Logify is a full-stack Internship Logging & Evaluation System built with:

1. Backend: Django (Python)

2. Frontend: React (Vite + pnpm)

3. Code Quality: pre-commit (Black, isort, Flake8, ESLint, Prettier)

4. CI: GitHub Actions (Windows + Ubuntu)

This project is structured to enforce code quality, consistency, and collaboration standards across contributors.

# Project Vision

Logify is designed to:

- Allow interns to log daily/weekly activities

- Allow supervisors to review and evaluate performance

- Track internship progress over time

- Provide structured reporting and evaluation metrics

- This system is built to scale into a full SaaS platform.

# Getting Started
```bash
git clone https://github.com/Joshkovu/Logify.git
```
# Project Architecture
```bash
logify/
│
├── logify-backend/        # Django backend
│   ├── config/            # Django project settings
│   ├── manage.py
│
├── logify-frontend/       # React frontend (Vite)
│   ├── src/
│   ├── eslint.config.js
│
├── .github/workflows/     # CI pipeline
├── .pre-commit-config.yaml
├── .flake8
└── README.md
```
# Prerequisites

All contributors must install:

1. Python (3.11+ recommended)

Download from:
https://python.org

Verify:
```bash
python --version
```
2. Node.js (LTS recommended – v20)

Download from:
https://nodejs.org

Verify:
```bash
node -v
```
3. pnpm (Package Manager)

We use pnpm, not npm.

Enable via Corepack:
```bash
corepack enable
corepack prepare pnpm@latest --activate
```
Verify:
```bash
pnpm -v
```
4. Git

https://git-scm.com

# Backend Setup (Django)

From the repo root:
```bash
cd logify-backend
Create Virtual Environment
python -m venv .venv
```
Activate:

Windows
```bash
.\.venv\Scripts\Activate.ps1
```
Mac/Linux
```bash
source .venv/bin/activate
Install Dependencies
pip install -r requirements.txt
```
If development dependencies exist:
```bash
pip install -r requirements-dev.txt
// Run Migrations
python manage.py migrate
// Run Development Server
python manage.py runserver
```
Backend runs at:

http://127.0.0.1:8000/

# Frontend Setup (React + Vite)

From repo root:
```bash
cd logify-frontend
```
Install dependencies:
```bash
pnpm install
```
Run dev server:
```bash
pnpm run dev
```
Frontend runs at:

http://localhost:5173

# Environment Variables

Backend uses environment variables for sensitive values.

Create:

logify-backend/.env

Example:
```bash
DJANGO_SECRET_KEY=your-secret-key
```
Never commit .env files.

# Code Quality & Standards

This project enforces strict code quality rules.

We use:

1. Backend

2. Black (formatting)

3. isort (import sorting)

4. Flake8 (linting)

5. Frontend

6. ESLint

7. Prettier

8. Git Hook Automation

All checks run automatically using pre-commit.

# Pre-commit Setup (Required)

From repo root:
```bash
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install pre-commit
pre-commit install
```
Run manually:
```bash
pre-commit run --all-files
```
If pre-commit modifies files, stage and commit again.

# Continuous Integration (CI)

GitHub Actions automatically runs on:

- Push to main

- Pull Requests

CI runs on:

- Ubuntu

- Windows

Checks performed:

- Django system check

- pytest (if tests exist)

- Black / isort / flake8

- ESLint

- Prettier

All PRs must pass CI before merging.

# Running Backend Tests with Docker Testcontainers

To run Django backend tests in isolation (without using a live database), the project uses [testcontainers](https://testcontainers-python.readthedocs.io/en/latest/) to spin up a temporary PostgreSQL Docker container for each test session.

## Requirements
- Docker must be installed and running on your machine.
- Python 3.12+ and virtualenv recommended.

## Setup Steps
1. **Install dependencies:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r logify-backend/requirements-dev.txt
   pip install psycopg2-binary
   ```
2. **Ensure Docker is running.**

3. **Run tests:**
# Make sure your python environment is activated then run the command below
   ```bash
   ./run_tests_with_container.sh
   ```
   This will automatically start a PostgreSQL Docker container for the test database. No live or production database will be touched.

## What the team needs to add for tests to pass:
- The following must be present in `logify-backend/requirements-dev.txt`:
  - `pytest`
  - `pytest-django`
  - `testcontainers`
  - `djangorestframework`
  - `psycopg2-binary` (install separately if not present)
- The file `logify-backend/conftest.py` must contain the testcontainers setup (see codebase for example).
- Docker must be running locally.

## Troubleshooting
- If you see import errors for `testcontainers.postgres`, ensure you have installed `testcontainers` and `psycopg2-binary` in your virtual environment.
- If tests fail with database errors, ensure Docker is running and no other process is using the test database port.
- If you see errors about the Python interpreter, make sure VS Code or your terminal is using the correct virtual environment.

# Contribution Guidelines
# Test Procedures

There are two main ways to run backend tests for Logify:

## 1. Using Docker Testcontainers (Recommended)

This method uses [testcontainers](https://testcontainers-python.readthedocs.io/en/latest/) to automatically spin up a temporary PostgreSQL Docker container for each test session.

**Steps:**
1. Ensure Docker is installed and running.
2. Create and activate a Python virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r logify-backend/requirements-dev.txt
   pip install psycopg2-binary
   ```
4. Run tests:
   ```bash
   pytest logify-backend
   ```
   This will start a PostgreSQL Docker container for the test database. No live or production database will be touched.

**Requirements:**
- Docker running locally
- The following in `logify-backend/requirements-dev.txt`:
  - `pytest`, `pytest-django`, `testcontainers`, `djangorestframework`, `psycopg2-binary`
- `logify-backend/conftest.py` must contain the testcontainers setup

**Troubleshooting:**
- If you see import errors for `testcontainers.postgres`, ensure you have installed `testcontainers` and `psycopg2-binary` in your virtual environment.
- If tests fail with database errors, ensure Docker is running and no other process is using the test database port.
- If you see errors about the Python interpreter, make sure your terminal or VS Code is using the correct virtual environment.

## 2. Using the Provided Shell Script

You can also run tests using the helper script:

```bash
./run_tests_with_container.sh
```

This script will:
- Find a free port
- Start a temporary PostgreSQL Docker container
- Export the necessary environment variables
- Run `pytest logify-backend`
- Clean up the container after tests finish

## 3. Pytest Configuration

The `pytest.ini` file configures pytest for the Django backend:

```
[pytest]
DJANGO_SETTINGS_MODULE = config.settings
python_files = test_*.py
addopts = --maxfail=1 --disable-warnings
pythonpath = logify-backend
```

This ensures tests are discovered and run correctly in the backend directory.

Branching Strategy
```bash
main → protected production branch

dev → integration branch

feature branches → feature/feature-name
```
Example:
```bash
git checkout -b feature/intern-model
Commit Message Convention
```
Use structured commit messages:
```bash
feat: add intern model
fix: resolve login validation bug
chore: configure CI pipeline
refactor: improve auth service logic
```

# Before Opening a PR

Make sure:
```bash
pre-commit run --all-files
```
Everything must pass.

# Testing (Backend)

Run:
```bash
pytest
```
Future contributors should:

- Write tests for models

- Write tests for views

- Avoid merging untested business logic

# Security Practices

- No hardcoded secrets

- Use environment variables

- No committing .env

- Validate all user input

- Follow Django security best practices

# Future Roadmap

1. Authentication system (JWT)

2. Role-based permissions (Intern / Supervisor / Admin)

3. Evaluation scoring engine

4. Reporting dashboard

5. Dockerization

6. Production deployment

# Why This Structure Matters

This project enforces:

- Consistent formatting across contributors

- Automatic linting before commits

- Cross-platform compatibility (Windows + Linux)

- Clean CI validation before merging

This ensures:

- No broken builds

- No style conflicts

- Professional codebase standards


# Final Note for Contributors

If something breaks:

1. Check pre-commit

2. Check lint errors

3. Check CI logs

4. Ask in Issues with full error output

We prioritize:

- Clean architecture

- Code clarity

- Maintainability

- Scalability
