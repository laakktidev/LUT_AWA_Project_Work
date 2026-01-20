//import { useState } from "react";
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


// tämä typesiin ehkä nimi pitää muuttaa
interface DocumentDetailPageProps {
  token: string | null;
  userId: string | null;
}

export default function DocumentDetailPage({ token, userId }: DocumentDetailPageProps) {

  //const [document, setDocument] = useState<Document | null>(null);


  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  //  const { doc, loading, error } = useDocument(id, token);
  const { doc, loading, error, refetch } = useDocument(id, token);


  console.log("isPublic: ", doc?.isPublic);

  // temporary: later we’ll derive this from auth + doc.ownerId/editors
  const canEdit = true;
  const isOwner = true;

  const handleTogglePublic = async (value: boolean) => {
    await updateDocumentVisibility(id!, value, token!);
    await refetch(); // refresh document after update
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
        isOwner={userId === doc.userId}
        isPublic={doc.isPublic}
        documentId={doc._id}
        onTogglePublic={handleTogglePublic}
      />

    </Container>

  );
}
