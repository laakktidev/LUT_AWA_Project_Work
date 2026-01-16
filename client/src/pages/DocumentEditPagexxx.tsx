import { useParams, useNavigate } from "react-router-dom";
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

export default function DocumentEditPage({ token }: { token: string | null }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { doc, loading, error } = useDocument(id!, token);

  if (!token) {
    return <Alert severity="warning">You must be logged in.</Alert>;
  }

  if (loading) {
    return <CircularProgress />;
  }

  if (error || !doc) {
    return <Alert severity="error">{error || "Document not found"}</Alert>;
  }

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

      <DocumentForm
        initialTitle={doc.title}
        initialContent={doc.content}
        headline="Edit Document"
        submitLabel="Save Changes"
        onSubmit={handleSubmit}
      />
    </Container>
  );
}
