import { useState } from "react";
import { ARAMA_SONUCLARI } from "../constants";
import { nowDateTimeLocal } from "../utils/dates";

export default function CallForm({ onSubmit, onCancel }) {
  const [callDate, setCallDate] = useState(nowDateTimeLocal());
  const [result, setResult] = useState("ulasildi");
  const [notes, setNotes] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ callDate, result, notes });
    setNotes("");
  }

  return (
    <form className="card-form" onSubmit={handleSubmit}>
      <label>
        Tarih ve Saat
        <input
          type="datetime-local"
          value={callDate}
          onChange={(e) => setCallDate(e.target.value)}
          required
        />
      </label>

      <label>
        Sonuç
        <select value={result} onChange={(e) => setResult(e.target.value)}>
          {ARAMA_SONUCLARI.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        Görüşme Notu
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
        />
      </label>

      <div className="form-actions">
        <button type="submit">Aramayı Kaydet</button>
        {onCancel && (
          <button type="button" className="secondary" onClick={onCancel}>
            Vazgeç
          </button>
        )}
      </div>
    </form>
  );
}
