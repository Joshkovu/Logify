import { render, screen } from "@testing-library/react";
import { api } from "../config/api";
import Dashboard from "../pages/dashboards/StudentDashboard/pages/Dashboard";

jest.mock("../config/api", () => ({
  api: {
    auth: {
      me: jest.fn(),
    },
    placements: {
      getPlacements: jest.fn(),
    },
    evaluations: {
      getResults: jest.fn(),
    },
    logbook: {
      getWeeklyLogs: jest.fn(),
    },
    organizations: {
      getOrganization: jest.fn(),
    },
    accounts: {
      getAcademicSupervisor: jest.fn(),
      getWorkplaceSupervisor: jest.fn(),
    },
  },
}));

beforeEach(() => {
  api.auth.me.mockResolvedValue({ first_name: "Emmanuel", last_name: "Gates" });
  api.placements.getPlacements.mockResolvedValue([]);
  api.logbook.getWeeklyLogs.mockResolvedValue({});
  api.evaluations.getResults.mockResolvedValue([]);
  api.organizations.getOrganization.mockResolvedValue(null);
  api.accounts.getAcademicSupervisor.mockResolvedValue(null);
  api.accounts.getWorkplaceSupervisor.mockResolvedValue(null);
});

test("renders page and shows user first name", async () => {
  api.auth.me.mockResolvedValue({ first_name: "Emmanuel", last_name: "Gates" });
  render(<Dashboard />);
  expect(await screen.findByText(/emmanuel/i)).toBeInTheDocument();
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
