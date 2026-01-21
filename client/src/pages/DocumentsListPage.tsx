import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Stack,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
//import RestoreFromTrashOutlinedIcon from '@mui/icons-material/RestoreFromTrashOutlined';

import { useDocuments } from "../hooks/useDocuments";
import { getUsers } from "../services/userService";
import { softDeleteDocument, shareDocument, getTrashCount, cloneDocument } from "../services/documentService";
import { ShareDialog } from "../components/ShareDialog";
import { User } from "../types/User";
import { Document } from "../types/Document";
import { useAuth } from "../context/AuthContext";

export default function DocumentsListPage() {
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const { documents, loading, error, refetch } = useDocuments(token);

  const [shareOpen, setShareOpen] = useState(false);
  const [docId, setDocId] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [trashCount, setTrashCount] = useState(0);


  const [sortBy, setSortBy] = useState<
    "name-asc" | "name-desc" |
    "created-asc" | "created-desc" |
    "updated-asc" | "updated-desc"
  >("updated-desc");


  async function refreshTrashCount() {
    if (!token) return;
    const count = await getTrashCount(token);
    setTrashCount(count);
  }


  useEffect(() => {
    refreshTrashCount();
  }, [token]);



  async function handleShareDocument(selectedUserIds: string[]) {
    if (!token) return;
    await shareDocument(docId, selectedUserIds, token);
    refetch();
  }

  async function openShareSelection(doc: Document) {
    if (!token) return;

    const allUsers = await getUsers(token);
    const filteredUsers = allUsers.filter(
      (u) => u.id !== doc.userId && !doc.editors.includes(u.id)
    );

    setDocId(doc._id);
    setUsers(filteredUsers);
    setShareOpen(true);
  }

  // tätä tullaan jatkossa kutsumaan trashPagelta nyt testataan soft-deleteä
  async function handleDelete(id: string) {
    if (!token) return;
    //await deleteDocument(id, token);
    await softDeleteDocument(id, token);
    await refetch();
    await refreshTrashCount();

  }

  async function handleClone(id: string) {
    if (!token) return;

    await cloneDocument(id, token);
    await refetch();

  }

  // POIS SIIRRÄ trashPagelle
  /*async function handleRestore(id: string) {
    if (!token) return;
    //await deleteDocument(id, token);
    await restoreDocument(id, token);

   // refetch();
  }*/


  if (!token) {
    return (
      <Container maxWidth="md">
        <Alert severity="warning">You must be logged in to view documents.</Alert>
        <Box mt={2}>
          <Button variant="contained" onClick={() => navigate("/login")}>
            Go to Login
          </Button>
        </Box>
      </Container>
    );
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

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const sortedDocs = [...documents].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.title.localeCompare(b.title);
      case "name-desc":
        return b.title.localeCompare(a.title);

      case "created-asc":
        return new Date(a.createdAt as string).getTime() - new Date(b.createdAt as string).getTime();
      case "created-desc":
        return new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime();

      case "updated-asc":
        return new Date(a.updatedAt as string).getTime() - new Date(b.updatedAt as string).getTime();
      case "updated-desc":
        return new Date(b.updatedAt as string).getTime() - new Date(a.updatedAt as string).getTime();

      default:
        return 0;
    }
  });

  return (
    <Container maxWidth="md">
      <ShareDialog
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        users={users}
        onShare={(selectedUserIds) => {
          setShareOpen(false);
          handleShareDocument(selectedUserIds);
        }}
      />

      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">My Documents</Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{
              padding: "6px 10px",
              borderRadius: 6,
              border: "1px solid #ccc",
              fontSize: "0.9rem",
            }}
          >
            <option value="name-asc">Name (A → Z)</option>
            <option value="name-desc">Name (Z → A)</option>
            <option value="created-desc">Created (newest first)</option>
            <option value="created-asc">Created (oldest first)</option>
            <option value="updated-desc">Last edited (newest first)</option>
            <option value="updated-asc">Last edited (oldest first)</option>
          </select>

          <Button variant="contained" onClick={() => navigate("/create")}>
            New Document
          </Button>

          {trashCount > 0 && (
            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={() => navigate("/trash")}
            >
              Trash
            </Button>
          )}
        </Stack>
      </Stack>

      {sortedDocs.length === 0 ? (
        <Alert severity="info">No documents yet. Create your first one!</Alert>
      ) : (
        <Stack spacing={2}>
          {sortedDocs.map((doc) => {
            const isOwner = user?.id === doc.userId;

            return (
              <Paper
                key={doc._id}
                sx={{
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/view/${doc._id}`)}
              >
                <Box>
                  <Typography variant="h6">{doc.title}</Typography>

                  <Typography variant="body2" color="text.secondary">
                    Last edited: {new Date(doc.updatedAt).toLocaleString()}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Created: {new Date(doc.createdAt).toLocaleString()}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton
                    disabled={!isOwner}
                    onClick={(e) => {
                      e.stopPropagation();
                      openShareSelection(doc);
                    }}
                  >
                    <ShareIcon />
                  </IconButton>

                  <IconButton
                    disabled={!isOwner}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClone(doc._id);
                    }}
                  >
                    <FileCopyOutlinedIcon />
                  </IconButton>

                  <IconButton
                    disabled={!isOwner}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(doc._id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>

                </Box>
              </Paper>
            );
          })}
        </Stack>
      )}
    </Container>
  );
}
