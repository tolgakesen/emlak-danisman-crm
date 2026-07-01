import { useState } from "react";
import { LEAD_DURUMLARI } from "../constants";

export default function LeadForm({ initial, onSubmit, onCancel, submitLabel }) {
  const [description, setDescription] = useState(initial?.description || "");
  const [status, setStatus] = useState(initial?.status || "yeni");
  const [nextFollowUpDate, setNextFollowUpDate] = useState(
    initial?.nextFollowUpDate || ""
  );
  const [notes, setNotes] = useState(initial?.notes || "");

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ description, status, nextFollowUpDate, notes });
  }

  return (
    <form className="card-form" onSubmit={handleSubmit}>
      <label>
        İpucu Açıklaması *
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ör: 3+1 satılık daire arıyor, bütçe 5M TL"
          required
        />
      </label>

      <label>
        Durum
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          {LEAD_DURUMLARI.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        Sonraki Takip Tarihi
        <input
          type="date"
          value={nextFollowUpDate}
          onChange={(e) => setNextFollowUpDate(e.target.value)}
        />
      </label>

      <label>
        Notlar
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
        />
      </label>

      <div className="form-actions">
        <button type="submit">{submitLabel || "İpucunu Kaydet"}</button>
        {onCancel && (
          <button type="button" className="secondary" onClick={onCancel}>
            Vazgeç
          </button>
        )}
      </div>
    </form>
  );
}
