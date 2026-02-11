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
import { useTranslation } from "react-i18next";

interface PendingImage {
  localUrl: string;
  file: File;
}

export default function DocumentCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);

  function handleImageAdd(localUrl: string, file: File) {
    setPendingImages((prev) => [...prev, { localUrl, file }]);
  }






  
  async function handleCreate() {
    if (!token) return;

    let finalContent = content;

    for (const { localUrl, file } of pendingImages) {
      const uploadedUrl = await uploadDocumentImage("new", file, token);
      finalContent = finalContent.replaceAll(localUrl, uploadedUrl);
    }

    const newDoc = await createDocument({ title, content: finalContent }, token);
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
          placeholder={t("create.titlePlaceholder")}
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
          {t("create.button")}
        </Button>
      </Box>

      {/* Editor */}
      <Box py={1}>
        <DocumentEditor
          value={content}
          onChange={setContent}
          onImageAdd={handleImageAdd}
        />
      </Box>
    </Container>
  );
}
