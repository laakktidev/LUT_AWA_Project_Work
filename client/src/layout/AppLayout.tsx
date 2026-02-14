import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { Box } from "@mui/material";

/**
 * Application‑wide layout wrapper.
 *
 * @remarks
 * This layout:
 * - renders the global `Header` at the top
 * - positions routed pages underneath using `<Outlet />`
 * - adds spacing so content does not sit under the fixed AppBar
 *
 * All pages rendered inside this layout inherit the same consistent structure.
 */
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
