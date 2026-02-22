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

# Contribution Guidelines

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
