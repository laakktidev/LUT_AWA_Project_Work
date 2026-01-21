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
import RestoreIcon from "@mui/icons-material/Restore";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import { useAuth } from "../context/AuthContext";
import { getTrashDocuments, restoreDocument, deleteDocument } from "../services/documentService";
import { Document } from "../types/Document";

export default function TrashListPage() {
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
      setError("Failed to load trash");
    } finally {
      setLoading(false);
    }
  }

  async function handleRestore(id: string) {
    if (!token) return;
    await restoreDocument(id, token);
    loadTrash(); // refresh list
  }

  async function handlePermanentDelete(id: string) {
    if (!token) return;
    await deleteDocument(id, token);
    loadTrash(); // refresh list
  }

  useEffect(() => {
    loadTrash();
  }, [token]);

  if (!token) {
    return (
      <Container maxWidth="md">
        <Alert severity="warning">You must be logged in to view trash.</Alert>
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
        <Typography variant="h4">Trash</Typography>

        <Button variant="outlined" onClick={() => navigate("/")}>
          Back to Documents
        </Button>
      </Stack>

      {docs.length === 0 ? (
        <Alert severity="info">Trash is empty.</Alert>
      ) : (
        <Stack spacing={2}>
          {docs.map((doc) => (
            <Paper
              key={doc._id}
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="h6">{doc.title}</Typography>

                <Typography variant="body2" color="text.secondary">
                  Deleted: {new Date(doc.deletedAt!).toLocaleString()}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton onClick={() => handleRestore(doc._id)}>
                  <RestoreIcon />
                </IconButton>

                <IconButton onClick={() => handlePermanentDelete(doc._id)}>
                  <DeleteForeverIcon color="error" />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Stack>
      )}
    </Container>
  );
}
