import {
  render,
  screen,
  fireEvent,
  waitFor,
  prettyDOM,
} from "@testing-library/react";
import DetailView from "../src/Components/DetailView";
import { describe, expect, test } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

describe("DetailView Component", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    localStorage.clear();
  });

  test("renders the component and fetches data successfully", async () => {
    const mockData = [
      {
        _id: "1",
        name: "Test Name",
        address: {
          street: "123 Main St",
          city: "Test City",
          state: "Test State",
          country: "Test Country",
        },
        description: "Test Description",
        startDate: "2022-01-01",
        endDate: "2022-12-31",
        Bhktype: "2 BHK",
        owner: "Test Owner",
        price: "100000",
      },
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockData }),
    });

    render(
      <BrowserRouter>
        <DetailView />
      </BrowserRouter>
    );

    await waitFor(() =>
      expect(screen.getByText("Test Name")).toBeInTheDocument()
    );

    expect(
      screen.getByText("123 Main St, Test City, Test State, Test Country")
    ).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("2022-01-01")).toBeInTheDocument();
    expect(screen.getByText("2022-12-31")).toBeInTheDocument();
    expect(screen.getByText("2 BHK")).toBeInTheDocument();
    expect(screen.getByText("Test Owner")).toBeInTheDocument();
    expect(screen.getByText("100000")).toBeInTheDocument();
  });

  test("handles unauthorized access", async () => {
    global.fetch.mockResolvedValueOnce({
      status: 403,
      ok: false,
    });

    render(
      <BrowserRouter>
        <DetailView />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(localStorage.getItem("token")).toBeNull();
    });
  });

  test("handles fetch error", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
    });

    render(
      <BrowserRouter>
        <DetailView />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(
        screen.queryByText("Something went wrong")
      ).not.toBeInTheDocument();
    });

    expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
  });
});
