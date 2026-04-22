import { render, screen } from "@testing-library/react";
import { api } from "../config/api";
import WeeklyLogs from "../pages/dashboards/StudentDashboard/pages/WeeklyLogs";

jest.mock("../config/api", () => ({
  api: {
    logbook: {
      getWeeklyLogHistory: jest.fn(),
      getWeeklyLogs: jest.fn(),
    },
    placements: {
      getPlacements: jest.fn(),
    },
  },
}));

beforeEach(() => {
  api.placements.getPlacements.mockResolvedValue([{ id: 1, status: "active" }]);
});

test("new weekly log button shows when placement active", async () => {
  render(<WeeklyLogs />);
  expect(await screen.findByText("New Log")).toBeInTheDocument();
});

test("placement not found shows when placement not existent", async () => {
  api.placements.getPlacements.mockResolvedValue([]);
  render(<WeeklyLogs />);
  expect(await screen.findByText("Placement not found")).toBeInTheDocument();
});

test("shows total logs", async () => {
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
  expect(
    await screen.findByText(/4\/20\/2026|20\/4\/2026/),
  ).toBeInTheDocument();
  expect(
    await screen.findByText(/4\/27\/2026|27\/4\/2026/),
  ).toBeInTheDocument();
  expect(
    await screen.findByText(/4\/28\/2026|28\/4\/2026/),
  ).toBeInTheDocument();
  expect(await screen.findByText(/5\/5\/2026|5\/5\/2026/)).toBeInTheDocument();
  expect(
    await screen.findByText(/4\/29\/2026|29\/4\/2026/),
  ).toBeInTheDocument();
  expect(await screen.findByText("Not submitted")).toBeInTheDocument();
});
