import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  Stack,
  TextField,
  Typography
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { ISlide, ISlideDeck } from "../types/slides";
import { createSlideDeck, updateSlideDeck } from "../services/slideService";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

export default function SlideEditorPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // for editing existing decks

  const [title, setTitle] = useState("");
  const [slides, setSlides] = useState<ISlide[]>([
    { header: "", bullets: [""] }
  ]);

  /* -----------------------------
     Slide manipulation helpers
  ------------------------------*/

  const updateSlideHeader = (index: number, value: string) => {
    const updated = [...slides];
    updated[index].header = value;
    setSlides(updated);
  };

  const updateBullet = (slideIndex: number, bulletIndex: number, value: string) => {
    const updated = [...slides];
    updated[slideIndex].bullets[bulletIndex] = value;
    setSlides(updated);
  };

  const addBullet = (slideIndex: number) => {
    const updated = [...slides];
    updated[slideIndex].bullets.push("");
    setSlides(updated);
  };

  const removeBullet = (slideIndex: number, bulletIndex: number) => {
    const updated = [...slides];
    updated[slideIndex].bullets.splice(bulletIndex, 1);
    setSlides(updated);
  };

  const addSlide = () => {
    setSlides([...slides, { header: "", bullets: [""] }]);
  };

  const removeSlide = (index: number) => {
    const updated = [...slides];
    updated.splice(index, 1);
    setSlides(updated);
  };

  /* -----------------------------
     Save handler
  ------------------------------*/

  const handleSave = async () => {
    if (!token) return;

    const payload = { title, slides };

    console.log("Saving slide deck:", payload);
    /*if (id) {
      await updateSlideDeck(id, payload, token);
    } else {
      await createSlideDeck(payload, token);
    }*/

    navigate("/slides");
  };

  /* -----------------------------
     UI Rendering
  ------------------------------*/

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {id ? "Edit Slide Deck" : "Create Slide Deck"}
      </Typography>

      <TextField
        fullWidth
        label="Presentation Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ mb: 3 }}
      />

      {slides.map((slide, slideIndex) => (
        <Card key={slideIndex} sx={{ mb: 3 }}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Slide {slideIndex + 1}</Typography>

              <IconButton onClick={() => removeSlide(slideIndex)}>
                <DeleteIcon />
              </IconButton>
            </Stack>

            <TextField
              fullWidth
              label="Slide Header"
              value={slide.header}
              onChange={(e) => updateSlideHeader(slideIndex, e.target.value)}
              sx={{ mt: 2 }}
            />

            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Bullet Points
            </Typography>

            {slide.bullets.map((bullet, bulletIndex) => (
              <Stack
                key={bulletIndex}
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mt: 1 }}
              >
                <TextField
                  fullWidth
                  value={bullet}
                  onChange={(e) =>
                    updateBullet(slideIndex, bulletIndex, e.target.value)
                  }
                />

                <IconButton
                  onClick={() => removeBullet(slideIndex, bulletIndex)}
                  disabled={slide.bullets.length === 1}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            ))}

            <Button
              color="inherit"              
              startIcon={<AddIcon />}
              onClick={() => addBullet(slideIndex)}
              sx={{ mt: 2 }}
            >
              Add Bullet
            </Button>
          </CardContent>
        </Card>
      ))}

      <Button
        variant="outlined"
        color="inherit"
        startIcon={<AddIcon />}
        onClick={addSlide}
        sx={{ mb: 3 }}
      >
        Add Slide
      </Button>

      <Button variant="contained" onClick={handleSave}>
        Save Presentation
      </Button>
    </Container>
  );
}
