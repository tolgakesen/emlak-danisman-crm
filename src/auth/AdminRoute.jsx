import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function AdminRoute({ children }) {
  const { loading, isAdmin } = useAuth();

  if (loading) return <div className="page-loading">Yükleniyor...</div>;
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
}
