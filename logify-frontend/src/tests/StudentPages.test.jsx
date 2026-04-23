import { render, screen } from "@testing-library/react";
import { api } from "../config/api";
import Dashboard from "../pages/dashboards/StudentDashboard/pages/Dashboard";
import Evaluations from "../pages/dashboards/StudentDashboard/pages/Evaluations";
import InternshipPlacement from "../pages/dashboards/StudentDashboard/pages/InternshipPlacement";
import Profile from "../pages/dashboards/StudentDashboard/pages/Profile";
import WeeklyLogs from "../pages/dashboards/StudentDashboard/pages/WeeklyLogs";

jest.mock(
  "../pages/dashboards/StudentDashboard/CreatePlacement",
  () => () => null,
);
jest.mock(
  "../pages/dashboards/StudentDashboard/CreateWeeklyLog",
  () => () => null,
);

jest.mock("../config/api", () => ({
  api: {
    auth: {
      me: jest.fn(),
    },
    placements: {
      getPlacements: jest.fn(),
    },
    evaluations: {
      getEvaluations: jest.fn(),
      getResults: jest.fn(),
      getCriteria: jest.fn(),
      getScores: jest.fn(),
    },
    logbook: {
      getWeeklyLogs: jest.fn(),
      getWeeklyLogHistory: jest.fn(),
    },
    organizations: {
      getOrganization: jest.fn(),
      getOrganizations: jest.fn(),
    },
    accounts: {
      getAcademicSupervisor: jest.fn(),
      getWorkplaceSupervisor: jest.fn(),
    },
    academics: {
      getInstitution: jest.fn(),
      getProgramme: jest.fn(),
    },
    registry: {
      getStudent: jest.fn(),
    },
  },
}));

beforeEach(() => {
  jest.clearAllMocks();

  api.auth.me.mockResolvedValue({
    first_name: "John",
    last_name: "Doe",
    email: "johndoe@gmail.com",
    student_number: "1234567890",
  });
  api.placements.getPlacements.mockResolvedValue([]);
  api.evaluations.getEvaluations.mockResolvedValue([]);
  api.evaluations.getResults.mockResolvedValue([]);
  api.evaluations.getCriteria.mockResolvedValue([]);
  api.evaluations.getScores.mockResolvedValue([]);
  api.logbook.getWeeklyLogs.mockResolvedValue({});
  api.logbook.getWeeklyLogHistory.mockResolvedValue({ weekly_logs: [] });
  api.organizations.getOrganization.mockResolvedValue(null);
  api.organizations.getOrganizations.mockResolvedValue([]);
  api.accounts.getAcademicSupervisor.mockResolvedValue(null);
  api.accounts.getWorkplaceSupervisor.mockResolvedValue(null);
  api.academics.getInstitution.mockResolvedValue(null);
  api.academics.getProgramme.mockResolvedValue(null);
  api.registry.getStudent.mockResolvedValue(null);
});

describe("Student dashboard", () => {
  test("renders page and shows user first name", async () => {
    render(<Dashboard />);
    expect(await screen.findByText(/john/i)).toBeInTheDocument();
  });

  test("renders page and shows internship title after placement data loads", async () => {
    api.placements.getPlacements.mockResolvedValue([
      { internship_title: "Internship Title", status: "active" },
    ]);

    render(<Dashboard />);
    expect(await screen.findByText(/internship title/i)).toBeInTheDocument();
  });

  test("renders page and shows organization name when placement loads", async () => {
    api.placements.getPlacements.mockResolvedValue([
      { organization: 1, status: "active" },
    ]);
    api.organizations.getOrganization.mockResolvedValue({
      id: 1,
      name: "Organization A",
    });

    render(<Dashboard />);
    expect(await screen.findByText(/organization a/i)).toBeInTheDocument();
  });

  test("renders page and shows workplace supervisor name when placement loads", async () => {
    api.placements.getPlacements.mockResolvedValue([
      { workplace_supervisor: 1, status: "active" },
    ]);
    api.accounts.getWorkplaceSupervisor.mockResolvedValue({
      id: 1,
      first_name: "Workplace1",
      last_name: "Supervisor1",
    });

    render(<Dashboard />);
    expect(await screen.findByText(/workplace1/i)).toBeInTheDocument();
    expect(await screen.findByText(/supervisor1/i)).toBeInTheDocument();
  });

  test("renders page and shows academic supervisor name when placement loads", async () => {
    api.placements.getPlacements.mockResolvedValue([
      { academic_supervisor: 1, status: "active" },
    ]);
    api.accounts.getAcademicSupervisor.mockResolvedValue({
      id: 1,
      first_name: "Academic1",
      last_name: "Supervisor1",
    });

    render(<Dashboard />);
    expect(await screen.findByText(/academic1/i)).toBeInTheDocument();
    expect(await screen.findByText(/supervisor1/i)).toBeInTheDocument();
  });

  test("renders page and shows start date after placement data loads", async () => {
    api.placements.getPlacements.mockResolvedValue([
      { start_date: "2026-04-21", status: "active" },
    ]);

    render(<Dashboard />);
    expect(await screen.findByText(/2026-04-21/i)).toBeInTheDocument();
  });

  test("renders page and shows end date after placement data loads", async () => {
    api.placements.getPlacements.mockResolvedValue([
      { end_date: "2026-04-21", status: "active" },
    ]);

    render(<Dashboard />);
    expect(await screen.findByText(/2026-04-21/i)).toBeInTheDocument();
  });

  test("renders page and shows placement status", async () => {
    api.placements.getPlacements.mockResolvedValue([{ status: "draft" }]);

    render(<Dashboard />);
    expect(await screen.findByText(/draft/i)).toBeInTheDocument();
  });

  test("renders page and shows number of weekly logs", async () => {
    api.logbook.getWeeklyLogs.mockResolvedValue({ weekly_logs: [{}, {}, {}] });

    render(<Dashboard />);
    expect(await screen.findByText(/3/i)).toBeInTheDocument();
  });

  test("renders component and shows final score", async () => {
    api.evaluations.getResults.mockResolvedValue([{ final_score: 67 }]);

    render(<Dashboard />);
    expect(await screen.findByText(/67/i)).toBeInTheDocument();
  });
});

describe("Student profile", () => {
  test("shows user data", async () => {
    render(<Profile />);

    expect(await screen.findByText(/john doe/i)).toBeInTheDocument();
    expect(await screen.findByText(/johndoe@gmail.com/i)).toBeInTheDocument();
    expect(await screen.findByText(/1234567890/i)).toBeInTheDocument();
  });

  test("shows institution data", async () => {
    api.auth.me.mockResolvedValue({
      first_name: "John",
      last_name: "Doe",
      email: "johndoe@gmail.com",
      student_number: "1234567890",
      institution_id: 1,
    });
    api.academics.getInstitution.mockResolvedValue({
      id: 1,
      name: "University A",
    });

    render(<Profile />);
    expect(await screen.findByText(/university a/i)).toBeInTheDocument();
  });

  test("shows programme name", async () => {
    api.auth.me.mockResolvedValue({
      first_name: "John",
      last_name: "Doe",
      email: "johndoe@gmail.com",
      student_number: "1234567890",
      institution_id: 1,
      programme_id: 1,
    });
    api.academics.getInstitution.mockResolvedValue({
      id: 1,
      name: "University A",
    });
    api.academics.getProgramme.mockResolvedValue({
      id: 1,
      name: "Programme A",
    });

    render(<Profile />);
    expect(await screen.findByText(/programme a/i)).toBeInTheDocument();
  });

  test("shows year level", async () => {
    api.auth.me.mockResolvedValue({
      first_name: "John",
      last_name: "Doe",
      email: "johndoe@gmail.com",
      student_number: "1234567890",
      student_registry_id: 1,
    });
    api.registry.getStudent.mockResolvedValue({ id: 1, year_of_study: 3 });

    render(<Profile />);
    expect(await screen.findByText("Year 3")).toBeInTheDocument();
  });

  test("shows workplace and academic supervisor names", async () => {
    api.placements.getPlacements.mockResolvedValue([
      { workplace_supervisor: 1, academic_supervisor: 1 },
    ]);
    api.accounts.getAcademicSupervisor.mockResolvedValue({
      id: 1,
      first_name: "Academic1",
      last_name: "Supervisor1",
    });
    api.accounts.getWorkplaceSupervisor.mockResolvedValue({
      id: 1,
      first_name: "Workplace2",
      last_name: "Supervisor2",
    });

    render(<Profile />);
    expect(
      await screen.findByText("Academic1 Supervisor1"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Workplace2 Supervisor2"),
    ).toBeInTheDocument();
  });
});

describe("Student internship placement", () => {
  test("renders page and shows placement status", async () => {
    api.placements.getPlacements.mockResolvedValue([{ status: "draft" }]);

    render(<InternshipPlacement />);
    expect(await screen.findByText(/draft/i)).toBeInTheDocument();
  });

  test("renders page and shows organization name, address, contact and email when placement loads", async () => {
    api.placements.getPlacements.mockResolvedValue([
      { organization: 1, status: "active" },
    ]);
    api.organizations.getOrganization.mockResolvedValue({
      id: 1,
      name: "Organization A",
      address: "Kisaasi",
      contact_phone: "123456",
      contact_email: "info@orgacom",
    });

    render(<InternshipPlacement />);
    expect(await screen.findByText(/organization a/i)).toBeInTheDocument();
    expect(await screen.findByText(/kisaasi/i)).toBeInTheDocument();
    expect(await screen.findByText(/123456/i)).toBeInTheDocument();
    expect(await screen.findByText(/info@orgacom/i)).toBeInTheDocument();
  });

  test("renders page and shows workplace supervisor name and email when placement loads", async () => {
    api.placements.getPlacements.mockResolvedValue([
      { workplace_supervisor: 1, status: "active" },
    ]);
    api.accounts.getWorkplaceSupervisor.mockResolvedValue({
      id: 1,
      first_name: "Workplace1",
      last_name: "Supervisor1",
      email: "supervisor@workplacecom",
    });

    render(<InternshipPlacement />);
    expect(await screen.findByText(/workplace1/i)).toBeInTheDocument();
    expect(await screen.findByText(/supervisor1/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/supervisor@workplacecom/i),
    ).toBeInTheDocument();
  });

  test("renders page and shows academic supervisor name and email when placement loads", async () => {
    api.placements.getPlacements.mockResolvedValue([
      { academic_supervisor: 1, status: "active" },
    ]);
    api.accounts.getAcademicSupervisor.mockResolvedValue({
      id: 1,
      first_name: "Academic1",
      last_name: "Supervisor2",
      email: "supervisor@academycom",
    });

    render(<InternshipPlacement />);
    expect(await screen.findByText(/academic1/i)).toBeInTheDocument();
    expect(await screen.findByText(/supervisor2/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/supervisor@academycom/i),
    ).toBeInTheDocument();
  });
});

describe("Student evaluations", () => {
  test("shows evaluation mark and status", async () => {
    api.evaluations.getEvaluations.mockResolvedValue([
      { status: "reviewed", total_score: 92 },
    ]);

    render(<Evaluations />);
    expect(await screen.findByText(/92/i)).toBeInTheDocument();
    expect(await screen.findByText(/reviewed/i)).toBeInTheDocument();
  });

  test("shows evaluator names", async () => {
    api.evaluations.getEvaluations.mockResolvedValue([{ evaluator: 1 }]);
    api.accounts.getAcademicSupervisor.mockResolvedValue({
      id: 1,
      first_name: "John",
      last_name: "Doe",
    });

    render(<Evaluations />);
    expect(await screen.findByText(/john doe/i)).toBeInTheDocument();
  });

  test("shows workplace feedback", async () => {
    api.evaluations.getEvaluations.mockResolvedValue([{ id: 1, evaluator: 1 }]);
    api.evaluations.getResults.mockResolvedValue([
      { workplace_feedback: "words" },
    ]);
    api.accounts.getAcademicSupervisor.mockResolvedValue({
      id: 1,
      first_name: "John",
      last_name: "Doe",
    });

    render(<Evaluations />);
    expect(await screen.findByText(/words/i)).toBeInTheDocument();
  });

  test("shows academic, logbook and final score, and grade", async () => {
    api.evaluations.getEvaluations.mockResolvedValue([{ id: 1 }]);
    api.evaluations.getResults.mockResolvedValue([
      {
        final_score: 74,
        final_grade: "B",
        academic_score: 69,
        logbook_score: 28,
      },
    ]);

    render(<Evaluations />);
    expect(await screen.findByText(/74/i)).toBeInTheDocument();
    expect(await screen.findByText("B")).toBeInTheDocument();
    expect(await screen.findByText(/69/i)).toBeInTheDocument();
    expect(await screen.findByText(/28/i)).toBeInTheDocument();
  });

  test("shows criterion weight, score and name", async () => {
    api.evaluations.getEvaluations.mockResolvedValue([
      { id: 1, total_score: 92, rubric: 1 },
    ]);
    api.evaluations.getCriteria.mockResolvedValue([
      {
        id: 1,
        name: "Technical Skills",
        group: "Technical Skills",
        rubric: 1,
        weight_percent: 20.0,
      },
    ]);
    api.evaluations.getScores.mockResolvedValue([
      {
        evaluation: 1,
        criterion: 1,
        score: 15,
      },
    ]);

    render(<Evaluations />);
    expect(await screen.findByText(/technical skills/i)).toBeInTheDocument();
    expect(await screen.findByText(/20%/i)).toBeInTheDocument();
    expect(await screen.findByText(/15%/i)).toBeInTheDocument();
  });
});

describe("Student weekly logs", () => {
  test("new weekly log button shows when placement active", async () => {
    api.placements.getPlacements.mockResolvedValue([
      { id: 1, status: "active" },
    ]);

    render(<WeeklyLogs />);
    expect(await screen.findByText("New Log")).toBeInTheDocument();
  });

  test("placement not found shows when placement not existent", async () => {
    api.placements.getPlacements.mockResolvedValue([]);

    render(<WeeklyLogs />);
    expect(await screen.findByText("Placement not found")).toBeInTheDocument();
  });

  test("shows total logs", async () => {
    api.placements.getPlacements.mockResolvedValue([
      { id: 1, status: "active" },
    ]);
    api.logbook.getWeeklyLogHistory.mockResolvedValue({
      weekly_logs: [
        { status: "draft" },
        { status: "submitted" },
        { status: "draft" },
      ],
    });

    render(<WeeklyLogs />);
    expect(await screen.findByText("3")).toBeInTheDocument();
  });

  test("shows number of approved logs", async () => {
    api.placements.getPlacements.mockResolvedValue([
      { id: 1, status: "active" },
    ]);
    api.logbook.getWeeklyLogHistory.mockResolvedValue({
      weekly_logs: [
        { status: "approved" },
        { status: "draft" },
        { status: "draft" },
      ],
    });

    render(<WeeklyLogs />);
    expect(await screen.findByText("1")).toBeInTheDocument();
  });

  test("shows weekly log details", async () => {
    api.placements.getPlacements.mockResolvedValue([
      { id: 1, status: "active" },
    ]);
    api.logbook.getWeeklyLogHistory.mockResolvedValue({
      weekly_logs: [
        {
          placement: 1,
          status: "draft",
          week_number: "1",
          week_start_date: "4/20/2026",
          week_end_date: "4/27/2026",
        },
        {
          placement: 1,
          status: "submitted",
          week_number: "2",
          week_start_date: "4/28/2026",
          week_end_date: "5/5/2026",
          submitted_at: "4/29/2026",
        },
      ],
    });

    render(<WeeklyLogs />);
    expect(await screen.findByText(/week 1/i)).toBeInTheDocument();
    expect(await screen.findByText(/week 2/i)).toBeInTheDocument();
    expect(await screen.findByText(/draft/i)).toBeInTheDocument();
    expect(await screen.findByText("submitted")).toBeInTheDocument();

    expect(await screen.findByText("Not submitted")).toBeInTheDocument();
  });
});
