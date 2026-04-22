import { render, screen } from "@testing-library/react";
import { api } from "../config/api";
import Profile from "../pages/dashboards/StudentDashboard/pages/Profile";

jest.mock("../config/api", () => ({
  api: {
    auth: {
      me: jest.fn(),
    },
    accounts: {
      getAcademicSupervisor: jest.fn(),
      getWorkplaceSupervisor: jest.fn(),
    },
    academics: {
      getInstitution: jest.fn(),
      getProgramme: jest.fn(),
    },
    placements: {
      getPlacements: jest.fn(),
    },
    registry: {
      getStudent: jest.fn(),
    },
  },
}));

test("shows user data", async () => {
  api.auth.me.mockResolvedValue({
    first_name: "John",
    last_name: "Doe",
    email: "johndoe@gmail.com",
    student_number: "1234567890",
  });
  render(<Profile />);
  expect(await screen.findByText(/john doe/i)).toBeInTheDocument();
  expect(await screen.findByText(/johndoe@gmail.com/i)).toBeInTheDocument();
  expect(await screen.findByText(/1234567890/i)).toBeInTheDocument();
});

test("shows institution data", async () => {
  api.academics.getInstitution.mockResolvedValue({ name: "University A" });
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
  api.academics.getProgramme.mockResolvedValue({ id: 1, name: "Programme A" });

  render(<Profile />);
  expect(await screen.findByText(/programme a/i)).toBeInTheDocument();
});

test("shows year level", async () => {
  api.auth.me.mockResolvedValue({
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
  expect(await screen.findByText("Academic1 Supervisor1")).toBeInTheDocument();
  expect(await screen.findByText("Workplace2 Supervisor2")).toBeInTheDocument();
});
