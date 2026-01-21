import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Stack,
  Paper
} from "@mui/material";

import { useDocument } from "../hooks/useDocument";
import PublicVisibilitySection from "../components/PublicVisibilitySection";
import { updateDocumentVisibility } from "../services/documentService";
import { useAuth } from "../context/AuthContext";

export default function DocumentDetailsPage() {
  const { token, user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { doc, loading, error, refetch } = useDocument(id, token);

  const isOwner = user?.id === doc?.userId;
  const isEditor = doc?.editors?.includes(user?.id as string);
  const canEdit = isOwner || isEditor;

  const handleTogglePublic = async (value: boolean) => {
    if (!token) return;
    await updateDocumentVisibility(id!, value, token);
    await refetch();
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !doc) {
    return (
      <Container maxWidth="md">
        <Alert severity="error">{error || "Document not found"}</Alert>
        <Box mt={2}>
          <Button variant="outlined" onClick={() => navigate("/")}>
            Back to documents
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4">{doc.title}</Typography>

        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={() => navigate("/")}>
            Back to list
          </Button>

          {canEdit && (
            <Button
              variant="contained"
              onClick={() => navigate(`/edit/${doc._id}`)}
            >
              Edit
            </Button>
          )}

          {isOwner && (
            <>
              <Button variant="outlined" color="primary">
                Rename
              </Button>
              <Button variant="outlined" color="secondary">
                Share
              </Button>
            </>
          )}
        </Stack>
      </Stack>

      <Paper sx={{ p: 2 }}>
        <Typography
          variant="body1"
          sx={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}
        >
          {doc.content}
        </Typography>
      </Paper>

      <PublicVisibilitySection
        isOwner={isOwner}
        isPublic={doc.isPublic}
        documentId={doc._id}
        onTogglePublic={handleTogglePublic}
      />
    </Container>
  );
}
