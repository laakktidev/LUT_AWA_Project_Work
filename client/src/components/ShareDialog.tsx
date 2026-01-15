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

interface ShareDialogProps {
    open: boolean;
    onClose: () => void;
    users: User[];
    onShare: (selectedUserIds: string[]) => void;
}

export function ShareDialog({ open, onClose, users, onShare }: ShareDialogProps) {
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<string[]>([]);


    useEffect(() => {
        if (open) {
            setSelected([]);   // reset selection on open
            setSearch("");     // optional: reset search too
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
            <DialogTitle>Select editors</DialogTitle>

            <DialogContent
                dividers
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "400px", // fixed height for scroll area
                    p: 0,
                }}
            >
                {/* Fixed search bar */}
                <Box sx={{ p: 2, borderBottom: "1px solid #ddd", position: "sticky", top: 0, background: "white", zIndex: 1 }}>
                    <TextField
                        fullWidth
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </Box>

                {/* Scrollable list */}
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
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={() => onShare(selected)}
                >
                    Share
                </Button>
            </DialogActions>
        </Dialog>
    );
}
