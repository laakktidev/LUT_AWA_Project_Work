import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import {
  getPresentationById,
  updatePresentationBatch,
} from "../services/presentationService";
import { useAuth } from "../context/AuthContext";

export default function PresentationEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useAuth();

  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  // Track current slide index
  const [index, setIndex] = useState(0);

  // Load presentation from DB
  useEffect(() => {
    if (!token || !id) return;

    const load = async () => {
      try {
        const data = await getPresentationById(id, token);
        setPresentation(data);
        setTitle(data.title);
      } catch (err) {
        console.error("Failed to load presentation", err);
      }
    };

    load();
  }, [id, token]);

  // Navigation callbacks
  const next = useCallback(() => {
    if (!presentation) return;
    setIndex((i) => Math.min(i + 1, presentation.slides.length - 1));
  }, [presentation?.slides.length]);

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

  // Save changes (batch update)
  const handleSave = async () => {
    if (!token || !presentation || !id) return;

    setSaving(true);

    try {
      const payload = {
        title,
        slides: presentation.slides,
      };

      await updatePresentationBatch(id, payload, token);
      navigate("/presentations");
    } catch (err) {
      console.error("Failed to update presentation", err);
    } finally {
      setSaving(false);
    }
  };

  if (!presentation) {
    return (
      <Box sx={{ maxWidth: 900, margin: "0 auto", mt: 4 }}>
        <Typography>Loading presentation…</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, margin: "0 auto", mt: 4 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Edit Presentation</Typography>

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
              onChange={(updated) => setPresentation({ ...updated })}
            />
          </Box>
        </Fade>
      </Box>

      {/* Save button */}
      <Box display="flex" justifyContent="flex-end" mt={4}>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </Box>
    </Box>
  );
}
