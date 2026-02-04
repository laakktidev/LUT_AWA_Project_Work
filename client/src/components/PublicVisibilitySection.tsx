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

import SendEmailDialog from "./SendEmailDialog";
import { PublicVisibilityProps } from "../types/PublicVisibilityProps";
import { useTranslation } from "react-i18next";

export default function PublicVisibilitySection({
  isOwner,
  isPublic,
  documentId,
  docTitle,
  onTogglePublic,
}: PublicVisibilityProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);

  if (!isOwner) return null;

  const publicUrl = `${window.location.origin}/public/${documentId}`;

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

            <Tooltip title={t("visibility.sendLink")}>
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
