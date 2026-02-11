import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Stack,
  Paper,
  IconButton,
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";

import { useDocument } from "../hooks/useDocument";
import PublicVisibilitySection from "../components/PublicVisibilitySection";
import {
  updateDocumentVisibility,
  downloadPdf,
} from "../services/documentService";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { Toast } from "../components/Toast";


export default function DocumentDetailsPage() {
  const [toastOpen, setToastOpen] = useState(false);
  const { t } = useTranslation();
  const { token, user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [sessionExpired, setSessionExpired] = useState(false);


  //const { doc, loading, error, refetch } = useDocument(id, token, () => { setToastOpen(true) });
  const { doc, loading, error, refetch } = useDocument(id, token, () => {
    setSessionExpired(true);
    setToastOpen(true);
  });

  console.log("Toeast open: after", toastOpen, "Document:", doc);

  /*useEffect(() => {
    if (!doc && !loading) {
      console.log("NAVIGATE tologin");
      navigate("/login");
    }
  }, [doc, loading]);*/

  /*
    if (!doc && !loading) {
      console.log("Document not found or loading failed RETURN NULL");
      return null;
    }
  */

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

 



  /*
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  async function go() {
    await sleep(5000);
    navigate("/");
    console.log("ready!!!");
  }
  
  go();
  
  */



  //  if (error || !doc) {
  
  //if (!toastOpen && (error)) { //|| !doc)) {
  if (!sessionExpired && (error || !doc)) {

    console.log("Error loading document:", error, "Session expired:", toastOpen, "Document:", !doc);
    return (
      <Container maxWidth="md">
        <Alert severity="error">{error || t("details.notFound")}</Alert>
        <Box mt={2}>
          <Button variant="outlined" onClick={() => navigate("/")}>
            {t("details.backToDocuments")}
          </Button>
        </Box>
      </Container>
    );
  }

  console.log("Toeast open: before", toastOpen);
  /*if (toastOpen) {

    //setTimeout(() => navigate("/"), 5000); // delay logout
    return (
      <Toast
        open={toastOpen}
        message="Session expired. Please log in again."
        severity="warning"
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
      />

    )
  }*/

  return (
    <Container maxWidth="md">
      {/* Top bar */}
      <Box
        sx={(theme) => ({
          width: "100%",
          borderBottom: 1,
          borderColor: "divider",
          backgroundColor: "background.paper",
          boxShadow:
            theme.palette.mode === "light"
              ? "0 1px 2px rgba(0,0,0,0.05)"
              : "0 1px 2px rgba(0,0,0,0.4)",
          mb: 2,
        })}
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
                aria-label={t("details.edit")}
                onClick={() => navigate(`/edit/${doc._id}`)}
                sx={{ border: 1, borderColor: "divider", borderRadius: 2 }}
              >
                <EditIcon />
              </IconButton>
            )}

            <IconButton
              onClick={handleDownload}
              disabled={!doc}
              aria-label={t("details.download")}
              sx={{ border: 1, borderColor: "divider", borderRadius: 2 }}
            >
              <DownloadIcon />
            </IconButton>
          </Stack>
        </Box>
      </Box>

      {/* Document content */}
      <Paper sx={{ p: 2 }}>
        <Box
          className="tiptap"
          sx={(theme) => ({
            fontSize: "1rem",
            lineHeight: 1.7,

            // Force ALL text inside to follow theme colors
            "&, & *": {
              color: `${theme.palette.text.primary} !important`,
            },

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
              borderLeft: "4px solid",
              borderColor: theme.palette.primary.light,
              paddingLeft: "16px",
              margin: "16px 0",
              fontStyle: "italic",
            },

            "& pre": {
              background: theme.palette.background.default,
              padding: "12px",
              borderRadius: "6px",
              overflowX: "auto",
              marginBottom: "16px",
            },
          })}
          dangerouslySetInnerHTML={{ __html: doc?.content ?? "" }}
        />
      </Paper>

      <PublicVisibilitySection
        isOwner={isOwner}
        isPublic={doc.isPublic}
        documentId={doc._id}
        docTitle={doc.title}
        onTogglePublic={handleTogglePublic}
      />

      <Toast
        open={toastOpen}
        message="Session expired. Please log in again."
        severity="warning"
        autoHideDuration={3000}
        onClose={() => {
          setToastOpen(false);
          logout();          // now safe
          navigate("/login"); // now safe
        }}
      />


    </Container>
  );
}

