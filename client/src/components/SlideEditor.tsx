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

import { Presentation } from "../types/Presentation";
import { useTranslation } from "react-i18next";

interface SlideEditorProps {
  deck: Presentation;
  index: number;
  onIndexChange: (i: number) => void;
  onChange: (updated: Presentation) => void;
}

export default function SlideEditor({
  deck,
  index,
  onIndexChange,
  onChange,
}: SlideEditorProps) {
  const { t } = useTranslation();

  const nextSlide = () => {
    onIndexChange(Math.min(index + 1, deck.slides.length - 1));
  };

  const prevSlide = () => {
    onIndexChange(Math.max(index - 1, 0));
  };

  const updateTitle = (value: string) => {
    const updated = { ...deck };
    updated.slides[index].title = value;
    onChange(updated);
  };

  const updateBullet = (bulletIndex: number, value: string) => {
    const updated = { ...deck };
    updated.slides[index].bullets[bulletIndex] = value;
    onChange(updated);
  };

  const addBullet = () => {
    const updated = { ...deck };
    updated.slides[index].bullets.push("");
    onChange(updated);
  };

  const removeBullet = (bulletIndex: number) => {
    const updated = { ...deck };
    updated.slides[index].bullets.splice(bulletIndex, 1);
    onChange(updated);
  };

  const addSlide = () => {
    const updated = { ...deck };
    updated.slides.push({ title: "", bullets: [""] });
    onChange(updated);
    onIndexChange(updated.slides.length - 1);
  };

  const deleteSlide = () => {
    if (deck.slides.length === 1) return;

    const updated = { ...deck };
    updated.slides.splice(index, 1);
    onChange(updated);

    onIndexChange(Math.max(0, index - 1));
  };

  const slide = deck.slides[index];

  return (
    <Box sx={{ maxWidth: 700, margin: "0 auto", mt: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <IconButton onClick={prevSlide} disabled={index === 0}>
          <ArrowBackIosNewIcon />
        </IconButton>

        <Typography variant="h6">
          {t("presentations.editor.slideCounter", {
            current: index + 1,
            total: deck.slides.length,
          })}
        </Typography>

        <IconButton onClick={nextSlide} disabled={index === deck.slides.length - 1}>
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>

      <Slide in direction="left" mountOnEnter unmountOnExit>
        <Box key={index}>
          <TextField
            fullWidth
            label={t("presentations.editor.slideTitle")}
            value={slide.title}
            onChange={(e) => updateTitle(e.target.value)}
            sx={{ mb: 2 }}
          />

          {slide.bullets.map((b, i) => (
            <Box key={i} display="flex" alignItems="center" mb={1}>
              <TextField
                fullWidth
                label={t("presentations.editor.bulletLabel", { number: i + 1 })}
                value={b}
                onChange={(e) => updateBullet(i, e.target.value)}
              />
              <IconButton onClick={() => removeBullet(i)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}

          <Button
            color="inherit"
            startIcon={<AddIcon />}
            onClick={addBullet}
            sx={{ mt: 1 }}
          >
            {t("presentations.editor.addBullet")}
          </Button>
        </Box>
      </Slide>

      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={deleteSlide}
          disabled={deck.slides.length === 1}
        >
          {t("presentations.editor.deleteSlide")}
        </Button>

        <Button variant="contained" startIcon={<AddIcon />} onClick={addSlide}>
          {t("presentations.editor.addSlide")}
        </Button>
      </Box>
    </Box>
  );
}
