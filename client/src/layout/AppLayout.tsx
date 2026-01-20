import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { Box } from "@mui/material";

export default function AppLayout() {
  return (
    <Box>
      <Header />

      {/* Push content below the fixed AppBar */}
      <Box sx={{ mt: 10, p: 2 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
