import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Stack,
  Paper,
  IconButton
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";

import { useDocument } from "../hooks/useDocument";
import PublicVisibilitySection from "../components/PublicVisibilitySection";
import { updateDocumentVisibility, downloadPdf } from "../services/documentService";
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

  async function handleDownload() {

    if (!token || !doc) return;

    const blob = await downloadPdf(doc._id, token);
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.title}.pdf`;
    a.click();

    window.URL.revokeObjectURL(url);
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

        {/* Full-width top bar */}
        <Box
          sx={{
            width: "100%",
            borderBottom: "1px solid #e0e0e0",
            backgroundColor: "#f5f7fa", 
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            mb: 2,
          }}
        >
          <Box
            sx={{
              maxWidth: "md",
              margin: "0 auto",
              padding: "12px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Back arrow */}
            <IconButton onClick={() => navigate("/")}>
              <ArrowBackIcon />
            </IconButton>

            {/* Title */}
            <Typography
              variant="h5"
              sx={{ flexGrow: 1, mx: 2, fontWeight: 600 }}
            >
              {doc.title}
            </Typography>

            {/* Right side actions */}
            <Stack direction="row" spacing={1}>
              {canEdit && (
                <IconButton
                  aria-label="Edit" 
                  onClick={() => navigate(`/edit/${doc._id}`)}
                  sx={{ border: "1px solid #ccc", borderRadius: 2 }}
                >
                  <EditIcon />
                </IconButton>
              )}

              <IconButton
                onClick={handleDownload}
                disabled={!doc}
                sx={{ border: "1px solid #ccc", borderRadius: 2 }}
              >
                <DownloadIcon />
              </IconButton>
            </Stack>
          </Box>
        </Box>

      </Stack>

      <Paper sx={{ p: 2 }}>
        <Box 
          className="tiptap"
          sx={{
            fontSize: "1rem",
            lineHeight: 1.7,
            color: "#333",

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
