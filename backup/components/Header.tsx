import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link, useNavigate } from "react-router-dom";
import { useColorScheme } from "@mui/material/styles";
import { useAuth } from "../context/AuthContext";
import { LanguageSwitcher } from "./LanguageSwitcher";


export default function Header() {
  const { mode, setMode } = useColorScheme();
  const { token, user, logout } = useAuth();   // now includes user
  const navigate = useNavigate();

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Documents</Typography>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {token && user && (
            <Typography variant="body1">
              Logged in as: <strong>{user.username}</strong>
            </Typography>
          )}

          <Button color="inherit" component={Link} to="/profile" sx={{ marginRight: 2 }}>
            Profile
          </Button>

          <Button color="inherit" component={Link} to="/" sx={{ marginRight: 2 }}>
            home
          </Button>

          <Button color="inherit" component={Link} to="/saved">
            saved
          </Button>

          <Button color="inherit" component={Link} to="/view">
            View
          </Button>

          <Button color="inherit" component={Link} to="/create">
            Create
          </Button>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <LanguageSwitcher/>
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

          <Button
            color="inherit"
            onClick={() => setMode(mode === "light" ? "dark" : "light")}
          >
            Toggle
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}
