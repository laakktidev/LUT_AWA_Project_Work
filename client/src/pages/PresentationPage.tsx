import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  Stack,
  Paper,
  Fade,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePresentation } from "../hooks/usePresentation";
import { useState, useEffect, useCallback, useRef } from "react";

export default function PresentationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const { presentation, loading, error } = usePresentation(id, token);

  const [index, setIndex] = useState(0);
  const touchStartXRef = useRef<number | null>(null);

  const next = useCallback(() => {
    if (!presentation) return;
    setIndex((i) => Math.min(i + 1, presentation.slides.length - 1));
  }, [presentation]);

  const prev = useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  // Reset index when presentation changes
  useEffect(() => {
    setIndex(0);
  }, [presentation]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartXRef.current;

    if (diff < -50) next(); // swipe left → next
    if (diff > 50) prev();  // swipe right → prev

    touchStartXRef.current = null;
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !presentation) {
    return (
      <Container maxWidth="md">
        <Typography variant="h6" color="error" sx={{ mt: 4 }}>
          Failed to load presentation
        </Typography>
      </Container>
    );
  }

  const slide = presentation.slides[index];

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      {/* Header + metadata */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
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
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => navigate("/presentations")}
          >
            Back to list
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/presentation/${presentation._id}/edit`)}
          >
            Edit presentation
          </Button>
        </Stack>
      </Stack>

      {/* Slide viewer (cheap carousel) */}
      <Paper
        elevation={2}
        sx={{
          position: "relative",
          height: 320,
          overflow: "hidden",
          borderRadius: 2,
          p: 3,
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
          ◀
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
          ▶
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
    </Container>
  );
}
