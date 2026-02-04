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
  TextField,
  InputAdornment,
  Pagination,
  MenuItem
} from "@mui/material";

import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
//import DescriptionIcon from "@mui/icons-material/Description";
//import SlideshowIcon from "@mui/icons-material/Slideshow";
import SearchIcon from "@mui/icons-material/Search";

import { useDocuments } from "../hooks/useDocuments";
import { getUsers } from "../services/userService";
import {
  softDeleteDocument,
  shareDocument,
  getTrashCount,
  cloneDocument,
  searchDocuments
} from "../services/documentService";

import { ShareDialog } from "../components/ShareDialog";
import { User } from "../types/User";
import { Document } from "../types/Document";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

export default function DocumentsListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const { documents, loading, error, refetch } = useDocuments(token);

  const [shareOpen, setShareOpen] = useState(false);
  const [docId, setDocId] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [trashCount, setTrashCount] = useState(0);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Document[] | null>(null);

  const [sortBy, setSortBy] = useState<
    "name-asc" | "name-desc" |
    "created-asc" | "created-desc" |
    "updated-asc" | "updated-desc"
  >("updated-desc");

  const [page, setPage] = useState(1);
  const pageSize = 5;

  async function refreshTrashCount() {
    if (!token) return;
    const count = await getTrashCount(token);
    setTrashCount(count);
  }

  useEffect(() => {
    refreshTrashCount();
  }, [token]);

  useEffect(() => {
    if (!token) return;

    if (search.trim().length < 3) {
      setSearchResults(null);
      return;
    }

    const timeout = setTimeout(async () => {
      const data = await searchDocuments(search, token);
      setSearchResults(data);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, token]);

  useEffect(() => {
    setPage(1);
  }, [search, sortBy]);

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

  async function handleDelete(id: string) {
    if (!token) return;

    await softDeleteDocument(id, token);
    await refetch();
    await refreshTrashCount();
  }

  async function handleClone(id: string) {
    if (!token) return;

    await cloneDocument(id, token);
    await refetch();
  }

  if (!token) {
    return (
      <Container maxWidth="md">
        <Alert severity="warning">{t("documents.mustLogin")}</Alert>
        <Box mt={2}>
          <Button variant="contained" onClick={() => navigate("/login")}>
            {t("documents.goToLogin")}
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

  const docsToShow = searchResults ?? sortedDocs;

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedDocs = docsToShow.slice(start, end);

  return (
    <Container maxWidth="md" sx={{ pt: 0, pb: 0 }}>
      <ShareDialog
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        users={users}
        onShare={(selectedUserIds) => {
          setShareOpen(false);
          handleShareDocument(selectedUserIds);
        }}
      />

      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={600}>
          {t("documents.title")}
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          {/* Search */}
          <TextField
            size="small"
            placeholder={t("documents.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 220 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
              endAdornment: search.length > 0 && (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearch("")} edge="end">
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {/* Sort */}
          <TextField
            select
            size="small"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            sx={{ width: 180 }}
          >
            <MenuItem value="name-asc">{t("documents.sort.nameAsc")}</MenuItem>
            <MenuItem value="name-desc">{t("documents.sort.nameDesc")}</MenuItem>
            <MenuItem value="created-desc">{t("documents.sort.createdNew")}</MenuItem>
            <MenuItem value="created-asc">{t("documents.sort.createdOld")}</MenuItem>
            <MenuItem value="updated-desc">{t("documents.sort.updatedNew")}</MenuItem>
            <MenuItem value="updated-asc">{t("documents.sort.updatedOld")}</MenuItem>
          </TextField>

          {/* New Document */}
          <Button
            variant="outlined"
            color="success"
            startIcon={<NoteAddIcon />}
            onClick={() => navigate("/create")}
          >
            {t("documents.new")}
          </Button>
          
          {/* Trash */}
          {trashCount > 0 && (
            <Button
              variant="outlined"
              color="success"
              startIcon={<DeleteIcon />}
              onClick={() => navigate("/trash")}
            >
              {t("documents.trash")}
            </Button>
          )}
        </Stack>
      </Stack>

      {/* Document List */}
      {docsToShow.length === 0 ? (
        <Alert severity="info">{t("documents.empty")}</Alert>
      ) : (
        <>
          <Stack spacing={2}>
            {paginatedDocs.map((doc) => {
              const isOwner = user?.id === doc.userId;

              return (
                <Paper
                  key={doc._id}
                  elevation={1}
                  sx={{
                    p: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    borderRadius: 2,
                    transition: "0.2s",
                    "&:hover": {
                      boxShadow: 4,
                      transform: "translateY(-2px)"
                    }
                  }}
                  onClick={() => navigate(`/view/${doc._id}`)}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    {/*{doc.type === "presentation" ? (
                      <SlideshowIcon color="primary" />
                    ) : (
                      <DescriptionIcon color="primary" />
                    )}*/}

                    <Box>
                      <Typography variant="h6">{doc.title}</Typography>

                      <Typography variant="body2" color="text.secondary">
                        {t("documents.lastEdited")}:{" "}
                        {new Date(doc.updatedAt as string).toLocaleString()}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {t("documents.created")}:{" "}
                        {new Date(doc.createdAt as string).toLocaleString()}
                      </Typography>
                    </Box>
                  </Stack>

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
                      aria-label="Delete"
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

          {/* Pagination */}
          <Box mt={3} display="flex" justifyContent="center">
            <Pagination
              count={Math.ceil(docsToShow.length / pageSize)}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </Box>
        </>
      )}
    </Container>
  );
}
