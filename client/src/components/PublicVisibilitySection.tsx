import { useState } from "react";
import {
  Box,
  Switch,
  Typography,
  IconButton,
  Tooltip,
  Paper,
} from "@mui/material";

import PublicIcon from "@mui/icons-material/Public";
import LockIcon from "@mui/icons-material/Lock";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

import {SendEmailDialog} from "./SendEmailDialog";
import { PublicVisibilityProps } from "../types/PublicVisibilityProps";
import { useTranslation } from "react-i18next";

/**
 * Controls the public/private visibility of a document.
 *
 * @remarks
 * This section is only visible to the document owner and provides:
 * - a toggle between **public** and **private** visibility
 * - a shareable public URL when visibility is enabled
 * - copy‑to‑clipboard functionality
 * - a “send via email” action that opens a dialog
 *
 * The component does not perform any backend operations itself; it delegates
 * visibility changes to the parent via `onTogglePublic`.
 *
 * @param isOwner - Whether the current user owns the document.
 * @param isPublic - Current visibility state of the document.
 * @param documentId - ID used to generate the public URL.
 * @param docTitle - Title used when sending the link via email.
 * @param onTogglePublic - Callback fired when the visibility switch is toggled.
 *
 * @returns JSX element for controlling document visibility.
 */
export function PublicVisibilitySection({
  isOwner,
  isPublic,
  documentId,
  docTitle,
  onTogglePublic,
}: PublicVisibilityProps) {
  const { t } = useTranslation();

  /** Whether the “copied to clipboard” feedback text is visible. */
  const [copied, setCopied] = useState(false);

  /** Controls visibility of the email‑sending dialog. */
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);

  // Non‑owners should not see this section
  if (!isOwner) return null;

  /** Public URL for sharing the document. */
  const publicUrl = `${window.location.origin}/public/${documentId}`;

  /**
   * Copies the public URL to the clipboard and shows temporary feedback.
   */
  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        mt: 2,
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        {isPublic ? (
          <PublicIcon color="success" />
        ) : (
          <LockIcon color="action" />
        )}

        <Typography variant="h6">
          {isPublic ? t("visibility.public") : t("visibility.private")}
        </Typography>

        <Switch
          checked={isPublic}
          onChange={(e) => onTogglePublic(e.target.checked)}
        />

        {isPublic && (
          <Paper
            variant="outlined"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1,
              py: 0.5,
              ml: 1,
              borderRadius: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{ wordBreak: "break-all" }}
            >
              {publicUrl}
            </Typography>

            <IconButton onClick={handleCopy}>
              <ContentCopyIcon fontSize="small" />
            </IconButton>

            <Tooltip title={t("sendLink")}>
              <IconButton onClick={() => setEmailDialogOpen(true)}>
                <SendOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {copied && (
              <Typography variant="body2" color="success.main">
                {t("visibility.copied")}
              </Typography>
            )}
          </Paper>
        )}
      </Box>

      <SendEmailDialog
        open={emailDialogOpen}
        onClose={() => setEmailDialogOpen(false)}
        publicUrl={publicUrl}
        documentTitle={docTitle}
      />
    </Paper>
  );
}
