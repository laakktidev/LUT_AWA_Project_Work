import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { useColorScheme } from "@mui/material/styles";

interface HeaderProps {
  token: string | null;
  setToken: (token: string | null) => void;
}

export default function Header({ token, setToken }: HeaderProps) {
  const { mode, setMode } = useColorScheme();

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Documents</Typography>

        <div>
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

          {/* Show Login/Signup only when NOT logged in */}
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

          {/* Show Logout only when logged in */}
          {token && (
            <Button
              color="inherit"
              onClick={() => {
                setToken(null);
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
