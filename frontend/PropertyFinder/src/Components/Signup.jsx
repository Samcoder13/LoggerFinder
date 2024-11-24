import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [signupError, setSignupError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

  const navigate = useNavigate();

  const validateName = (name) => {
    if (!name) {
      setNameError("Name is required");
      return false;
    }
    setNameError("");
    return true;
  };

  const validateEmail = (email) => {
    if (!emailRegex.test(email)) {
      setEmailError("Invalid email format");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (password) => {
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters long and contain at least one letter, one number, and one special character"
      );
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const isNameValid = validateName(name);
      const isEmailValid = validateEmail(email);
      const isPasswordValid = validatePassword(password);
      const isConfirmPasswordValid = validateConfirmPassword(
        password,
        confirmPassword
      );

      if (
        isNameValid &&
        isEmailValid &&
        isPasswordValid &&
        isConfirmPasswordValid
      ) {
        const response = await fetch("http://localhost:4000/v1/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        });
        if (response.status === 500) {
          const errorData = await response.json();
          setSignupError(errorData.message || "Signup failed");
          toast.error(errorData.message || "Signup failed");
        } else if(response.status===201) {
          toast.success("Signup successful");
          setSignupError("");
          navigate("/");
        }
      }
    } catch (error) {
      setSignupError("Something Went Wrong! Please try again later.");
      toast.error("Something Went Wrong!");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={2} sx={{ boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.2)", p: 9 }}>
        <ToastContainer position="top-center" />
        <Typography variant="h4" component="h1" gutterBottom>
          Signup
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => validateName(name)}
            error={!!nameError}
            helperText={nameError}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => validateEmail(email)}
            error={!!emailError}
            helperText={emailError}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => validatePassword(password)}
            error={!!passwordError}
            helperText={passwordError}
          />
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={() => validateConfirmPassword(password, confirmPassword)}
            error={!!confirmPasswordError}
            helperText={confirmPasswordError}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: "16px" }}
          >
            Signup
          </Button>
          {signupError && <Typography color="error">{signupError}</Typography>}
        </form>
        <br />
        <Grid container>
          <Grid item>
            <Link to="/">{`Already have an account? Login`}</Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Signup;
