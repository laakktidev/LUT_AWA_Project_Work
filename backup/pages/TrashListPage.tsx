import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
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

export default function TrashListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadTrash() {
    if (!token) return;
    try {
      setLoading(true);
      const data = await getTrashDocuments(token);
      setDocs(data);
    } catch (err: any) {
      setError(t("trash.loadError"));
    } finally {
      setLoading(false);
    }
  }

  async function handleRestore(id: string) {
    if (!token) return;
    await restoreDocument(id, token);
    loadTrash();
  }

  async function handlePermanentDelete(id: string) {
    if (!token) return;
    await deleteDocument(id, token);
    loadTrash();
  }

  async function handleEmptyTrash() {
    if (!token) return;

    const ok = window.confirm(t("trash.confirmEmpty"));
    if (!ok) return;

    await emptyTrash(token);
    loadTrash();
  }

  useEffect(() => {
    loadTrash();
  }, [token]);

  if (!token) {
    return (
      <Container maxWidth="md">
        <Alert severity="warning">{t("trash.mustLogin")}</Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
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
    </Container>
  );
}
