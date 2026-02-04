import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, CircularProgress, TextField } from "@mui/material";

import SlideEditor from "../components/SlideEditor";
import { ISlideDeck } from "../types/Slides";
import { getSlideDeck, updateSlideDeck, createSlideDeck } from "../services/presentationService";
import { useAuth } from "../context/AuthContext";

export default function SlideEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const isNew = !id || id === "new";

  const [deck, setDeck] = useState<ISlideDeck | null>(null);
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      if (isNew) {
        setDeck({
          title: "Untitled Slide Deck",
          slides: [
            {
              header: "",
              bullets: [""]
            }
          ]
        });
        
        setLoading(false);
        return;
      }

      if (!token) return;

      try {
        const data = await getSlideDeck(id!, token);

        if (!data.slides) {
          data.slides = [{ header: "", bullets: [""] }];
        }

        setDeck(data);
        setTitle(data.title);
      } catch (err) {
        console.error("Failed to load slide deck", err);
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
      const payload = {
        title,
        slides: deck.slides
      };

      if (isNew) {
        const created = await createSlideDeck(payload, token);
        //navigate(`/slides/${created._id}/edit`);
      } else {
        await updateSlideDeck(id!, payload, token);
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
        {isNew ? "Create New Slide Deck" : "Edit Slide Deck"}
      </Typography>

      <TextField
        fullWidth
        label="Slide Deck Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ mb: 3 }}
      />

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
