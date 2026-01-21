import { useState } from "react";
import { Box, Switch, Typography, IconButton } from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import LockIcon from "@mui/icons-material/Lock";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { PublicVisibilityProps } from "../types/PublicVisibilityProps";

export default function PublicVisibilitySection({
  isOwner,
  isPublic,
  documentId,
  onTogglePublic
}: PublicVisibilityProps) {
  const [copied, setCopied] = useState(false);

  if (!isOwner) return null;

  const publicUrl = `${window.location.origin}/public/${documentId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Box sx={{ border: "1px solid #ddd", borderRadius: 2, p: 2, mt: 2 }}>
      {/* Top row: icon + label + switch */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {isPublic ? <PublicIcon color="success" /> : <LockIcon color="action" />}
        <Typography variant="h6">
          {isPublic ? "Public document" : "Private document"}
        </Typography>

        <Switch
          checked={isPublic}
          onChange={(e) => onTogglePublic(e.target.checked)}
        />
      </Box>

      {/* NEW: link + copy button BELOW the switch */}
      {isPublic && (
        <Box
          sx={{
            mt: 2,
            p: 1,
            borderRadius: 1,
            backgroundColor: "#fafafa",
            display: "flex",
            alignItems: "center",
            gap: 1
          }}
        >
          <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
            {publicUrl}
          </Typography>

          <IconButton onClick={handleCopy}>
            <ContentCopyIcon fontSize="small" />
          </IconButton>

          {copied && (
            <Typography variant="body2" color="success.main">
              Copied
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}
