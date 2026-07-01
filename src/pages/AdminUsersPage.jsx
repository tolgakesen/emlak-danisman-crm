import { useEffect, useState } from "react";
import { subscribeProfiles } from "../services/profiles";
import { createUser, resetPassword } from "../services/adminUsers";
import { formatDateTime } from "../utils/dates";

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState([]);
  const [newUser, setNewUser] = useState({ email: "", fullName: "", password: "" });
  const [resetTarget, setResetTarget] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => subscribeProfiles(setProfiles), []);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    setSubmitting(true);
    try {
      await createUser(newUser);
      setInfo(`${newUser.email} için hesap oluşturuldu.`);
      setNewUser({ email: "", fullName: "", password: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReset(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    setSubmitting(true);
    try {
      await resetPassword({ userId: resetTarget.id, newPassword });
      setInfo(`${resetTarget.email} için şifre güncellendi.`);
      setResetTarget(null);
      setNewPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Kullanıcılar</h1>
      </div>

      {error && <div className="form-error">{error}</div>}
      {info && <p className="muted">{info}</p>}

      <div className="panel">
        <h2>Yeni Kullanıcı Ekle</h2>
        <form className="card-form" onSubmit={handleCreate}>
          <label>
            Email *
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required
            />
          </label>
          <label>
            Ad Soyad
            <input
              value={newUser.fullName}
              onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
            />
          </label>
          <label>
            Geçici Şifre *
            <input
              type="text"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              minLength={6}
              required
            />
          </label>
          <div className="form-actions">
            <button type="submit" disabled={submitting}>
              Kullanıcı Oluştur
            </button>
          </div>
        </form>
      </div>

      <div className="list">
        {profiles.map((p) => (
          <div className="list-item" key={p.id}>
            <div className="list-item-main">
              <strong>{p.fullName || p.email}</strong>
              <span className="muted">{p.email}</span>
              <span className={`tag ${p.role === "admin" ? "status-kazanildi" : ""}`}>
                {p.role === "admin" ? "Admin" : "Kullanıcı"}
              </span>
              <span className="muted">{formatDateTime(p.createdAt)}</span>
            </div>
            <div className="list-item-actions">
              <button className="secondary" onClick={() => setResetTarget(p)}>
                Şifre Sıfırla
              </button>
            </div>
          </div>
        ))}
      </div>

      {resetTarget && (
        <div className="panel">
          <h2>{resetTarget.email} için Yeni Şifre</h2>
          <form className="card-form" onSubmit={handleReset}>
            <label>
              Yeni Şifre
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
                required
              />
            </label>
            <div className="form-actions">
              <button type="submit" disabled={submitting}>
                Şifreyi Güncelle
              </button>
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  setResetTarget(null);
                  setNewPassword("");
                }}
              >
                Vazgeç
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
