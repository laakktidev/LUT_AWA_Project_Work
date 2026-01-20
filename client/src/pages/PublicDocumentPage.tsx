import { useParams } from "react-router-dom";
import { useDocument } from "../hooks/useDocument";

import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Container
} from "@mui/material";

export default function PublicDocumentPage() {
  const { id } = useParams();
  const { doc, loading, error } = useDocument(id, null); // public: no token

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 6, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading public document…
        </Typography>
      </Container>
    );
  }

  if (error || !doc) {
    return (
      <Container maxWidth="md" sx={{ mt: 6 }}>
        <Alert severity="error">Document not found or not public.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {doc.title}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              whiteSpace: "pre-wrap",
              lineHeight: 1.6,
              mt: 2
            }}
          >
            {doc.content}
          </Typography>

          <Box sx={{ mt: 4, opacity: 0.6 }}>
            <Typography variant="caption">
              Public document — read‑only
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
