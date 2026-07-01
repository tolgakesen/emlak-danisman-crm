import { useState } from "react";
import { ILGI_TURLERI } from "../constants";

const EMPTY = {
  fullName: "",
  phone: "",
  email: "",
  region: "",
  address: "",
  interestType: "alici",
  source: "",
  notes: "",
};

export default function ContactForm({ initial, onSubmit, onCancel, submitLabel }) {
  const [form, setForm] = useState(initial || EMPTY);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form className="card-form" onSubmit={handleSubmit}>
      <label>
        Ad Soyad *
        <input
          value={form.fullName}
          onChange={(e) => set("fullName", e.target.value)}
          required
        />
      </label>

      <label>
        Telefon *
        <input
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
          required
        />
      </label>

      <label>
        Email
        <input
          type="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
        />
      </label>

      <label>
        Bölge / Mahalle
        <input
          value={form.region}
          onChange={(e) => set("region", e.target.value)}
        />
      </label>

      <label>
        Adres
        <input
          value={form.address}
          onChange={(e) => set("address", e.target.value)}
        />
      </label>

      <label>
        İlgi Türü
        <select
          value={form.interestType}
          onChange={(e) => set("interestType", e.target.value)}
        >
          {ILGI_TURLERI.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        Kaynak (nasıl tanıştınız)
        <input
          value={form.source}
          onChange={(e) => set("source", e.target.value)}
          placeholder="Ör: Etki çevresi, referans, sosyal medya..."
        />
      </label>

      <label>
        Notlar
        <textarea
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          rows={3}
        />
      </label>

      <div className="form-actions">
        <button type="submit">{submitLabel || "Kaydet"}</button>
        {onCancel && (
          <button type="button" className="secondary" onClick={onCancel}>
            Vazgeç
          </button>
        )}
      </div>
    </form>
  );
}
