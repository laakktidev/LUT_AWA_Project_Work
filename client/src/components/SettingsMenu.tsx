import { useState } from "react";
import { Link } from "react-router-dom";
import {
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
} from "@mui/material";

import SettingsIcon from "@mui/icons-material/Settings";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import InfoIcon from "@mui/icons-material/Info";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LanguageIcon from "@mui/icons-material/Language";
import LogoutIcon from "@mui/icons-material/Logout";

import { useColorScheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
//import AboutDialog from "./About";
import About from "./About";
//import LanguageDialog from "./LanguageDialog";
import i18n from "i18next";

export default function SettingsMenu() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    //const [aboutOpen, setAboutOpen] = useState(false);
    const [showAbout, setShowAbout] = useState(false);
    const [languageOpen, setLanguageOpen] = useState(false);



    const open = Boolean(anchorEl);

    const { mode, setMode } = useColorScheme();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) =>
        setAnchorEl(event.currentTarget);

    const handleClose = () => setAnchorEl(null);

    const toggleTheme = () => {
        setMode(mode === "dark" ? "light" : "dark");
        handleClose();
    };

    return (
        <>
            <IconButton onClick={handleOpen} aria-label="settings">
                <SettingsIcon />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                {/* Theme toggle */}
                <MenuItem onClick={toggleTheme}>
                    <ListItemIcon>
                        {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
                    </ListItemIcon>
                    <ListItemText
                        primary={mode === "dark" ? "Light Mode" : "Dark Mode"}
                    />
                </MenuItem>

                <Divider />

                {/* Profile */}
                <MenuItem
                    component={Link}
                    to="/profile"
                    onClick={handleClose}
                >
                    <ListItemIcon>
                        <AccountCircleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                </MenuItem>


                {/* Language */}
                {/* Language */}
                <MenuItem
                    onClick={() => {
                        const newLang = i18n.language === "fi" ? "en" : "fi";
                        i18n.changeLanguage(newLang);
                        handleClose();
                    }}
                >
                    <ListItemIcon>
                        <LanguageIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary={
                            i18n.language === "fi"
                                ? "Switch to English"
                                : "Vaihda suomeksi"
                        }
                    />
                </MenuItem>


                {/* About */}
                <MenuItem
                    onClick={() => {
                        setShowAbout(true)
                        handleClose();
                    }}
                >
                    <ListItemIcon>
                        <InfoIcon />
                    </ListItemIcon>
                    <ListItemText primary="About" />
                </MenuItem>

                <Divider />

                {/* Logout */}
                <MenuItem
                    onClick={() => {
                        logout();
                        handleClose();
                    }}
                >
                    <ListItemIcon>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </MenuItem>
            </Menu>
            
            <About show={showAbout} onHide={() => setShowAbout(false)} />
            {/* Dialogs 
            <AboutDialog open={aboutOpen} onClose={() => setAboutOpen(false)} />*/}
            {/*<LanguageDialog
        open={languageOpen}
        onClose={() => setLanguageOpen(false)}
      />*/}
        </>
    );
}
