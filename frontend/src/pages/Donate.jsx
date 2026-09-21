import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  TextField,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";

import API from "../services/api";

function Donate() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [detectedItems, setDetectedItems] = useState([]);
  const [imageUrl, setImageUrl] = useState("");

  const [quantity, setQuantity] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Select Image
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));

    // Clear previous results
    setDetectedItems([]);
    setImageUrl("");
    setMessage("");
    setError("");
  };

  // AI Detection
  const handleDetect = async () => {
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("image", selectedFile);

      const response = await API.post(
        "/ai/detect",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("AI Response:", response.data);

      setDetectedItems(
        response.data.detected_items || []
      );

      // IMPORTANT:
      // Store uploaded image URL
      setImageUrl(
        response.data.image_url || ""
      );

      if (
        !response.data.detected_items ||
        response.data.detected_items.length === 0
      ) {
        setError("No donation item detected");
      }

    } catch (error) {
      console.error(
        "AI Detection Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "AI Detection Failed"
      );

    } finally {
      setLoading(false);
    }
  };

  // Save Donation
  const handleSaveDonation = async () => {
    // Validate quantity
    if (
      !quantity ||
      Number(quantity) <= 0 ||
      !Number.isInteger(Number(quantity))
    ) {
      setError("Please enter a valid quantity");
      return;
    }

    // Validate AI detection
    if (detectedItems.length === 0) {
      setError("Please detect the item using AI first");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");

      // Take first detected item
      const item = detectedItems[0];

      const response = await API.post(
        "/ai/save-donation",
        {
          item_name: item.item_name,
          category: item.category || "Other",
          quantity: Number(quantity),

          // IMPORTANT:
          // Save uploaded image URL
          image_url: imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Donation Save Response:",
        response.data
      );

      setMessage(
        response.data.message ||
          "Donation Saved Successfully"
      );

      // Clear form after successful save
      setQuantity("");

    } catch (error) {
      console.error(
        "Save Donation Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to save donation"
      );

    } finally {
      setSaving(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ mt: 5, mb: 5 }}
    >
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
          Donate an Item
        </Typography>

        <Typography
          variant="body1"
          align="center"
          sx={{ mb: 4 }}
        >
          Upload an image and let AI identify
          your donation item.
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

        {/* File Selection */}
        <Button
          variant="outlined"
          component="label"
          fullWidth
          sx={{ mb: 2 }}
        >
          Select Image

          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleFileChange}
          />
        </Button>

        {/* Image Preview */}
        {preview && (
          <Box
            sx={{
              textAlign: "center",
              mb: 3,
            }}
          >
            <img
              src={preview}
              alt="Donation Preview"
              style={{
                width: "100%",
                maxHeight: "300px",
                objectFit: "contain",
                borderRadius: "10px",
              }}
            />
          </Box>
        )}

        {/* Detect Button */}
        <Button
          variant="contained"
          fullWidth
          onClick={handleDetect}
          disabled={!selectedFile || loading}
          sx={{ mb: 3 }}
        >
          {loading ? (
            <>
              <CircularProgress
                size={22}
                sx={{ mr: 1 }}
              />
              Detecting...
            </>
          ) : (
            "Detect Item With AI"
          )}
        </Button>

        {/* Detection Results */}
        {detectedItems.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
            >
              AI Detection Result
            </Typography>

            {detectedItems.map(
              (item, index) => (
                <Card
                  key={index}
                  sx={{ mb: 2 }}
                >
                  <CardContent>
                    <Typography variant="h6">
                      {item.item_name}
                    </Typography>

                    <Typography>
                      Category:{" "}
                      {item.category ||
                        "Other"}
                    </Typography>

                    <Typography>
                      Confidence:{" "}
                      {(
                        item.confidence * 100
                      ).toFixed(0)}
                      %
                    </Typography>
                  </CardContent>
                </Card>
              )
            )}
          </Box>
        )}

        {/* Quantity */}
        {detectedItems.length > 0 && (
          <TextField
            label="Quantity"
            type="number"
            fullWidth
            value={quantity}
            onChange={(e) =>
              setQuantity(e.target.value)
            }
            inputProps={{
              min: 1,
              step: 1,
            }}
            sx={{ mb: 3 }}
          />
        )}

        {/* Save Donation */}
        {detectedItems.length > 0 && (
          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={handleSaveDonation}
            disabled={saving}
          >
            {saving ? (
              <>
                <CircularProgress
                  size={22}
                  sx={{ mr: 1 }}
                />
                Saving...
              </>
            ) : (
              "Confirm Donation"
            )}
          </Button>
        )}

        {/* Image URL Debug / Information */}
        {imageUrl && (
          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 2,
              wordBreak: "break-all",
            }}
          >
            Image uploaded successfully
          </Typography>
        )}
      </Paper>
    </Container>
  );
}

export default Donate;