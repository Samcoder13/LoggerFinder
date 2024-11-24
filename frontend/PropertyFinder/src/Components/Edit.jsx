/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Container,
  Grid,
  Typography,
  Box,
} from "@mui/material";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNavigate, useParams } from "react-router-dom";
import SideNavbar from "./SideNavbar";
import dayjs from "dayjs";
import { toast } from "react-toastify";

const Edit = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: {
      street: "",
      city: "",
      state: "",
      pinCode: "",
    },
    description: "",
    startDate: null,
    endDate: null,
    Bhktype: "",
    owner: "",
    price: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const { Id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:4000/v1/getById/${Id}`, {
          method: "GET",
          headers: {
            Authorization: token,
          },
        });
        if (response.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("name");
          localStorage.removeItem("email");
          navigate("/");
        }
        const responseData = await response.json();
        console.log(responseData.data[0]);
        const startDate = dayjs(responseData.data[0].startDate);
        const endDate = dayjs(responseData.data[0].endDate);
        setFormData({
          name: responseData.data[0].name,
          address: {
            street: responseData.data[0].address.street,
            city: responseData.data[0].address.city,
            state: responseData.data[0].address.state,
            pinCode: responseData.data[0].address.pinCode,
          },
          description: responseData.data[0].description,
          startDate: startDate,
          endDate: endDate,
          Bhktype: responseData.data[0].Bhktype,
          owner: responseData.data[0].owner,
          price: responseData.data[0].price,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [Id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [field, subField] = name.split(".");

    if (subField) {
      setFormData((prevState) => ({
        ...prevState,
        [field]: {
          ...prevState[field],
          [subField]: value,
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [field]: value,
      }));
    }
  };

  const handleDateChange = (name, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const Errorsobj = {};

    validateName(formData.name, Errorsobj);
    validateAddress(formData.address, Errorsobj);
    validateDescription(formData.description, Errorsobj);
    validateDates(formData.startDate, formData.endDate, Errorsobj);
    validateFieldLength(formData.Bhktype, "Bhktype", 3, "BHK type", Errorsobj);
    validateFieldLength(formData.owner, "owner", 3, "Owner", Errorsobj);
    validateFieldLength(formData.price, "price", 3, "Price", Errorsobj);

    setErrors(Errorsobj);
    return Object.keys(Errorsobj).length === 0;
  };

  const validateName = (name, errors) => {
    if (!name || name.length < 5)
      errors.name = "Name must be at least 5 characters long";
  };

  const validateAddress = (address, errors) => {
    if (!address.street) errors.street = "Street is required";
    if (!address.city) errors.city = "City is required";
    if (!address.state) errors.state = "State is required";
    if (!address.pinCode) errors.pinCode = "Pin Code is required";
  };

  const validateDescription = (description, errors) => {
    if (!description || description.length < 20 || description.length > 1000) {
      errors.description = "Description must be between 20 and 100 characters";
    }
  };

  const validateDates = (startDate, endDate, errors) => {
    if (!startDate) {
      errors.startDate = "Start Date is required";
    }
    if (!endDate) {
      errors.endDate = "End Date is required";
    } else if (new Date(endDate) <= new Date(startDate)) {
      errors.endDate = "End Date must be after Start Date";
    }
  };

  const validateFieldLength = (
    field,
    fieldName,
    minLength,
    fieldLabel,
    errors
  ) => {
    if (!field || field.length < minLength) {
      errors[
        fieldName
      ] = `${fieldLabel} must be at least ${minLength} characters long`;
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (validateForm() === false) return;

      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4000/v1/edit/${Id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 401) {
        navigate("/list");
      }
      if (response.status === 403) {
        localStorage.clear();
        navigate("/");
      }

      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      toast.success("Update Successfully");
      navigate("/list");
    } catch (error) {
      toast.error("Fetch error");
    }
  };

  return (
    <Box display="flex">
      <SideNavbar />
      <Container sx={{ marginLeft: "100px", marginTop: "16px" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome To Edit
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              "& .MuiTextField-root": { m: 1 },
              "& .MuiButton-root": { m: 2 },
              backgroundColor: "white",
              padding: 3,
              borderRadius: 7,
              boxShadow: 3,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  label="Name (Enter your full name)"
                  fullWidth
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="address.street"
                  label="Street"
                  fullWidth
                  value={formData.address.street}
                  onChange={handleChange}
                  error={!!errors.street}
                  helperText={errors.street}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="address.city"
                  label="City"
                  fullWidth
                  value={formData.address.city}
                  onChange={handleChange}
                  error={!!errors.city}
                  helperText={errors.city}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="address.state"
                  label="State"
                  fullWidth
                  value={formData.address.state}
                  onChange={handleChange}
                  error={!!errors.state}
                  helperText={errors.state}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="address.pinCode"
                  label="Pin Code"
                  fullWidth
                  value={formData.address.pinCode}
                  onChange={handleChange}
                  error={!!errors.pinCode}
                  helperText={errors.pinCode}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description (20-100 words)"
                  fullWidth
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  error={!!errors.description}
                  helperText={errors.description}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="Bhktype"
                  label="BHK Type"
                  fullWidth
                  value={formData.Bhktype}
                  onChange={handleChange}
                  error={!!errors.Bhktype}
                  helperText={errors.Bhktype}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="owner"
                  label="Owner"
                  fullWidth
                  value={formData.owner}
                  onChange={handleChange}
                  error={!!errors.owner}
                  helperText={errors.owner}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="price"
                  label="Price"
                  type="number"
                  fullWidth
                  value={formData.price}
                  onChange={handleChange}
                  error={!!errors.price}
                  helperText={errors.price}
                />
              </Grid>
              <Grid item xs={6}>
                <MobileDatePicker
                  label="Start Date"
                  value={formData.startDate}
                  onChange={(newValue) =>
                    handleDateChange("startDate", newValue)
                  }
                  textField={(props) => (
                    <TextField
                      {...props}
                      fullWidth
                      error={!!errors.startDate}
                      helperText={errors.startDate}
                    />
                  )}
                  inputFormat="DD/MM/YYYY"
                />
              </Grid>
              <Grid item xs={6}>
                <MobileDatePicker
                  label="End Date"
                  value={formData.endDate}
                  onChange={(newValue) => handleDateChange("endDate", newValue)}
                  textField={(props) => (
                    <TextField
                      {...props}
                      fullWidth
                      error={!!errors.endDate}
                      helperText={errors.endDate}
                    />
                  )}
                  inputFormat="DD/MM/YYYY"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{ backgroundColor: "#337ab7" }}
                >
                  Update
                </Button>
              </Grid>
            </Grid>
          </Box>
        </LocalizationProvider>
      </Container>
    </Box>
  );
};

export default Edit;
