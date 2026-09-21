import { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";

import API from "../services/api";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await API.get(
        "/user/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfile(response.data.user || response.data);
    } catch (error) {
      console.error("Profile Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load profile"
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
          My Profile
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {profile && (
          <>
            <TextField
              label="Name"
              value={profile.name || ""}
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
            />

            <TextField
              label="Email"
              value={profile.email || ""}
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
            />

            <TextField
              label="Phone"
              value={profile.phone || ""}
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
            />

            <TextField
              label="Address"
              value={profile.address || ""}
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
            />
          </>
        )}
      </Paper>
    </Container>
  );
}

export default Profile;