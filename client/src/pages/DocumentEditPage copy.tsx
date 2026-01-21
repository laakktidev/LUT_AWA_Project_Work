import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDocument } from "../hooks/useDocument";
import { updateDocument } from "../services/documentService";
import {
  Container,
  Button,
  CircularProgress,
  Alert,
  Stack,
  Typography
} from "@mui/material";
import DocumentForm from "../components/DocumentForm";

import { lockDocument, unlockDocument } from "../services/lockingService";
import { useAuth } from "../context/AuthContext";

export default function DocumentEditPage() {
  const { token, user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [canEdit, setCanEdit] = useState(false);
  const [editError, setError] = useState<string | null>(null);

  const { doc, loading, error } = useDocument(id!, token);

  // -------------------------------
  // OWNER CHECK (Point D)
  // -------------------------------
  if (!loading && doc) {
    const isOwner = user?.id === doc.userId;
    if (!isOwner) {
      return (
        <Container maxWidth="md">
          <Alert severity="warning" sx={{ mt: 2 }}>
            You cannot edit this document.
          </Alert>
          <Button
            sx={{ mt: 2 }}
            variant="outlined"
            onClick={() => navigate(`/view/${doc._id}`)}
          >
            Back to document
          </Button>
        </Container>
      );
    }
  }

  // -------------------------------
  // LOCKING LOGIC
  // -------------------------------
  useEffect(() => {
    if (!doc || !token) return;

    let mounted = true;

    async function init() {
      try {
        await lockDocument(doc._id, token);
        if (mounted) setCanEdit(true);
      } catch (err: any) {
        if (mounted) {
          setCanEdit(false);
          setError(err.message);
        }
      }
    }

    init();

    return () => {
      mounted = false;
      if (token) unlockDocument(doc._id, token);
    };
  }, [doc?._id, token]);

  if (!token) {
    return <Alert severity="warning">You must be logged in.</Alert>;
  }

  if (loading) {
    return <CircularProgress />;
  }

  if (error || !doc) {
    return <Alert severity="error">{error || "Document not found"}</Alert>;
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" mb={3}>Edit Document</Typography>

      <Stack direction="row" spacing={2} mb={2}>
        <Button variant="outlined" onClick={() => navigate("/")}>Back to list</Button>
        <Button variant="outlined" color="secondary" onClick={() => navigate(`/view/${id}`)}>Cancel</Button>
      </Stack>

      {!canEdit && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          {editError || "You cannot edit this document right now."}
        </Alert>
      )}

      {canEdit && (
        <DocumentForm
          initialTitle={doc.title}
          initialContent={doc.content}
          headline="Edit Document"
          submitLabel="Save Changes"
          onSubmit={async (values) => {
            await updateDocument(id!, values, token);
            navigate(`/view/${id}`);
          }}
        />
      )}
    </Container>
  );
}
