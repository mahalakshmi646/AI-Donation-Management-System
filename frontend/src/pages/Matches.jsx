import { useEffect, useState } from "react";

import {
  Container,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";

import API from "../services/api";

function Matches() {
  const [donations, setDonations] = useState([]);
  const [selectedDonationId, setSelectedDonationId] = useState("");

  const [matches, setMatches] = useState([]);

  const [loadingDonations, setLoadingDonations] =
    useState(true);

  const [loadingMatches, setLoadingMatches] =
    useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch user's donations
  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoadingDonations(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await API.get(
        "/donations/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const donationData =
        response.data.donations ||
        response.data ||
        [];

      setDonations(donationData);

      // Automatically select the latest donation
      if (donationData.length > 0) {
        setSelectedDonationId(
          donationData[0].id
        );
      }
    } catch (error) {
      console.error(
        "Fetch Donations Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to fetch donations"
      );
    } finally {
      setLoadingDonations(false);
    }
  };

  // Fetch matches whenever donation changes
  useEffect(() => {
    if (selectedDonationId) {
      fetchMatches(selectedDonationId);
    }
  }, [selectedDonationId]);

  const fetchMatches = async (donationId) => {
    try {
      setLoadingMatches(true);
      setError("");
      setMessage("");
      setMatches([]);

      const token = localStorage.getItem("token");

      const response = await API.get(
        `/matches/${donationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMatches(
        response.data.matches || []
      );
    } catch (error) {
      console.error(
        "Fetch Matches Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to fetch matches"
      );
    } finally {
      setLoadingMatches(false);
    }
  };

  // Confirm Match
  const handleConfirm = async (match) => {
    try {
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");

      const response = await API.post(
        "/matches/confirm",
        {
          donation_id:
            Number(selectedDonationId),

          ngo_id: match.ngo_id,

          match_score:
            match.match_score,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message ||
          "Match Confirmed Successfully"
      );

      // Refresh donations so updated status is shown
      await fetchDonations();

      // Refresh matches
      await fetchMatches(
        selectedDonationId
      );

    } catch (error) {
      console.error(
        "Confirm Match Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Match confirmation failed"
      );
    }
  };

  // Loading donations
  if (loadingDonations) {
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
    <Container
      maxWidth="md"
      sx={{
        mt: 5,
        mb: 5,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 3,
        }}
      >
        {/* Heading */}
        <Typography
          variant="h4"
          align="center"
          gutterBottom
        >
          NGO Matches
        </Typography>

        <Typography
          align="center"
          sx={{ mb: 4 }}
        >
          Find the best NGOs matching your donation
        </Typography>

        {/* Success Message */}
        {message && (
          <Alert
            severity="success"
            sx={{ mb: 3 }}
          >
            {message}
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
          >
            {error}
          </Alert>
        )}

        {/* No Donations */}
        {donations.length === 0 ? (
          <Alert severity="info">
            You have no donations available
            for matching.
          </Alert>
        ) : (
          <>
            {/* Donation Selector */}
            <FormControl
              fullWidth
              sx={{ mb: 4 }}
            >
              <InputLabel>
                Select Donation
              </InputLabel>

              <Select
                value={selectedDonationId}
                label="Select Donation"
                onChange={(e) =>
                  setSelectedDonationId(
                    e.target.value
                  )
                }
              >
                {donations.map(
                  (donation) => (
                    <MenuItem
                      key={donation.id}
                      value={donation.id}
                    >
                      {donation.item_name} -
                      Donation ID:{" "}
                      {donation.id} -
                      Quantity:{" "}
                      {donation.quantity} -
                      {donation.status}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>

            {/* Selected Donation Details */}
            {selectedDonationId && (
              <Box sx={{ mb: 4 }}>
                {donations
                  .filter(
                    (donation) =>
                      donation.id ===
                      Number(
                        selectedDonationId
                      )
                  )
                  .map((donation) => (
                    <Card
                      key={donation.id}
                      variant="outlined"
                    >
                      <CardContent>
                        <Typography variant="h6">
                          Selected Donation
                        </Typography>

                        <Typography>
                          Item:{" "}
                          {donation.item_name}
                        </Typography>

                        <Typography>
                          Quantity:{" "}
                          {donation.quantity}
                        </Typography>

                        <Typography>
                          Status:{" "}
                          {donation.status}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
              </Box>
            )}

            {/* Loading Matches */}
            {loadingMatches ? (
              <Box
                sx={{
                  textAlign: "center",
                  mt: 3,
                }}
              >
                <CircularProgress />
              </Box>
            ) : matches.length === 0 ? (
              <Alert severity="info">
                No NGO matches found for this
                donation.
              </Alert>
            ) : (
              <>
                <Typography
                  variant="h5"
                  gutterBottom
                >
                  Available NGO Matches
                </Typography>

                {matches.map(
                  (match, index) => (
                    <Card
                      key={index}
                      sx={{
                        mb: 3,
                        borderRadius: 3,
                      }}
                    >
                      <CardContent>
                        <Typography variant="h5">
                          {match.ngo_name}
                        </Typography>

                        <Typography
                          sx={{ mt: 1 }}
                        >
                          📍 {match.address}
                        </Typography>

                        <Typography
                          sx={{ mt: 1 }}
                        >
                          Item:{" "}
                          {match.item_name}
                        </Typography>

                        <Typography>
                          Quantity Required:{" "}
                          {
                            match.quantity_required
                          }
                        </Typography>

                        <Typography>
                          Priority:{" "}
                          {match.priority}
                        </Typography>

                        <Chip
                          label={`Match Score: ${match.match_score}%`}
                          color="success"
                          sx={{ mt: 2 }}
                        />

                        <Typography
                          sx={{
                            mt: 2,
                            mb: 2,
                          }}
                        >
                          {match.match_reason}
                        </Typography>

                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            handleConfirm(
                              match
                            )
                          }
                        >
                          Confirm Match
                        </Button>
                      </CardContent>
                    </Card>
                  )
                )}
              </>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
}

export default Matches;