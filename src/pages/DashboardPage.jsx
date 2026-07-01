import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useData } from "../data/DataContext";
import { LEAD_DURUMLARI, labelFor } from "../constants";
import { followUpBucket, formatDate } from "../utils/dates";

export default function DashboardPage() {
  const { contacts, calls, leads, contactById } = useData();

  const followUps = useMemo(() => {
    return leads
      .map((lead) => ({ lead, bucket: followUpBucket(lead.nextFollowUpDate) }))
      .filter(
        (item) =>
          (item.bucket === "gecikmis" || item.bucket === "bugun" || item.bucket === "yaklasan") &&
          item.lead.status !== "kazanildi" &&
          item.lead.status !== "kaybedildi"
      )
      .sort((a, b) => a.lead.nextFollowUpDate.localeCompare(b.lead.nextFollowUpDate))
      .slice(0, 10);
  }, [leads]);

  const statusCounts = useMemo(() => {
    const counts = {};
    for (const opt of LEAD_DURUMLARI) counts[opt.value] = 0;
    for (const lead of leads) counts[lead.status] = (counts[lead.status] || 0) + 1;
    return counts;
  }, [leads]);

  return (
    <div className="page">
      <h1>Pano</h1>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-number">{contacts.length}</span>
          <span className="stat-label">Kişi</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{calls.length}</span>
          <span className="stat-label">Arama</span>
        </div>
        {LEAD_DURUMLARI.map((opt) => (
          <div className="stat-card" key={opt.value}>
            <span className="stat-number">{statusCounts[opt.value]}</span>
            <span className="stat-label">{opt.label}</span>
          </div>
        ))}
      </div>

      <section className="section">
        <h2>Yaklaşan / Gecikmiş Takipler</h2>
        {followUps.length === 0 && (
          <p className="empty-state">Yaklaşan takip bulunmuyor.</p>
        )}
        <div className="list">
          {followUps.map(({ lead, bucket }) => {
            const contact = contactById(lead.contactId);
            return (
              <div className="list-item" key={lead.id}>
                <Link
                  to={contact ? `/kisiler/${contact.id}` : "/kisiler"}
                  className="list-item-main"
                >
                  <strong>{contact ? contact.fullName : "Bilinmeyen kişi"}</strong>
                  <span>{lead.description}</span>
                  <span className={`tag bucket-${bucket}`}>
                    {formatDate(lead.nextFollowUpDate)}
                  </span>
                  <span className="tag">{labelFor(LEAD_DURUMLARI, lead.status)}</span>
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
