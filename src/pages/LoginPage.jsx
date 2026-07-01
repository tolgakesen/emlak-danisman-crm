import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function supabaseErrorToTurkish(message) {
  const map = [
    [/invalid login credentials/i, "Email veya şifre hatalı."],
    [/email.*not.*confirmed/i, "Email adresinizi onaylamanız gerekiyor."],
    [/invalid email/i, "Geçersiz email adresi."],
  ];
  const match = map.find(([pattern]) => pattern.test(message || ""));
  return match ? match[1] : "Bir hata oluştu, lütfen tekrar deneyin.";
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
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
        <p className="auth-subtitle">Hesabınıza giriş yapın</p>

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
          {submitting ? "Bekleyin..." : "Giriş Yap"}
        </button>

        <p className="auth-subtitle">
          Hesabınız yoksa admin sizin için oluşturur.
        </p>
      </form>
    </div>
  );
}
