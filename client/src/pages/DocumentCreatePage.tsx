import { Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DocumentForm from "../components/DocumentForm";
import { createDocument } from "../services/documentService";

//tämä typesiin ehkä nimi pitää muuttaa
interface DocumentCreatePageProps {
  token: string | null;
}

export default function DocumentCreatePage({ token }: DocumentCreatePageProps) {
  const navigate = useNavigate();

  async function handleSubmit(data: { title: string; content: string }) {
    if (!token) {
      alert("You must be logged in to create a document");
      return;
    }

    try {
      const doc = await createDocument(data, token);
      navigate(`/view/${doc._id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create document");
    }
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Create New Document
      </Typography>

      <DocumentForm
        initialTitle=""
        initialContent=""
        headline="Create Document"
        submitLabel="Create"
        onSubmit={handleSubmit}
      />

    </Container>
  );
}
