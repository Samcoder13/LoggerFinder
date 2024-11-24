import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Logs from "../src/Components/Logs";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";



describe("Logs Component",()=>{
    beforeEach(() => {
        global.fetch = vi.fn();
        localStorage.clear();
      });

      test("renders the component and fetches data", async () => {
        const mockData = {
          data: [
            {
              _id: "1",
              rowNo: 1,
              errormessage: ["Error 1", "Error 2"],
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
            <Logs />
          </BrowserRouter>
        );
    
        await waitFor(() => {
          expect(screen.getByText("Row Number")).toBeInTheDocument();
        });
    
        // expect(screen.getByText("1 - Error 1")).toBeInTheDocument();
        // expect(screen.getByText("b -Error 2")).toBeInTheDocument();
      });

      test("handles unauthorized access", async () => {
        global.fetch.mockResolvedValueOnce({
          status: 403,
          ok: false,
        });
    
        render(
          <BrowserRouter>
            <Logs />
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
        <Logs />
      </BrowserRouter>
    );

    expect(await screen.findByText("Rows per page:")).toBeInTheDocument();
  });
 

})