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
 * Page for editing an existing document.
 *
 * @remarks
 * This page:
 * - loads the document from the server,
 * - allows editing of title and content,
 * - handles image uploads,
 * - saves updates back to the backend,
 * - and prevents editing if the session has expired.
 *
 * @returns JSX element representing the document editing page.
 */
export default function DocumentEditPage() {  
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, logout, user } = useAuth();
  

  /** Document title being edited. */
  const [title, setTitle] = useState("");

  /** Document content (HTML) being edited. */
  const [content, setContent] = useState("");

  /** Whether the document is still loading from the server. */
//  const [loading, setLoading] = useState(true);

  /** Images added to the editor that still need to be uploaded. */
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);

  const [canEditLock, setCanEditLock] = useState(false);
  
 // -----------------------------
  // SESSION EXPIRED HANDLING
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

// -------------------------------------------------------

 const { doc, loading, error } = useDocument(id!, token);

// PERMISSION CHECK (owner OR editor)
  // -------------------------------------------------------
  if (!user) return false;

  const isOwner = doc && user?.id === doc.userId;
  const isEditor = doc && doc.editors?.includes(user.id);
  const hasEditPermission = isOwner || isEditor;

  // -------------------------------------------------------
  // LOCKING LOGIC (only if user has permission)
  // -------------------------------------------------------
  
  
  useEffect(() => {
    if (!doc || !token || !hasEditPermission) return;

    let mounted = true;

    async function init() {
      if (!doc?._id || !token) return
      try {
        await lockDocument(doc?._id, token);
        if (mounted){ setCanEditLock(true);
        }
      } catch (err: any) {
        if (mounted) {
          setCanEditLock(false);
        }
      }
    }

    init();

    return () => {
      mounted = false;
      if (token && doc){ unlockDocument(doc._id, token);       
      }
    };
  }, [doc?._id, token, hasEditPermission]);
  

useEffect(() => {
  if (!doc) return;

  setTitle(doc.title || "");
  setContent(doc.content || "");  
}, [doc?._id]);


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



 if (!token) {
    return <Alert severity="warning">You must be logged in.</Alert>;
  }

  if (loading) {
    return <CircularProgress />;
  }

  if (error || !doc) {
    return <Alert severity="error">{error || "Document not found"}</Alert>;
  }

  

  /**
   * Adds a new image to the list of pending uploads.
   *
   * @param localUrl - Temporary blob URL used inside the editor.
   * @param file - The image file selected by the user.
   */
  function handleImageAdd(localUrl: string, file: File) {
    setPendingImages((prev) => [...prev, { localUrl, file }]);
  }

  /**
   * Saves the updated document.
   *
   * @remarks
   * Steps:
   * 1. Upload all pending images.
   * 2. Replace temporary URLs with uploaded URLs.
   * 3. Update the document on the server.
   * 4. Navigate back to the document details page.
   *
   * @returns Promise resolving when the document is saved and navigation occurs.
   */
  async function handleSave() {
    if (!id || !token) return;

    let finalContent = content;

    // Upload each pending image and replace its temporary URL
    for (const { localUrl, file } of pendingImages) {
      const uploadedUrl = await uploadDocumentImage(id, file, token);
      finalContent = finalContent.replaceAll(localUrl, uploadedUrl);
    }

    // Save the updated document
    await updateDocument(id, { title, content: finalContent }, token);

    // Navigate back to details page
    navigate(`/documents/${id}`);
  }

  // -----------------------------
  // LOADING STATE
  // -----------------------------

  /**
   * Displays a loading placeholder while the document is being fetched.
   */
  if (loading) {
    return <PageContainer>{t("edit.loading")}</PageContainer>;
  }

  // -----------------------------
  // NORMAL RENDER
  // -----------------------------

  return (
    <PageContainer>
      {/* Top bar */}
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

      {/* Editor */}
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
