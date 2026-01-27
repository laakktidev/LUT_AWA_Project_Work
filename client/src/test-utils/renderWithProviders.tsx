import { ReactNode } from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

// If you have an AuthProvider, import it here
// import { AuthProvider } from "../context/AuthContext";

// If you have a ThemeProvider, import it here
// import { ThemeProvider } from "../theme/ThemeProvider";

// If you use React Query:
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function renderWithProviders(ui: ReactNode) {
  // const queryClient = new QueryClient();

  return render(
    <BrowserRouter>
      {/* <AuthProvider> */}
      {/* <ThemeProvider> */}
      {/* <QueryClientProvider client={queryClient}> */}
      {ui}
      {/* </QueryClientProvider> */}
      {/* </ThemeProvider> */}
      {/* </AuthProvider> */}
    </BrowserRouter>
  );
}
