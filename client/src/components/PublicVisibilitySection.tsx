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

  console.log("usPublic in Section :", isPublic); 


  if (!isOwner) return null;

  const publicUrl = `${window.location.origin}/public/${documentId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Box sx={{ border: "1px solid #ddd", borderRadius: 2, p: 2, mt: 2 }}>
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

      {isPublic && (
        <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2">{publicUrl}</Typography>

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