<div align="center">
  <h1 align="center">Logify</h1>
  <p align="center">
    <strong>A full-stack internship logging, placement, supervision, and evaluation system.</strong>
    <br />
    <a href="#about-the-project"><strong>Explore the docs</strong></a>
    <br />
    <br />
    <a href="#proposal--requirements">Proposal & Requirements</a>
    |
    <a href="#workflow--business-logic">Workflow</a>
    |
    <a href="#code-walkthrough">Code Walkthrough</a>
    |
    <a href="#getting-started">Getting Started</a>
  </p>
</div>

<div align="center">

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg?logo=python&logoColor=white)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-5+-092E20.svg?logo=django&logoColor=white)](https://www.djangoproject.com/)
[![DRF](https://img.shields.io/badge/DRF-API-red.svg)](https://www.django-rest-framework.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Code Style: Black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)

</div>

---

<details open>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#proposal--requirements">Proposal & Requirements</a></li>
    <li><a href="#architecture--tech-stack">Architecture & Tech Stack</a></li>
    <li><a href="#workflow--business-logic">Workflow & Business Logic</a></li>
    <li><a href="#code-walkthrough">Code Walkthrough</a></li>
    <li><a href="#api-surface">API Surface</a></li>
    <li><a href="#erd--data-model">ERD & Data Model</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#testing">Testing</a></li>
    <li><a href="#code-quality--standards">Code Quality & Standards</a></li>
    <li><a href="#contribution-guidelines">Contribution Guidelines</a></li>
  </ol>
</details>

---

## About The Project

Logify is a comprehensive internship management platform for universities, students, workplace supervisors, academic supervisors, and internship administrators. It centralizes the internship lifecycle: student onboarding, placement submission, supervisor assignment, weekly logbook tracking, supervisor review, evaluation scoring, reporting, and institutional oversight.

The current codebase is a full-stack monorepo with a Django REST API, a React/Vite client, PostgreSQL persistence, JWT authentication, role-based dashboards, email notifications, and automated backend/frontend tests.

### Core Capabilities

- **Student onboarding**: Students create accounts using institutional details, programme information, student number, intake year, and year of study.
- **Role-based access**: Four primary roles are supported: `student`, `workplace_supervisor`, `academic_supervisor`, and `internship_admin`.
- **Placement management**: Students create internship placements, submit them for approval, and track placement status.
- **Supervisor workflows**: Academic supervisors approve, reject, activate, complete, or cancel placements; workplace supervisors review weekly logs.
- **Weekly logbook**: Students create weekly logs for active placements, submit them, receive feedback, and revise when changes are requested.
- **Evaluation engine**: Rubrics, criteria, scores, evaluations, and final results model structured internship assessment.
- **Reporting**: Weekly log reports can be viewed or downloaded through the frontend API client.
- **Institutional administration**: Admins manage students, supervisors, institutions, colleges, departments, programmes, organizations, placements, evaluations, and reports.

---

## Proposal & Requirements

### Problem Statement

Internship supervision often happens across scattered email threads, spreadsheets, paper logbooks, and disconnected institutional records. This makes it difficult to verify student progress, enforce approval workflows, collect supervisor feedback, and produce reliable internship reports.

Logify proposes a unified system where every actor in the internship lifecycle works from the same data model and follows a controlled workflow. The platform reduces administrative overhead, makes student progress visible, and preserves a reliable audit trail for placement and logbook decisions.

### Project Objectives

- Provide a single platform for internship placement, tracking, supervision, evaluation, and reporting.
- Enforce role-specific access so users only see and mutate records within their scope.
- Support a highly structured Academic Hierarchy: **Institution &rarr; College &rarr; Department &rarr; Programme**.
- Capture placement and weekly log status history for accountability.
- Support both Academic and Workplace supervisor participation.
- Generate reporting data from submitted logs, supervisor comments, placement information, and evaluation scores.
- Keep the system deployable as a modern web application with separate backend and frontend services.

### Functional Requirements

| Area | Requirement |
| --- | --- |
| Authentication | Users can sign up, log in, refresh JWTs, view/update their profile, change password, and log out. |
| Authorization | Routes and API endpoints enforce role-based access for `student`, `workplace_supervisor`, `academic_supervisor`, `internship_admin`, and superusers. |
| Student Registry | Internship admins can list and manage students scoped to their exact Institution, College, and Department. |
| Supervisor Onboarding | Supervisors submit applications; internship admins approve or reject them before activation. |
| Academic Structure | Data maps tightly to `Institutions`, `Colleges`, `Departments`, and `Programmes`. |
| Organizations | Host organizations store industry, address, city, email, and phone contact data. |
| Placements | Students create placements; assigned academic supervisors transition them through the approval lifecycle. |
| Weekly Logs | Students create logs only when they have an active placement; supervisors approve, reject, or request changes. |
| Evaluations | Supervisors/admins manage rubrics, criteria, evaluations, scores, and final results. |
| Reports | Users can retrieve or download student weekly log reports from the reporting API. |

### Non-Functional Requirements

- **Security**: JWT bearer authentication, token refresh/blacklisting, server-side permission checks, and environment variables for secrets.
- **Data Integrity**: PostgreSQL relational models and append-only status history tables (`PlacementStatusHistory`, `WeeklyLogStatusHistory`).
- **Maintainability**: Backend domains separated into isolated Django apps; frontend domains separated into pages, dashboards, contexts, and API helpers.
- **Testability**: Backend tests with `pytest`; frontend tests with Jest/Testing Library.
- **Scalability**: API and frontend deployable independently with Docker, Render/Netlify configuration, and CORS origin control.

### Stakeholders

- **Students**: Need a clear way to register, create placements, log work, track feedback, and view outcomes.
- **Workplace Supervisors**: Need quick access to assigned interns and pending weekly logs.
- **Academic Supervisors**: Need placement approval tools, evaluation workflows, and progress visibility.
- **Internship Administrators**: Need oversight of users, supervisors, placements, academics, and evaluations scoped exactly to their respective Institutional Departments.

### Assumptions and Constraints

- A student must have a valid Institution, College, Department, and Programme before placement creation.
- Weekly logs are tied to a specific placement and can only be created after the placement becomes `active`.
- Supervisor applications remain inactive until explicitly approved by an authorized internship admin.
- Internship admins are strictly scoped to their academic hierarchy unless they possess superuser privileges.
- The frontend expects `VITE_BACKEND_URL` to point to the API base prefix (e.g. `http://127.0.0.1:8000/api`).

## Architecture & Tech Stack

The project is structured as a monorepo containing the backend API and frontend client.

```text
Logify/
|-- logify-backend/         # Django REST API
|   |-- config/             # Django settings, ASGI/WSGI, root URLs
|   |-- apps/               # Domain-focused Django apps
|   |-- docs/ERD.md         # Mermaid entity relationship diagram
|   |-- manage.py
|   |-- requirements.txt
|   `-- requirements-dev.txt
|
|-- logify-frontend/        # React + Vite client
|   |-- src/
|   |   |-- contexts/       # Auth provider and session state
|   |   |-- config/         # API client wrapper
|   |   |-- pages/          # Auth pages and role dashboards
|   |   |-- components/     # Shared route/UI components
|   |   `-- tests/          # Frontend test suites
|   |-- package.json
|   `-- vite.config.js
|
|-- docker-compose.yml      # Local multi-service stack
|-- Makefile                # Test automation entrypoint
|-- pytest.ini
`-- README.md
```

### Built With

- **Backend**: Django, Django REST Framework, Simple JWT
- **Frontend**: React, Vite, React Router, Tailwind CSS, Radix UI, lucide-react, Chart.js
- **Database**: PostgreSQL
- **Testing**: pytest, pytest-django, testcontainers, Jest, Testing Library
- **Tooling**: Docker, Make, pre-commit, Black, isort, Flake8, ESLint, Prettier

### Runtime Architecture

```text
React/Vite client
    |
    | fetch + JWT bearer token
    v
Django REST API
    |
    | ORM models, serializers, permissions, workflow views
    v
PostgreSQL database
    |
    | event-triggered email notifications
    v
SMTP/email backend
```

---

## Workflow & Business Logic

### Authentication and Session Flow

1. A user signs up or logs in through the frontend React client.
2. The backend returns an access token and refresh token using Simple JWT.
3. The frontend stores the session securely and uses `AuthContext` to load `/v1/auth/me/` and hydrate the user.
4. Protected routes redirect users based on their role (`/student`, `/admin`, `/supervisor`, `/workplace-supervisor`).
5. API helper utilities retry failed `401 Unauthorized` requests after refreshing the access token.

### Supervisor Onboarding

1. A supervisor registers via `/signup/supervisor`.
2. The backend generates a `SupervisorApplication` in a `pending` state.
3. The account remains inactive until an authorized Internship Admin approves the application.
4. Internship Admins review and approve applications, shifting the status to `approved`, activating the user account, and dispatching a welcome email.

### Placement Lifecycle

Placement statuses follow a strict state machine represented in `InternshipPlacements.STATUS_CHOICES`:

```text
draft -> submitted -> approved -> active -> completed
                   \-> rejected
                   \-> cancelled
```

Business rules:
- Students create placements against their own `Institution` and `Programme`.
- Only `draft` placements can be modified or submitted.
- Academic supervisors approve/reject only those placements directly assigned to them.
- Placements strictly move from `submitted` -> `approved` -> `active` -> `completed`.
- Every transition automatically logs an immutable record to `PlacementStatusHistory`.
- Status changes trigger relevant lifecycle email notifications.

### Weekly Logbook Lifecycle

Weekly log statuses follow a clear revision cycle:

```text
draft -> submitted -> approved
                  \-> rejected
                  \-> changes_requested -> submitted
```

Business rules:
- Students require an `active` placement to generate weekly logs.
- Logs initially save as `draft`.
- Workplace supervisors review submitted logs (Approve, Reject, or Request Changes).
- `changes_requested` allows the student to update and re-submit the log.
- Every review writes to both a `SupervisorReviews` record and a `WeeklyLogStatusHistory` audit log.

### Evaluation and Results Logic

- **Rubrics** are linked to an `Institution` and `Programme`.
- **Criteria** detail max scores, weights, and the required evaluator type.
- **Evaluations** are bound to a placement, rubric, evaluator, and evaluator type.
- **Scores** are uniquely constrained per evaluation/criterion pair.
- **Final Results** aggregate the logbook score, workplace feedback, academic score, and calculate a final grade and remarks.

### Admin Scope Logic

Internship admins are scoped specifically to prevent cross-institution data leaks.
- Governed by helper functions in `apps/accounts/access.py`.
- Admins are scoped deeply by the academic hierarchy: `Institution -> College -> Department`.
- Superusers bypass constraints for global platform oversight.
- Scoping applies across student registries, supervisor listings, placements, and user profiles.

---

## Code Walkthrough

### Backend Architecture

The backend is a monolithic Django application structured tightly into domain-driven apps:

- `apps/academics/`: Models the core academic hierarchy (`Institutions`, `Colleges`, `Departments`, `Programmes`).
- `apps/accounts/`: Manages custom users, roles, JWT auth views, supervisor applications, profiles, and role permissions.
- `apps/evaluations/`: Handles grading (`EvaluationRubrics`, `EvaluationCriteria`, `Evaluations`, `EvaluationScores`, `FinalResults`).
- `apps/logbook/`: Owns weekly logs, submission logic, review histories, and supervisor remarks.
- `apps/notifications/`: Houses reusable email templates and asynchronous email dispatch helpers.
- `apps/organizations/`: Manages internship host organization records.
- `apps/placements/`: Drives the internship placement lifecycle, contacts, and status history.
- `apps/reports/`: Exposes generated statistical reporting and data export endpoints.

### Frontend Architecture

The frontend is a modern React/Vite SPA utilizing a clean folder structure:

- `src/App.jsx`: Root component handling the router configuration and fallback error pages.
- `src/contexts/`: Houses `AuthContext.jsx` for global session state and role hydration.
- `src/config/api.js`: Centralized Axios/fetch wrapper handling interceptors, token refreshes, and API base URL resolution.
- `src/components/auth/`: Contains `ProtectedRoute.jsx` for client-side role authorization.
- `src/pages/dashboards/`: Directory isolating views by user role (Student, Internship Admin, Academic Supervisor, Workplace Supervisor).

### Key Design Patterns

- **Domain Apps**: Strict separation of concerns on the backend (URLs, Views, Serializers, Models).
- **API Wrapper**: Centralized API call handling on the client instead of ad-hoc fetch usage.
- **State Transitions as Commands**: Endpoints use explicit verbs (`/submit`, `/approve`, `/activate`) instead of generic PATCH requests for state changes.
- **Audit Tables**: Immutable logs for tracking history (`PlacementStatusHistory`, `WeeklyLogStatusHistory`).

## API Surface

All backend endpoints are mounted under `/api/v1/`.

| Domain | Prefix | Purpose |
| --- | --- | --- |
| Auth | `/auth/` | Login, refresh, logout, current user, password changes, student/admin/supervisor signup. |
| Accounts | `/accounts/` | Supervisor applications, supervisor approvals, supervisor lists, user detail access. |
| Registry | `/registry/` | Student registry CRUD plus import/export stubs. |
| Academics | `/academics/` | Institutions, colleges, departments, programmes, and nested academic lookups. |
| Organizations | `/organizations/` | Host organization CRUD. |
| Placements | `/placements/` | Placement CRUD and status transition commands. |
| Logbook | `/logbook/` | Weekly log creation, update, submission, review, history, and supervisor reviews. |
| Evaluations | `/evaluations/` | Rubrics, criteria, evaluations, scores, and final results. |
| Reports | `/reports/` | Weekly log report retrieval and download. |

---

## ERD & Data Model

The detailed Mermaid ERD is maintained in:

- [logify-backend/docs/ERD.md](logify-backend/docs/ERD.md)

The major entities are:

- Academic structure: `Institutions`, `Colleges`, `Departments`, `Programmes`
- Identity and roles: `User`, `StaffProfiles`, `SupervisorApplication`
- Internship placement: `Organizations`, `InternshipPlacements`, `PlacementStatusHistory`, `PlacementContacts`
- Logbook: `WeeklyLogs`, `WeeklyLogStatusHistory`, `SupervisorReviews`
- Evaluation: `EvaluationRubrics`, `EvaluationCriteria`, `Evaluations`, `EvaluationScores`, `FinalResults`
- Reporting: `InternshipReport`

---

## Getting Started

Follow these steps to run Logify locally.

### 1. Clone the Repository

```bash
git clone https://github.com/Joshkovu/Logify.git
cd Logify
```

### 2. Prerequisites

- [Python 3.11+](https://python.org)
- [Node.js 20+](https://nodejs.org)
- [Docker](https://www.docker.com/)
- [Make](https://www.gnu.org/software/make/)
- `pnpm`

Enable pnpm if needed:

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

### 3. Backend Setup

```bash
cd logify-backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
pip install -r requirements-dev.txt
```

Create `logify-backend/.env`:

```env
DJANGO_SECRET_KEY=your-local-secret
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
FRONTEND_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
FRONTEND_URL=http://localhost:5173

POSTGRES_DB=logify
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_SSLMODE=disable
POSTGRES_CHANNEL_BINDING=disable

EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

Run migrations and start the API:

```bash
python manage.py migrate
python manage.py runserver
```

The backend will be available at `http://127.0.0.1:8000/`.

### 4. Frontend Setup

```bash
cd logify-frontend
pnpm install
```

Create `logify-frontend/.env`:

```env
VITE_BACKEND_URL=http://127.0.0.1:8000/api
```

Start the Vite dev server:

```bash
pnpm run dev
```

The frontend will be available at `http://localhost:5173/`.

### 5. Docker Compose Option

The repository also includes a compose stack for PostgreSQL, backend, and frontend:

```bash
docker compose up --build
```

---

## Testing

Logify uses `make` as the root test entrypoint for backend tests.

```bash
make test
```

Manual backend test execution:

```bash
cd logify-backend
pytest
```

Frontend tests:

```bash
cd logify-frontend
pnpm test
```

Frontend linting and production build:

```bash
pnpm run lint
pnpm run build
```

---

## Code Quality & Standards

This project enforces code quality through pre-commit hooks and framework-specific tooling.

- **Backend**: Black, isort, Flake8, pytest
- **Frontend**: ESLint, Prettier, Jest, Testing Library
- **Security**: Environment variables for secrets, JWT authentication, DRF permission classes, no committed `.env` files
- **Data**: Prefer serializers and model constraints over ad hoc validation

Install hooks:

```bash
pip install pre-commit
pre-commit install
```

Run all hooks manually:

```bash
pre-commit run --all-files
```

---

## Contribution Guidelines

We prioritize clean architecture, code clarity, and test-driven maintainability.

### Branching Strategy

- `main` - protected production branch
- `dev` - integration and testing branch
- `feature/feature-name` - feature development branches

### Commit Message Convention

- `feat:` for new features, for example `feat: add weekly log review flow`
- `fix:` for bug fixes, for example `fix: enforce placement approval scope`
- `chore:` for maintenance, for example `chore: update CI config`
- `refactor:` for internal restructuring, for example `refactor: extract auth permissions`
- `test:` for test-only changes, for example `test: cover student log submission`

### Pull Request Process

1. Keep your branch up to date with `dev`.
2. Run backend and frontend tests relevant to your change.
3. Run pre-commit checks before pushing.
4. Open a PR with a clear summary, test notes, and any screenshots for UI changes.
5. Wait for CI to pass before requesting merge.

### Security Practices

- Do not hardcode secrets or tokens.
- Do not commit `.env` files.
- Validate request payloads through serializers.
- Keep authorization checks on the backend even when frontend routes are protected.
- Scope admin access by institution and college unless superuser behavior is explicitly intended.

---

## Completed Milestones

- [x] JWT authentication and token refresh flow
- [x] Role-based route protection and API permissions
- [x] Student, supervisor, and admin signup flows
- [x] Supervisor application approval flow
- [x] Placement lifecycle with status history
- [x] Weekly log creation, submission, review, and revision workflow
- [x] Rubric-based evaluation data model
- [x] Admin, student, academic supervisor, and workplace supervisor dashboards
- [x] Email templates for account, placement, and logbook events
