import { useEffect, useRef, useState } from "react";
import { Button }    from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast }     from "primereact/toast";
import { linkedEmailService } from "../services/linkedEmailService";

export default function LinkedEmailsSection() {
  const toast = useRef(null);

  const [emails,   setEmails]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [adding,   setAdding]   = useState(false);
  const [removingId, setRemovingId] = useState(null);

  // ── Load on mount ────────────────────────────────────────────────────
  useEffect(() => {
    linkedEmailService.getAll()
      .then(res => setEmails(res.data))
      .catch(() => toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Could not load linked emails.",
        life: 3000,
      }))
      .finally(() => setLoading(false));
  }, []);

  // ── Add ─────────────────────────────────────────────────────────────
  const handleAdd = async () => {
    const trimmed = newEmail.trim();
    if (!trimmed) return;

    setAdding(true);
    try {
      const res = await linkedEmailService.add(trimmed, newLabel.trim() || null);
      setEmails(prev => [...prev, res.data]);
      setNewEmail("");
      setNewLabel("");
      toast.current?.show({
        severity: "success",
        summary: "Email linked",
        detail: `${trimmed} has been added.`,
        life: 2200,
      });
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add email.";
      toast.current?.show({
        severity: err.response?.status === 409 ? "warn" : "error",
        summary:  err.response?.status === 409 ? "Already linked" : "Error",
        detail:   msg,
        life: 3000,
      });
    } finally {
      setAdding(false);
    }
  };

  // ── Remove ───────────────────────────────────────────────────────────
  const handleRemove = async (id, email) => {
    setRemovingId(id);
    try {
      await linkedEmailService.remove(id);
      setEmails(prev => prev.filter(e => e.id !== id));
      toast.current?.show({
        severity: "success",
        summary: "Removed",
        detail: `${email} has been unlinked.`,
        life: 2000,
      });
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Could not remove this email. Try again.",
        life: 3000,
      });
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <>
      <Toast ref={toast} position="bottom-right" />

      <section className="settings-card">
        <div className="settings-card__head">
          <h3>Linked email accounts</h3>
          <p>
            Add Gmail or other email accounts to enable automatic application
            detection in the future.
          </p>
        </div>

        {/* ── Existing emails list ── */}
        {loading ? (
          <p className="linked-emails__loading">Loading…</p>
        ) : emails.length === 0 ? (
          <p className="linked-emails__empty">
            No email accounts linked yet.
          </p>
        ) : (
          <ul className="linked-emails__list">
            {emails.map(entry => (
              <li key={entry.id} className="linked-emails__row">
                <span className="linked-emails__icon">
                  <i className="pi pi-envelope" />
                </span>
                <div className="linked-emails__info">
                  <span className="linked-emails__address">{entry.email}</span>
                  {entry.label && (
                    <span className="linked-emails__label">{entry.label}</span>
                  )}
                </div>
                <Button
                  icon={removingId === entry.id ? "pi pi-spin pi-spinner" : "pi pi-trash"}
                  className="p-button-text p-button-danger p-button-sm linked-emails__remove"
                  onClick={() => handleRemove(entry.id, entry.email)}
                  disabled={removingId === entry.id}
                  aria-label={`Remove ${entry.email}`}
                  title="Remove"
                />
              </li>
            ))}
          </ul>
        )}

        {/* ── Add new email form ── */}
        <div className="linked-emails__add-form">
          <div className="linked-emails__add-row">
            <div className="field linked-emails__field">
              <label htmlFor="le-email">Email address</label>
              <InputText
                id="le-email"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAdd()}
                placeholder="you@gmail.com"
                type="email"
              />
            </div>
            <div className="field linked-emails__field">
              <label htmlFor="le-label">Label <span className="linked-emails__optional">(optional)</span></label>
              <InputText
                id="le-label"
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAdd()}
                placeholder="e.g. Work Gmail"
              />
            </div>
          </div>
          <Button
            label={adding ? "Adding…" : "Add email"}
            icon={adding ? "pi pi-spin pi-spinner" : "pi pi-plus"}
            loading={adding}
            onClick={handleAdd}
            disabled={!newEmail.trim() || adding}
            className="linked-emails__add-btn"
          />
        </div>
      </section>
    </>
  );
}