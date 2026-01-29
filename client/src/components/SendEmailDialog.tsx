import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { TextField, Button } from "@mui/material";
import { useState } from "react";

type SendEmailDialogProps = {
  open: boolean;
  onClose: () => void;
  onSend: (email: string) => Promise<void>;
  loading?: boolean;
};

export function SendEmailDialog({ open, onClose, onSend, loading }: SendEmailDialogProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    await onSend(email);
    setEmail("");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Send link via email</DialogTitle>

      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Recipient email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !email}
        >
          {loading ? "Sending..." : "Send"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}