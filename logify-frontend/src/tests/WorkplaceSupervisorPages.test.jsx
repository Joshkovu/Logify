import { fireEvent, render, screen } from "@testing-library/react";
import Dashboard from "../pages/dashboards/WorkplaceSupervisor/components/dashboard/Dashboard";
import AssignedInterns from "../pages/dashboards/WorkplaceSupervisor/pages/AssignedInterns";
import PendingLogReview from "../pages/dashboards/WorkplaceSupervisor/pages/PendingLogReview";
import Profile from "../pages/dashboards/WorkplaceSupervisor/pages/Profile";

describe("Workplace supervisor pages", () => {
  beforeEach(() => {
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    window.alert.mockRestore();
  });

  test("renders dashboard overview cards and recent activity", () => {
    render(<Dashboard />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Dashboard" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/welcome back, john/i)).toBeInTheDocument();
    expect(screen.getAllByText("Assigned Interns").length).toBeGreaterThan(0);
    expect(screen.getByText("Pending Reviews")).toBeInTheDocument();
    expect(screen.getByText("Approved rate")).toBeInTheDocument();
    expect(
      screen.getByText(/approved sarah johnson's log for week 8/i),
    ).toBeInTheDocument();
  });

  test("renders assigned interns with key details", () => {
    render(<AssignedInterns />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Assigned Interns" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/manage and monitor your assigned interns/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Sarah Johnson")).toBeInTheDocument();
    expect(screen.getByText("James Martinez")).toBeInTheDocument();
    expect(screen.getByText(/computer science intern/i)).toBeInTheDocument();
    expect(screen.getByText(/8 logs approved/i)).toBeInTheDocument();
  });

  test("renders pending log review with default selected intern", () => {
    render(<PendingLogReview />);

    expect(screen.getByText("Pending Log Reviews")).toBeInTheDocument();
    expect(screen.getByText(/select a log to review/i)).toBeInTheDocument();
    expect(screen.getByText(/sarah johnson - week 9/i)).toBeInTheDocument();
    expect(
      screen.getByText(/provide a comment for sarah johnson/i),
    ).toBeInTheDocument();
  });

  test("switches pending log details when another intern is selected", () => {
    render(<PendingLogReview />);

    fireEvent.click(screen.getByText("James Martinez"));

    expect(screen.getByText(/james martinez - week 7/i)).toBeInTheDocument();
    expect(
      screen.getByText(/provide a comment for james martinez/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        /write your feedback for james martinez here/i,
      ),
    ).toBeInTheDocument();
  });

  test("updates profile details after saving edits", () => {
    render(<Profile />);

    fireEvent.click(screen.getByRole("button", { name: /edit profile/i }));
    fireEvent.change(screen.getByPlaceholderText("First Name"), {
      target: { value: "Alex" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email Address"), {
      target: { value: "alex.roberts@university.edu" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    expect(screen.getByText(/dr. alex roberts/i)).toBeInTheDocument();
    expect(screen.getByText("alex.roberts@university.edu")).toBeInTheDocument();
    expect(window.alert).toHaveBeenCalledWith("Profile updated successfully.");
  });
});
