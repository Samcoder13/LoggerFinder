import {
  render,
  screen,
  fireEvent,
  waitFor,
  prettyDOM,
} from "@testing-library/react";
import Signup from "../src/Components/Signup";
import { describe, expect, test } from "vitest";
import { BrowserRouter } from "react-router-dom";

describe("Signup Component", () => {
  test("renders signup form", () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    const nameInput = screen.getByLabelText("Name");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");
    const signupButton = screen.getByRole("button", { name: "Signup" });

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();
    expect(signupButton).toBeInTheDocument();
  });

  test("validates name is required", async () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    const signupButton = screen.getByRole("button", { name: "Signup" });
    fireEvent.click(signupButton);

    const errorText = await screen.findByText("Name is required");
    expect(errorText).toBeInTheDocument();
  });

  test("validates email format", () => {
    render(
      <BrowserRouter>
        <Signup />
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
        <Signup />
      </BrowserRouter>
    );
    const passwordInput = screen.getByLabelText("Password");
    fireEvent.change(passwordInput, { target: { value: "weakpassword" } });
    fireEvent.blur(passwordInput);

    const errorText = screen.getByText(
      "Password must be at least 8 characters long and contain at least one letter, one number, and one special character"
    );
    expect(errorText).toBeInTheDocument();
  });

  test("validates confirm password matches", () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");
    fireEvent.change(passwordInput, { target: { value: "Password@123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "Password123" },
    });
    fireEvent.blur(confirmPasswordInput);

    const errorText = screen.getByText("Passwords do not match");
    expect(errorText).toBeInTheDocument();
  });

  test("handles successful signup", async () => {
    const mockResponse = { status: 201 };
    global.fetch = vi.fn(() => Promise.resolve(mockResponse));

    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "Password@123" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "Password@123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Signup" }));
    expect(await screen.findByText("Signup successful")).toBeInTheDocument();
    expect(window.location.pathname).toBe("/");
  });

  test("signup Failed", async () => {
    const mockResponse = { message: "Signup Failed" };
    global.fetch = vi.fn(() =>
      Promise.resolve({
        status: 500,
        json: () => Promise.resolve(mockResponse),
      })
    );

    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    await waitFor(() => {
      fireEvent.change(screen.getByLabelText("Name"), {
        target: { value: "John Doe" },
      });
      fireEvent.change(screen.getByLabelText("Email"), {
        target: { value: "john.doe@example.com" },
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "Password@123" },
      });
      fireEvent.change(screen.getByLabelText("Confirm Password"), {
        target: { value: "Password@123" },
      });

      fireEvent.click(screen.getByRole("button", { name: "Signup" }));
    });

    await waitFor(() => {
      expect(screen.getAllByText("Signup Failed")[0]).toBeInTheDocument();
    });
  });

  test("displays generic error message on exception", async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error("Network error")));

    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "Password@123" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "Password@123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Signup" }));

    const errorText = await screen.findByText(
      "Something Went Wrong! Please try again later."
    );
    expect(errorText).toBeInTheDocument();
  });
});
