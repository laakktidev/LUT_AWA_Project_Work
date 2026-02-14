import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import SlideshowIcon from "@mui/icons-material/Slideshow";

import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SettingsMenu from "./SettingsMenu";
import { useTranslation } from "react-i18next";

/**
 * Application header containing:
 *
 * - navigation tabs (Documents / Presentations)
 * - a mobile hamburger menu
 * - the logged‑in user's name
 * - the settings menu (language, theme, logout)
 *
 * @remarks
 * This component:
 * - adapts between desktop and mobile layouts using Material‑UI breakpoints
 * - reads authentication state from `useAuth()`
 * - uses React Router for navigation
 *
 * The header is persistent across the application and updates automatically
 * based on the current route.
 *
 * @returns JSX element representing the application header.
 */
export default function Header() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  /** Anchor element for the mobile hamburger menu. */
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  /**
   * Determines which tab should be active based on the current route.
   *
   * @remarks
   * - Any `/presentation*` route activates the Presentations tab.
   * - All other routes default to Documents.
   */
  const currentTab = location.pathname.startsWith("/presentation")
    ? "presentations"
    : "documents";

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

        {/* DESKTOP NAVIGATION TABS */}
        <Tabs
          value={currentTab}
          onChange={(_, value) => navigate(`/${value}`)}
          textColor="inherit"
          indicatorColor="secondary"
          sx={{
            minHeight: 0,
            display: { xs: "none", sm: "flex" },
            "& .MuiTab-root": { minHeight: 0, paddingX: 2 },
          }}
        >
          <Tab label={t("header.documents")} value="documents" />
          <Tab label={t("header.presentations")} value="presentations" />
        </Tabs>

        {/* MOBILE HAMBURGER MENU */}
        <Box sx={{ display: { xs: "block", sm: "none" } }}>
          <IconButton
            color="inherit"
            onClick={(e) => setMenuAnchor(e.currentTarget)}
          >
            <MenuIcon />
          </IconButton>

          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={() => setMenuAnchor(null)}
          >
            <MenuItem
              onClick={() => {
                navigate("/documents");
                setMenuAnchor(null);
              }}
            >
              <NoteAddIcon sx={{ mr: 1 }} /> {t("header.menuDocuments")}
            </MenuItem>

            <MenuItem
              onClick={() => {
                navigate("/presentations");
                setMenuAnchor(null);
              }}
            >
              <SlideshowIcon sx={{ mr: 1 }} /> {t("header.menuPresentations")}
            </MenuItem>
          </Menu>
        </Box>

        {/* RIGHT SIDE CONTROLS */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {token && user && (
            <Typography variant="body1">
              <strong>{user.username}</strong>
            </Typography>
          )}

          <SettingsMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
