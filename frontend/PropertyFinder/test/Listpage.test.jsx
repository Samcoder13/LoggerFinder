import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ListPage from "../src/Components/Listpage";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

describe("List Component", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    localStorage.clear();
  });

  test("renders the component and fetches data", async () => {
    const mockData = {
      data: [
        {
          _id: "1",
          name: "Test Name",
          description: "Test Description",
          Bhktype: "2BHK",
          owner: "Test Owner",
          price: "1000",
        },
      ],
      datalength: 1,
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(
      <BrowserRouter>
        <ListPage />
        <ToastContainer />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Name")).toBeInTheDocument();
    });

    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("2BHK")).toBeInTheDocument();
    expect(screen.getByText("Test Owner")).toBeInTheDocument();
    expect(screen.getByText("1000")).toBeInTheDocument();
  });
  test("handles unauthorized access", async () => {
    global.fetch.mockResolvedValueOnce({
      status: 403,
      ok: false,
    });

    render(
      <BrowserRouter>
        <ListPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBeNull();
    });
  });

  test("search functionality", async () => {
    const mockData = {
      data: [],
      datalength: 0,
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(
      <BrowserRouter>
        <ListPage />
        <ToastContainer />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText("Search"), {
      target: { value: "Test" },
    });

    const searchButton = screen
      .getByLabelText("Search")
      .parentElement.querySelector("button");
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:4000/v1/getalldetails?page=1&limit=5&filter=&search=Test",
        expect.anything()
      );
    });
  });

  test("renders pagination controls", async () => {
    const mockData = {
      data: [],
      datalength: 0,
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(
      <BrowserRouter>
        <ListPage />
      </BrowserRouter>
    );

    expect(await screen.findByText("Rows per page:")).toBeInTheDocument();
  });

  
});
