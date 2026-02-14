import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

import { useState } from "react";
import { sendDocumentEmail } from "../services/emailService";

interface Props {
  /** Whether the dialog is visible. */
  open: boolean;

  /** Fired when the dialog should close. */
  onClose: () => void;

  /** Public URL of the shared document. */
  publicUrl: string;

  /** Title of the document being shared. */
  documentTitle: string;
}

/**
 * Dialog for sending a public document link via email.
 *
 * @remarks
 * This component:
 * - collects a recipient email address
 * - uses the `sendDocumentEmail` service to send the message
 * - closes automatically after a successful send
 *
 * It does not validate email format beyond what the backend or email service handles.
 *
 * @param open - Whether the dialog is visible.
 * @param onClose - Callback fired when the dialog should close.
 * @param publicUrl - Public link to the shared document.
 * @param documentTitle - Title included in the email message.
 *
 * @returns JSX element representing the email‑sending dialog.
 */
export default function SendEmailDialog({
  open,
  onClose,
  publicUrl,
  documentTitle
}: Props) {
  /** Email address entered by the user. */
  const [email, setEmail] = useState("");

  /**
   * Sends the email using the email service.
   *
   * @remarks
   * - On success, the dialog closes.
   * - Errors are logged to the console.
   */
  const handleSend = async () => {
    try {
      await sendDocumentEmail(email, documentTitle, publicUrl, "");
      onClose();
    } catch (err) {
      console.error("EmailJS error:", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Send Document Link</DialogTitle>

      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="Recipient Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mt: 1 }}
        />
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between" }}>
        {/* Cancel */}
        <IconButton
          onClick={onClose}
          sx={{
            color: "text.secondary",
            "&:hover": { color: "text.primary" }
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Send */}
        <IconButton onClick={handleSend}>
          <SendOutlinedIcon fontSize="small" />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
}
