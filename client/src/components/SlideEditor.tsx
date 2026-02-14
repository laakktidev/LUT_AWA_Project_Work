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
  /** The full presentation deck being edited. */
  deck: Presentation;

  /** Index of the currently active slide. */
  index: number;

  /** Fired when the active slide index changes. */
  onIndexChange: (i: number) => void;

  /** Fired whenever the deck is modified. */
  onChange: (updated: Presentation) => void;
}

/**
 * Editor for a single slide within a presentation.
 *
 * @remarks
 * This component supports:
 * - editing the slide title
 * - editing bullet points
 * - adding and removing bullets
 * - adding and removing slides
 * - navigating between slides
 *
 * The component itself does not store deck state; all mutations are delegated
 * upward via `onChange`, keeping the editor fully controlled by the parent.
 *
 * @param deck - The full presentation deck.
 * @param index - Index of the currently active slide.
 * @param onIndexChange - Callback fired when the active slide changes.
 * @param onChange - Callback fired when the deck is modified.
 *
 * @returns JSX element representing the slide editor.
 */
export default function SlideEditor({
  deck,
  index,
  onIndexChange,
  onChange,
}: SlideEditorProps) {
  const { t } = useTranslation();

  /** Moves to the next slide if available. */
  const nextSlide = () => {
    onIndexChange(Math.min(index + 1, deck.slides.length - 1));
  };

  /** Moves to the previous slide if available. */
  const prevSlide = () => {
    onIndexChange(Math.max(index - 1, 0));
  };

  /**
   * Updates the title of the current slide.
   *
   * @param value - New title text.
   */
  const updateTitle = (value: string) => {
    const updated = { ...deck };
    updated.slides[index].title = value;
    onChange(updated);
  };

  /**
   * Updates a specific bullet point.
   *
   * @param bulletIndex - Index of the bullet to update.
   * @param value - New bullet text.
   */
  const updateBullet = (bulletIndex: number, value: string) => {
    const updated = { ...deck };
    updated.slides[index].bullets[bulletIndex] = value;
    onChange(updated);
  };

  /** Adds a new empty bullet to the current slide. */
  const addBullet = () => {
    const updated = { ...deck };
    updated.slides[index].bullets.push("");
    onChange(updated);
  };

  /**
   * Removes a bullet from the current slide.
   *
   * @param bulletIndex - Index of the bullet to remove.
   */
  const removeBullet = (bulletIndex: number) => {
    const updated = { ...deck };
    updated.slides[index].bullets.splice(bulletIndex, 1);
    onChange(updated);
  };

  /** Adds a new slide and navigates to it. */
  const addSlide = () => {
    const updated = { ...deck };
    updated.slides.push({ title: "", bullets: [""] });
    onChange(updated);
    onIndexChange(updated.slides.length - 1);
  };

  /**
   * Deletes the current slide.
   *
   * @remarks
   * - Does nothing if there is only one slide.
   * - Navigates to the previous slide after deletion.
   */
  const deleteSlide = () => {
    if (deck.slides.length === 1) return;

    const updated = { ...deck };
    updated.slides.splice(index, 1);
    onChange(updated);

    onIndexChange(Math.max(0, index - 1));
  };

  /** The slide currently being edited. */
  const slide = deck.slides[index];

  return (
    <Box sx={{ maxWidth: 700, margin: "0 auto", mt: 3 }}>
      {/* Slide navigation */}
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

      {/* Slide content */}
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

      {/* Slide actions */}
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
