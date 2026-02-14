import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Fade,
  Stack
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import SlideEditor from "../components/SlideEditor";
import { Presentation } from "../types/Presentation";
import {
  getPresentationById,
  updatePresentation,
} from "../services/presentationService";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

import { isTokenExpired } from "../utils/isTokenExpired";
import { Toast } from "../components/Toast";
import PageContainer from "../layout/PageContainer";

/**
 * Page for editing an existing presentation.
 *
 * @remarks
 * This page allows the user to:
 * - load an existing presentation
 * - edit its title and slides
 * - navigate between slides using keyboard or swipe gestures
 * - save changes back to the server
 *
 * It also handles session expiration and prevents editing when the token is invalid.
 *
 * @returns JSX element representing the presentation editing page.
 */
export default function PresentationEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token, logout } = useAuth();
  const { t } = useTranslation();

  /** The presentation being edited. */
  const [presentation, setPresentation] = useState<Presentation | null>(null);

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
  // LOAD PRESENTATION
  // -----------------------------

  useEffect(() => {
    if (!token || !id) return;

    /**
     * Loads the presentation from the server.
     *
     * @returns Promise resolving when the presentation is loaded.
     */
    const load = async () => {
      try {
        const data = await getPresentationById(id, token);
        setPresentation(data);
      } catch (err) {
        console.error("Failed to load presentation", err);
      }
    };

    load();
  }, [id, token]);

  // -----------------------------
  // SLIDE NAVIGATION
  // -----------------------------

  /**
   * Moves to the next slide if possible.
   *
   * @returns void
   */
  const next = useCallback(() => {
    if (!presentation) return;
    setIndex((i) => Math.min(i + 1, presentation.slides.length - 1));
  }, [presentation?.slides.length]);

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
   * Saves the updated presentation to the server.
   *
   * @remarks
   * Only the title and slides are sent to the backend.
   * After saving, the user is redirected to the presentations list.
   *
   * @returns Promise resolving when the save completes.
   */
  const handleSave = async () => {
    if (!token || !presentation || !id) return;

    setSaving(true);

    try {
      const payload = {
        title: presentation.title,
        slides: presentation.slides,
      };

      await updatePresentation(id, payload, token);
      navigate("/presentations");
    } catch (err) {
      console.error("Failed to update presentation", err);
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------
  // LOADING STATE
  // -----------------------------

  /**
   * Displays a loading placeholder until the presentation is fetched.
   */
  if (!presentation) {
    return (
      <PageContainer>
        <Typography>{t("presentations.edit.loading")}</Typography>
      </PageContainer>
    );
  }

  // -----------------------------
  // RENDER
  // -----------------------------

  return (
    <PageContainer>
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        mb={2}
        sx={{ position: "relative" }}
      >
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>

        <Typography
          variant="h4"
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
            pointerEvents: "none"
          }}
        >
          {t("presentations.edit.title")}
        </Typography>
      </Stack>

      {/* Title input */}
      <TextField
        fullWidth
        label={t("presentations.edit.titleLabel")}
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
          {saving
            ? t("presentations.edit.saving")
            : t("presentations.edit.saveChanges")}
        </Button>
      </Box>
    </PageContainer>
  );
}
