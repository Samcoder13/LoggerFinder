/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import SideNavbar from "./SideNavbar";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Box,
  InputAdornment,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";

function ListPage() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [searchboolflag, setSearchboolflag] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:4000/v1/getalldetails?page=${page}&limit=${rowsPerPage}&filter=${filter}&search=${search}`,
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
  }, [page, rowsPerPage, filter, searchboolflag]);

  const searchhandler = (e) => {
    setSearch(e.target.value);
    if (e.target.value === "") {
      setSearchboolflag(!searchboolflag);
    }
  };

  return (
    <div>
      <SideNavbar />
      <div style={{ marginLeft: "240px", padding: "20px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <Box sx={{ display: "flex", gap: "10px" }}>
            <FormControl sx={{ minWidth: 120 }} size="small">
              <InputLabel>Filter</InputLabel>
              <Select
                label="Filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                sx={{
                  backgroundColor: "#337ab7",
                  color: "white",
                  ".MuiSelect-icon": { color: "white" },
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="1BHK">1BHK</MenuItem>
                <MenuItem value="2BHK"> 2BHK</MenuItem>
                <MenuItem value="3BHK">3BHK</MenuItem>
                <MenuItem value="4BHK">4BHK</MenuItem>
                <MenuItem value="5BHK">5BHK</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              value={search}
              onChange={searchhandler}
              sx={{
                backgroundColor: "#ffffff",
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        setSearchboolflag(!searchboolflag);
                      }}
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box sx={{ display: "flex", gap: "10px" }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#337ab7", color: "white" }}
              onClick={() => navigate("/create")}
            >
              Create
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#337ab7", color: "white" }}
              onClick={() => navigate("/bulkUpload")}
            >
              Upload
            </Button>
          </Box>
        </Box>
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
                  Description
                </TableCell>
                <TableCell
                  sx={{ color: "white", fontWeight: "bold", fontSize: 18 }}
                >
                  Bhktype
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
                <TableCell
                  sx={{ color: "white", fontWeight: "bold", fontSize: 18 }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                data?.map((row, index) => (
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
                      {row.description}
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
                    <TableCell>
                      <IconButton
                        component={Link}
                        to={`/view/${row._id}`}
                        aria-label="view"
                        sx={{
                          color: "#337ab7",
                          "&:hover": { color: "#00033" },
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        component={Link}
                        to={`/edit/${row._id}`}
                        aria-label="edit"
                        sx={{
                          color: "#337ab7",
                          "&:hover": { color: "#00033" },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
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

export default ListPage;
