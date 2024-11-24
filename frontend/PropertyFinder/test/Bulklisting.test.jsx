import {
  render,
  screen,
  fireEvent,
  waitFor,
  prettyDOM,
} from "@testing-library/react";
import Bulklisting from "../src/Components/Bulklisting";
import { describe, expect, test } from "vitest";
import { BrowserRouter } from "react-router-dom";

describe("Bulklisting Component", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });
  test("renders table with data", async () => {
    const mockData = {
      data: [
        {
          _id: "1",
          filename: "file1.csv",
          noOfItemsToBeUpload: 100,
          successfullyUpload: 90,
          failedDuringUpload: 10,
          startTime: "2024-06-21",
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
        <Bulklisting />
      </BrowserRouter>
    );

    expect(await screen.findByText("file1.csv")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("90")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("2024-06-21")).toBeInTheDocument();
  });

  test("handles API error", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
    });

    render(
      <BrowserRouter>
        <Bulklisting />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText("file1.csv")).not.toBeInTheDocument();
    });
  });
  test("handles unauthorized access", async () => {
    global.fetch.mockResolvedValueOnce({
      status: 403,
      ok: false,
    });

    render(
      <BrowserRouter>
        <Bulklisting />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBeNull();
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
        <Bulklisting />
      </BrowserRouter>
    );

    expect(await screen.findByText("Rows per page:")).toBeInTheDocument();
  });

  test("handles unauthorized access", async () => {
    global.fetch.mockResolvedValueOnce({
      status: 403,
      ok: false,
    });

    render(
      <BrowserRouter>
        <Bulklisting />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBeNull();
    });
  });

 
});
