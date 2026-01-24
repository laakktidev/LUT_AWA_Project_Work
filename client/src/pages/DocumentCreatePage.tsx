import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDocument, uploadDocumentImage } from "../services/documentService";
import { useAuth } from "../context/AuthContext";

import {
  Container,
  Box,
  IconButton,
  TextField,
  Button
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { DocumentEditor } from "../components/DocumentEditor";

export default function DocumentCreatePage() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  async function handleImageUpload(file: File): Promise<string> {
    if (!token) throw new Error("Missing token");
    return uploadDocumentImage("new", file, token); 
  }

  async function handleCreate() {
    if (!token) return;

    const newDoc = await createDocument({ title, content }, token);
    navigate(`/documents/${newDoc.id}`);
  }

  return (
    <Container maxWidth="md">
      {/* Top bar */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          padding: "12px 0",
          marginBottom: "16px"
        }}
      >
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>

        <TextField
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Document title"
          variant="outlined"
          size="small"
          sx={{
            flexGrow: 1,
            mx: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              height: "48px",
              fontSize: "1.5rem",
              fontWeight: 600,
              paddingLeft: "12px",
              paddingRight: "12px",
            },
            "& input": {
              padding: 0,
            },
          }}
        />

        <Button
          variant="contained"
          onClick={handleCreate}
          disabled={!title.trim()}
        >
          Create
        </Button>
      </Box>

      {/* Editor */}
      <Box py={1}>
        <DocumentEditor
          value={content}
          onChange={setContent}
          onImageUpload={handleImageUpload}
        />
      </Box>
    </Container>
  );
}
