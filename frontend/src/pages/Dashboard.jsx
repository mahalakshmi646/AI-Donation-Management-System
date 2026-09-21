import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
} from "@mui/material";

function Dashboard() {
  const navigate = useNavigate();

  // Dashboard statistics
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    matched: 0,
    completed: 0,
  });

  // Fetch dashboard statistics
  useEffect(() => {
    getStats();
  }, []);

  const getStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await API.get("/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(response.data);
    } catch (error) {
      console.error("Dashboard Stats Error:", error);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      {/* Navbar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            AI Donation Management System
          </Typography>

          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Container */}
      <Container sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to Dashboard 👋
        </Typography>

        <Typography variant="body1" sx={{ mb: 4 }}>
          Manage your donations and help resources reach the right NGOs.
        </Typography>

        {/* Statistics */}
        <Grid container spacing={3}>

          {/* Total Donations */}
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  Total Donations
                </Typography>

                <Typography variant="h3">
                  {stats.total}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Pending */}
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  Pending
                </Typography>

                <Typography variant="h3">
                  {stats.pending}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Matched */}
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  Matched
                </Typography>

                <Typography variant="h3">
                  {stats.matched}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Completed */}
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  Completed
                </Typography>

                <Typography variant="h3">
                  {stats.completed}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

        </Grid>

        {/* Quick Actions */}
        <Box sx={{ mt: 5 }}>
          <Typography variant="h5" gutterBottom>
            Quick Actions
          </Typography>

          <Grid container spacing={2}>

            {/* Donate */}
            <Grid item>
              <Button
                variant="contained"
                onClick={() => navigate("/donate")}
              >
                Donate Item
              </Button>
            </Grid>

            {/* Matches */}
            <Grid item>
              <Button
                variant="outlined"
                onClick={() => navigate("/matches")}
              >
                View Matches
              </Button>
            </Grid>

            {/* Pickup */}
            <Grid item>
              <Button
                variant="outlined"
                onClick={() => navigate("/pickup")}
              >
                Pickup Schedule
              </Button>
            </Grid>

            {/* History */}
            <Grid item>
              <Button
                variant="outlined"
                onClick={() => navigate("/history")}
              >
                Donation History
              </Button>
            </Grid>

            {/* Profile */}
            <Grid item>
              <Button
                variant="outlined"
                onClick={() => navigate("/profile")}
              >
                My Profile
              </Button>
            </Grid>

          </Grid>
        </Box>
      </Container>
    </>
  );
}

export default Dashboard;