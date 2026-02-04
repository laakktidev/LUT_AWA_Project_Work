import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  Fade,
  Stack,
} from "@mui/material";

import SlideEditor from "../components/SlideEditor";
import { Presentation } from "../types/Presentation";
import { createPresentation } from "../services/presentationService";
import { useAuth } from "../context/AuthContext";

export default function PresentationCreatePage() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [presentation, setPresentation] = useState<Presentation>({
    _id: "",
    title: "",
    type: "presentation",
    slides: [
      {
        title: "",
        bullets: [""],
      },
    ],
    userId: "",
  });

  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  // // Track current slide index (parent-controlled navigation)
  const [index, setIndex] = useState(0);

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

    if (diff < -50) next(); // swipe left → next
    if (diff > 50) prev();  // swipe right → prev

    touchStartXRef.current = null;
  };

  const handleSave = async () => {
    if (!token) return;

    setSaving(true);

    try {
      const payload = {
        title,
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
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Create New Presentation</Typography>

        <Button variant="outlined" color="inherit" onClick={() => navigate("/presentations")}>
          Back to list
        </Button>
      </Stack>

      {/* Title input */}
      <TextField
        fullWidth
        label="Presentation Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ mb: 3 }}
      />

      {/* Slide Editor with swipe + fade wrapper */}
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
