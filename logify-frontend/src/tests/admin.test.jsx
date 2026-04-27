import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import AdminSignupPage from "../pages/AdminSignupPage";

jest.mock("../config/api", () => ({
  api: {
    academics: {
      getInstitutions: jest.fn().mockResolvedValue([
        { id: "1", name: "Institution A" },
      ]),
      getInstitutionColleges: jest.fn().mockResolvedValue([
        { id: "1", name: "College A" },
      ]),
      getCollegeDepartments: jest.fn().mockResolvedValue([
        { id: "1", name: "Department A" },
      ]),
    },
  },
}));

jest.mock("../contexts/AuthContext", () => {
  const { createContext } = jest.requireActual("react");
  return {
    AuthContext: createContext({}),
  };
});

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => jest.fn(),
  };
});
function renderWithProviders(ui, { providerProps, ...renderOptions }) {
  return render(
    <BrowserRouter>
      <AuthContext.Provider {...providerProps}>{ui}</AuthContext.Provider>
    </BrowserRouter>,
    renderOptions,
  );
}

test("renders form and shows validation errors", async () => {
  renderWithProviders(<AdminSignupPage />, {
    providerProps: { value: { adminSignUp: jest.fn() } },
  });
  fireEvent.click(
    screen.getByRole("button", { name: /create admin account/i }),
  );
  expect(await screen.findByText(/full name is required/i)).toBeInTheDocument();
  expect(await screen.findByText(/institution is required/i)).toBeInTheDocument();
  expect(await screen.findByText(/department is required/i)).toBeInTheDocument();
  expect(await screen.findByText(/college is required/i)).toBeInTheDocument();
  expect(
    await screen.findByText(/institutional email is required/i),
  ).toBeInTheDocument();
  expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  expect(await screen.findByText(/confirm your password/i)).toBeInTheDocument();
});

test("submits valid form and calls adminSignUp", async () => {
  const adminSignUp = jest.fn().mockResolvedValue({});

  renderWithProviders(<AdminSignupPage />, {
    providerProps: { value: { adminSignUp } },
  });

  fireEvent.change(screen.getByPlaceholderText(/your full name/i), {
    target: { value: "Jane Doe" },
  });
  fireEvent.change(screen.getByPlaceholderText(/name@institution\.ac\.ug/i), {
    target: { value: "jane@institution.ac.ug" },
  });

  await waitFor(() => {
    expect(screen.getByRole('option', { name: "Institution A" })).toBeInTheDocument();
  });
  fireEvent.change(document.querySelector('select[name="institution"]'), { target: { name: "institution", value: "1" } });

  await waitFor(() => {
    expect(screen.getByRole('option', { name: "College A" })).toBeInTheDocument();
  });
  fireEvent.change(document.querySelector('select[name="college"]'), { target: { name: "college", value: "1" } });

  await waitFor(() => {
    expect(screen.getByRole('option', { name: "Department A" })).toBeInTheDocument();
  });
  fireEvent.change(document.querySelector('select[name="department"]'), { target: { name: "department", value: "1" } });

  fireEvent.change(screen.getByPlaceholderText(/at least 8 characters/i), {
    target: { name: "password", value: "password123" },
  });
  fireEvent.change(screen.getByPlaceholderText(/re-enter password/i), {
    target: { name: "confirmPassword", value: "password123" },
  });

  fireEvent.click(
    screen.getByRole("button", { name: /create admin account/i }),
  );

  await waitFor(() => expect(adminSignUp).toHaveBeenCalled());
});
