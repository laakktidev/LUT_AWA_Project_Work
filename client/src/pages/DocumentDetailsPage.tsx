import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Stack,
  Paper,
  IconButton,
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";

import { useDocument } from "../hooks/useDocument";
import PublicVisibilitySection from "../components/PublicVisibilitySection";
import {
  updateDocumentVisibility,
  downloadPdf,
} from "../services/documentService";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { Toast } from "../components/Toast";

import PageContainer from "../layout/PageContainer";

/**
 * Displays a single document, including:
 * - title
 * - HTML content
 * - visibility settings
 * - download button
 * - edit button (if user has permission)
 *
 * @remarks
 * This page handles:
 * - session expiration
 * - loading and error states
 * - permission checks (owner/editor)
 * - PDF download
 * - toggling public visibility
 *
 * @returns JSX element representing the document details page.
 */
export default function DocumentDetailsPage() {
  /** Whether the user's session has expired. */
  const [sessionExpired, setSessionExpired] = useState(false);

  const { t } = useTranslation();
  const { token, user, logout } = useAuth();

  // -----------------------------
  // PARAMS & NAVIGATION
  // -----------------------------

  /** Extracted document ID from the URL. */
  const params = useParams();
  const id = params.id as string;

  const navigate = useNavigate();

  // -----------------------------
  // DOCUMENT FETCHING
  // -----------------------------

  /**
   * Fetches the document and handles:
   * - loading state
   * - error state
   * - session expiration callback
   */
  const { doc, loading, error, refetch } = useDocument(id, token, () => {
    setSessionExpired(true);
  });

  // -----------------------------
  // SESSION EXPIRED OR NO TOKEN
  // -----------------------------

  /**
   * Blocks the page when the session is expired or token is missing.
   */
  if (sessionExpired || !token) {
    return (
      <PageContainer>
        <Toast
          open={sessionExpired}
          message="Session expired. Please log in again."
          severity="warning"
          autoHideDuration={3000}
          onClose={() => logout()}
        />
      </PageContainer>
    );
  }

  // -----------------------------
  // LOADING STATE
  // -----------------------------

  /**
   * Displays a loading spinner while the document is being fetched.
   */
  if (loading) {
    return (
      <PageContainer>
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  // -----------------------------
  // ERROR OR NOT FOUND
  // -----------------------------

  /**
   * Displays an error message if the document cannot be loaded.
   */
  if (error || !doc) {
    return (
      <PageContainer>
        <Alert severity="error">{error || t("details.notFound")}</Alert>
        <Box mt={2}>
          <Button variant="outlined" onClick={() => navigate("/")}>
            {t("details.backToDocuments")}
          </Button>
        </Box>
      </PageContainer>
    );
  }

  // -----------------------------
  // PERMISSION CHECKS
  // -----------------------------

  /** Whether the current user is the owner of the document. */
  const isOwner = user?.id === doc.userId;

  /** Whether the current user is listed as an editor. */
  const isEditor = doc.editors?.includes(user?.id as string);

  /** Whether the user can edit the document. */
  const canEdit = isOwner || isEditor;

  /**
   * Toggles the public visibility of the document.
   *
   * @param value - Whether the document should be public.
   * @returns Promise resolving when visibility is updated.
   */
  const handleTogglePublic = async (value: boolean) => {
    if (!token) return;
    await updateDocumentVisibility(id, value, token);
    await refetch();
  };

  /**
   * Downloads the document as a PDF file.
   *
   * @remarks
   * Creates a temporary blob URL and triggers a browser download.
   *
   * @returns Promise resolving when the download is triggered.
   */
  async function handleDownload() {
    if (!token || !doc) return;

    const blob = await downloadPdf(doc._id, token);
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.title}.pdf`;
    a.click();

    window.URL.revokeObjectURL(url);
  }

  // -----------------------------
  // NORMAL RENDER
  // -----------------------------

  return (
    <PageContainer>

      {/* Top bar */}
      <Box
        sx={(theme) => ({
          width: "100%",
          borderBottom: 1,
          borderColor: "divider",
          backgroundColor: "background.paper",
          boxShadow:
            theme.palette.mode === "light"
              ? "0 1px 2px rgba(0,0,0,0.05)"
              : "0 1px 2px rgba(0,0,0,0.4)",
          mb: 2,
        })}
      >
        <Box
          sx={{
            maxWidth: "100%",
            margin: "0 auto",
            padding: "12px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <IconButton onClick={() => navigate("/")}>
            <ArrowBackIcon />
          </IconButton>

          <Typography
            variant="h5"
            sx={{
              flexGrow: 1,
              mx: 2,
              fontWeight: 600,
              minWidth: 0,
              fontSize: { xs: "1.1rem", sm: "1.5rem" }
            }}
          >
            {doc.title}
          </Typography>

          <Stack direction="row" spacing={1}>
            {canEdit && (
              <IconButton
                aria-label={t("details.edit")}
                onClick={() => navigate(`/edit/${doc._id}`)}
                sx={{ border: 1, borderColor: "divider", borderRadius: 2 }}
              >
                <EditIcon />
              </IconButton>
            )}

            <IconButton
              onClick={handleDownload}
              aria-label={t("details.download")}
              sx={{ border: 1, borderColor: "divider", borderRadius: 2 }}
            >
              <DownloadIcon />
            </IconButton>
          </Stack>
        </Box>
      </Box>

      {/* Document content */}
      <Paper sx={{ p: 2 }}>
        <Box
          className="tiptap"
          sx={(theme) => ({
            fontSize: "1rem",
            lineHeight: 1.7,
            "&, & *": {
              color: `${theme.palette.text.primary} !important`,
            },
            "& img": {
              maxWidth: "100%",
              borderRadius: "6px",
              margin: "16px 0",
            },
            "& h1, & h2, & h3, & h4, & h5, & h6": {
              fontWeight: 600,
              marginTop: "24px",
              marginBottom: "12px",
            },
            "& p": {
              marginBottom: "16px",
            },
            "& ul, & ol": {
              paddingLeft: "24px",
              marginBottom: "16px",
            },
            "& blockquote": {
              borderLeft: "4px solid",
              borderColor: theme.palette.primary.light,
              paddingLeft: "16px",
              margin: "16px 0",
              fontStyle: "italic",
            },
            "& pre": {
              background: theme.palette.background.default,
              padding: "12px",
              borderRadius: "6px",
              overflowX: "auto",
              marginBottom: "16px",
            },
          })}
          dangerouslySetInnerHTML={{ __html: doc.content ?? "" }}
        />
      </Paper>

      <PublicVisibilitySection
        isOwner={isOwner}
        isPublic={doc.isPublic}
        documentId={doc._id}
        docTitle={doc.title}
        onTogglePublic={handleTogglePublic}
      />
    </PageContainer>
  );
}