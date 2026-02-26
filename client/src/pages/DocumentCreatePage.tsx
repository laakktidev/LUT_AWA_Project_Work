import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDocument, uploadDocumentImage } from "../services/documentService";
import { useAuth } from "../context/AuthContext";

import {
  Box,
  IconButton,
  TextField,
  Button
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { DocumentEditor } from "../components/DocumentEditor";
import { useTranslation } from "react-i18next";

import { isTokenExpired } from "../utils/isTokenExpired";
import { Toast } from "../components/Toast";
import PageContainer from "../layout/PageContainer";

/**
 * Represents an image inserted into the editor but not yet uploaded.
 */
interface PendingImage {
  /** Temporary blob URL used inside the editor. */
  localUrl: string;

  /** The actual image file selected by the user. */
  file: File;
}

/**
 * Page for creating a new document.
 *
 * @remarks
 * This page allows the user to:
 * - enter a title,
 * - write content,
 * - insert images,
 * - upload images,
 * - and save the final document.
 *
 * It also handles session expiration and prevents editing when the token is invalid.
 *
 * @returns JSX element representing the document creation page.
 */
export function DocumentCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  /** Title of the new document. */
  const [title, setTitle] = useState("");

  /** Raw editor content (may contain temporary image URLs). */
  const [content, setContent] = useState("");

  /** List of images inserted into the editor but not yet uploaded. */
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);

  // -----------------------------
  // SESSION EXPIRATION CHECK
  // -----------------------------

  /**
   * If the token exists but is expired, block the page and show a toast.
   */

  
  if (token) {
    const sessionExpired = isTokenExpired(token);

    if (sessionExpired) {
      return (
        <PageContainer>
          <Toast
            open={sessionExpired}
            message="Session expired. Please log in again."
            severity="warning"
            autoHideDuration={5000}
            onClose={() => logout()}
          />
        </PageContainer>
      );
    }
  }
   

  // -----------------------------
  // IMAGE HANDLING
  // -----------------------------

  /**
   * Adds a new image to the list of pending uploads.
   *
   * @param localUrl - Temporary blob URL used inside the editor.
   * @param file - The actual image file selected by the user.
   */
  function handleImageAdd(localUrl: string, file: File) {
    setPendingImages((prev) => [...prev, { localUrl, file }]);
  }

  // -----------------------------
  // DOCUMENT CREATION
  // -----------------------------

  /**
   * Creates a new document.
   *
   * @remarks
   * Steps:
   * 1. Upload all pending images.
   * 2. Replace temporary URLs with uploaded URLs.
   * 3. Send the final content to the backend.
   * 4. Navigate to the newly created document.
   *
   * @returns Promise resolving when the document is created and navigation occurs.
   */
  async function handleCreate() {
    if (!token) return;

    let finalContent = content;

    // Upload each pending image and replace its temporary URL
    for (const { localUrl, file } of pendingImages) {
      const uploadedUrl = await uploadDocumentImage("new", file, token);
      finalContent = finalContent.replaceAll(localUrl, uploadedUrl);
    }

    // Create the document
    const newDoc = await createDocument(
      { title, content: finalContent },
      token
    ) as any;

    // Navigate to the new document
    navigate(`/documents/${newDoc._id}`);
  }

  // -----------------------------
  // RENDER
  // -----------------------------

  return (
    <PageContainer>
      {/* Top bar */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ padding: "12px 0", marginBottom: "16px" }}
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
            "& input": { padding: 0 },
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
    </PageContainer>
  );
}
