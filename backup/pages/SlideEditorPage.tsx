/*
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, CircularProgress } from "@mui/material";

import SlideEditor from "../components/SlideEditor";
import { ISlideDeck } from "../types/Slides";
import { getSlideDeck, updateSlideDeck, createSlideDeck } from "../services/slideService";
import { useAuth } from "../context/AuthContext";

export default function SlideEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  // FIXED: "new" mode must detect undefined too
  const isNew = !id || id === "new";

  const [deck, setDeck] = useState<ISlideDeck | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      if (isNew) {
        setDeck({
          title: "Untitled Slide Deck",
          slides: [{ header: "", bullets: [] }]
        });
        setLoading(false);
        return;
      }

      if (!token) return;

      try {
        const data = await getSlideDeck(id!, token);
        setDeck(data);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, token, isNew]);

  const handleSave = async () => {
    if (!deck || !token) return;

    setSaving(true);
    try {
      if (isNew) {
        const created = await createSlideDeck(deck, token);
        navigate(`/slides/${created._id}/edit`);
      } else {
        await updateSlideDeck(id!, deck, token);
      }
    } catch (err) {
      console.error("Failed to save slide deck", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !deck) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, margin: "0 auto", mt: 4 }}>
      <Typography variant="h4" mb={2}>
        {isNew ? "Create New Slide Deck" : deck.title}
      </Typography>

      <SlideEditor
        deck={deck}
        onChange={(updated) => setDeck({ ...updated })}
      />

      <Box display="flex" justifyContent="flex-end" mt={4}>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </Box>
    </Box>
  );
}
*/

import { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import Button from "@mui/material/Button";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import { ISlideDeck } from "../types/Slides";

interface SlideEditorProps {
  deck: ISlideDeck;
  onChange: (updated: ISlideDeck) => void;
}

export default function SlideEditor({ deck, onChange }: SlideEditorProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  /* ----------------------------------------
     NAVIGATION
  -----------------------------------------*/
  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, deck.slides.length - 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  /* ----------------------------------------
     KEYBOARD NAVIGATION
  -----------------------------------------*/
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [deck.slides.length]);

  /* ----------------------------------------
     UPDATE HEADER
  -----------------------------------------*/
  const updateHeader = (value: string) => {
    const updated = { ...deck };
    updated.slides[currentSlide].header = value;
    onChange(updated);
  };

  /* ----------------------------------------
     UPDATE BULLET
  -----------------------------------------*/
  const updateBullet = (index: number, value: string) => {
    const updated = { ...deck };
    updated.slides[currentSlide].bullets[index] = value;
    onChange(updated);
  };

  /* ----------------------------------------
     ADD BULLET
  -----------------------------------------*/
  const addBullet = () => {
    const updated = { ...deck };
    updated.slides[currentSlide].bullets.push("");
    onChange(updated);
  };

  /* ----------------------------------------
     REMOVE BULLET
  -----------------------------------------*/
  const removeBullet = (index: number) => {
    const updated = { ...deck };
    updated.slides[currentSlide].bullets.splice(index, 1);
    onChange(updated);
  };

  /* ----------------------------------------
     ADD SLIDE
  -----------------------------------------*/
  const addSlide = () => {
    const updated = { ...deck };
    updated.slides.push({ header: "", bullets: [""] });
    onChange(updated);
    setCurrentSlide(updated.slides.length - 1);
  };

  /* ----------------------------------------
     DELETE SLIDE
  -----------------------------------------*/
  const deleteSlide = () => {
    if (deck.slides.length === 1) return;

    const updated = { ...deck };
    updated.slides.splice(currentSlide, 1);
    onChange(updated);

    setCurrentSlide((prev) => Math.max(0, prev - 1));
  };

  const slide = deck.slides[currentSlide];

  /* ----------------------------------------
     RENDER
  -----------------------------------------*/
  return (
    <Box sx={{ maxWidth: 700, margin: "0 auto", mt: 3 }}>
      {/* Navigation */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <IconButton onClick={prevSlide} disabled={currentSlide === 0}>
          <ArrowBackIosNewIcon />
        </IconButton>

        <Typography variant="h6">
          Slide {currentSlide + 1} / {deck.slides.length}
        </Typography>

        <IconButton
          onClick={nextSlide}
          disabled={currentSlide === deck.slides.length - 1}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>

      {/* Slide Editor */}
      <Slide in direction="left" mountOnEnter unmountOnExit>
        <Box key={currentSlide}>
          <TextField
            fullWidth
            label="Slide Header"
            value={slide.header}
            onChange={(e) => updateHeader(e.target.value)}
            sx={{ mb: 2 }}
          />

          {slide.bullets.map((b, i) => (
            <Box key={i} display="flex" alignItems="center" mb={1}>
              <TextField
                fullWidth
                label={`Bullet ${i + 1}`}
                value={b}
                onChange={(e) => updateBullet(i, e.target.value)}
              />
              <IconButton onClick={() => removeBullet(i)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}

          <Button startIcon={<AddIcon />} onClick={addBullet} sx={{ mt: 1 }}>
            Add Bullet
          </Button>
        </Box>
      </Slide>

      {/* Slide actions */}
      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={deleteSlide}
          disabled={deck.slides.length === 1}
        >
          Delete Slide
        </Button>

        <Button variant="contained" startIcon={<AddIcon />} onClick={addSlide}>
          Add Slide
        </Button>
      </Box>
    </Box>
  );
}
