import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FeaturesAccordion } from "./FeaturesAccordion";

interface ConfirmModalProps {
  /** Controls whether the modal is visible. */
  show: boolean;

  /** Callback fired when the modal should be closed. */
  onHide: () => void;
}

/**
 * Displays an informational “About” modal for the application.
 *
 * @remarks
 * This modal includes:
 * - course information
 * - author details
 * - a short project description
 * - a feature list via `FeaturesAccordion`
 *
 * It is used as a static informational dialog and does not perform any actions
 * beyond closing itself.
 *
 * @param show - Whether the modal is visible.
 * @param onHide - Callback to close the modal.
 *
 * @returns JSX element representing the About dialog.
 */
export default function About({ show, onHide }: ConfirmModalProps) {
  return (
    <Dialog
      open={show}
      onClose={onHide}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: "#B2B7BA",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1
        }}
      >
        <DialogTitle sx={{ p: 0 }}>
          <Typography sx={{ fontSize: "18px" }}>
            CT30A3204 Advanced Web Applications
          </Typography>
          <Typography sx={{ fontSize: "14px" }}>
            Timo Laakkonen
          </Typography>
        </DialogTitle>

        <IconButton onClick={onHide}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Body */}
      <DialogContent sx={{ mt: 1 }}>
        <Typography variant="h6">
          Project Work
        </Typography>

        <Typography sx={{ fontSize: "14px", mt: 1, mb: 2 }}>
          A full‑stack MERN application implementing complete CRUD operations for documents and presentations, combined with user authentication, internationalization (EN/FI), sharing, and a modern Material‑UI interface. The system includes a rich WYSIWYG editor, a slide‑based presentation builder, and a variety of usability enhancements such as search, pagination, dark/light themes, and PDF export.
        </Typography>

        <FeaturesAccordion />
      </DialogContent>

      {/* Footer */}
      <DialogActions>
        <Button variant="outlined" onClick={onHide}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
