// src/components/ConnectedGmailSection.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { gmailService } from "../services/gmailService";

export default function ConnectedGmailSection() {
  const toast = useRef(null);
  const location = useLocation();
  const query = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const gmailLinkedFlag = query.get("gmailLinked");

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [removingEmail, setRemovingEmail] = useState(null);

  // ── Load accounts ────────────────────────────────────────────────────
  const loadAccounts = () => {
    gmailService
      .getAccounts()
      .then((res) => setAccounts(res.data || []))
      .catch(() =>
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Could not load Gmail accounts.",
          life: 3000,
        })
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  // ── Handle redirect back from Google OAuth ───────────────────────────
  useEffect(() => {
    if (gmailLinkedFlag === "1") {
      toast.current?.show({
        severity: "success",
        summary: "Gmail connected",
        detail: "Your Gmail account was linked successfully.",
        life: 3000,
      });
      window.history.replaceState({}, "", "/settings");
      gmailService
        .getAccounts()
        .then((res) => setAccounts(res.data || []))
        .catch(() => {});
    }
  }, [gmailLinkedFlag]);

  // ── Connect new account ──────────────────────────────────────────────
  const handleConnect = async () => {
    setConnecting(true);
    try {
      const res = await gmailService.getAuthUrl();
      window.location.href = res.data;
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Could not start Gmail connection.",
        life: 3000,
      });
      setConnecting(false);
    }
  };

  // ── Remove account ───────────────────────────────────────────────────
  const handleRemove = async (email) => {
    setRemovingEmail(email);
    try {
      await gmailService.removeAccount(email);
      setAccounts((prev) => prev.filter((a) => a.email !== email));
      toast.current?.show({
        severity: "success",
        summary: "Account removed",
        detail: `${email} has been disconnected.`,
        life: 2500,
      });
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: `Could not remove ${email}. Try again.`,
        life: 3000,
      });
    } finally {
      setRemovingEmail(null);
    }
  };

  return (
    <>
      <Toast ref={toast} position="bottom-right" />

      <section className="settings-card">
        <div className="settings-card__head">
          <h3>Gmail automation</h3>
          <p>
            Connect one or more Gmail accounts to automatically detect job
            applications, interviews, and rejections from your inbox.
          </p>
        </div>

        {/* ── Accounts list ── */}
        {loading ? (
          <div className="linked-emails__list">
            <div className="skeleton skeleton-text" style={{ width: "60%" }} />
          </div>
        ) : accounts.length === 0 ? (
          <p className="linked-emails__empty">No Gmail accounts connected yet.</p>
        ) : (
          <ul className="linked-emails__list">
            {accounts.map((account) => (
              <li key={account.email} className="linked-emails__row">
                <span className="linked-emails__icon">
                  <i className="pi pi-envelope" />
                </span>
                <div className="linked-emails__info">
                  <span className="linked-emails__address">{account.email}</span>
                  {account.linkedAt && (
                    <span className="linked-emails__label">
                      Connected {new Date(account.linkedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <span className="linked-emails__badge linked-emails__badge--active">
                  Active
                </span>
                <Button
                  icon={
                    removingEmail === account.email
                      ? "pi pi-spin pi-spinner"
                      : "pi pi-trash"
                  }
                  className="p-button-text p-button-danger p-button-sm linked-emails__remove"
                  onClick={() => handleRemove(account.email)}
                  disabled={removingEmail === account.email}
                  aria-label={`Remove ${account.email}`}
                  title="Remove"
                />
              </li>
            ))}
          </ul>
        )}

        {/* ── Connect new account button ── */}
        <div className="linked-emails__actions">
          <Button
            label={connecting ? "Redirecting…" : "Connect Gmail account"}
            icon="pi pi-google"
            className="p-button-outlined"
            onClick={handleConnect}
            loading={connecting}
            disabled={connecting}
          />
        </div>
      </section>
    </>
  );
}