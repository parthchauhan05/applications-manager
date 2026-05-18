// src/components/ConnectedGmailSection.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { gmailService } from "../services/gmailService";

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

export default function ConnectedGmailSection() {
  const toast = useRef(null);
const location = useLocation();
const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const gmailLinkedFlag = query.get("gmailLinked");
    const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  // Load connected accounts on mount
  useEffect(() => {
    gmailService
      .getAccounts()
      .then((res) => setAccounts(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Show success toast if redirected back from Google OAuth
  useEffect(() => {
  if (gmailLinkedFlag === "1") {
    toast.current?.show({
      severity: "success",
      summary: "Gmail connected",
      detail: "Your Gmail account was linked successfully.",
      life: 3000,
    });

    // Clean up query string
    window.history.replaceState({}, "", "/settings");

    // Re-fetch accounts once, now that we know link succeeded
    gmailService
      .getAccounts()
      .then((res) => setAccounts(res.data || []))
      .catch(() => {});
  }
}, [gmailLinkedFlag]); // ← depends only on the string, not on the whole query object

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const res = await gmailService.getAuthUrl();
      // Backend returns plain string URL, not { url: "..." }
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

  return (
    <>
      <Toast ref={toast} position="bottom-right" />

      <section className="settings-card">
        <div className="settings-card__head">
          <h3>Gmail automation</h3>
          <p>
            Connect a Gmail account to automatically detect job applications,
            interviews, and rejections from your inbox.
          </p>
        </div>

        {loading ? (
          <div className="linked-emails__list">
            <div className="skeleton skeleton-text" style={{ width: "60%" }} />
          </div>
        ) : accounts.length === 0 ? (
          <p className="linked-emails__empty">No Gmail accounts connected yet.</p>
        ) : (
          <ul className="linked-emails__list">
            {accounts.map((account) => (
              <li key={account.id} className="linked-emails__item">
                <span className="linked-emails__icon">
                  <i className="pi pi-envelope" />
                </span>
                <span className="linked-emails__address">{account.email}</span>
                <span className="linked-emails__badge linked-emails__badge--active">
                  Active
                </span>
              </li>
            ))}
          </ul>
        )}

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