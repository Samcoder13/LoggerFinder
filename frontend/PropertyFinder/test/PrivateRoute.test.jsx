import { render } from "@testing-library/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { describe, beforeEach, expect, test, vi } from "vitest";
import Privateroutes from "../src/Components/Privateroutes"; // Adjust the import path as necessary
import { Navigate, Outlet } from "react-router-dom";

describe("Privateroutes Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("renders Outlet when token is present", () => {
    localStorage.setItem("token", "mockToken");

    const TestComponent = () => <div>Protected Content</div>;

    const { getByText } = render(
      <BrowserRouter>
        <Routes>
          <Route element={<Privateroutes />}>
            <Route path="/" element={<TestComponent />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );

    expect(getByText("Protected Content")).toBeInTheDocument();
  });

  test("redirects to '/' when token is not present", () => {
    const TestComponent = () => <div>Protected Content</div>;

    const { queryByText } = render(
      <BrowserRouter>
        <Routes>
          <Route path="/protected" element={<Privateroutes />}>
            <Route path="/protected" element={<TestComponent />} />
          </Route>
          <Route path="/" element={<div>Login Page</div>} />
        </Routes>
      </BrowserRouter>
    );

    expect(queryByText("Protected Content")).not.toBeInTheDocument();
    expect(queryByText("Login Page")).toBeInTheDocument();
  });
});
