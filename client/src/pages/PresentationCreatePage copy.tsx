import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, CircularProgress, TextField } from "@mui/material";

import SlideEditor from "../components/SlideEditor";
import { Presentation } from "../types/Presentation";
import {
  getPresentation,  
  createPresentation
} from "../services/presentationService";
import { useAuth } from "../context/AuthContext";

export default function PresentationCreatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const isNew = !id || id === "new";

  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      if (isNew) {
        setPresentation({
          title: "Untitled Presentation",
          slides: [
            {
              title: "",
              bullets: [""]
            }
          ]
        } as Presentation);

        setLoading(false);
        return;
      }

      if (!token) return;

      try {
        const data = await getPresentation(id!, token);

        if (!data.slides || data.slides.length === 0) {
          data.slides = [{ title: "", bullets: [""] }];
        }

        setPresentation(data);
        setTitle(data.title);
      } catch (err) {
        console.error("Failed to load presentation", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, token, isNew]);

  const handleSave = async () => {
    if (!presentation || !token) return;

    setSaving(true);
    try {
      const payload = {
        title,
        slides: presentation.slides
      };

      await createPresentation(payload, token);
      navigate("/presentations");

    } catch (err) {
      console.error("Failed to save presentation", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !presentation) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, margin: "0 auto", mt: 4 }}>
      <Typography variant="h4" mb={2}>
        {isNew ? "Create New Presentation" : "Edit Presentation"}
      </Typography>

      <TextField
        fullWidth
        label="Presentation Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ mb: 3 }}
      />

      <SlideEditor
        deck={presentation}
        onChange={(updated) => setPresentation({ ...updated })}
      />

      <Box display="flex" justifyContent="flex-end" mt={4}>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </Box>
    </Box>
  );
}
