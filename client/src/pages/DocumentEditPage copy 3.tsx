import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DocumentEditor } from "../components/DocumentEditor";
import { getDocumentById, updateDocument } from "../services/documentService";
import { useAuth } from "../context/AuthContext";
import { uploadDocumentImage } from "../services/documentService";

import {
    Box,
    Button,
    Container,
    IconButton,
    TextField
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
        onImageUpload={handleImageUpload}
      />
    </Box>
  </Container>
);

}
