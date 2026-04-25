import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import DashboardLayout from "../layouts/DashboardLayout";
import ApplicationFormDialog from "../components/ApplicationFormDialog";
import { applicationService } from "../services/applicationService";
import { useAuth } from "../context/AuthContext";
import { APPLICATION_STATUS } from "../utils/constants";

function formatDate(raw) {
  if (!raw) return "—";
  const d = new Date(raw);
  if (isNaN(d)) return "—";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function normalizeApplication(item) {
  return {
    ...item,
    createdAt: item.createdAt ?? item.created_at ?? null,
  };
}

export default function DashboardPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const toast = useRef(null);

  const [summary, setSummary] = useState({});
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
  const controller = new AbortController();

  const loadData = async () => {
    setLoading(true);
    try {
      const [summaryRes, pageRes] = await Promise.all([
        applicationService.getSummary(),
        applicationService.getPage({ page: 0, size: 5 }),
      ]);

      if (!controller.signal.aborted) {
        const pageData = pageRes.data || {};
        setSummary(summaryRes.data || {});
        setRecent((pageData.content || []).map(normalizeApplication));
      }
    } catch (err) {
      if (err.name !== "CanceledError") {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Could not load dashboard.",
          life: 3000,
        });
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  };

  loadData();
  return () => controller.abort();
}, []);

  const handleSave = async (form) => {
  try {
    await applicationService.create(form);

    const [summaryRes, pageRes] = await Promise.all([
      applicationService.getSummary(),
      applicationService.getPage({ page: 0, size: 5 }),
    ]);

    const pageData = pageRes.data || {};
    setSummary(summaryRes.data || {});
    setRecent((pageData.content || []).map(normalizeApplication));
    setCreateOpen(false);

    toast.current?.show({
      severity: "success",
      summary: "Added",
      detail: "Application created.",
      life: 2200,
    });
  } catch {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: "Could not save application.",
      life: 3000,
    });
  }
};

  const total = summary.TOTAL || Object.values(summary).reduce((s, v) => s + (v || 0), 0) || 0;

  const kpis = [
    { label: "Total",     value: total,                icon: "pi-briefcase",  key: null },
    { label: "Saved",     value: summary.SAVED || 0,   icon: "pi-bookmark",   key: "SAVED" },
    { label: "Applied",   value: summary.APPLIED || 0, icon: "pi-send",       key: "APPLIED" },
    { label: "Interview", value: summary.INTERVIEW || 0,icon: "pi-calendar",  key: "INTERVIEW" },
    { label: "Offer",     value: summary.OFFER || 0,   icon: "pi-star",       key: "OFFER" },
    { label: "Rejected",  value: summary.REJECTED || 0,icon: "pi-times",      key: "REJECTED" },
  ];

  const pipeline = [
    { label: "Applied",   value: summary.APPLIED || 0,   key: "APPLIED" },
    { label: "OA",        value: summary.OA || 0,         key: "OA" },
    { label: "Interview", value: summary.INTERVIEW || 0,  key: "INTERVIEW" },
    { label: "Offer",     value: summary.OFFER || 0,      key: "OFFER" },
  ];
  const pipelineMax = Math.max(...pipeline.map((p) => p.value), 1);

  return (
    <>
      <Toast ref={toast} position="bottom-right" />

      <DashboardLayout onCreateClick={() => setCreateOpen(true)}>
        <div className="db-root">

          {/* KPI Strip */}
          <div className="db-kpi-strip db-kpi-strip--wide">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="db-kpi">
                <div className="db-kpi__icon">
                  <i className={`pi ${kpi.icon}`} />
                </div>
                <div>
                  <div className="db-kpi__value">
                    {loading ? "—" : kpi.value}
                  </div>
                  <div className="db-kpi__label">{kpi.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="db-dashboard-grid">

            {/* Pipeline Funnel */}
            <div className="db-board db-board--half">
              <div className="db-board__header">
                <div>
                  <h2 className="db-board__title">Pipeline</h2>
                  <p className="db-board__sub">Conversion across stages</p>
                </div>
              </div>

              {loading ? (
                <div className="db-skeleton-list">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="db-card-skeleton" style={{ height: "36px" }} />
                  ))}
                </div>
              ) : (
                <div className="db-pipeline">
                  {pipeline.map((stage) => {
                    const meta = APPLICATION_STATUS[stage.key];
                    const pct = Math.round((stage.value / pipelineMax) * 100);
                    return (
                      <div key={stage.key} className="db-pipeline__row">
                        <span className="db-pipeline__label">{stage.label}</span>
                        <div className="db-pipeline__bar-track">
                          <div
                            className="db-pipeline__bar-fill"
                            style={{
                              width: `${pct}%`,
                              background: meta?.dot || "#94a3b8",
                            }}
                          />
                        </div>
                        <span className="db-pipeline__count">{stage.value}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="db-board db-board--half">
              <div className="db-board__header">
                <div>
                  <h2 className="db-board__title">Recent</h2>
                  <p className="db-board__sub">Last 5 applications added</p>
                </div>
                <Button
                  className="db-btn-primary"
                  label="View all"
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  text
                  size="small"
                  onClick={() => navigate("/applications")}
                />
              </div>

              {loading ? (
                <div className="db-skeleton-list">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="db-card-skeleton" style={{ height: "48px" }} />
                  ))}
                </div>
              ) : recent.length === 0 ? (
                <div className="db-empty">
                  <div className="db-empty__icon"><i className="pi pi-inbox" /></div>
                  <h3>No applications yet</h3>
                  <p>Create your first application to start tracking your pipeline.</p>
                    <Button
                      className="db-btn-primary"
                    label="Add Application"
                    icon="pi pi-plus"
                    size="small"
                    onClick={() => setCreateOpen(true)}
                  />
                </div>
              ) : (
                <ul className="db-recent-list">
                  {recent.map((item) => {
                    const meta = APPLICATION_STATUS[item.status] || {
                      label: item.status || "Unknown",
                      dot: "#94a3b8",
                      color: "#475569",
                      bg: "#f1f5f9",
                    };
                    return (
                      <li key={item.id} className="db-recent-item">
                        <div className="db-recent-item__avatar">
                          {(item.company || "?").slice(0, 1).toUpperCase()}
                        </div>
                        <div className="db-recent-item__body">
                          <span className="db-recent-item__title">
                            {item.title || "Untitled role"}
                          </span>
                          <span className="db-recent-item__company">{item.company || "—"}</span>
                        </div>
                        <div className="db-recent-item__meta">
                          <span
                            className="db-status-badge"
                            style={{ color: meta.color, background: meta.bg }}
                          >
                            <span
                              className="db-status-badge__dot"
                              style={{ background: meta.dot }}
                            />
                            {meta.label}
                          </span>
                          <span className="db-recent-item__date">
                            {formatDate(item.createdAt)}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

          </div>
        </div>

        <ApplicationFormDialog
          visible={createOpen}
          onHide={() => setCreateOpen(false)}
          onSave={handleSave}
        />
      </DashboardLayout>
    </>
  );
}