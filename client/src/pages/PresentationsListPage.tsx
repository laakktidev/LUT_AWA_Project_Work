import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
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

import { isTokenExpired } from "../utils/isTokenExpired";
import { Toast } from "../components/Toast";
import PageContainer from "../layout/PageContainer";

/**
 * Displays the list of presentations belonging to the user.
 *
 * @remarks
 * This page supports:
 * - searching presentations
 * - sorting by name, creation date, or update date
 * - pagination
 * - sharing presentations with other users
 * - deleting presentations
 * - navigating to create or view pages
 *
 * It also handles session expiration and displays a warning toast when needed.
 *
 * @returns JSX element representing the presentations list page.
 */
export default function PresentationsListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();

  /** Controls visibility of the share dialog. */
  const [shareOpen, setShareOpen] = useState(false);

  /** ID of the presentation currently being shared. */
  const [presId, setPresId] = useState("");

  /** List of users available for sharing. */
  const [users, setUsers] = useState<User[]>([]);

  /** Search input text. */
  const [search, setSearch] = useState("");

  /** Search results (null = show full list). */
  const [searchResults, setSearchResults] = useState<any[] | null>(null);

  /** Sorting mode. */
  const [sortBy, setSortBy] = useState<
    "name-asc" | "name-desc" |
    "created-asc" | "created-desc" |
    "updated-asc" | "updated-desc"
  >("updated-desc");

  /** Current pagination page. */
  const [page, setPage] = useState(1);

  const pageSize = 5;

  // -----------------------------
  // SESSION EXPIRED HANDLING
  // -----------------------------

  /**
   * Blocks the page when the session is expired.
   */
  if (token) {
    const sessionExpired = isTokenExpired(token);
    if (sessionExpired) {
      return (
        <PageContainer>
          <Toast
            open={sessionExpired}
            message="Session expired. Please log in again."
            severity="warning"
            autoHideDuration={5000}
            onClose={() => logout()}
          />
        </PageContainer>
      );
    }
  }

  // -----------------------------
  // LOAD PRESENTATIONS
  // -----------------------------

  /**
   * Loads the user's presentations.
   *
   * @remarks
   * The hook handles:
   * - loading state
   * - error state
   * - refetching
   */
  const { presentations, loading, error, refetch } = usePresentations(token);

  // -----------------------------
  // SEARCH
  // -----------------------------

  /**
   * Performs a debounced search when the user types.
   *
   * @remarks
   * - Clears results when search text < 3 chars
   * - Calls backend after 300ms delay
   */
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

  /**
   * Resets pagination when search or sorting changes.
   */
  useEffect(() => {
    setPage(1);
  }, [search, sortBy]);

  // -----------------------------
  // LOADING
  // -----------------------------

  /**
   * Displays a loading spinner while presentations are being fetched.
   */
  if (loading) {
    return (
      <PageContainer>
        <Box textAlign="center" mt={4}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  // -----------------------------
  // ERROR
  // -----------------------------

  /**
   * Displays an error message if presentations cannot be loaded.
   */
  if (error) {
    return (
      <PageContainer>
        <Typography color="error" mt={4}>
          {error}
        </Typography>
      </PageContainer>
    );
  }

  // -----------------------------
  // MUST LOGIN
  // -----------------------------

  /**
   * Blocks the page if the user is not authenticated.
   */
  if (!token) {
    return (
      <PageContainer>
        <Alert severity="warning">{t("documents.mustLogin")}</Alert>
        <Box mt={2}>
          <Button variant="contained" onClick={() => navigate("/login")}>
            {t("documents.goToLogin")}
          </Button>
        </Box>
      </PageContainer>
    );
  }

  // -----------------------------
  // SHARE ACTIONS
  // -----------------------------

  /**
   * Shares a presentation with selected users.
   *
   * @param selectedUserIds - IDs of users to share with.
   */
  async function handleShare(selectedUserIds: string[]) {
    if (!token) return;
    await sharePresentation(presId, selectedUserIds, token);
    refetch();
  }

  /**
   * Opens the share dialog and loads eligible users.
   *
   * @param pres - The presentation to share.
   */
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

  /**
   * Deletes a presentation.
   *
   * @param id - Presentation ID.
   */
  const handleDelete = async (id: string) => {
    if (!token) return;
    await deletePresentation(id, token);
    refetch();
  };

  // -----------------------------
  // SORTING
  // -----------------------------

  /**
   * Sort presentations based on the selected sort mode.
   */
  const sorted = [...presentations].sort((a, b) => {
  const createdA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
  const createdB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
  const updatedA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
  const updatedB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;

  switch (sortBy) {
    case "name-asc":
      return a.title.localeCompare(b.title);
    case "name-desc":
      return b.title.localeCompare(a.title);
    case "created-asc":
      return createdA - createdB;
    case "created-desc":
      return createdB - createdA;
    case "updated-asc":
      return updatedA - updatedB;
    case "updated-desc":
      return updatedB - updatedA;
    default:
      return 0;
  }
});


  /** Final list of presentations to display (search results override sorting). */
  const listToShow = searchResults ?? sorted;

  /** Index of first item on current page. */
  const start = (page - 1) * pageSize;

  /** Paginated presentations for current page. */
  const paginated = listToShow.slice(start, start + pageSize);

  // -----------------------------
  // RENDER
  // -----------------------------

  return (
    <PageContainer>
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
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        mb={3}
        sx={{ width: "100%" }}
      >
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
    </PageContainer>
  );
}
