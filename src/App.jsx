import { HashRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import "./App.css";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { DataProvider } from "./data/DataContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ContactsPage from "./pages/ContactsPage";
import ContactDetailPage from "./pages/ContactDetailPage";
import LeadsPage from "./pages/LeadsPage";

function Layout({ children }) {
  const { logout, user } = useAuth();

  return (
    <div className="app-shell">
      <header className="top-bar">
        <span className="brand">Emlak CRM</span>
        <nav className="main-nav">
          <NavLink to="/" end>Pano</NavLink>
          <NavLink to="/kisiler">Kişiler</NavLink>
          <NavLink to="/ipuclari">İpuçları</NavLink>
        </nav>
        <div className="user-area">
          <span className="user-email">{user?.email}</span>
          <button className="secondary" onClick={logout}>Çıkış</button>
        </div>
      </header>
      <main className="main-content">{children}</main>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/giris" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout><DashboardPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/kisiler"
        element={
          <ProtectedRoute>
            <Layout><ContactsPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/kisiler/:id"
        element={
          <ProtectedRoute>
            <Layout><ContactDetailPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ipuclari"
        element={
          <ProtectedRoute>
            <Layout><LeadsPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <DataProvider>
          <AppRoutes />
        </DataProvider>
      </AuthProvider>
    </HashRouter>
  );
}
