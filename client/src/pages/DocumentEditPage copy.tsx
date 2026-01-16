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


export default function DocumentEditPage({ token }: { token: string | null }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { doc, loading, error } = useDocument(id!, token);
  const [canEdit, setCanEdit] = useState(false);
  const [editError, setError] = useState<string | null>(null);

  if (!token) {
    return <Alert severity="warning">You must be logged in.</Alert>;
  }

  if (loading) {
    return <CircularProgress />;
  }

  if (error || !doc) {
    return <Alert severity="error">{error || "Document not found"}</Alert>;
  }


  useEffect(() => {
    let mounted = true;

    async function init() {

      if (!doc) {
        return false;
      }

      try {
        await lockDocument(doc._id, token as string);
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
      unlockDocument(doc._id, token);
    };
  }, [doc._id]);



  async function handleSubmit(values: { title: string; content: string }) {
    await updateDocument(id!, values, token as string);
    navigate(`/view/${id}`);
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" mb={3}>Edit Document</Typography>

      <Stack direction="row" spacing={2} mb={2}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate("/")}
        >
          Back to list
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate(`/view/${id}`)}
        >
          Cancel
        </Button>
      </Stack>

      {/* 🔥 If editing is NOT allowed, show banner and STOP */}
      {/*
      {!canEdit && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          {editError || "You cannot edit this document right now."}
        </Alert>
      )}*/}

      {/* 🔥 Only render the editor when canEdit = true */}
      {/*{canEdit && (*/}
        <DocumentForm
          initialTitle={doc.title}
          initialContent={doc.content}
          headline="Edit Document"
          submitLabel="Save Changes"
          onSubmit={handleSubmit}
        />
      {/*})}*/}
    </Container>
  );

}


