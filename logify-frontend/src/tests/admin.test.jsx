import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import { AuthContext } from "../contexts/AuthContext";
import AdminSignupPage from "../pages/AdminSignupPage";

// eslint-disable-next-line no-undef
/* global , test, expect */

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
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
    providerProps: { value: { adminSignUp: vi.fn() } },
  });
  fireEvent.click(
    screen.getByRole("button", { name: /create admin account/i }),
  );
  expect(await screen.findByText(/full name is required/i)).toBeInTheDocument();
  expect(
    await screen.findByText(/institutional email is required/i),
  ).toBeInTheDocument();
  expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  expect(await screen.findByText(/confirm your password/i)).toBeInTheDocument();
});

test("submits valid form and calls adminSignUp", async () => {
  const adminSignUp = vi.fn().mockResolvedValue({});

  renderWithProviders(<AdminSignupPage />, {
    providerProps: { value: { adminSignUp } },
  });

  fireEvent.change(screen.getByPlaceholderText(/your full name/i), {
    target: { value: "Jane Doe" },
  });
  fireEvent.change(screen.getByPlaceholderText(/name@institution\.ac\.ug/i), {
    target: { value: "jane@institution.ac.ug" },
  });
  fireEvent.change(screen.getByPlaceholderText(/at least 8 characters/i), {
    target: { value: "password123" },
  });
  fireEvent.change(screen.getByPlaceholderText(/re-enter password/i), {
    target: { value: "password123" },
  });

  fireEvent.click(
    screen.getByRole("button", { name: /create admin account/i }),
  );

  await waitFor(() => expect(adminSignUp).toHaveBeenCalled());
});
