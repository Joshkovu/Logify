import { render, screen } from "@testing-library/react";
import { api } from "../config/api";
import Evaluations from "../pages/dashboards/StudentDashboard/pages/Evaluations";

jest.mock("../config/api", () => ({
  api: {
    evaluations: {
      getEvaluations: jest.fn(),
      getResults: jest.fn(),
      getCriteria: jest.fn(),
      getScores: jest.fn(),
    },
    accounts: {
      getAcademicSupervisor: jest.fn(),
    },
  },
}));

beforeEach(() => {
  api.evaluations.getEvaluations.mockResolvedValue([]);
  api.evaluations.getResults.mockResolvedValue([]);
  api.evaluations.getCriteria.mockResolvedValue([]);
  api.evaluations.getScores.mockResolvedValue([]);
  api.accounts.getAcademicSupervisor.mockResolvedValue({
    id: 1,
    first_name: "John",
    last_name: "Doe",
  });
});

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
  render(<Evaluations />);
  expect(await screen.findByText(/john doe/i)).toBeInTheDocument();
});

test("shows workplace feedback", async () => {
  api.evaluations.getEvaluations.mockResolvedValue([{ id: 1 }]);
  api.evaluations.getResults.mockResolvedValue([
    { workplace_feedback: "words" },
  ]);
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
    { id: 1, total_score: 92 },
  ]);
  api.evaluations.getCriteria.mockResolvedValue([
    {
      id: 1,
      name: "Technical Skills",
      group: "Technical Skills",
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
