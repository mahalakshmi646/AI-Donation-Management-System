import { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";

import API from "../services/api";

function History() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await API.get(
        "/donations/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDonations(response.data.donations || response.data || []);
    } catch (error) {
      console.error("History Error:", error);

      setError(
        error.response?.data?.message ||
        "Unable to load donation history"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container
        sx={{
          mt: 5,
          textAlign: "center",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
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
          Donation History
        </Typography>

        <Typography
          align="center"
          sx={{ mb: 4 }}
        >
          View all your donations
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {!error && donations.length === 0 && (
          <Alert severity="info">
            No donations found.
          </Alert>
        )}

        {donations.map((donation) => (
          <Card
            key={donation.id}
            sx={{
              mb: 2,
              borderRadius: 3,
            }}
          >
            <CardContent>

              <Typography variant="h5">
                {donation.item_name}
              </Typography>

              <Typography sx={{ mt: 1 }}>
                Donation ID: {donation.id}
              </Typography>

              <Typography>
                Quantity: {donation.quantity}
              </Typography>

              <Typography>
                Image: {donation.image_url || "Not available"}
              </Typography>

              <Typography>
                Created:{" "}
                {donation.created_at
                  ? new Date(
                      donation.created_at
                    ).toLocaleString()
                  : "N/A"}
              </Typography>

              <Chip
                label={donation.status || "Pending"}
                sx={{ mt: 2 }}
              />

            </CardContent>
          </Card>
        ))}
      </Paper>
    </Container>
  );
}

export default History;