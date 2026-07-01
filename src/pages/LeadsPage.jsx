import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useData } from "../data/DataContext";
import { LEAD_DURUMLARI, labelFor } from "../constants";
import { followUpBucket, formatDate } from "../utils/dates";

const BUCKET_LABELS = {
  gecikmis: "Gecikmiş",
  bugun: "Bugün",
  yaklasan: "Yaklaşan",
};

const BUCKET_ORDER = { gecikmis: 0, bugun: 1, yaklasan: 2 };

export default function LeadsPage() {
  const { leads, contactById } = useData();
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    const list =
      statusFilter === "all" ? leads : leads.filter((l) => l.status === statusFilter);

    return [...list].sort((a, b) => {
      const ba = BUCKET_ORDER[followUpBucket(a.nextFollowUpDate)] ?? 3;
      const bb = BUCKET_ORDER[followUpBucket(b.nextFollowUpDate)] ?? 3;
      if (ba !== bb) return ba - bb;
      return (a.nextFollowUpDate || "").localeCompare(b.nextFollowUpDate || "");
    });
  }, [leads, statusFilter]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>İpuçları (Pipeline)</h1>
      </div>

      <div className="filter-row">
        <button
          className={statusFilter === "all" ? "filter-active" : "secondary"}
          onClick={() => setStatusFilter("all")}
        >
          Tümü
        </button>
        {LEAD_DURUMLARI.map((opt) => (
          <button
            key={opt.value}
            className={statusFilter === opt.value ? "filter-active" : "secondary"}
            onClick={() => setStatusFilter(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 && <p className="empty-state">İpucu bulunamadı.</p>}

      <div className="list">
        {filtered.map((lead) => {
          const contact = contactById(lead.contactId);
          const bucket = followUpBucket(lead.nextFollowUpDate);
          return (
            <div className="list-item" key={lead.id}>
              <Link
                to={contact ? `/kisiler/${contact.id}` : "/kisiler"}
                className="list-item-main"
              >
                <strong>{contact ? contact.fullName : "Bilinmeyen kişi"}</strong>
                <span>{lead.description}</span>
                <span className={`tag status-${lead.status}`}>
                  {labelFor(LEAD_DURUMLARI, lead.status)}
                </span>
                {bucket && (
                  <span className={`tag bucket-${bucket}`}>
                    {BUCKET_LABELS[bucket]}: {formatDate(lead.nextFollowUpDate)}
                  </span>
                )}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
