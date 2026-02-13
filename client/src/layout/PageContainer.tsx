import { Box } from "@mui/material";
import { ReactNode } from "react";

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
