/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import SideNavbar from "./SideNavbar"; // Assuming SideNavbar.js is in the same directory
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

function DetailView() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const { Id } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:4000/v1/getById/${Id}`,
          {
            method: "GET",
            headers: {
              Authorization: token,
            },
          }
        );
        if(response.status===403)
        {
          localStorage.clear();
          navigate("/");
        }
        if (!response.ok) {
          throw new Error("Something went wrong");
        }

        const responseData = await response.json();
        setData(responseData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [ Id]);

  return (
    <div>
      <SideNavbar />
      <div style={{ marginLeft: "240px", padding: "20px" }}>
        <TableContainer
          component={Paper}
          sx={{ boxShadow: 4, borderRadius: 4 }}
        >
          <Table sx={{ fontSize: 16 }}>
            <TableHead sx={{ backgroundColor: "#337ab7" }}>
              <TableRow>
                <TableCell
                  sx={{ color: "white", fontWeight: "bold", fontSize: 18 }}
                >
                  Name
                </TableCell>
                <TableCell
                  sx={{ color: "white", fontWeight: "bold", fontSize: 18 }}
                >
                  Address
                </TableCell>
                <TableCell
                  sx={{ color: "white", fontWeight: "bold", fontSize: 18 }}
                >
                  Description
                </TableCell>
                <TableCell
                  sx={{ color: "white", fontWeight: "bold", fontSize: 18 }}
                >
                  Start Date
                </TableCell>
                <TableCell
                  sx={{ color: "white", fontWeight: "bold", fontSize: 18 }}
                >
                  End Date
                </TableCell>
                <TableCell
                  sx={{ color: "white", fontWeight: "bold", fontSize: 18 }}
                >
                  BHK Type
                </TableCell>
                <TableCell
                  sx={{ color: "white", fontWeight: "bold", fontSize: 18 }}
                >
                  Owner
                </TableCell>
                <TableCell
                  sx={{ color: "white", fontWeight: "bold", fontSize: 18 }}
                >
                  Price
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((row, index) => (
                <TableRow
                  key={row._id}
                  sx={{
                    "&:hover": { backgroundColor: "#9fffff" },
                    backgroundColor: index % 2 === 0 ? "#f0f0f0" : "inherit",
                  }}
                >
                  <TableCell sx={{ fontSize: 16, fontWeight: 400 }}>
                    {row.name}
                  </TableCell>
                  <TableCell sx={{ fontSize: 16, fontWeight: 400 }}>
                    {row.address.street}, {row.address.city},{" "}
                    {row.address.state}, {row.address.country}
                  </TableCell>
                  <TableCell sx={{ fontSize: 16, fontWeight: 400 }}>
                    {row.description}
                  </TableCell>
                  <TableCell sx={{ fontSize: 16, fontWeight: 400 }}>
                    {row.startDate}
                  </TableCell>
                  <TableCell sx={{ fontSize: 16, fontWeight: 400 }}>
                    {row.endDate}
                  </TableCell>
                  <TableCell sx={{ fontSize: 16, fontWeight: 400 }}>
                    {row.Bhktype}
                  </TableCell>
                  <TableCell sx={{ fontSize: 16, fontWeight: 400 }}>
                    {row.owner}
                  </TableCell>
                  <TableCell sx={{ fontSize: 16, fontWeight: 400 }}>
                    {row.price}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default DetailView;
