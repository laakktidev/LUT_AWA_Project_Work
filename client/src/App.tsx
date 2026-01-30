import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layout/AppLayout";

import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import DocumentCreatePage from "./pages/DocumentCreatePage";
import DocumentDetailPage from "./pages/DocumentDetailsPage";
import DocumentsListPage from "./pages/DocumentsListPage";
import DocumentEditPage from "./pages/DocumentEditPage";
import PublicDocumentPage from "./pages/PublicDocumentPage";
import ProfilePage from "./pages//ProfilePage";


import { useAuth } from "./context/AuthContext";
import TrashListPage from "./pages/TrashListPage";

import SlideShowPage from "./pages/SlideShowPage";
import SlideEditorPage from "./pages/SlideEditorPage";



export default function App() {
  const { token, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: 40 }}>Loading session…</div>;
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/public/:id" element={<PublicDocumentPage />} />

        {/* PROTECTED ROUTES */}
        <Route
          element={
            token ? <AppLayout /> : <Navigate to="/login" replace />
          }
        >
          <Route path="/" element={<DocumentsListPage />} />
          <Route path="/create" element={<DocumentCreatePage />} />
          <Route path="/view/:id" element={<DocumentDetailPage />} />
          <Route path="/edit/:id" element={<DocumentEditPage />} />
          <Route path="/trash" element={<TrashListPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          
          
          <Route path="/slides/new" element={<SlideEditorPage />} />
          <Route path="/slides/:id/edit" element={<SlideEditorPage />} />
          <Route path="/slides/:id/show" element={<SlideShowPage />} />

        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
