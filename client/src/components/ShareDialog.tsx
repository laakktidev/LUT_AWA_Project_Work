import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Checkbox,
    Button,
    Box
} from "@mui/material";
import { useEffect, useState } from "react";
import { User } from "../types/User";
import { useTranslation } from "react-i18next";

interface ShareDialogProps {
    open: boolean;
    onClose: () => void;
    users: User[];
    onShare: (selectedUserIds: string[]) => void;
}

export function ShareDialog({ open, onClose, users, onShare }: ShareDialogProps) {
    const { t } = useTranslation();

    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<string[]>([]);

    useEffect(() => {
        if (open) {
            setSelected([]);
            setSearch("");
        }
    }, [open]);

    function toggle(id: string) {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    }

    const filtered = users.filter(
        (u) =>
            u.username.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{t("share.title")}</DialogTitle>

            <DialogContent
                dividers
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "400px",
                    p: 0,
                }}
            >
                <Box
                    sx={{
                        p: 2,
                        borderBottom: "1px solid #ddd",
                        position: "sticky",
                        top: 0,
                        background: "white",
                        zIndex: 1
                    }}
                >
                    <TextField
                        fullWidth
                        placeholder={t("share.search")}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </Box>

                <Box sx={{ overflowY: "auto", flex: 1 }}>
                    <List>
                        {filtered.map((u) => (
                            <ListItem key={u.id} disablePadding>
                                <ListItemButton onClick={() => toggle(u.id)}>
                                    <Checkbox checked={selected.includes(u.id)} />
                                    <ListItemText primary={u.username} secondary={u.email} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button color="inherit" onClick={onClose}>{t("share.cancel")}</Button>
                <Button
                    variant="contained"
                    onClick={() => onShare(selected)}
                >
                    {t("share.confirm")}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
