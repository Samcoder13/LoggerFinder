import {
  render,
  screen,
  fireEvent,
  waitFor,
  prettyDOM,
} from "@testing-library/react";
import Create from "../src/Components/Create";
import { describe, expect, test } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

describe("Create Component", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    localStorage.clear();
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <Create />
        <ToastContainer />
      </BrowserRouter>
    );
    test("renders form fields correctly", () => {
      renderComponent();

      expect(
        screen.getByLabelText(/Name \(Enter your full name\)/i)
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/Street/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/State/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Pin Code/i)).toBeInTheDocument();
      expect(
        screen.getByLabelText(/Description \(20-100 words\)/i)
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/BHK Type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Owner/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Price/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Start Date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/End Date/i)).toBeInTheDocument();
    });

    test("allows input values to be changed", () => {
      renderComponent();

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

    test("Validates and Submit the form", async () => {
      renderComponent();

      fireEvent.change(screen.getByLabelText(/Name \(Enter your full name\)/i), {
        target: { value: "Joh" },
      });
      fireEvent.change(screen.getByLabelText(/Street/i), {
        target: { value: "" },
      });
      fireEvent.change(screen.getByLabelText(/City/i), {
        target: { value: "" },
      });
      fireEvent.change(screen.getByLabelText(/State/i), {
        target: { value: "" },
      });
      fireEvent.change(screen.getByLabelText(/Pin Code/i), {
        target: { value: "" },
      });
      fireEvent.change(screen.getByLabelText(/Description \(20-100 words\)/i), {
        target: { value: "hello" },
      });
      fireEvent.change(screen.getByLabelText(/BHK Type/i), {
        target: { value: "bh" },
      });
      fireEvent.change(screen.getByLabelText(/Owner/i), {
        target: { value: "sa" },
      });
      fireEvent.change(screen.getByLabelText(/Price/i), {
        target: { value: "" },
      });

      const createButton = screen.getByText("Create");
      fireEvent.click(createButton);

      await waitFor(() => {
        expect(
          screen.getByText(/Name must be at least 5 characters long/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/Street is required/i)).toBeInTheDocument();
        expect(screen.getByText(/City is required/i)).toBeInTheDocument();
        expect(screen.getByText(/State is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Pin Code is required/i)).toBeInTheDocument();
        expect(
          screen.getByText(/Description must be between 20 and 100 characters/i)
        ).toBeInTheDocument();
        expect(
          screen.getByText(/BHK type must be at least 3 characters long/i)
        ).toBeInTheDocument();
        expect(
          screen.getByText(/Owner must be at least 3 characters long/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/Price must be at least 3/i)).toBeInTheDocument();
      });
    });

    
  // test("Validates and Submit the form", async () => {
  //   const mockData = {
  //     name: "samarth srivastava",
  //     address: {
  //       street: "123 main street",
  //       city: "Kota",
  //       state: "Rajasthan",
  //       PinCode: 324002,
  //     },
  //     description:
  //       "Hello this is the description of the city of the chambal .etcj ldsfnldfn nldsnfldl dsflnd lnksdfklns lnsdflsdf lkndflnsf nkfdlnsdf nlskdnflskndf sndflnsdf",
  //     Bhktype: "3BHK",
  //     owner: "Harry Harry",
  //     price: "200000",
  //   };

  //   global.fetch.mockResolvedValueOnce({
  //     ok: true,
  //     json: async () => mockData,
  //   });

  //   renderComponent();

  //   const nameInput = screen.getByLabelText(/Name \(Enter your full name\)/i);
  //   fireEvent.change(nameInput, { target: { value: "Sam" } });
  //   expect(nameInput.value).toBe("Sam");

  //   const streetInput = screen.getByLabelText(/Street/i);
  //   fireEvent.change(streetInput, { target: { value: "123 Main St" } });
  //   expect(streetInput.value).toBe("123 Main St");

  //   const cityInput = screen.getByLabelText(/City/i);
  //   fireEvent.change(cityInput, { target: { value: "New York" } });
  //   expect(cityInput.value).toBe("New York");

  //   const stateInput = screen.getByLabelText(/State/i);
  //   fireEvent.change(stateInput, { target: { value: "NY" } });
  //   expect(stateInput.value).toBe("NY");

  //   const pinCodeInput = screen.getByLabelText(/Pin Code/i);
  //   fireEvent.change(pinCodeInput, { target: { value: "10001" } });
  //   expect(pinCodeInput.value).toBe("10001");

  //   const descriptionInput = screen.getByLabelText(
  //     /Description \(20-100 words\)/i
  //   );
  //   fireEvent.change(descriptionInput, {
  //     target: { value: "A nice place to live." },
  //   });
  //   expect(descriptionInput.value).toBe("A nice place to live.");

  //   const bhkTypeInput = screen.getByLabelText(/BHK Type/i);
  //   fireEvent.change(bhkTypeInput, { target: { value: "3BHK" } });
  //   expect(bhkTypeInput.value).toBe("3BHK");

  //   const ownerInput = screen.getByLabelText(/Owner/i);
  //   fireEvent.change(ownerInput, { target: { value: "Harry" } });
  //   expect(ownerInput.value).toBe("Harry");

  //   const priceInput = screen.getByLabelText(/Price/i);
  //   fireEvent.change(priceInput, { target: { value: "5000" } });
  //   expect(priceInput.value).toBe("5000");
  //   fireEvent.change(screen.getByLabelText("Start Date"), {
  //     target: { value: "2024-06-20" },
  //   });
  //   fireEvent.change(screen.getByLabelText("End Date"), {
  //     target: { value: "2024-06-23" },
  //   });

  //   // expect(screen.getByLabelText("Start Date")).toBeInTheDocument();
  //   fireEvent.click(screen.getByText("Create"));
    
  //   // expect(screen.getByText("Successfully Created")).toBeInTheDocument();
  //   // expect(window.location.pathname).toBe("/list");
  // });
});
