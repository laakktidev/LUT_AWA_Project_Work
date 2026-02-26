import { useState } from "react";
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
import { useAuth } from "../context/AuthContext";
import {About} from "./About";
import i18n from "i18next";
import { Link } from "react-router-dom";

/**
 * Settings dropdown menu displayed in the application header.
 *
 * @remarks
 * This menu provides:
 * - **Theme toggle** (light/dark) using Material‑UI’s color scheme system
 * - **Profile navigation**
 * - **Language switching** (EN/FI) using i18next
 * - **About dialog** access
 * - **Logout** action
 *
 * The component manages its own menu state and About dialog visibility.
 *
 * @returns JSX element representing the settings dropdown menu.
 */
export function SettingsMenu() {
  /** Anchor element for the dropdown menu. */
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  /** Controls visibility of the About dialog. */
  const [showAbout, setShowAbout] = useState(false);

  /** Whether the menu is currently open. */
  const open = Boolean(anchorEl);

  const { mode, setMode } = useColorScheme();
  const { logout } = useAuth();

  /**
   * Opens the settings menu.
   *
   * @param event - Click event from the settings icon button.
   */
  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);

  /** Closes the settings menu. */
  const handleClose = () => setAnchorEl(null);

  /**
   * Toggles between light and dark themes.
   */
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
        <MenuItem component={Link} to="/profile" onClick={handleClose}>
          <ListItemIcon>
            <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </MenuItem>

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
            setShowAbout(true);
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

      {/* About dialog */}
      <About show={showAbout} onHide={() => setShowAbout(false)} />
    </>
  );
}
