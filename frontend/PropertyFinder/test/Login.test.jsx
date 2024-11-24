import {
  render,
  screen,
  fireEvent,
  waitFor,
  prettyDOM,
} from "@testing-library/react";
import Login from "../src/Components/Login";
import { describe, expect, test } from "vitest";
import { BrowserRouter } from "react-router-dom";

describe("Login component", () => {
  test("renders login form", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const loginButton = screen.getByRole("button", { name: "Login" });
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  test("validates email format", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    const emailInput = screen.getByLabelText("Email");
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.blur(emailInput);
    const errorText = screen.getByText("Invalid email format");
    expect(errorText).toBeInTheDocument();
  });

  test("validates password format", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    const passwordInput = screen.getByLabelText("Password");
    fireEvent.change(passwordInput, { target: { value: "weakpassword" } });
    fireEvent.blur(passwordInput);
    const errorText = screen.getByText(
      "Password must contain at least one letter, one number, and one special character"
    );
    expect(errorText).toBeInTheDocument();
  });

  test("validates password length format", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    const passwordInput = screen.getByLabelText("Password");
    fireEvent.change(passwordInput, { target: { value: "smallp" } });
    fireEvent.blur(passwordInput);
    const errorText = screen.getByText(
      "Password must be at least 8 characters long"
    );
    expect(errorText).toBeInTheDocument();
  });

  it("Error in fetching the data :Email valiation fails", async () => {
    const mockData = { name: "John Doe" };

    global.fetch = vi.fn(() => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      });
    });
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText("Email"), {
        target: { value: "johndoeexamplecom" },
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "Password123!" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Login" }));
    });

    const errorText = screen.getByText("Invalid email format");
    expect(errorText).toBeInTheDocument();
  });

  it("Fetching Successfully the fetch function", async () => {
    const mockData = {
      name: "John Doe",
      data: {
        token: "mytoken",
        email: "samarth123@gmail.com",
        name: "samarth",
      },
    };

    global.fetch = vi.fn(() => {
      return Promise.resolve({
        status: 200,
        json: () => Promise.resolve(mockData),
      });
    });
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText("Email"), {
        target: { value: "johndoe@example.com" },
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "Password@123!" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Login" }));
    });

    expect(window.location.pathname).toBe("/list");
  });
  it("Fetching Successfully the fetch function", async () => {
    const mockData = {
      name: "John Doe",
      data: {
        token: "mytoken",
        email: "samarth123@gmail.com",
        name: "samarth",
      },
      message: "Username not existed",
    };

    global.fetch = vi.fn(() => {
      return Promise.resolve({
        status: 404,
        json: () => Promise.resolve(mockData),
      });
    });
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText("Email"), {
        target: { value: "johndoe@example.com" },
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "Password@123!" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Login" }));
    });

    expect(
      await screen.findByText("Bad Credentials : Username not existed")
    ).toBeInTheDocument();
  });
});
