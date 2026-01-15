import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { Box } from "@mui/material";

interface AppLayoutProps {
  token: string | null;
  setToken: (token: string | null) => void;
}

export default function AppLayout({ token, setToken }: AppLayoutProps) {
  return (
    <Box>
      <Header token={token} setToken={setToken} />

      {/* Push content below the fixed AppBar */}
      <Box sx={{ mt: 10, p: 2 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
