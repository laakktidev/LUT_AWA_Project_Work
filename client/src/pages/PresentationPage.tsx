import {
  Box,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  Stack,
  Paper,
  Fade,
} from "@mui/material";

import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePresentation } from "../hooks/usePresentation";
import { useState, useEffect, useCallback, useRef } from "react";

import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";


import { isTokenExpired } from "../utils/isTokenExpired";
import { Toast } from "../components/Toast";
import PageContainer from "../layout/PageContainer";

/**
 * Displays a single presentation in a slide viewer format.
 *
 * @remarks
 * This page:
 * - loads a presentation by ID
 * - allows slide navigation via keyboard and swipe gestures
 * - shows metadata (title, created/updated timestamps)
 * - allows editing if the user is the owner or an editor
 *
 * It also handles session expiration and displays a warning toast when needed.
 *
 * @returns JSX element representing the presentation viewer page.
 */
export default function PresentationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();

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

  /**
   * Loads the presentation using a custom hook.
   *
   * @remarks
   * The hook handles:
   * - loading state
   * - error state
   * - returning the presentation object
   */
  const { presentation, loading, error } = usePresentation(id, token);

  /** Index of the currently displayed slide. */
  const [index, setIndex] = useState(0);

  /** Touch start position for swipe navigation. */
  const touchStartXRef = useRef<number | null>(null);

  /** Whether the user is the owner of the presentation. */
  const isOwner = user?.id === presentation?.userId;

  /** Whether the user is listed as an editor. */
  const isEditor = presentation?.editors?.includes(user?.id as string);

  /** Whether the user can edit the presentation. */
  const canEdit = isOwner || isEditor;

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
  }, [presentation]);

  /**
   * Moves to the previous slide if possible.
   *
   * @returns void
   */
  const prev = useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  /**
   * Resets slide index when a new presentation loads.
   */
  useEffect(() => {
    setIndex(0);
  }, [presentation]);

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
  // LOADING
  // -----------------------------

  /**
   * Displays a loading spinner while the presentation is being fetched.
   */
  if (loading) {
    return (
      <PageContainer>
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  // -----------------------------
  // ERROR
  // -----------------------------

  /**
   * Displays an error message if the presentation cannot be loaded.
   */
  if (error || !presentation) {
    return (
      <PageContainer>
        <Typography variant="h6" color="error" sx={{ mt: 4 }}>
          Failed to load presentation
        </Typography>
      </PageContainer>
    );
  }

  /** The currently displayed slide. */
  const slide = presentation.slides[index];

  // -----------------------------
  // RENDER
  // -----------------------------

  return (
    <PageContainer>
      {/* Header + metadata */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>

        <Box>
          <Typography variant="h4" fontWeight={600}>
            {presentation.title}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Created:{" "}
            {presentation.createdAt
              ? new Date(presentation.createdAt).toLocaleString()
              : "-"}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Last updated:{" "}
            {presentation.updatedAt
              ? new Date(presentation.updatedAt).toLocaleString()
              : "-"}
          </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          {canEdit && (
            <IconButton
              onClick={() =>
                navigate(`/presentation/${presentation._id}/edit`)
              }
              sx={{ border: 1, borderColor: "divider", borderRadius: 2 }}
            >
              <EditIcon />
            </IconButton>
          )}
        </Stack>
      </Stack>

      {/* Slide viewer */}
      <Paper
        elevation={2}
        sx={{
          position: "relative",
          height: 320,
          overflow: "hidden",
          borderRadius: 2,
          pl: 9,   // <— perfect spacing
          pr: 9,
          py: 3,
          mb: 2,
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Fade in key={index} timeout={250}>
          <Box sx={{ height: "100%" }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              {slide.title || `Slide ${index + 1}`}
            </Typography>

            {slide.bullets.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No bullets
              </Typography>
            ) : (
              <ul>
                {slide.bullets.map((b, i) => (
                  <li key={i}>
                    <Typography variant="body1">{b}</Typography>
                  </li>
                ))}
              </ul>
            )}
          </Box>
        </Fade>

        {/* Navigation arrows */}

        <Button
          onClick={prev}
          disabled={index === 0}
          sx={{
            position: "absolute",
            top: "50%",
            left: 8,
            transform: "translateY(-50%)",
            minWidth: 0,
          }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 32 }} />   {/* <— bigger icon */}
        </Button>

        <Button
          onClick={next}
          disabled={index === presentation.slides.length - 1}
          sx={{
            position: "absolute",
            top: "50%",
            right: 8,
            transform: "translateY(-50%)",
            minWidth: 0,
          }}
        >
          <ArrowForwardIosIcon sx={{ fontSize: 32 }} />
        </Button>

        {/* Slide indicator */}
        <Box
          sx={{
            position: "absolute",
            bottom: 8,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Slide {index + 1} / {presentation.slides.length}
          </Typography>
        </Box>
      </Paper>
    </PageContainer>
  );
}
