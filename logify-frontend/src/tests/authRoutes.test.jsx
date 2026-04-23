import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";

jest.mock("../config/api.js", () => ({
  SESSION_CLEARED_EVENT: "logify:session-cleared",
  api: {
    auth: {
      me: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
      studentSignup: jest.fn(),
      supervisorSignup: jest.fn(),
      adminSignup: jest.fn(),
    },
  },
}));

import { AuthContext } from "../contexts/AuthContext";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import GuestOnlyRoute from "../pages/auth/GuestOnlyRoute";
import LoginPage from "../pages/LoginPage";

jest.mock("../pages/auth/AuthLayout", () => {
  function AuthLayoutMock({ title, subtitle, footer, children }) {
    return (
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
        <p>{footer}</p>
        {children}
      </div>
    );
  }

  AuthLayoutMock.displayName = "AuthLayoutMock";

  return AuthLayoutMock;
});

const defaultAuthValue = {
  isAuthenticated: false,
  isLoadingUser: false,
  user: null,
  login: jest.fn(),
  logout: jest.fn(),
  studentSignup: jest.fn(),
  supervisorSignUp: jest.fn(),
  adminSignUp: jest.fn(),
};

const renderWithAuth = (ui, authValue, routerProps = {}) =>
  render(
    <AuthContext.Provider value={{ ...defaultAuthValue, ...authValue }}>
      <MemoryRouter {...routerProps}>{ui}</MemoryRouter>
    </AuthContext.Provider>,
  );

const LocationProbe = () => {
  const location = useLocation();

  return (
    <div>
      <span data-testid="pathname">{location.pathname}</span>
      <span data-testid="from-path">
        {location.state?.from?.pathname || ""}
      </span>
      <span data-testid="from-search">
        {location.state?.from?.search || ""}
      </span>
    </div>
  );
};

test("protected routes redirect unauthenticated users to login and preserve the original path", async () => {
  renderWithAuth(
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
        <Route path="/student" element={<div>Student area</div>} />
      </Route>
      <Route path="/login" element={<LocationProbe />} />
    </Routes>,
    {},
    { initialEntries: ["/student?tab=logs"] },
  );

  expect(await screen.findByTestId("pathname")).toHaveTextContent("/login");
  expect(screen.getByTestId("from-path")).toHaveTextContent("/student");
  expect(screen.getByTestId("from-search")).toHaveTextContent("?tab=logs");
});

test("guest-only routes redirect authenticated users to their dashboard", async () => {
  renderWithAuth(
    <Routes>
      <Route
        path="/login"
        element={
          <GuestOnlyRoute>
            <div>Login form</div>
          </GuestOnlyRoute>
        }
      />
      <Route path="/student" element={<div>Student dashboard</div>} />
    </Routes>,
    {
      isAuthenticated: true,
      user: { role: "student", first_name: "Jane", last_name: "Doe" },
    },
    { initialEntries: ["/login"] },
  );

  expect(await screen.findByText("Student dashboard")).toBeInTheDocument();
});

test("login page forwards the original destination to the login action", async () => {
  const login = jest.fn().mockResolvedValue({
    role: "student",
    first_name: "Jane",
    last_name: "Doe",
  });

  renderWithAuth(
    <Routes>
      <Route path="/login" element={<LoginPage />} />
    </Routes>,
    { login },
    {
      initialEntries: [
        {
          pathname: "/login",
          state: {
            from: {
              pathname: "/student/weekly-logs",
              search: "?filter=submitted",
              hash: "#current",
            },
          },
        },
      ],
    },
  );

  fireEvent.change(screen.getByLabelText(/email \/ webmail/i), {
    target: { value: "student@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "password123" },
  });
  fireEvent.click(screen.getByRole("button", { name: /login/i }));

  await waitFor(() =>
    expect(login).toHaveBeenCalledWith(
      "student@example.com",
      "password123",
      "/student/weekly-logs?filter=submitted#current",
    ),
  );
});
