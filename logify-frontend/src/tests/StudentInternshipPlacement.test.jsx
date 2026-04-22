import { render, screen } from "@testing-library/react";
import { api } from "../config/api";
import InternshipPlacement from "../pages/dashboards/StudentDashboard/pages/InternshipPlacement";

jest.mock("../config/api", () => ({
  api: {
    placements: {
      getPlacements: jest.fn(),
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
  api.placements.getPlacements.mockResolvedValue([]);
  api.organizations.getOrganization.mockResolvedValue(null);
  api.accounts.getAcademicSupervisor.mockResolvedValue(null);
  api.accounts.getWorkplaceSupervisor.mockResolvedValue(null);
});

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
  expect(await screen.findByText(/supervisor@academycom/i)).toBeInTheDocument();
});
