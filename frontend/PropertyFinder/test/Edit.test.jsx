import {
  render,
  screen,
  fireEvent,
  waitFor,
  prettyDOM,
} from "@testing-library/react";
import Edit from "../src/Components/Edit";
import { describe, expect, test } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

describe("Edit Component", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    localStorage.clear();
  });

  test("renders the component and fetches data", async () => {
    const mockData = {
      data: [
        {
          name: "Test Name",
          address: {
            street: "123 Test St",
            city: "Test City",
            state: "Test State",
            pinCode: "123456",
          },
          description: "Test Description",
          startDate: "2024-01-01T00:00:00Z",
          endDate: "2024-01-10T00:00:00Z",
          Bhktype: "2BHK",
          owner: "Test Owner",
          price: "1000",
        },
      ],
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(
      <BrowserRouter>
        <Edit />
        <ToastContainer />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test Name")).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue("123 Test St")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test City")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test State")).toBeInTheDocument();
    expect(screen.getByDisplayValue("123456")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Description")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2BHK")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Owner")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1000")).toBeInTheDocument();
  });

  test("handles unauthorized access", async () => {
    global.fetch.mockResolvedValueOnce({
      status: 403,
      ok: false,
    });

    render(
      <BrowserRouter>
        <Edit />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBeNull();
    });
  });

  test("submits the form and handles validation", async () => {
    const mockData = {
      data: [
        {
          name: "Test Name",
          address: {
            street: "123 Test St",
            city: "Test City",
            state: "Test State",
            pinCode: "123456",
          },
          description: "Test Description",
          startDate: "2024-01-01T00:00:00Z",
          endDate: "2024-01-10T00:00:00Z",
          Bhktype: "2BHK",
          owner: "Test Owner",
          price: "1000",
        },
      ],
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(
      <BrowserRouter>
        <Edit />
        <ToastContainer />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test Name")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Name (Enter your full name)"), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByText("Update"));

    await waitFor(() => {
      expect(screen.getByText("Name must be at least 5 characters long")).toBeInTheDocument();
    });
  });

test("displays error on fetch failure", async () => {
  global.fetch.mockRejectedValueOnce(new Error("Network error"));

  render(
    <BrowserRouter>
      <Edit />
    </BrowserRouter>
  );
});

test("allows input values to be changed", () => {
  render(
    <BrowserRouter>
      <Edit />
    </BrowserRouter>
  );

  const nameInput = screen.getByLabelText(/Name \(Enter your full name\)/i);
  fireEvent.change(nameInput, { target: { value: "Sam" } });
  expect(nameInput.value).toBe("Sam");

  const streetInput = screen.getByLabelText(/Street/i);
  fireEvent.change(streetInput, { target: { value: "123 Main St" } });
  expect(streetInput.value).toBe("123 Main St");

  const cityInput = screen.getByLabelText(/City/i);
  fireEvent.change(cityInput, { target: { value: "New York" } });
  expect(cityInput.value).toBe("New York");

  const stateInput = screen.getByLabelText(/State/i);
  fireEvent.change(stateInput, { target: { value: "NY" } });
  expect(stateInput.value).toBe("NY");

  const pinCodeInput = screen.getByLabelText(/Pin Code/i);
  fireEvent.change(pinCodeInput, { target: { value: "10001" } });
  expect(pinCodeInput.value).toBe("10001");

  const descriptionInput = screen.getByLabelText(
    /Description \(20-100 words\)/i
  );
  fireEvent.change(descriptionInput, {
    target: { value: "A nice place to live." },
  });
  expect(descriptionInput.value).toBe("A nice place to live.");

  const bhkTypeInput = screen.getByLabelText(/BHK Type/i);
  fireEvent.change(bhkTypeInput, { target: { value: "3 BHK" } });
  expect(bhkTypeInput.value).toBe("3 BHK");

  const ownerInput = screen.getByLabelText(/Owner/i);
  fireEvent.change(ownerInput, { target: { value: "Harry" } });
  expect(ownerInput.value).toBe("Harry");

  const priceInput = screen.getByLabelText(/Price/i);
  fireEvent.change(priceInput, { target: { value: "5000" } });
  expect(priceInput.value).toBe("5000");
});


});
