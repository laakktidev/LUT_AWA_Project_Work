import { useNavigate } from "react-router-dom";
import { useState } from "react";
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

import { useDocuments } from "../hooks/useDocuments";
import { getUsers } from "../services/userService";
import { deleteDocument } from "../services/documentService";
import { ShareDialog } from "../components/ShareDialog";
import { shareDocument } from "../services/documentService";
import { User } from "../types/User";
import { Document } from "../types/Document";

// tämä typesiin ehkä nimi pitää muuttaa 
interface DocumentsListPageProps {
  token: string | null;
  userId: string | null;
}

export default function DocumentsListPage({ token, userId }: DocumentsListPageProps) {
//export default function DocumentsListPage({ token, userId }) {
  const navigate = useNavigate();

  const { documents, loading, error, refetch } = useDocuments(token);

  const [shareOpen, setShareOpen] = useState(false);
  
  
  // vois olla selectedDocId
  const [docId, setDocId] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  
  async function handleShareDocument(selectedUserIds: string[]) {
    // Implement share functionality here
    //console.log("document ",docId);
    //console.log("Sharing document with users:", selectedUserIds);
    const response=await shareDocument(docId, selectedUserIds, token as string);
    console.log("Sharing document ",response.message);
    refetch();
  }

  async function openShareSelection(doc:Document) {

    if (!token) 
       return;
    
    const users: User[] = await getUsers(token);
    
    console.log("All users:", users);
    console.log("Document to share:", doc);
    console.log("Document to share:", doc.editors);

    
    // suodatetaan omistaja ja jo editorit pois
    const filteredUsers = users.filter(
      (u) => {
        //console.log(doc.editors.includes(u.id));
        //console.log(u.id," == ",doc.userId," - ", u.email);
        return (u.id !== doc.userId &&
        !doc.editors.includes(u.id))
      }
    );
    console.log("Filtered users for sharing:", filteredUsers);

    setDocId(doc._id);
    setUsers(filteredUsers);
    setShareOpen(true);

  }

  async function handleDelete(id: string) {
    // Implement delete functionality here
    //console.log("Delete document with id:", id);
    if (!token) 
      return;
    
    const ret = await deleteDocument(id, token);
    console.log("Deleted document with id:", id, ret);
    refetch();
  }

   console.log(documents);

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
        <Typography variant="h4">Your Documents</Typography>

        <Button
          variant="contained"
          onClick={() => navigate("/create")}
        >
          New Document
        </Button>
      </Stack>

      {documents.length === 0 ? (
        <Alert severity="info">No documents yet. Create your first one!</Alert>
      ) : (
        <Stack spacing={2}>
          {documents.map((doc) => (            
            <Paper
              key={doc._id}
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              onClick={() => navigate(`/view/${doc._id}`)}
            >
              {/* LEFT SIDE: Title + date */}
              <Box>
                <Typography variant="h6">{doc.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Last updated: {new Date(doc.updatedAt as string).toLocaleString()}
                </Typography>
              </Box>

              {/* RIGHT SIDE: Icons */}
              <Box sx={{ display: "flex", gap: 1 }}>
                
                <IconButton disabled={userId!==doc.userId} 
                  onClick={(e) => {
                    e.stopPropagation();
                    //console.log("share", doc._id);
                    openShareSelection(doc);
                  }}
                >
                  <ShareIcon />
                </IconButton>

                <IconButton disabled={userId!==doc.userId}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(doc._id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Paper>
          ))}

        </Stack>
      )}
    </Container>
  );
}
