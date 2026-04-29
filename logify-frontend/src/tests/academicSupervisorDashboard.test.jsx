import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "../pages/dashboards/AcademicSupervisorDashboard/Pages/Dashboard";

jest.mock("../config/api", () => ({
  api: {
    auth: { me: jest.fn() },
    placements: { getPlacements: jest.fn() },
    logbook: { getWeeklyLogs: jest.fn() },
    evaluations: {
      getEvaluations: jest.fn(),
      getScores: jest.fn(),
      getCriteria: jest.fn(),
      getResults: jest.fn(),
      getRubrics: jest.fn(),
    },
    academics: {
      getProgrammes: jest.fn(),
      getDepartments: jest.fn(),
    },
    accounts: { getUser: jest.fn() },
    organizations: { getOrganization: jest.fn() },
  },
}));

jest.mock("../components/ui/ThemeToggle", () => {
  function ThemeToggleMock() {
    return <div>Theme Toggle</div>;
  }

  ThemeToggleMock.displayName = "ThemeToggleMock";

  return ThemeToggleMock;
});

jest.mock("../components/ui/MetricCard", () => {
  const PropTypes = require("prop-types");

  function MetricCardMock({ title, value }) {
    return (
      <div>
        <span>{title}</span>
        <span>{value}</span>
      </div>
    );
  }

  MetricCardMock.displayName = "MetricCardMock";
  MetricCardMock.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  };

  return MetricCardMock;
});

const { api } = jest.requireMock("../config/api");

const waitForDashboardEffectsToSettle = async () => {
  await waitFor(() => {
    expect(api.auth.me).toHaveBeenCalled();
    expect(api.placements.getPlacements).toHaveBeenCalled();
    expect(api.logbook.getWeeklyLogs).toHaveBeenCalled();
    expect(api.evaluations.getEvaluations).toHaveBeenCalled();
    expect(api.evaluations.getScores).toHaveBeenCalled();
    expect(api.evaluations.getCriteria).toHaveBeenCalled();
    expect(api.evaluations.getResults).toHaveBeenCalled();
    expect(api.evaluations.getRubrics).toHaveBeenCalled();
    expect(api.academics.getProgrammes).toHaveBeenCalled();
    expect(api.academics.getDepartments).toHaveBeenCalled();
  });
};

const setupSuccessfulResponses = ({
  placements = [
    {
      id: 1,
      intern: 101,
      programme: 901,
      organization: 201,
      internship_title: "Software Engineering Intern",
      status: "submitted",
      submitted_at: "2026-04-18T10:00:00Z",
      created_at: "2026-04-17T10:00:00Z",
      start_date: "2026-04-01",
      end_date: "2026-06-30",
      updated_at: "2026-04-19T10:00:00Z",
    },
  ],
  weeklyLogs = { weekly_logs: [] },
  evaluations = [
    {
      id: 301,
      placement: 1,
      status: "reviewed",
      total_score: 88,
      updated_at: "2026-04-20T10:00:00Z",
    },
  ],
  scores = [],
  criteria = [],
  results = [],
  programmes = [
    {
      id: 901,
      department: 801,
      name: "Bachelor of Software Engineering",
    },
  ],
  departments = [
    {
      id: 801,
      name: "Computer Science",
    },
  ],
} = {}) => {
  api.auth.me.mockResolvedValue({
    first_name: "Emily",
    last_name: "Roberts",
  });

  api.placements.getPlacements.mockResolvedValue(placements);
  api.logbook.getWeeklyLogs.mockResolvedValue(weeklyLogs);
  api.evaluations.getEvaluations.mockResolvedValue(evaluations);
  api.evaluations.getScores.mockResolvedValue(scores);
  api.evaluations.getCriteria.mockResolvedValue(criteria);
  api.evaluations.getResults.mockResolvedValue(results);
  api.evaluations.getRubrics.mockResolvedValue([]);
  api.academics.getProgrammes.mockResolvedValue(programmes);
  api.academics.getDepartments.mockResolvedValue(departments);

  api.accounts.getUser.mockResolvedValue({
    id: 101,
    first_name: "Sarah",
    last_name: "Johnson",
    student_number: "20240001",
  });

  api.organizations.getOrganization.mockResolvedValue({
    id: 201,
    name: "TechCorp Solutions",
  });
};

beforeEach(() => {
  jest.clearAllMocks();
  window.localStorage.clear();
});

test("shows a loading message while dashboard data is being fetched", () => {
  api.auth.me.mockReturnValue(new Promise(() => {}));
  api.placements.getPlacements.mockReturnValue(new Promise(() => {}));
  api.logbook.getWeeklyLogs.mockReturnValue(new Promise(() => {}));
  api.evaluations.getEvaluations.mockReturnValue(new Promise(() => {}));
  api.evaluations.getScores.mockReturnValue(new Promise(() => {}));
  api.evaluations.getCriteria.mockReturnValue(new Promise(() => {}));
  api.evaluations.getResults.mockReturnValue(new Promise(() => {}));
  api.evaluations.getRubrics.mockReturnValue(new Promise(() => {}));
  api.academics.getProgrammes.mockReturnValue(new Promise(() => {}));
  api.academics.getDepartments.mockReturnValue(new Promise(() => {}));

  render(<Dashboard />);

  expect(
    screen.getByText(/loading your supervision overview/i),
  ).toBeInTheDocument();
});

test("renders academic supervisor data from the backend responses", async () => {
  setupSuccessfulResponses();

  render(<Dashboard />);
  await waitForDashboardEffectsToSettle();

  expect(
    await screen.findByText(/welcome back, emily roberts!/i),
  ).toBeInTheDocument();

  expect(screen.getByText("Interns Supervised")).toBeInTheDocument();
  expect(screen.getAllByText("Sarah Johnson").length).toBeGreaterThan(0);
  expect(screen.getAllByText("TechCorp Solutions").length).toBeGreaterThan(0);
  expect(screen.getByText(/completed evaluation/i)).toBeInTheDocument();
});

test("renders empty states when the supervisor has no assigned data", async () => {
  setupSuccessfulResponses({
    placements: [],
    weeklyLogs: { weekly_logs: [] },
    evaluations: [],
    scores: [],
    criteria: [],
    results: [],
  });

  render(<Dashboard />);
  await waitForDashboardEffectsToSettle();

  expect(
    await screen.findByText(/no interns are currently assigned/i),
  ).toBeInTheDocument();

  expect(
    screen.getByText(/no pending placement approvals right now/i),
  ).toBeInTheDocument();

  expect(
    screen.getByText(/no recent supervision activity is available yet/i),
  ).toBeInTheDocument();
});

test("shows an error message when dashboard loading fails", async () => {
  api.auth.me.mockRejectedValue(new Error("Backend unavailable"));
  api.placements.getPlacements.mockResolvedValue([]);
  api.logbook.getWeeklyLogs.mockResolvedValue({ weekly_logs: [] });
  api.evaluations.getEvaluations.mockResolvedValue([]);
  api.evaluations.getScores.mockResolvedValue([]);
  api.evaluations.getCriteria.mockResolvedValue([]);
  api.evaluations.getResults.mockResolvedValue([]);
  api.evaluations.getRubrics.mockResolvedValue([]);
  api.academics.getProgrammes.mockResolvedValue([]);
  api.academics.getDepartments.mockResolvedValue([]);

  render(<Dashboard />);
  await waitForDashboardEffectsToSettle();

  expect(await screen.findByText(/backend unavailable/i)).toBeInTheDocument();
});
