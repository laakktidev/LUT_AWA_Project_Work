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
  updatePresentation,
} from "../services/presentationService";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

export default function PresentationEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useAuth();
  const { t } = useTranslation();

  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [saving, setSaving] = useState(false);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!token || !id) return;

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

  const next = useCallback(() => {
    if (!presentation) return;
    setIndex((i) => Math.min(i + 1, presentation.slides.length - 1));
  }, [presentation?.slides.length]);

  const prev = useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev]);

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

  if (!presentation) {
    return (
      <Box sx={{ maxWidth: 900, margin: "0 auto", mt: 4 }}>
        <Typography>{t("presentations.edit.loading")}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, margin: "0 auto", mt: 4 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="h4">
          {t("presentations.edit.title")}
        </Typography>

        <Button
          variant="outlined"
          color="inherit"
          onClick={() => navigate("/presentations")}
        >
          {t("presentations.edit.back")}
        </Button>
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
    </Box>
  );
}
