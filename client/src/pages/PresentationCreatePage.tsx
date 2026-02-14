import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  Fade,
  Stack,
  IconButton
} from "@mui/material";

import SlideEditor from "../components/SlideEditor";
import { Presentation } from "../types/Presentation";
import { createPresentation } from "../services/presentationService";
import { useAuth } from "../context/AuthContext";

import { isTokenExpired } from "../utils/isTokenExpired";
import { Toast } from "../components/Toast";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PageContainer from "../layout/PageContainer";

/**
 * Page for creating a new presentation.
 *
 * @remarks
 * This page allows the user to:
 * - create a new presentation deck
 * - edit slides using the SlideEditor component
 * - navigate between slides using keyboard or swipe gestures
 * - save the final presentation to the server
 *
 * It also handles session expiration and prevents editing when the token is invalid.
 *
 * @returns JSX element representing the presentation creation page.
 */
export default function PresentationCreatePage() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  /** Presentation being created. */
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

  /** Whether the presentation is currently being saved. */
  const [saving, setSaving] = useState(false);

  /** Index of the currently active slide. */
  const [index, setIndex] = useState(0);

  // -----------------------------
  // SESSION EXPIRED HANDLING
  // -----------------------------

  /**
   * If the token exists but is expired, block the page and show a toast.
   */
  if (token) {
    const sessionExpired = isTokenExpired(token);
    if (sessionExpired) {
      return (
        <PageContainer>
          <Toast
            open={sessionExpired}
            message="Session expired. Please log in again."
            severity="warning"
            autoHideDuration={5000}
            onClose={() => logout()}
          />
        </PageContainer>
      );
    }
  }

  // -----------------------------
  // SLIDE NAVIGATION
  // -----------------------------

  /**
   * Moves to the next slide if possible.
   *
   * @returns void
   */
  const next = useCallback(() => {
    setIndex((i) => Math.min(i + 1, presentation.slides.length - 1));
  }, [presentation.slides.length]);

  /**
   * Moves to the previous slide if possible.
   *
   * @returns void
   */
  const prev = useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  // -----------------------------
  // KEYBOARD NAVIGATION
  // -----------------------------

  /**
   * Enables left/right arrow key navigation between slides.
   */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev]);

  // -----------------------------
  // SWIPE NAVIGATION
  // -----------------------------

  /** Stores the X‑coordinate of the initial touch event. */
  const touchStartXRef = useRef<number | null>(null);

  /**
   * Records the starting X position of a touch gesture.
   *
   * @param e - Touch start event.
   */
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  /**
   * Detects swipe direction and navigates slides accordingly.
   *
   * @param e - Touch end event.
   */
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartXRef.current;

    if (diff < -50) next();
    if (diff > 50) prev();

    touchStartXRef.current = null;
  };

  // -----------------------------
  // SAVE PRESENTATION
  // -----------------------------

  /**
   * Saves the newly created presentation to the server.
   *
   * @remarks
   * Only the title and slides are sent to the backend.
   * After saving, the user is redirected to the presentations list.
   *
   * @returns Promise resolving when the save completes.
   */
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

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <PageContainer>
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
            pointerEvents: "none"
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
    </PageContainer>
  );
}
