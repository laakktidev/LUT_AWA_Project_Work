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
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import SearchIcon from "@mui/icons-material/Search";

import { usePresentations } from "../hooks/usePresentations";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

import { ShareDialog } from "../components/ShareDialog";
import { User } from "../types/User";

import {  
  deletePresentation,
  searchPresentations,
  sharePresentation
} from "../services/presentationService";

import { getUsers } from "../services/userService";

export default function PresentationsListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  //const [presentations, setPresentations] = useState<any[]>([]);
  //const [loading, setLoading] = useState(true);

  const [shareOpen, setShareOpen] = useState(false);
  const [presId, setPresId] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[] | null>(null);

  const [sortBy, setSortBy] = useState<
    "name-asc" | "name-desc" |
    "created-asc" | "created-desc" |
    "updated-asc" | "updated-desc"
  >("updated-desc");

  const [page, setPage] = useState(1);
  const pageSize = 5;


  const { presentations, loading, error, refetch } = usePresentations(token);


  /* -----------------------------
     Load Presentations
  ------------------------------*/
  /*  useEffect(() => {
      if (!token) return;
  
      getPresentations(token)
        .then(data => setPresentations(data))
        .finally(() => setLoading(false));
    }, [token]);*/

  /* -----------------------------
     Search (backend)
  ------------------------------*/

  useEffect(() => {
    if (!token) return;

    if (search.trim().length < 3) {
      setSearchResults(null);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const results = await searchPresentations(search, token);
        setSearchResults(results);
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, token]);

  useEffect(() => {
    setPage(1);
  }, [search, sortBy]);

  ////////////////////////////////////////

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" mt={4}>
        {error}
      </Typography>
    );
  }

  ////////////////////////////////////////  



  /* -----------------------------
     Share
  ------------------------------*/
  
async function handleShare(selectedUserIds: string[]) {
    if (!token) return;
    await sharePresentation(presId, selectedUserIds, token);
    refetch();
  }

  
  async function openShareSelection(pres: any) {
    if (!token) return;

    const allUsers = await getUsers(token);
    const filteredUsers = allUsers.filter(
      (u) => u.id !== pres.userId && !pres.editors.includes(u.id)
    );

    setPresId(pres._id);
    setUsers(filteredUsers);
    setShareOpen(true);
  }

  
  const handleDelete = async (id: string) => {
    if (!token) return;
    await deletePresentation(id, token);
    refetch(); // refresh list
  };


  /* -----------------------------
     Sorting
  ------------------------------*/
  const sorted = [...presentations].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.title.localeCompare(b.title);
      case "name-desc":
        return b.title.localeCompare(a.title);
      case "created-asc":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "created-desc":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "updated-asc":
        return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      case "updated-desc":
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      default:
        return 0;
    }
  });

  const listToShow = searchResults ?? sorted;

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginated = listToShow.slice(start, end);

  /* -----------------------------
     Render
  ------------------------------*/
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

  return (
    <Container maxWidth="md" sx={{ pt: 0, pb: 0 }}>
      <ShareDialog
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        users={users}        
        onShare={(selectedUserIds) => {
          setShareOpen(false);
          handleShare(selectedUserIds);
        }}
      />

      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={600}>
          {t("presentations.title")}
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

          {/* New Presentation */}
          <Button
            variant="outlined"
            color="success"
            startIcon={<NoteAddIcon />}
            onClick={() => navigate("/presentation/new")}
          >
            {t("presentations.new")}
          </Button>
        </Stack>
      </Stack>

      {/* List */}
      {listToShow.length === 0 ? (
        <Alert severity="info">{t("presentations.empty")}</Alert>
      ) : (
        <>
          <Stack spacing={2}>
            {paginated.map((pres) => {
              const isOwner = user?.id === pres.userId;

              return (
                <Paper
                  key={pres._id}
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
                  onClick={() => navigate(`/presentation/${pres._id}`)}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <SlideshowIcon color="primary" />

                    <Box>
                      <Typography variant="h6">{pres.title}</Typography>

                      <Typography variant="body2" color="text.secondary">
                        {t("documents.lastEdited")}:{" "}
                        {new Date(pres.updatedAt).toLocaleString()}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {t("documents.created")}:{" "}
                        {new Date(pres.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                  </Stack>

                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      disabled={!isOwner}
                      onClick={(e) => {
                        e.stopPropagation();
                        openShareSelection(pres);
                      }}
                    >
                      <ShareIcon />
                    </IconButton>

                    <IconButton
                      aria-label="Delete"
                      disabled={!isOwner}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(pres._id);
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
              count={Math.ceil(listToShow.length / pageSize)}
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
