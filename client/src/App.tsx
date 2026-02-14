import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "./layout/AppLayout";

// Auth
import { useAuth } from "./context/AuthContext";

// Pages — Public
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import PublicDocumentPage from "./pages/PublicDocumentPage";

// Pages — Documents
import DocumentsListPage from "./pages/DocumentsListPage";
import DocumentCreatePage from "./pages/DocumentCreatePage";
import DocumentDetailPage from "./pages/DocumentDetailsPage";
import DocumentEditPage from "./pages/DocumentEditPage";
import TrashListPage from "./pages/TrashListPage";

// Pages — User
import ProfilePage from "./pages/ProfilePage";

// Pages — Presentations
import PresentationsListPage from "./pages/PresentationsListPage";
import PresentationCreatePage from "./pages/PresentationCreatePage";
import PresentationPage from "./pages/PresentationPage";
import PresentationEditPage from "./pages/PresentationEditPage";

/**
 * Root application component responsible for:
 *
 * @remarks
 * - Initializing the router
 * - Handling authentication‑based route protection
 * - Rendering public and private routes
 * - Applying the global `AppLayout` wrapper for authenticated sections
 *
 * The component waits for the authentication context to finish loading
 * before rendering any routes, ensuring the correct initial redirect behavior.
 *
 * @returns The full application router.
 */
export default function App() {
  const { token, loading } = useAuth();

  // Wait for auth context to resolve before rendering routes
  if (loading) {
    return <div style={{ padding: 40 }}>Loading session…</div>;
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* =======================================================
            PUBLIC ROUTES
        ======================================================== */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/public/:id" element={<PublicDocumentPage />} />

        {/* =======================================================
            PROTECTED ROUTES (Requires Auth)
        ======================================================== */}
        <Route
          element={
            token ? <AppLayout /> : <Navigate to="/login" replace />
          }
        >
          {/* Documents */}
          <Route path="/" element={<DocumentsListPage />} />
          <Route path="/create" element={<DocumentCreatePage />} />
          <Route path="/view/:id" element={<DocumentDetailPage />} />
          <Route path="/edit/:id" element={<DocumentEditPage />} />
          <Route path="/trash" element={<TrashListPage />} />

          {/* User */}
          <Route path="/profile" element={<ProfilePage />} />

          {/* Presentations */}
          <Route path="/presentations" element={<PresentationsListPage />} />
          <Route path="/presentation/new" element={<PresentationCreatePage />} />
          <Route path="/presentation/:id" element={<PresentationPage />} />
          <Route path="/presentation/:id/edit" element={<PresentationEditPage />} />
        </Route>

        {/* =======================================================
            FALLBACK
        ======================================================== */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
