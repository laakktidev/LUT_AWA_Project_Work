import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Checkbox,
  Button,
  Box
} from "@mui/material";
import { useEffect, useState } from "react";
import { User } from "../types/User";
import { useTranslation } from "react-i18next";

interface ShareDialogProps {
  /** Whether the dialog is visible. */
  open: boolean;

  /** Fired when the dialog should close. */
  onClose: () => void;

  /** List of all users that can be shared with. */
  users: User[];

  /**
   * Fired when the user confirms sharing.
   * Provides an array of selected user IDs.
   */
  onShare: (selectedUserIds: string[]) => void;
}

/**
 * Dialog for selecting users to share a document with.
 *
 * @remarks
 * This dialog supports:
 * - searching by username or email
 * - selecting multiple users via checkboxes
 * - resetting internal state whenever the dialog opens
 *
 * It does not perform any backend operations; it simply returns the selected
 * user IDs to the parent component via `onShare`.
 *
 * @param open - Whether the dialog is visible.
 * @param onClose - Callback fired when the dialog should close.
 * @param users - List of users eligible for sharing.
 * @param onShare - Callback fired with selected user IDs.
 *
 * @returns JSX element representing the share dialog.
 */
export function ShareDialog({ open, onClose, users, onShare }: ShareDialogProps) {
  const { t } = useTranslation();

  /** Current search query for filtering users. */
  const [search, setSearch] = useState("");

  /** List of selected user IDs. */
  const [selected, setSelected] = useState<string[]>([]);

  /**
   * Resets search and selection state whenever the dialog is opened.
   */
  useEffect(() => {
    if (open) {
      setSelected([]);
      setSearch("");
    }
  }, [open]);

  /**
   * Toggles a user ID in the selection list.
   *
   * @param id - User ID to toggle.
   */
  function toggle(id: string) {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  }

  /** Filtered list of users based on search query. */
  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t("share.title")}</DialogTitle>

      <DialogContent
        dividers
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "400px",
          p: 0,
        }}
      >
        {/* Search bar */}
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid #ddd",
            position: "sticky",
            top: 0,
            background: "white",
            zIndex: 1
          }}
        >
          <TextField
            fullWidth
            placeholder={t("share.search")}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </Box>

        {/* User list */}
        <Box sx={{ overflowY: "auto", flex: 1 }}>
          <List>
            {filtered.map(u => (
              <ListItem key={u.id} disablePadding>
                <ListItemButton onClick={() => toggle(u.id)}>
                  <Checkbox checked={selected.includes(u.id)} />
                  <ListItemText primary={u.username} secondary={u.email} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button color="inherit" onClick={onClose}>
          {t("share.cancel")}
        </Button>

        <Button
          variant="contained"
          onClick={() => onShare(selected)}
        >
          {t("share.confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
