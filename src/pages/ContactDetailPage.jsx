import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useData } from "../data/DataContext";
import { useAuth } from "../auth/AuthContext";
import { deleteContact } from "../services/contacts";
import { addCall, deleteCall } from "../services/calls";
import { addLead, updateLead, deleteLead } from "../services/leads";
import { ILGI_TURLERI, ARAMA_SONUCLARI, LEAD_DURUMLARI, labelFor } from "../constants";
import CallForm from "../components/CallForm";
import LeadForm from "../components/LeadForm";

export default function ContactDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { contactById, calls, leads } = useData();
  const { user } = useAuth();
  const [showCallForm, setShowCallForm] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  const contact = contactById(id);
  const contactCalls = calls.filter((c) => c.contactId === id);
  const contactLeads = leads.filter((l) => l.contactId === id);

  if (!contact) {
    return (
      <div className="page">
        <p className="empty-state">Kişi bulunamadı.</p>
        <Link to="/kisiler">← Kişilere dön</Link>
      </div>
    );
  }

  async function handleAddCall(form) {
    await addCall(user.uid, { ...form, contactId: id });
    setShowCallForm(false);
  }

  async function handleAddLead(form) {
    await addLead(user.uid, { ...form, contactId: id });
    setShowLeadForm(false);
  }

  async function handleUpdateLead(form) {
    await updateLead(editingLead.id, form);
    setEditingLead(null);
  }

  async function handleDeleteContact() {
    if (confirm(`${contact.fullName} silinsin mi? Bu işlem geri alınamaz.`)) {
      await deleteContact(id);
      navigate("/kisiler");
    }
  }

  return (
    <div className="page">
      <Link to="/kisiler" className="back-link">← Kişilere dön</Link>

      <div className="page-header">
        <h1>{contact.fullName}</h1>
        <button className="danger" onClick={handleDeleteContact}>
          Kişiyi Sil
        </button>
      </div>

      <div className="detail-grid">
        <div><strong>Telefon:</strong> {contact.phone}</div>
        {contact.email && <div><strong>Email:</strong> {contact.email}</div>}
        {contact.region && <div><strong>Bölge:</strong> {contact.region}</div>}
        {contact.address && <div><strong>Adres:</strong> {contact.address}</div>}
        <div><strong>İlgi Türü:</strong> {labelFor(ILGI_TURLERI, contact.interestType)}</div>
        {contact.source && <div><strong>Kaynak:</strong> {contact.source}</div>}
        {contact.notes && <div className="full-width"><strong>Notlar:</strong> {contact.notes}</div>}
      </div>

      <section className="section">
        <div className="section-header">
          <h2>İpuçları / Fırsatlar</h2>
          <button onClick={() => setShowLeadForm(true)}>+ Yeni İpucu</button>
        </div>

        {showLeadForm && (
          <div className="panel">
            <LeadForm onSubmit={handleAddLead} onCancel={() => setShowLeadForm(false)} submitLabel="Ekle" />
          </div>
        )}

        {editingLead && (
          <div className="panel">
            <LeadForm
              initial={editingLead}
              onSubmit={handleUpdateLead}
              onCancel={() => setEditingLead(null)}
              submitLabel="Güncelle"
            />
          </div>
        )}

        {contactLeads.length === 0 && <p className="empty-state">Henüz ipucu eklenmedi.</p>}
        <div className="list">
          {contactLeads.map((lead) => (
            <div className="list-item" key={lead.id}>
              <div className="list-item-main">
                <strong>{lead.description}</strong>
                <span className={`tag status-${lead.status}`}>
                  {labelFor(LEAD_DURUMLARI, lead.status)}
                </span>
                {lead.nextFollowUpDate && (
                  <span className="muted">Takip: {lead.nextFollowUpDate}</span>
                )}
              </div>
              <div className="list-item-actions">
                <button className="secondary" onClick={() => setEditingLead(lead)}>
                  Düzenle
                </button>
                <button className="danger" onClick={() => deleteLead(lead.id)}>
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Arama Geçmişi</h2>
          <button onClick={() => setShowCallForm(true)}>+ Yeni Arama Kaydı</button>
        </div>

        {showCallForm && (
          <div className="panel">
            <CallForm onSubmit={handleAddCall} onCancel={() => setShowCallForm(false)} />
          </div>
        )}

        {contactCalls.length === 0 && <p className="empty-state">Henüz arama kaydı yok.</p>}
        <div className="list">
          {contactCalls.map((call) => (
            <div className="list-item" key={call.id}>
              <div className="list-item-main">
                <strong>{call.callDate}</strong>
                <span className="tag">{labelFor(ARAMA_SONUCLARI, call.result)}</span>
                {call.notes && <span className="muted">{call.notes}</span>}
              </div>
              <div className="list-item-actions">
                <button className="danger" onClick={() => deleteCall(call.id)}>
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
