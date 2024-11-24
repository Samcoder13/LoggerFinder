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
  TablePagination,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

function Logs() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const { uploadId } = useParams();
  const navigate=useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:4000/v1/getbyuploadid/${uploadId}?page=${page}&limit=${rowsPerPage}`,
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
        const responseData = await response.json();
        setData(responseData.data);
        setTotalCount(responseData.datalength);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [page, rowsPerPage, uploadId]);

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
                  Row Number
                </TableCell>
                <TableCell
                  sx={{ color: "white", fontWeight: "bold", fontSize: 18 }}
                >
                  Error Message
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow
                  key={row._id}
                  sx={{
                    "&:hover": { backgroundColor: "#9fffff" },
                    backgroundColor: index % 2 === 0 ? "#f0f0f0" : "inherit",
                  }}
                >
                  <TableCell sx={{ fontSize: 16, fontWeight: 400 }}>
                    {row.rowNo}
                  </TableCell>
                  <TableCell sx={{ fontSize: 16, fontWeight: 400 }}>
                    <TableCell sx={{ fontSize: 16, fontWeight: 400 }}>
                      {row.errormessage.map((message, idx) => (
                        <div key={`${row._id}-${idx}`}>{`${String.fromCharCode(
                          97 + idx
                        )} - ${message}`}</div>
                      ))}
                    </TableCell>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={totalCount}
          page={page - 1}
          onPageChange={(e, newPage) => setPage(newPage + 1)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value));
            setPage(1);
          }}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </div>
    </div>
  );
}

export default Logs;
