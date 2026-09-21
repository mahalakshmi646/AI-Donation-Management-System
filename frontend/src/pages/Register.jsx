import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",  
    password: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", form);

      alert("Registration Successful");

      navigate("/");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message || "Registration Failed"
      );
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={6}
        sx={{
          p: 4,
          mt: 5,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
        >
          Create Account
        </Typography>

        <Typography
          variant="h6"
          align="center"
          sx={{ mb: 3 }}
        >
          AI Donation Management System
        </Typography>

        <Box
          component="form"
          onSubmit={handleRegister}
          display="flex"
          flexDirection="column"
          gap={2}
        >
          <TextField
            label="Full Name"
            name="name"
            required
            fullWidth
            value={form.name}
            onChange={handleChange}
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            required
            fullWidth
            value={form.email}
            onChange={handleChange}
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            required
            fullWidth
            value={form.password}
            onChange={handleChange}
          />

          <TextField
            label="Phone"
            name="phone"
            required
            fullWidth
            value={form.phone}
            onChange={handleChange}
          />

          <TextField
            label="Address"
            name="address"
            required
            fullWidth
            multiline
            rows={2}
            value={form.address}
            onChange={handleChange}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
          >
            Register
          </Button>

          <Typography align="center">
            Already have an account?{" "}
            <Link to="/">
              Login
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Register;