import { Box } from "@mui/material";
import { ReactNode } from "react";

/**
 * A responsive layout wrapper used across pages.
 *
 * @remarks
 * This component:
 * - centers content horizontally
 * - applies consistent padding
 * - constrains maximum width based on viewport size
 *
 * It helps maintain a clean and readable layout across all pages.
 *
 * @param children - Page content to be rendered inside the container.
 *
 * @returns A responsive layout wrapper.
 */
export default function PageContainer({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        maxWidth: { xs: "100%", sm: "600px", md: "900px", lg: "1200px" },
        mx: "auto",
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {children}
    </Box>
  );
}
