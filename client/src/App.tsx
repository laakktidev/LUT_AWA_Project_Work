import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import DocumentCreatePage from "./pages/DocumentCreatePage";
import DocumentDetailPage from "./pages/DocumentDetailPage";
import DocumentsListPage from "./pages/DocumentsListPage";
import DocumentEditPage from "./pages/DocumentEditPage";
import PublicDocumentPage from "./pages/PublicDocumentPage";


//import RequireAuth from "./layout/RequireAuth";
import AppLayout from "./layout/AppLayout";
import { User } from "./types/User";

const App = () => {
const [token, setToken] = useState<string | null>(null);
const [user, setUser] = useState<User | null>(null);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
                
        <Route path="/login" element={<LoginPage setToken={setToken} setUser={setUser} />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Protected */}
        {/*<Route element={<RequireAuth token={token} />}>*/}
        <Route element={<AppLayout token={token} setToken={setToken} />}>
          <Route path="/create" element={<DocumentCreatePage token={token} />} />
          <Route path="/view/:id" element={<DocumentDetailPage token={token} userId={user?.id}/>} />
          <Route path="/edit/:id" element={<DocumentEditPage token={token} />} />
          <Route path="/" element={token ? <DocumentsListPage token={token} userId={user?.id}/> : <LoginPage setToken={setToken} setUser={setUser}/>} />
          <Route path="/public/:id" element={<PublicDocumentPage />} />

        </Route>
        {/*</Route>*/}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
