import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Stack,
  IconButton,
} from "@mui/material";

import RestoreFromTrashOutlinedIcon from '@mui/icons-material/RestoreFromTrashOutlined';
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useAuth } from "../context/AuthContext";
import {
  getTrashDocuments,
  restoreDocument,
  deleteDocument,
  emptyTrash
} from "../services/documentService";

import { Document } from "../types/Document";
import { useTranslation } from "react-i18next";
import PageContainer from "../layout/PageContainer";

/**
 * Displays the list of documents currently in the user's trash.
 *
 * @remarks
 * This page allows the user to:
 * - view all soft‑deleted documents
 * - restore individual documents
 * - permanently delete individual documents
 * - empty the entire trash
 *
 * It also handles:
 * - loading and error states
 * - authentication requirements
 *
 * @returns JSX element representing the trash list page.
 */
export function TrashListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token } = useAuth();

  /** List of trashed documents. */
  const [docs, setDocs] = useState<Document[]>([]);

  /** Whether the trash list is currently loading. */
  const [loading, setLoading] = useState(true);

  /** Error message, if any. */
  const [error, setError] = useState("");

  /**
   * Loads all documents currently in the trash.
   *
   * @returns Promise resolving when the trash list is loaded.
   */
  async function loadTrash() {
    if (!token) return;
    try {
      setLoading(true);
      const data = await getTrashDocuments(token);
      setDocs(data);
    } catch {
      setError(t("trash.loadError"));
    } finally {
      setLoading(false);
    }
  }

  /**
   * Restores a document from the trash.
   *
   * @param id - Document ID.
   * @returns Promise resolving when the document is restored.
   */
  async function handleRestore(id: string) {
    if (!token) return;
    await restoreDocument(id, token);
    loadTrash();
  }

  /**
   * Permanently deletes a document.
   *
   * @param id - Document ID.
   * @returns Promise resolving when the document is deleted.
   */
  async function handlePermanentDelete(id: string) {
    if (!token) return;
    await deleteDocument(id, token);
    loadTrash();
  }

  /**
   * Empties the entire trash after user confirmation.
   *
   * @returns Promise resolving when the trash is emptied.
   */
  async function handleEmptyTrash() {
    if (!token) return;

    const ok = window.confirm(t("trash.confirmEmpty"));
    if (!ok) return;

    await emptyTrash(token);
    loadTrash();
  }

  /**
   * Loads trash contents when the token becomes available.
   */
  useEffect(() => {
    loadTrash();
  }, [token]);

  // -----------------------------
  // MUST LOGIN
  // -----------------------------

  /**
   * Blocks the page if the user is not authenticated.
   */
  if (!token) {
    return (
      <PageContainer>
        <Alert severity="warning">{t("trash.mustLogin")}</Alert>
      </PageContainer>
    );
  }

  // -----------------------------
  // LOADING
  // -----------------------------

  /**
   * Displays a loading spinner while trash contents are being fetched.
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
  // ERROR
  // -----------------------------

  /**
   * Displays an error message if trash contents cannot be loaded.
   */
  if (error) {
    return (
      <PageContainer>
        <Alert severity="error">{error}</Alert>
      </PageContainer>
    );
  }

  // -----------------------------
  // NORMAL RENDER
  // -----------------------------

  return (
    <PageContainer>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h4">{t("trash.title")}</Typography>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            color="error"
            startIcon={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <DeleteForeverIcon sx={{ color: "text.secondary", fontSize: 30 }} />
              </Box>
            }
            onClick={handleEmptyTrash}
          >
            {t("trash.empty")}
          </Button>
        </Stack>
      </Stack>

      {docs.length === 0 ? (
        <Alert severity="info">{t("trash.emptyMessage")}</Alert>
      ) : (
        <Stack spacing={2}>
          {docs.map((doc) => (
            <Paper
              key={doc._id}
              sx={{
                p: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="h6">{doc.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("trash.deleted")}: {new Date(doc.deletedAt!).toLocaleString()}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton onClick={() => handleRestore(doc._id)}>
                  <RestoreFromTrashOutlinedIcon sx={{ color: "text.secondary", fontSize: 28 }} />
                </IconButton>

                <IconButton onClick={() => handlePermanentDelete(doc._id)}>
                  <DeleteForeverIcon color="error" sx={{ color: "text.secondary", fontSize: 28 }} />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Stack>
      )}
    </PageContainer>
  );
}
