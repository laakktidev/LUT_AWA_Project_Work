import {
  Snackbar,
  Alert,
  AlertColor,
  SnackbarOrigin,
  useMediaQuery,
  useTheme
} from "@mui/material";

export interface ToastProps {
  /** Whether the toast is visible. */
  open: boolean;

  /** Message text displayed inside the toast. */
  message: string;

  /** Visual severity level (info, success, warning, error). */
  severity?: AlertColor;

  /** Auto-hide duration in milliseconds, or null to disable. */
  autoHideDuration?: number | null;

  /** Fired when the toast should close. */
  onClose: () => void;

  /** Position of the toast on screen. */
  anchorOrigin?: SnackbarOrigin;

  /** MUI Alert variant. */
  variant?: "filled" | "outlined" | "standard";
}

/**
 * Responsive toast notification component.
 *
 * @remarks
 * This component wraps MUI's `Snackbar` and `Alert` to provide:
 * - consistent toast notifications across the app
 * - automatic mobile-friendly sizing and typography adjustments
 * - configurable severity, position, and auto-hide behavior
 *
 * It is fully controlled by the parent component via props.
 *
 * @param open - Whether the toast is visible.
 * @param message - Text displayed inside the toast.
 * @param severity - Visual severity level.
 * @param autoHideDuration - Duration before auto-dismissal.
 * @param onClose - Callback fired when the toast should close.
 * @param anchorOrigin - Screen position of the toast.
 * @param variant - MUI Alert variant.
 *
 * @returns JSX element representing a responsive toast notification.
 */
export function Toast({
  open,
  message,
  severity = "info",
  autoHideDuration = null,
  onClose,
  anchorOrigin = { vertical: "top", horizontal: "center" },
  variant = "filled",
}: ToastProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      sx={{
        "& .MuiSnackbarContent-root": {
          maxWidth: isMobile ? "90%" : "auto",
        }
      }}
    >
      <Alert
        severity={severity}
        onClose={onClose}
        variant={variant}
        sx={{
          fontSize: isMobile ? "0.85rem" : "1rem",
          padding: isMobile ? "6px 10px" : "8px 16px",
          borderRadius: isMobile ? "6px" : "8px",
          "& .MuiAlert-icon": {
            fontSize: isMobile ? "18px" : "24px",
          }
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
