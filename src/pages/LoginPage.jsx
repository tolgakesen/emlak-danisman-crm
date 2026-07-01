import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function supabaseErrorToTurkish(message) {
  const map = [
    [/invalid login credentials/i, "Email veya şifre hatalı."],
    [/email.*not.*confirmed/i, "Email adresinizi onaylamanız gerekiyor."],
    [/user already registered/i, "Bu email zaten kayıtlı."],
    [/password.*should be at least/i, "Şifre en az 6 karakter olmalı."],
    [/invalid email/i, "Geçersiz email adresi."],
  ];
  const match = map.find(([pattern]) => pattern.test(message || ""));
  return match ? match[1] : "Bir hata oluştu, lütfen tekrar deneyin.";
}

export default function LoginPage() {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      navigate("/", { replace: true });
    } catch (err) {
      setError(supabaseErrorToTurkish(err.message));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Emlak CRM</h1>
        <p className="auth-subtitle">
          {mode === "login" ? "Hesabınıza giriş yapın" : "Yeni hesap oluşturun"}
        </p>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </label>

        <label>
          Şifre
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </label>

        {error && <div className="form-error">{error}</div>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Bekleyin..." : mode === "login" ? "Giriş Yap" : "Kayıt Ol"}
        </button>

        <button
          type="button"
          className="link-button"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
        >
          {mode === "login"
            ? "Hesabınız yok mu? Kayıt olun"
            : "Zaten hesabınız var mı? Giriş yapın"}
        </button>
      </form>
    </div>
  );
}
