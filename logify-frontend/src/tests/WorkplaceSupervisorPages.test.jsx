import { fireEvent, render, screen } from "@testing-library/react";

jest.mock("../config/api", () => ({
  api: {
    auth: { me: jest.fn() },
    placements: {
      getPlacements: jest.fn(),
      createPlacement: jest.fn(),
      patchPlacement: jest.fn(),
      submitPlacement: jest.fn(),
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
      getWeeklyLogReviews: jest.fn(),
      createWeeklyLog: jest.fn(),
      updateWeeklyLog: jest.fn(),
      submitWeeklyLog: jest.fn(),
      deleteWeeklyLog: jest.fn(),
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

jest.mock(
  "../pages/dashboards/WorkplaceSupervisor/utils/workplaceSupervisorData",
  () => ({
    loadWorkplaceSupervisorData: jest.fn(),
  }),
  { virtual: true },
);

import { loadWorkplaceSupervisorData } from "../pages/dashboards/WorkplaceSupervisor/utils/workplaceSupervisorData";
import Dashboard from "../pages/dashboards/WorkplaceSupervisor/components/dashboard/Dashboard";
import AssignedInterns from "../pages/dashboards/WorkplaceSupervisor/pages/AssignedInterns";
import PendingLogReview from "../pages/dashboards/WorkplaceSupervisor/pages/PendingLogReview";
import Profile from "../pages/dashboards/WorkplaceSupervisor/pages/Profile";

const mockSnapshot = {
  me: {
    id: 1,
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@company.com",
    role: "Workplace Supervisor",
  },
  placements: [
    {
      id: 1,
      student: 101,
      organization: 201,
      status: "active",
      internship_title: "Frontend Intern",
    },
    {
      id: 2,
      student: 102,
      organization: 202,
      status: "active",
      internship_title: "Backend Intern",
    },
  ],
  weeklyLogs: [
    {
      id: 1,
      student: 101,
      week_number: 9,
      status: "submitted",
      submitted_at: "2026-02-25",
      created_at: "2026-02-25",
    },
    {
      id: 2,
      student: 102,
      week_number: 7,
      status: "submitted",
      submitted_at: "2026-02-24",
      created_at: "2026-02-24",
    },
  ],
  usersById: {
    101: {
      id: 101,
      first_name: "Sarah",
      last_name: "Johnson",
      email: "sarah.johnson@university.edu",
    },
    102: {
      id: 102,
      first_name: "James",
      last_name: "Martinez",
      email: "james.martinez@university.edu",
    },
  },
  organizationsById: {
    201: { id: 201, name: "University of Technology" },
    202: { id: 202, name: "Institute of Technology" },
  },
};

describe("Workplace supervisor pages", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    loadWorkplaceSupervisorData.mockResolvedValue(mockSnapshot);
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    window.alert.mockRestore();
  });

  test("renders dashboard overview cards", async () => {
    render(<Dashboard />);

    expect(
      await screen.findByRole("heading", { level: 1, name: "Dashboard" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        /welcome back, john|loading your supervision overview/i,
      ),
    ).toBeInTheDocument();
    expect(await screen.findByText(/pending reviews/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/approval rate|approved rate/i),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Assigned Interns").length).toBeGreaterThan(0);
  });

  test("renders assigned interns page with intern names", async () => {
    render(<AssignedInterns />);

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Assigned Interns",
      }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/manage and monitor your assigned interns/i),
    ).toBeInTheDocument();
    expect(await screen.findByText("Sarah Johnson")).toBeInTheDocument();
    expect(await screen.findByText("James Martinez")).toBeInTheDocument();
  });

  test("renders pending log review page", async () => {
    render(<PendingLogReview />);

    expect(await screen.findByText("Pending Log Reviews")).toBeInTheDocument();
    expect(
      await screen.findByText(
        /select a log to review|select a log to inspect and review/i,
      ),
    ).toBeInTheDocument();
    expect(await screen.findByText("Sarah Johnson")).toBeInTheDocument();
  });

  test("switches pending log details when another intern is selected", async () => {
    render(<PendingLogReview />);

    fireEvent.click(await screen.findByText("James Martinez"));

    expect(
      await screen.findByText(/provide a comment for james martinez/i),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/james martinez - week 7/i),
    ).toBeInTheDocument();
  });

  test("renders workplace supervisor profile sections", async () => {
    render(<Profile />);

    expect(
      await screen.findByRole("heading", { level: 1, name: /profile/i }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/personal information/i),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/academic credentials|recent assigned placements/i)
        .length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText(/current interns/i).length).toBeGreaterThan(0);
  });
});
