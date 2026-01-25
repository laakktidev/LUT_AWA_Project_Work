import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DocumentEditor } from "../components/DocumentEditor";
import { getDocumentById, updateDocument, uploadDocumentImage } from "../services/documentService";
import { useAuth } from "../context/AuthContext";

import {
  Box,
  Button,
  Container,
  IconButton,
  TextField
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface PendingImage {
  localUrl: string;
  file: File;
}

export default function DocumentEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  // Store images added during editing
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);

  useEffect(() => {
    async function load() {
      if (!id || !token) return;

      const doc = await getDocumentById(id, token);
      setTitle(doc.title || "");
      setContent(doc.content || "");
      setLoading(false);
    }

    load();
  }, [id, token]);

  // Called by DocumentEditor when user inserts an image
  function handleImageAdd(localUrl: string, file: File) {
    setPendingImages((prev) => [...prev, { localUrl, file }]);
  }

  async function handleSave() {
    if (!id || !token) return;

    let finalContent = content;

    // 1. Upload all pending images and replace blob URLs
    for (const { localUrl, file } of pendingImages) {
      const uploadedUrl = await uploadDocumentImage(id, file, token);
      finalContent = finalContent.replaceAll(localUrl, uploadedUrl);
    }

    // 2. Save updated document
    await updateDocument(id, { title, content: finalContent }, token);

    navigate(`/documents/${id}`);
  }

  if (loading) return <div>Loading…</div>;

  return (
    <Container maxWidth="md">
      {/* Sticky top bar */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          backgroundColor: "white",
          paddingTop: "12px",
          paddingBottom: "12px",
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

        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </Box>

      {/* Editor */}
      <Box p={1}>
        <DocumentEditor
          value={content}
          onChange={setContent}
          onImageAdd={handleImageAdd}
        />
      </Box>
    </Container>
  );
}
