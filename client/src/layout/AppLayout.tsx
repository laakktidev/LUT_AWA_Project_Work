import { Outlet } from "react-router-dom";
import Header from "./Header";
import { Box } from "@mui/material";
import { useAuth } from "../context/AuthContext";

/**
 * Application‑wide layout wrapper.
 *
 * @remarks
 * This layout:
 * - renders the global `Header` only when authenticated
 * - relies on the Header's internal `<Toolbar />` spacer for AppBar offset
 * - positions routed pages underneath using `<Outlet />`
 *
 * By placing the spacing inside the Header component, we ensure:
 * - no vertical scrollbar caused by mismatched heights
 * - no empty space on login/signup pages
 * - perfect alignment with MUI's fixed AppBar pattern
 */
export default function AppLayout() {
  const { token } = useAuth();

  return (
    <Box>
      {/* Render header only when logged in */}
      {token && <Header />}

      {/* Main routed content */}
      <Box sx={{ p: 2 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
