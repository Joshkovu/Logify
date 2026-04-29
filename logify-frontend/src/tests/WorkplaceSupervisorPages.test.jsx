import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

jest.mock("../config/api", () => ({
  api: {
    auth: { me: jest.fn() },
    placements: {
      getPlacements: jest.fn(),
      createPlacement: jest.fn(),
      patchPlacement: jest.fn(),
      submitPlacement: jest.fn(),
      wsAcceptPlacement: jest.fn(),
      wsDenyPlacement: jest.fn(),
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
      approveWeeklyLog: jest.fn(),
      requestChangesWeeklyLog: jest.fn(),
      rejectWeeklyLog: jest.fn(),
    },
    organizations: {
      getOrganization: jest.fn(),
      getOrganizations: jest.fn(),
    },
    accounts: {
      getAcademicSupervisor: jest.fn(),
      getWorkplaceSupervisor: jest.fn(),
      getUser: jest.fn(),
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
    formatDate: jest.fn((value) => {
      if (!value) return "N/A";
      const parsed = new Date(value);
      if (Number.isNaN(parsed.getTime())) return "N/A";
      return parsed.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }),
  }),
  { virtual: true },
);

import { loadWorkplaceSupervisorData } from "../pages/dashboards/WorkplaceSupervisor/utils/workplaceSupervisorData";
import Dashboard from "../pages/dashboards/WorkplaceSupervisor/components/dashboard/Dashboard";
import AssignedInterns from "../pages/dashboards/WorkplaceSupervisor/pages/AssignedInterns";
import PendingLogReview from "../pages/dashboards/WorkplaceSupervisor/pages/PendingLogReview";
import Profile from "../pages/dashboards/WorkplaceSupervisor/pages/Profile";
import PendingAcceptances from "../pages/dashboards/WorkplaceSupervisor/pages/PendingAcceptances";

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
      intern: 101,
      organization: 201,
      status: "active",
      internship_title: "Frontend Intern",
      start_date: "2026-02-01",
      end_date: "2026-04-30",
    },
    {
      id: 2,
      intern: 102,
      organization: 202,
      status: "approved",
      internship_title: "Backend Intern",
      start_date: "2026-02-05",
      end_date: "2026-05-05",
      work_mode: "onsite",
    },
  ],
  weeklyLogs: [
    {
      id: 1,
      placement: 1,
      week_number: 9,
      status: "submitted",
      submitted_at: "2026-02-25",
      created_at: "2026-02-25",
      updated_at: "2026-02-25",
      activities: "Completed assigned frontend tasks.",
      learnings: "Learned component testing.",
      challenges: "Resolved state management issues.",
    },
    {
      id: 2,
      placement: 2,
      week_number: 7,
      status: "submitted",
      submitted_at: "2026-02-24",
      created_at: "2026-02-24",
      updated_at: "2026-02-24",
      activities: "Worked on backend endpoints.",
      learnings: "Learned API validation.",
      challenges: "Handled serializer errors.",
    },
  ],
  usersById: {
    101: {
      id: 101,
      first_name: "Sarah",
      last_name: "Johnson",
      email: "sarah.johnson@university.edu",
      phone: "+256700000001",
    },
    102: {
      id: 102,
      first_name: "James",
      last_name: "Martinez",
      email: "james.martinez@university.edu",
      phone: "+256700000002",
    },
  },
  organizationsById: {
    201: { id: 201, name: "University of Technology" },
    202: { id: 202, name: "Institute of Technology" },
  },
};

const waitForWorkplaceDashboardEffectsToSettle = async () => {
  await waitFor(() => {
    expect(loadWorkplaceSupervisorData).toHaveBeenCalled();
  });
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
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );
    await waitForWorkplaceDashboardEffectsToSettle();

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
    expect(screen.getAllByText("Active Interns").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Pending Acceptances").length).toBeGreaterThan(
      0,
    );
  });

  test("renders assigned interns page with intern names", async () => {
    render(
      <MemoryRouter>
        <AssignedInterns />
      </MemoryRouter>,
    );

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
    render(
      <MemoryRouter>
        <PendingLogReview />
      </MemoryRouter>,
    );

    expect(await screen.findByText("Pending Log Reviews")).toBeInTheDocument();
    expect(
      await screen.findByText(
        /select a log to review|select a log to inspect and review/i,
      ),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: /Sarah Johnson/i }),
    ).toBeInTheDocument();
  });

  test("switches pending log details when another intern is selected", async () => {
    render(
      <MemoryRouter>
        <PendingLogReview />
      </MemoryRouter>,
    );

    const jamesButton = await screen.findByRole("button", {
      name: /James Martinez/i,
    });
    fireEvent.click(jamesButton);

    expect(
      await screen.findByRole("heading", {
        name: /James Martinez/i,
      }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/worked on backend endpoints/i),
    ).toBeInTheDocument();
  });

  test("renders workplace supervisor profile sections", async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    );

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
    expect(screen.getAllByText(/assigned interns/i).length).toBeGreaterThan(0);
  });

  test("renders pending acceptances page with student names", async () => {
    render(
      <MemoryRouter>
        <PendingAcceptances />
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: /pending acceptances/i,
      }),
    ).toBeInTheDocument();
    expect(await screen.findByText("James Martinez")).toBeInTheDocument();
    expect(await screen.findByText("Backend Intern")).toBeInTheDocument();
    expect(
      await screen.findByText("Institute of Technology"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /accept intern/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /deny/i })).toBeInTheDocument();
  });
});
