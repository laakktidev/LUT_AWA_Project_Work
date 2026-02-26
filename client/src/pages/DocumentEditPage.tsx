import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DocumentEditor } from "../components/DocumentEditor";
import { updateDocument, uploadDocumentImage } from "../services/documentService";
import { useAuth } from "../context/AuthContext";

import {
  Box,
  Button,
  IconButton,
  TextField,
  Alert,
  CircularProgress
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTranslation } from "react-i18next";

import { isTokenExpired } from "../utils/isTokenExpired";
import { Toast } from "../components/Toast";
import PageContainer from "../layout/PageContainer";
import { lockDocument, unlockDocument } from "../services/lockingService";
import { useDocument } from "../hooks/useDocument";

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
 * DocumentEditPage
 *
 * Page for editing an existing document.  
 * Handles:
 * - loading the document
 * - locking for exclusive editing
 * - editing title and content
 * - uploading embedded images
 * - saving changes
 * - session expiration
 *
 * @returns JSX element for editing a document.
 */
export function DocumentEditPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, logout, user } = useAuth();

  /** Document title being edited. */
  const [title, setTitle] = useState("");

  /** Document content (HTML) being edited. */
  const [content, setContent] = useState("");

  /** Images added to the editor that still need to be uploaded. */
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);

  /** Whether the user has acquired the edit lock. */
  const [canEditLock, setCanEditLock] = useState(false);

  // -----------------------------
  // SESSION EXPIRED HANDLING
  // -----------------------------

  
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

  const { doc, loading, error } = useDocument(id!, token);

  // -----------------------------
  // PERMISSION CHECK
  // -----------------------------

  if (!user) {
    return <Alert severity="warning">You must be logged in.</Alert>;
  }

  const isOwner = doc && user.id === doc.userId;
  const isEditor = doc && doc.editors?.includes(user.id);
  const hasEditPermission = isOwner || isEditor;

  // -----------------------------
  // LOCKING LOGIC
  // -----------------------------

  /**
   * Attempts to lock the document for exclusive editing.
   *
   * @remarks
   * - Runs when the document or token changes.
   * - Unlocks automatically on cleanup.
   */
  useEffect(() => {
    if (!doc || !token || !hasEditPermission) return;

    const docId = doc._id;
    const _token = token;
    let mounted = true;

    /**
     * Initializes the lock request.
     *
     * @returns Promise resolving when lock attempt completes.
     */
    async function init(): Promise<void> {
      try {
        await lockDocument(docId, _token);
        if (mounted) setCanEditLock(true);
      } catch {
        if (mounted) setCanEditLock(false);
      }
    }

    init();

    return () => {
      mounted = false;
      if (token && doc) unlockDocument(doc._id, token);
    };
  }, [doc?._id, token, hasEditPermission]);

  // -----------------------------
  // INITIALIZE TITLE + CONTENT
  // -----------------------------

  /**
   * Loads the document title and content into local state.
   *
   * @returns void
   */
  useEffect(() => {
    if (!doc) return;

    setTitle(doc.title || "");
    setContent(doc.content || "");
  }, [doc?._id]);

  // -----------------------------
  // LOCK BLOCK
  // -----------------------------

  if (!canEditLock) {
    return (
      <PageContainer>
        <Toast
          open={!canEditLock}
          message="This document is currently locked by another user."
          severity="warning"
          autoHideDuration={3000}
          onClose={() => navigate(`/view/${doc?._id}`)}
        />
      </PageContainer>
    );
  }

  // -----------------------------
  // LOADING / ERROR
  // -----------------------------

  if (!token) {
    return <Alert severity="warning">You must be logged in.</Alert>;
  }

  if (loading) {
    return <CircularProgress />;
  }

  if (error || !doc) {
    return <Alert severity="error">{error || "Document not found"}</Alert>;
  }

  // -----------------------------
  // IMAGE HANDLING
  // -----------------------------

  /**
   * Adds a new image to the list of pending uploads.
   *
   * @param localUrl - Temporary blob URL used inside the editor.
   * @param file - The image file selected by the user.
   * @returns void
   */
  function handleImageAdd(localUrl: string, file: File): void {
    setPendingImages((prev) => [...prev, { localUrl, file }]);
  }

  // -----------------------------
  // SAVE DOCUMENT
  // -----------------------------

  /**
   * Saves the updated document.
   *
   * @remarks
   * - Uploads pending images
   * - Replaces temporary URLs
   * - Sends updated title + content to backend
   * - Navigates back to document view
   *
   * @returns Promise resolving when save completes.
   */
  async function handleSave(): Promise<void> {
    if (!id || !token) return;

    let finalContent = content;

    for (const { localUrl, file } of pendingImages) {
      const uploadedUrl = await uploadDocumentImage(id, file, token);
      finalContent = finalContent.replaceAll(localUrl, uploadedUrl);
    }

    await updateDocument(id, { title, content: finalContent }, token);

    navigate(`/documents/${id}`);
  }

  // -----------------------------
  // RENDER
  // -----------------------------

  return (
    <PageContainer>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          backgroundColor: "background.paper",
          paddingTop: "12px",
          paddingBottom: "12px",
          mb: 2
        }}
      >
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>

        <TextField
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t("edit.titlePlaceholder")}
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
          {t("edit.save")}
        </Button>
      </Box>

      {content && (
        <Box p={1}>
          <DocumentEditor
            value={content}
            onChange={setContent}
            onImageAdd={handleImageAdd}
          />
        </Box>
      )}
    </PageContainer>
  );
}
