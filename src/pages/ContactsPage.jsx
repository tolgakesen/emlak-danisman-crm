import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useData } from "../data/DataContext";
import { useAuth } from "../auth/AuthContext";
import { addContact, updateContact, deleteContact } from "../services/contacts";
import { ILGI_TURLERI, labelFor } from "../constants";
import ContactForm from "../components/ContactForm";

export default function ContactsPage() {
  const { contacts } = useData();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return contacts;
    return contacts.filter((c) =>
      [c.fullName, c.phone, c.region, c.email]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(term))
    );
  }, [contacts, search]);

  async function handleAdd(form) {
    await addContact(user.id, form);
    setShowForm(false);
  }

  async function handleUpdate(form) {
    await updateContact(editing.id, form);
    setEditing(null);
  }

  async function handleDelete(id) {
    if (confirm("Bu kişiyi silmek istediğinize emin misiniz?")) {
      await deleteContact(id);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Kişiler</h1>
        <button onClick={() => setShowForm(true)}>+ Yeni Kişi</button>
      </div>

      <input
        className="search-input"
        placeholder="Ad, telefon, bölge veya email ara..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {showForm && (
        <div className="panel">
          <h2>Yeni Kişi Ekle</h2>
          <ContactForm
            onSubmit={handleAdd}
            onCancel={() => setShowForm(false)}
            submitLabel="Ekle"
          />
        </div>
      )}

      {editing && (
        <div className="panel">
          <h2>Kişiyi Düzenle</h2>
          <ContactForm
            initial={editing}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
            submitLabel="Güncelle"
          />
        </div>
      )}

      <div className="list">
        {filtered.length === 0 && <p className="empty-state">Kişi bulunamadı.</p>}
        {filtered.map((contact) => (
          <div className="list-item" key={contact.id}>
            <Link to={`/kisiler/${contact.id}`} className="list-item-main">
              <strong>{contact.fullName}</strong>
              <span>{contact.phone}</span>
              <span className="tag">{labelFor(ILGI_TURLERI, contact.interestType)}</span>
              {contact.region && <span className="muted">{contact.region}</span>}
            </Link>
            <div className="list-item-actions">
              <button className="secondary" onClick={() => setEditing(contact)}>
                Düzenle
              </button>
              <button className="danger" onClick={() => handleDelete(contact.id)}>
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
