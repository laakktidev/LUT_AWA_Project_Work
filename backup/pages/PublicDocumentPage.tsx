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

import { useTranslation } from "react-i18next";

export default function PublicDocumentPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { doc, loading, error } = useDocument(id, null); // public: no token

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 6, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          {t("public.loading")}
        </Typography>
      </Container>
    );
  }

  if (error || !doc) {
    return (
      <Container maxWidth="md" sx={{ mt: 6 }}>
        <Alert severity="error">{t("public.notFound")}</Alert>
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

          {/* Render Tiptap HTML content */}
          <Box
            className="tiptap"
            sx={{
              fontSize: "1rem",
              lineHeight: 1.7,
              color: "#333",
              mt: 2,
              "& img": {
                maxWidth: "100%",
                borderRadius: "6px",
                margin: "16px 0",
              },
              "& h1, & h2, & h3, & h4, & h5, & h6": {
                fontWeight: 600,
                marginTop: "24px",
                marginBottom: "12px",
              },
              "& p": {
                marginBottom: "16px",
              },
              "& ul, & ol": {
                paddingLeft: "24px",
                marginBottom: "16px",
              },
              "& blockquote": {
                borderLeft: "4px solid #90caf9",
                paddingLeft: "16px",
                margin: "16px 0",
                color: "#555",
                fontStyle: "italic",
              },
              "& pre": {
                background: "#f4f4f4",
                padding: "12px",
                borderRadius: "6px",
                overflowX: "auto",
                marginBottom: "16px",
              }
            }}
            dangerouslySetInnerHTML={{ __html: doc.content }}
          />

          <Box sx={{ mt: 4, opacity: 0.6 }}>
            <Typography variant="caption">
              {t("public.readOnly")}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
