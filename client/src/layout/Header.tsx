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
import {SettingsMenu} from "../components/SettingsMenu";
import { useTranslation } from "react-i18next";

/**
 * Global application header.
 *
 * @remarks
 * This component includes:
 * - navigation tabs (Documents / Presentations)
 * - mobile hamburger menu
 * - logged‑in user's name
 * - settings menu (language, theme, logout)
 *
 * Layout behavior:
 * - Uses a fixed MUI AppBar
 * - Includes a `<Toolbar />` spacer *after* the AppBar
 *   to ensure correct content offset without layout shifts
 * - This prevents vertical scrollbars caused by mismatched heights
 *
 * The header is only rendered for authenticated users
 * (controlled by `AppLayout`).
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
    <>
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

      {/* Spacer matching AppBar height — prevents scrollbars */}
      <Toolbar />
    </>
  );
}
