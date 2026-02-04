import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
//import SendIcon from "@mui/icons-material/Send";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

import { useState } from "react";

import { sendDocumentEmail } from "../services/emailService";

interface Props {
  open: boolean;
  onClose: () => void;
  publicUrl: string;
  documentTitle: string;
}

export default function SendEmailDialog({
  open,
  onClose,
  publicUrl,
  documentTitle
}: Props) {
  const [email, setEmail] = useState("");

/*
  toEmail: string,
  documentTitle: string,
  publicUrl: string,
  fromEmail: string
*/

const handleSend = async () => {
  try {
    await sendDocumentEmail(email, documentTitle, publicUrl, "");
    onClose();
  } catch (err) {
    console.error("EmailJS error:", err);
  }
};



/*  
const handleSend = () => {
  const subject = `Shared document: ${documentTitle}`;

  const body = [
    "Here is the link to the document:",
    "",
    publicUrl, 
    "",
    "Best regards,", // The comma is here
    "Timo"           // This will appear on the next line
  ].join("\r\n");

  const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  window.location.href = mailtoUrl;
  onClose();
};*/


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
        {/* Cancel icon */}
        <IconButton
          onClick={onClose}
          sx={{
            color: "text.secondary",
            "&:hover": { color: "text.primary" }
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Send icon */}
        {/*<IconButton
          onClick={handleSend}
          sx={{
            color: "text.secondary",
            "&:hover": { color: "text.primary" }
          }}
        >
          <SendIcon />
        </IconButton>*/}

        <IconButton onClick={handleSend}>
          <SendOutlinedIcon fontSize="small" />
        </IconButton>

      </DialogActions>
    </Dialog>
  );
}
/*
async function sendDocumentEmail(
  email: string,
  documentTitle: string,
  publicUrl: string
) {
  const response = await fetch("/api/send-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      documentTitle,
      publicUrl,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to send email");
  }

  return response.json();
}*/

