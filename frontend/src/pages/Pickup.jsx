import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";

import API from "../services/api";

function Pickup() {
  const [matchId, setMatchId] = useState("2");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSchedule = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!matchId || !pickupDate || !pickupTime) {
      setError("Please fill all fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await API.post(
        "/pickups/schedule",
        {
          match_id: Number(matchId),
          pickup_date: pickupDate,
          pickup_time: pickupTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message ||
          "Pickup Scheduled Successfully"
      );

    } catch (error) {
      console.error("Pickup Error:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Pickup scheduling failed"
      );
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>

      <Paper
        elevation={5}
        sx={{
          p: 4,
          borderRadius: 3,
        }}
      >

        <Typography
          variant="h4"
          align="center"
          gutterBottom
        >
          Pickup Schedule
        </Typography>

        <Typography
          align="center"
          sx={{ mb: 4 }}
        >
          Schedule a pickup for your confirmed donation.
        </Typography>

        {message && (
          <Alert
            severity="success"
            sx={{ mb: 3 }}
          >
            {message}
          </Alert>
        )}

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
          >
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSchedule}
          display="flex"
          flexDirection="column"
          gap={3}
        >

          <TextField
            label="Match ID"
            type="number"
            value={matchId}
            onChange={(e) =>
              setMatchId(e.target.value)
            }
            fullWidth
            required
          />

          <TextField
            label="Pickup Date"
            type="date"
            value={pickupDate}
            onChange={(e) =>
              setPickupDate(e.target.value)
            }
            fullWidth
            required
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label="Pickup Time"
            type="time"
            value={pickupTime}
            onChange={(e) =>
              setPickupTime(e.target.value)
            }
            fullWidth
            required
            InputLabelProps={{
              shrink: true,
            }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
          >
            Schedule Pickup
          </Button>

        </Box>

      </Paper>

    </Container>
  );
}

export default Pickup;