/*
import { useState } from "react";
import { Box, TextField, Button } from "@mui/material";

interface Props {
  onSubmit: (data: { title: string; content: string }) => void;
}

export default function DocumentForm({ onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  return (
    <Box display="flex" flexDirection="column" gap={2} maxWidth={600}>
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />

      <TextField
        label="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        fullWidth
        multiline
        minRows={6}
      />

      <Button
        variant="contained"
        onClick={() => onSubmit({ title, content })}
      >
        Create Document
      </Button>
    </Box>
  );
}
*/

import { useState } from "react";
import { Stack, TextField, Button, Typography } from "@mui/material";

interface DocumentFormProps {
  initialTitle: string;
  initialContent: string;
  headline: string;
  submitLabel: string;
  onSubmit: (values: { title: string; content: string }) => Promise<void> | void;
}

export default function DocumentForm({
  initialTitle,
  initialContent,
  headline,
  submitLabel,
  onSubmit
}: DocumentFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit({ title, content });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5" mb={2}>
        {headline}
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <TextField
          label="Content"
          fullWidth
          multiline
          minRows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <Button type="submit" variant="contained">
          {submitLabel}
        </Button>
      </Stack>
    </form>
  );
}
