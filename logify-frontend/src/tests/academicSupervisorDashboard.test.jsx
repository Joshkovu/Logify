import { render, screen, waitFor } from "@testing-library/react";
import PropTypes from "prop-types";
import Dashboard from "../pages/dashboards/AcademicSupervisorDashboard/Pages/Dashboard";

jest.mock("../config/api", () => ({
  api: {
    auth: { me: jest.fn() },
    placements: { getPlacements: jest.fn() },
    logbook: { getWeeklyLogs: jest.fn() },
    evaluations: { getEvaluations: jest.fn() },
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

const setupSuccessfulResponses = ({
  placements = [
    {
      id: 1,
      intern: 101,
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
} = {}) => {
  api.auth.me.mockResolvedValue({
    first_name: "Emily",
    last_name: "Roberts",
  });
  api.placements.getPlacements.mockResolvedValue(placements);
  api.logbook.getWeeklyLogs.mockResolvedValue(weeklyLogs);
  api.evaluations.getEvaluations.mockResolvedValue(evaluations);
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

  render(<Dashboard />);

  expect(
    screen.getByText(/loading your supervision overview/i),
  ).toBeInTheDocument();
});

test("renders academic supervisor data from the backend responses", async () => {
  setupSuccessfulResponses();

  render(<Dashboard />);

  expect(
    await screen.findByText(/welcome back, emily roberts!/i),
  ).toBeInTheDocument();
  expect(screen.getByText("Interns Supervised")).toBeInTheDocument();
  expect(screen.getByText("1")).toBeInTheDocument();
  expect(screen.getByText("Sarah Johnson")).toBeInTheDocument();
  expect(screen.getByText("TechCorp Solutions")).toBeInTheDocument();
  expect(screen.getByText(/completed evaluation/i)).toBeInTheDocument();
});

test("renders empty states when the supervisor has no assigned data", async () => {
  setupSuccessfulResponses({
    placements: [],
    weeklyLogs: { weekly_logs: [] },
    evaluations: [],
  });

  render(<Dashboard />);

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

  render(<Dashboard />);

  await waitFor(() => {
    expect(screen.getByText(/backend unavailable/i)).toBeInTheDocument();
  });
});
