import {
  render,
  screen,
  fireEvent,
  waitFor,
  prettyDOM,
} from "@testing-library/react";
import BulkUpload from "../src/Components/BulkUpload";
import { describe, expect, test } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

describe("BulkUpload Component", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    localStorage.clear();
  });

  test("renders the component and allows file upload", async () => {
    const mockFile = new File(["content"], "test.csv", { type: "text/csv" });
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    render(
      <BrowserRouter>
        <BulkUpload />
        <ToastContainer />
      </BrowserRouter>
    );

    expect(
      screen.getByText("Click Select File to upload, it only accepts csv file")
    ).toBeInTheDocument();

    const fileInput = screen.getByLabelText("Select File");
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    await waitFor(() =>
      expect(screen.getByDisplayValue("test.csv")).toBeInTheDocument()
    );

    const uploadButton = screen.getByText("Upload");
    fireEvent.click(uploadButton);

    await waitFor(() =>
      expect(
        screen.getAllByText("File uploaded successfully!")[0]
      ).toBeInTheDocument()
    );

    expect(window.location.pathname).toBe("/list");
  });

  test("No file found", async () => {
    const mockFile = "";
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    render(
      <BrowserRouter>
        <BulkUpload />
        <ToastContainer />
      </BrowserRouter>
    );

    expect(
      screen.getByText("Click Select File to upload, it only accepts csv file")
    ).toBeInTheDocument();

    const uploadButton = screen.getByText("Upload");
    fireEvent.click(uploadButton);
    await waitFor(() =>
      expect(screen.getByText("No file selected!")).toBeInTheDocument()
    );
  });

  test("handles unauthorized access", async () => {
    const mockFile = new File(["content"], "test.csv", { type: "text/csv" });

    global.fetch.mockResolvedValueOnce({
      status: 403,
      ok: false,
    });

    render(
      <BrowserRouter>
        <BulkUpload />
      </BrowserRouter>
    );
    const fileInput = screen.getByLabelText("Select File");
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    await waitFor(() =>
      expect(screen.getByDisplayValue("test.csv")).toBeInTheDocument()
    );
    const uploadButton = screen.getByText("Upload");
    fireEvent.click(uploadButton);
    await waitFor(() => {
      expect(localStorage.getItem("token")).toBeNull();
    });
  });

  test("displays generic error message on exception", async () => {
    const mockFile = new File(["content"], "test.csv", { type: "text/csv" });
    global.fetch.mockResolvedValueOnce(() =>
      Promise.reject(new Error("Network error"))
    );

    render(
      <BrowserRouter>
        <BulkUpload />
      </BrowserRouter>
    );
    const fileInput = screen.getByLabelText("Select File");
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    await waitFor(() =>
      expect(screen.getByDisplayValue("test.csv")).toBeInTheDocument()
    );

    const uploadButton = screen.getByText("Upload");
    fireEvent.click(uploadButton);
    await waitFor(() => {
      expect(screen.getByText("Error uploading file!")).toBeInTheDocument();
    });
  });

  test("displays error due to another status rather than 200", async () => {
    const mockFile = new File(["content"], "test.csv", { type: "text/csv" });
    global.fetch.mockResolvedValueOnce({
      status: 500,
      json:()=>{}
    });

    render(
      <BrowserRouter>
        <BulkUpload />
      </BrowserRouter>
    );
    const fileInput = screen.getByLabelText("Select File");
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    await waitFor(() =>
      expect(screen.getByDisplayValue("test.csv")).toBeInTheDocument()
    );

    const uploadButton = screen.getByText("Upload");
    fireEvent.click(uploadButton);
    await waitFor(() => {
      expect(screen.getByText("Error uploading file!")).toBeInTheDocument();
    });
  });
});
