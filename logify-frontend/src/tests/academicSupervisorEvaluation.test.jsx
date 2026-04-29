import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import Evaluation from "../pages/dashboards/AcademicSupervisorDashboard/Pages/Evaluation";

jest.mock("../config/api", () => ({
  api: {
    evaluations: {
      patchEvaluation: jest.fn(),
      createEvaluation: jest.fn(),
      createResult: jest.fn(),
      patchResult: jest.fn(),
      createScore: jest.fn(),
      patchScore: jest.fn(),
    },
  },
}));

jest.mock(
  "../pages/dashboards/AcademicSupervisorDashboard/utils/academicSupervisorData",
  () => ({
    buildEvaluationCriteria: jest.fn(() => [
      {
        title: "Technical Skills",
        weight: "100%",
        score: 80,
        note: "Technical delivery",
        contribution: "80%",
        comment: "Solid work",
      },
    ]),
    formatDate: jest.fn(() => "Apr 23, 2026"),
    getPlacementProgress: jest.fn(() => ({ weekLabel: "Week 8/12" })),
    getUserDisplayName: jest.fn((user, fallback) => {
      if (!user) return fallback;
      return `${user.first_name} ${user.last_name}`;
    }),
    loadAcademicSupervisorData: jest.fn(async () => ({
      evaluations: [
        {
          id: 11,
          placement: 21,
          rubric: 31,
          status: "draft",
          total_score: 80,
          updated_at: "2026-04-23T10:00:00Z",
        },
      ],
      placements: [],
      rubrics: [],
      scores: [],
      criteriaById: {},
      placementById: {
        21: {
          id: 21,
          intern: 41,
          organization: 51,
          internship_title: "Software Engineering Intern",
        },
      },
      resultByPlacementId: {},
      usersById: {
        41: {
          id: 41,
          first_name: "Sarah",
          last_name: "Johnson",
        },
      },
      organizationsById: {
        51: {
          id: 51,
          name: "TechCorp Solutions",
        },
      },
    })),
  }),
);

jest.mock("../components/ui/ThemeToggle", () => {
  function ThemeToggleMock() {
    return <div>Theme Toggle</div>;
  }

  ThemeToggleMock.displayName = "ThemeToggleMock";

  return ThemeToggleMock;
});

const { api } = jest.requireMock("../config/api");

beforeEach(() => {
  jest.clearAllMocks();
  window.localStorage.clear();
});

test("authorizing an evaluation persists the final result and marks the evaluation reviewed", async () => {
  api.evaluations.createResult.mockResolvedValue({
    id: 91,
    placement: 21,
    remarks: "Ready for sign-off",
    academic_score: 80,
    logbook_score: 75,
    final_score: 78.5,
    final_grade: "B",
  });
  api.evaluations.patchEvaluation.mockResolvedValue({
    id: 11,
    status: "reviewed",
  });

  render(<Evaluation />);

  expect(await screen.findByText(/sarah johnson/i)).toBeInTheDocument();
  expect(
    await screen.findByPlaceholderText(/provide qualitative feedback/i),
  ).toBeInTheDocument();

  fireEvent.change(
    screen.getByPlaceholderText(/provide qualitative feedback/i),
    {
      target: { value: "Ready for sign-off" },
    },
  );

  fireEvent.click(screen.getByRole("button", { name: /authorize request/i }));

  await waitFor(() => {
    expect(api.evaluations.createResult).toHaveBeenCalledWith({
      placement: 21,
      rubric: 31,
      remarks: "Ready for sign-off",
    });
  });

  expect(api.evaluations.patchEvaluation).toHaveBeenCalledWith(11, {
    status: "reviewed",
  });
});
