import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useColorScheme } from "@mui/material/styles";
import { useAuth } from "../context/AuthContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import About from "./About";
import SettingsMenu from "./SettingsMenu";


export default function Header() {
  const { mode, setMode } = useColorScheme();
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showAbout, setShowAbout] = useState(false);

  // Determine which tab is active
  const currentTab = location.pathname.startsWith("/presentation")
    ? "presentations"
    : "documents";

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

        {/* Left side: Tabs instead of static title */}
        <Tabs
          value={currentTab}
          onChange={(_, value) => {
            if (value === "documents") navigate("/documents");
            if (value === "presentations") navigate("/presentations");
          }}
          textColor="inherit"
          indicatorColor="secondary"
          sx={{
            minHeight: 0,
            "& .MuiTab-root": { minHeight: 0, paddingX: 2 },
          }}
        >
          <Tab label="Documents" value="documents" />
          <Tab label="Presentations" value="presentations" />
        </Tabs>

        {/* Right side: user info + controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {token && user && (
            <Typography variant="body1">
              Logged in as: <strong>{user.username}</strong>
            </Typography>
          )}

{/*
          <Button color="inherit" component={Link} to="/profile" sx={{ marginRight: 2 }}>
            Profile
          </Button>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <LanguageSwitcher />
          </Box>


          {!token && (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Signup
              </Button>
            </>
          )}
*/}
{/*
          {token && (
            <Button
              color="inherit"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Logout
            </Button>
          )}
*/}
          {/*<Button
            color="inherit"
            onClick={() => setMode(mode === "light" ? "dark" : "light")}
          >
            Toggle
          </Button>*/}

          <>
            {/* Button that opens the dialog */}
            {/*<Button variant="contained" onClick={() => setShowAbout(true)}>
              Open About
            </Button>*/}

            {/* The dialog */}
            {/*<About show={showAbout} onHide={() => setShowAbout(false)} />*/}

            <SettingsMenu />  
          </>

        </div>
      </Toolbar>
    </AppBar>
  );
}

