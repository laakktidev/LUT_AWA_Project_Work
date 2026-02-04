import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

import { ISlideDeck } from "../types/slides";
import { getSlideDeck } from "../services/slideService";
import { useAuth } from "../context/AuthContext";

export default function SlideShowPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [deck, setDeck] = useState<ISlideDeck | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!id || !token) return;

    (async () => {
      const data = await getSlideDeck(id, token);
      setDeck(data);
      setCurrentIndex(0);
    })();
  }, [id, token]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "Escape") {
        navigate(-1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  if (!deck) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography>Loading slideshow...</Typography>
      </Container>
    );
  }

  const totalSlides = deck.slides.length;
  const slide = deck.slides[currentIndex];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <Box
      sx={{
        height: "100vh",
        bgcolor: "#111",
        color: "#fff",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* Top bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: 2,
          py: 1,
          borderBottom: "1px solid #333"
        }}
      >
        <IconButton onClick={() => navigate(-1)} sx={{ color: "#fff" }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography sx={{ ml: 2, fontWeight: 600 }}>
          {deck.title}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Typography variant="body2">
          Slide {currentIndex + 1} / {totalSlides}
        </Typography>
      </Box>

      {/* Slide area */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 4
        }}
      >
        <Box
          sx={{
            width: "80%",
            maxWidth: "960px",
            minHeight: "60%",
            bgcolor: "#222",
            borderRadius: 2,
            boxShadow: "0 0 40px rgba(0,0,0,0.6)",
            p: 6
          }}
        >
          <Typography
            variant="h3"
            sx={{ mb: 3, fontWeight: 700, wordBreak: "break-word" }}
          >
            {slide.header}
          </Typography>

          <Box component="ul" sx={{ pl: 3, mt: 2 }}>
            {slide.bullets.map((bullet, idx) => (
              <Typography
                key={idx}
                component="li"
                variant="h5"
                sx={{ mb: 1.5, wordBreak: "break-word" }}
              >
                {bullet}
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Controls */}
      <Box
        sx={{
          py: 2,
          px: 4,
          borderTop: "1px solid #333",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <Button
          startIcon={<ArrowLeftIcon />}
          onClick={prevSlide}
          disabled={currentIndex === 0}
          variant="outlined"
          sx={{ color: "#fff", borderColor: "#555" }}
        >
          Previous
        </Button>

        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          Use ← → arrows, Esc to exit
        </Typography>

        <Button
          endIcon={<ArrowRightIcon />}
          onClick={nextSlide}
          disabled={currentIndex === totalSlides - 1}
          variant="outlined"
          sx={{ color: "#fff", borderColor: "#555" }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}
