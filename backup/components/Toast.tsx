import { Snackbar, Alert, AlertColor, SnackbarOrigin } from "@mui/material";

export interface ToastProps {
    open: boolean;
    message: string;
    severity?: AlertColor;
    autoHideDuration?: number | null;
    onClose: () => void;
    anchorOrigin?: SnackbarOrigin;
    variant?: "filled" | "outlined" | "standard";
}

export function Toast({
    open,
    message,
    severity = "info",
    autoHideDuration = null,
    onClose,
    anchorOrigin = { vertical: "top", horizontal: "center" },
    variant = "filled",
}: ToastProps) {
    return (
        <Snackbar
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={onClose}
            anchorOrigin={anchorOrigin}
        >
            <Alert severity={severity} onClose={onClose} variant={variant}>
                {message}
            </Alert>
        </Snackbar>
    );
}
