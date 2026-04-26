<div align="center">
  <h1 align="center">Logify</h1>
  <p align="center">
    <strong>A Full-Stack Internship Logging & Evaluation System</strong>
    <br />
    <a href="#about-the-project"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="#getting-started">Getting Started</a>
    ·
    <a href="#testing">Testing</a>
    ·
    <a href="#contribution-guidelines">Contributing</a>
  </p>
</div>

<div align="center">

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg?logo=python&logoColor=white)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-6.0+-092E20.svg?logo=django&logoColor=white)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Code Style: Black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)

</div>

---

<details open>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#architecture--tech-stack">Architecture & Tech Stack</a></li>
    <li><a href="#erd--workflow-design">ERD & Workflow Design</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#testing">Testing</a></li>
    <li><a href="#code-quality--standards">Code Quality & Standards</a></li>
    <li><a href="#contribution-guidelines">Contribution Guidelines</a></li>
  </ol>
</details>

---

## About The Project

Logify is a comprehensive platform designed to bridge the gap between universities, organizations, and students during the internship period. Built with scalability and a SaaS future in mind, Logify streamlines the entire internship lifecycle.

### Features
- **Interns**: Seamlessly log daily and weekly activities, upload attachments, and track internship progress.
- **Supervisors**: Review, approve, and evaluate intern performance using structured evaluation rubrics.
- **Administrators**: Manage placements, institutions, academic departments, and oversee system compliance.
- **Reporting**: Comprehensive data export and analytical reports on internship outcomes.

---

## Architecture & Tech Stack

The project is structured as a monorepo containing both the backend API and the frontend client.

```bash
logify/
├── logify-backend/        # Django backend API
│   ├── config/            # Core Django settings
│   ├── apps/              # Pluggable Django applications
│   └── manage.py
│
├── logify-frontend/       # React client
│   ├── src/               # React components and pages
│   ├── tailwind.config.cjs # Tailwind styling
│   └── vite.config.js     # Vite bundler configuration
│
├── .github/workflows/     # CI/CD pipelines
├── .pre-commit-config.yaml # Pre-commit hooks definition
└── README.md
```

### Built With
- **Backend**: [Django](https://www.djangoproject.com/) + [Django REST Framework](https://www.django-rest-framework.org/)
- **Frontend**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/) + [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Tooling**: `pnpm`, `pre-commit`, `pytest`, `eslint`, `make`

---

## ERD & Workflow Design

The database schema and system workflow design can be found in the project documentation:
- **Source File**: [logify-backend/docs/ERD.md](logify-backend/docs/ERD.md)

---

## Getting Started

Follow these step-by-step instructions to get a local copy up and running for development.

### 1. Clone the Repository

```bash
git clone https://github.com/Joshkovu/Logify.git
cd Logify
```

### 2. Prerequisites

Ensure you have the following installed on your local machine:
- [Python 3.11+](https://python.org)
- [Node.js v20+ (LTS)](https://nodejs.org)
- [Docker](https://www.docker.com/) *(Required for running isolated database tests)*
- [Make](https://www.gnu.org/software/make/) *(Required for running tests and automation scripts)*

**Enable pnpm (if not already installed):**
```bash
corepack enable
corepack prepare pnpm@latest --activate
```

### 3. Backend Setup (Django)

The backend API is built using Django and requires a virtual environment.

<details>
<summary><b>Click to expand backend setup instructions</b></summary>
<br>

1. **Navigate to the backend directory:**
   ```bash
   cd logify-backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   # Windows
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1

   # Mac/Linux
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   pip install -r requirements-dev.txt
   ```

4. **Configure Environment Variables:**
   Create a `.env` file in `logify-backend/` (do not commit this file):
   ```env
   DJANGO_SECRET_KEY=your-super-secret-key
   DEBUG=True
   POSTGRES_DB=logify
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   ```

5. **Apply database migrations & run the server:**
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```
   > The API will be available at [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

</details>

### 4. Frontend Setup (React + Vite)

The frontend client is built with React and Vite.

<details>
<summary><b>Click to expand frontend setup instructions</b></summary>
<br>

1. **Navigate to the frontend directory:**
   ```bash
   cd logify-frontend
   ```

2. **Install node dependencies:**
   ```bash
   pnpm install
   ```

3. **Start the development server:**
   ```bash
   pnpm run dev
   ```
   > The application will be available at [http://localhost:5173/](http://localhost:5173/)

</details>

---

## Testing

Logify uses `make` to orchestrate tests and quality checks.

> [!IMPORTANT]
> Ensure **Docker** and **Make** are installed on your system. Docker is required for isolated PostgreSQL instances during testing.

**Run all tests:**
```bash
make test
```

**Manual test execution:**
```bash
cd logify-backend
pytest
```
*(Note: No live or production databases are touched during testing.)*

---

## Code Quality & Standards

This project enforces strict code quality rules via **pre-commit** hooks.

- **Backend Tooling**: Black (formatting), isort (imports), Flake8 (linting)
- **Frontend Tooling**: ESLint, Prettier

### Pre-commit Setup (Required)
Before making your first commit, install the Git hooks:
```bash
pip install pre-commit
pre-commit install
```
You can manually run checks against all files at any time:
```bash
pre-commit run --all-files
```

---

## Contribution Guidelines

We prioritize clean architecture, code clarity, and test-driven maintainability.

### Branching Strategy
- `main` → Protected production branch
- `dev` → Integration and testing branch
- `feature/feature-name` → Feature development branches

### Commit Message Convention
Please use structured, semantic commit messages:
- `feat:` for new features (e.g., `feat: add intern model`)
- `fix:` for bug fixes (e.g., `fix: resolve login validation bug`)
- `chore:` for maintenance (e.g., `chore: configure CI pipeline`)
- `refactor:` for code restructuring

### Pull Request Process
1. Ensure your branch is up to date with `dev`.
2. Verify all `pre-commit` hooks pass locally.
3. Ensure all tests (`pytest`) pass successfully.
4. Open a PR outlining your changes, referencing any relevant issues.

> [!WARNING]
> All PRs must pass GitHub Actions CI checks before they can be merged.

### Security Practices
- **No hardcoded secrets**: Always use environment variables.
- **Validate all input**: Rely on DRF serializers for incoming data.
- **Never commit `.env` files**: Ensure they remain in `.gitignore`.

---

## Completed Milestones

- [x] JWT Authentication flows
- [x] Role-based Access Control (Intern / Supervisor / Admin)
- [x] Dynamic Evaluation Scoring Engine
- [x] Administrative Dashboard & Placements Tracking
