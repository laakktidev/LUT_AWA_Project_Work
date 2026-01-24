import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DocumentEditor } from "../components/DocumentEditor";
import { getDocumentById, updateDocument, uploadDocumentImage } from "../services/documentService";
import { useAuth } from "../context/AuthContext";

import {
  AppBar,
  Toolbar,
  IconButton,
  TextField,
  Button,
  Container,
  Box
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function DocumentEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

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

  async function handleImageUpload(file: File): Promise<string> {
    if (!id || !token) throw new Error("Missing id or token");
    return uploadDocumentImage(id, file, token);
  }

  async function handleSave() {
    if (!id || !token) return;

    await updateDocument(id, { title, content }, token);
    navigate(`/documents/${id}`);
  }

  if (loading) return <div>Loading…</div>;

  return (
    <>
      {/* Main AppBar already exists globally */}

      {/* ⭐ Editor AppBar (sub-header) */}
      <AppBar
  position="fixed"
  color="default"
  elevation={1}
  sx={{
    top: "64px",
    zIndex: (theme) => theme.zIndex.appBar - 1,
  }}
>
  <Container maxWidth="md">
    <Toolbar sx={{ gap: 2, paddingLeft: 0, paddingRight: 0 }}>
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
    </Toolbar>
  </Container>
</AppBar>


      {/* Push content below BOTH AppBars */}
      <Toolbar /> {/* main AppBar spacer */}
      <Toolbar /> {/* editor AppBar spacer */}

      <Container maxWidth="md">
        <Box py={3}>
          <DocumentEditor
            value={content}
            onChange={setContent}
            onImageUpload={handleImageUpload}
          />
        </Box>
      </Container>
    </>
  );
}
