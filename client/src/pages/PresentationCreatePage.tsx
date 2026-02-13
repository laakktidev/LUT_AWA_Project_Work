import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  Fade,
  Stack,
  IconButton,
  Container
} from "@mui/material";

import SlideEditor from "../components/SlideEditor";
import { Presentation } from "../types/Presentation";
import { createPresentation } from "../services/presentationService";
import { useAuth } from "../context/AuthContext";

import { isTokenExpired } from "../utils/isTokenExpired";
import { Toast } from "../components/Toast";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function PresentationCreatePage() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  // Full presentation object (title included)
  const [presentation, setPresentation] = useState<Presentation>({
    _id: "",
    title: "",
    type: "presentation",
    editors: [],
    slides: [
      {
        title: "",
        bullets: [""],
      },
    ],
    userId: "",
  });


  const [saving, setSaving] = useState(false);

  // Parent‑controlled slide index
  const [index, setIndex] = useState(0);

  if (token) {
    const sessionExpired = isTokenExpired(token);
    if (sessionExpired) {
      console.log("Session expired. Logging out...");
      return (
        <Container maxWidth="md">
          <Toast
            open={sessionExpired}
            message="Session expired. Please log in again."
            severity="warning"
            autoHideDuration={5000}
            onClose={() => logout()}
          />
        </Container>
      );
    }
  }

  // Navigation callbacks
  const next = useCallback(() => {
    setIndex((i) => Math.min(i + 1, presentation.slides.length - 1));
  }, [presentation.slides.length]);

  const prev = useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev]);

  // Swipe navigation
  const touchStartXRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartXRef.current;

    if (diff < -50) next();
    if (diff > 50) prev();

    touchStartXRef.current = null;
  };

  // Save new presentation
  const handleSave = async () => {
    if (!token) return;

    setSaving(true);

    try {
      const payload = {
        title: presentation.title,
        slides: presentation.slides,
      };

      await createPresentation(payload, token);
      navigate("/presentations");
    } catch (err) {
      console.error("Failed to save presentation", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 900, margin: "0 auto", mt: 4 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" mb={2} sx={{ position: "relative" }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>

        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
            pointerEvents: "none" // <-- important!
          }}
        >
          <Typography variant="h4">Create New Presentation</Typography>
        </Box>
      </Stack>


      {/* Title input */}
      <TextField
        fullWidth
        label="Presentation Title"
        value={presentation.title}
        onChange={(e) =>
          setPresentation({ ...presentation, title: e.target.value })
        }
        sx={{ mb: 3 }}
      />

      {/* Slide Editor */}
      <Box
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        sx={{ position: "relative" }}
      >
        <Fade in key={index} timeout={250}>
          <Box>
            <SlideEditor
              deck={presentation}
              index={index}
              onIndexChange={setIndex}
              onChange={setPresentation}
            />
          </Box>
        </Fade>
      </Box>

      {/* Save button */}
      <Box display="flex" justifyContent="flex-end" mt={4}>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Create Presentation"}
        </Button>
      </Box>
    </Box>
  );
}
