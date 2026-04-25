import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Paginator } from "primereact/paginator";
import { Toast } from "primereact/toast";
import DashboardLayout from "../layouts/DashboardLayout";
import ApplicationFormDialog from "../components/ApplicationFormDialog";
import { applicationService } from "../services/applicationService";
import { useAuth } from "../context/AuthContext";
import {
  APPLICATION_STATUS,
  STATUS_OPTIONS,
  JOB_TYPE_OPTIONS,
  SOURCE_OPTIONS,
} from "../utils/constants";
import "../styles/dashboard.css";

const STATUS_FILTERS = [{ label: "All", value: "" }, ...STATUS_OPTIONS];

const sourceLabelMap = Object.fromEntries(
  SOURCE_OPTIONS.map((opt) => [opt.value, opt.label])
);

const jobTypeLabelMap = Object.fromEntries(
  JOB_TYPE_OPTIONS.map((opt) => [opt.value, opt.label])
);

function formatDate(raw) {
  if (!raw) return null;
  const d = new Date(raw);
  if (isNaN(d)) return null;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function normalizeApplication(item) {
  return {
    ...item,
    jobType: item.jobType ?? item.job_type ?? "",
    appliedDate: item.appliedDate ?? item.applied_date ?? null,
    followupDate: item.followupDate ?? item.followup_date ?? null,
    interviewDate: item.interviewDate ?? item.interview_date ?? null,
    recruiterName: item.recruiterName ?? item.recruiter_name ?? "",
    recruiterEmail: item.recruiterEmail ?? item.recruiter_email ?? "",
    createdAt: item.createdAt ?? item.created_at ?? null,
    updatedAt: item.updatedAt ?? item.updated_at ?? null,
  };
}

function getNextStep(item) {
  if (item.interviewDate) return `Interview ${formatDate(item.interviewDate)}`;
  if (item.followupDate) return `Follow-up ${formatDate(item.followupDate)}`;
  if (item.appliedDate) return `Applied ${formatDate(item.appliedDate)}`;
  if (item.createdAt) return `Created ${formatDate(item.createdAt)}`;
  return "No timeline yet";
}

export default function ApplicationsPage() {
  const { logout } = useAuth();
  const toast = useRef(null);

  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [expandedId, setExpandedId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(0);
      setExpandedId(null);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPage(0);
    setExpandedId(null);
  }, [statusFilter]);

  const loadSummary = async () => {
    try {
      const res = await applicationService.getSummary();
      setSummary(res.data || {});
    } catch {
      // keep page usable even if summary fails
    }
  };

  const loadPage = async () => {
  setLoading(true);
  try {
    const res = await applicationService.getPage({
      page,
      size: rows,
      status: statusFilter,
      search: debouncedSearch,
    });

    const data = res.data;

    const content = Array.isArray(data) ? data : (data.content || []);
    const total = Array.isArray(data) ? data.length : (data.totalElements || 0);

    setItems(content.map(normalizeApplication));
    setTotalRecords(total);
  } catch (error) {
    console.error("Could not load applications:", error);
    setItems([]);
    setTotalRecords(0);
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: "Could not load applications.",
      life: 3000,
    });
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadPage();
  }, [page, rows, statusFilter, debouncedSearch]);

  useEffect(() => {
    loadSummary();
  }, []);

  const saveApplication = async (form) => {
    try {
      if (editingItem) {
        await applicationService.update(editingItem.id, form);
        toast.current?.show({
          severity: "success",
          summary: "Updated",
          detail: "Application updated.",
          life: 2200,
        });
        setEditingItem(null);
      } else {
        await applicationService.create(form);
        toast.current?.show({
          severity: "success",
          summary: "Added",
          detail: "Application created.",
          life: 2200,
        });
        setCreateOpen(false);
      }

      await Promise.all([loadPage(), loadSummary()]);
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Could not save application.",
        life: 3000,
      });
    }
  };

  const statusChips = useMemo(() => {
    return STATUS_FILTERS.map((sf) => ({
      ...sf,
      count: sf.value === "" ? totalRecords : summary[sf.value] || 0,
    }));
  }, [summary, totalRecords]);

  const startIndex = totalRecords === 0 ? 0 : page * rows + 1;
  const endIndex = Math.min((page + 1) * rows, totalRecords);

  return (
    <>
      <Toast ref={toast} position="bottom-right" />

      <DashboardLayout onCreateClick={() => setCreateOpen(true)}>
        <div className="ap-page">
        <div className="db-root">
          <div className="db-board">
            <div className="db-board__header">
              <div>
                <p className="apps-eyebrow">Application tracker</p>
                <h2 className="db-board__title">Applications</h2>
                <p className="db-board__sub">
                  {loading ? "Loading applications..." : `${startIndex}-${endIndex} of ${totalRecords} applications`}
                </p>
              </div>

              <div className="db-board__actions">
                <Button
                  label="New"
                  icon="pi pi-plus"
                  size="small"
                    // className="db-btn-new"
                  className="db-btn-primary"
                  onClick={() => setCreateOpen(true)}
                />
                  <Button
                  label="Logout"
                  icon="pi pi-sign-out"
                  text
                  size="small"
                  onClick={logout}
                />
              </div>
            </div>

            <div className="db-controls">
              <div className="db-search">
                <i className="pi pi-search db-search__icon" />
                <InputText
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search title, company, recruiter, notes, source…"
                  className="db-search__input"
                />
                {searchInput && (
                  <button
                    className="db-search__clear"
                    onClick={() => setSearchInput("")}
                    aria-label="Clear search"
                  >
                    <i className="pi pi-times" />
                  </button>
                )}
              </div>
            </div>

            <div className="db-status-chips apps-status-chips" role="group" aria-label="Filter by status">
              {statusChips.map((sf) => (
                <button
                  key={sf.value || "all"}
                  className={`db-chip ${statusFilter === sf.value ? "db-chip--active" : ""}`}
                  onClick={() => setStatusFilter(sf.value)}
                >
                  {sf.value && (
                    <span
                      className="db-chip__dot"
                      style={{ background: APPLICATION_STATUS[sf.value]?.dot }}
                    />
                  )}
                  {sf.label}
                  <span className="apps-chip-count">{sf.count}</span>
                </button>
              ))}
            </div>

            {loading ? (
              <div className="db-card-list db-card-list--loading">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="db-card-skeleton" />
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="db-empty">
                <div className="db-empty__icon">
                  <i className="pi pi-briefcase" />
                </div>
                <h3>No applications found</h3>
                <p>
                  {debouncedSearch || statusFilter
                    ? "Try changing the search or selected status."
                    : "Create your first application to start tracking your job pipeline."}
                </p>
              </div>
            ) : (
              <div className="db-card-list">
                {items.map((item, index) => {
                  const meta = APPLICATION_STATUS[item.status] || {
                    label: item.status || "Unknown",
                    color: "#475569",
                    bg: "#f8fafc",
                    dot: "#94a3b8",
                  };

                  const isExpanded = expandedId === item.id;

                  return (
                    <article
                      key={item.id}
                      className="db-app-card"
                      style={{ animationDelay: `${Math.min(index * 40, 240)}ms` }}
                    >
                      <div className="db-app-card__top">
                        <div className="db-app-card__identity">
                          <div className="db-app-card__avatar">
                            {(item.company || "?").slice(0, 1).toUpperCase()}
                          </div>

                          <div className="db-app-card__heading">
                            <div className="db-app-card__title-row">
                              <h3>{item.title || "Untitled role"}</h3>

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
                            </div>

                            <div className="db-app-card__company-row">
                              <span className="db-inline-meta">
                                <i className="pi pi-building" />
                                {item.company || "Unknown company"}
                              </span>

                              {item.location && (
                                <span className="db-inline-meta">
                                  <i className="pi pi-map-marker" />
                                  {item.location}
                                </span>
                              )}

                              {(item.jobType || item.source) && (
                                <span className="db-inline-meta">
                                  <i className="pi pi-tag" />
                                  {jobTypeLabelMap[item.jobType] || item.jobType || "—"}
                                  {item.source ? ` · ${sourceLabelMap[item.source] || item.source}` : ""}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="db-app-card__actions">
                          {item.url && (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="db-row-icon-btn db-row-icon-btn--link"
                              aria-label="Open job posting"
                              title="Open job posting"
                            >
                              <i className="pi pi-external-link" />
                            </a>
                          )}

                          <button
                            className="db-row-icon-btn"
                            onClick={() => setEditingItem(item)}
                            aria-label="Edit application"
                            title="Edit application"
                          >
                            <i className="pi pi-pencil" />
                          </button>

                          <button
                            className={`db-row-icon-btn ${isExpanded ? "is-active" : ""}`}
                            onClick={() => setExpandedId(isExpanded ? null : item.id)}
                            aria-label={isExpanded ? "Collapse details" : "Expand details"}
                            title={isExpanded ? "Collapse details" : "Expand details"}
                          >
                            <i className={`pi ${isExpanded ? "pi-chevron-up" : "pi-chevron-down"}`} />
                          </button>
                        </div>
                      </div>

                      <div className="db-app-card__middle">
                        <div className="db-mini-stat">
                          <span className="db-mini-stat__label">Next step</span>
                          <span className="db-mini-stat__value">{getNextStep(item)}</span>
                        </div>

                        <div className="db-mini-stat">
                          <span className="db-mini-stat__label">Recruiter</span>
                          <span className="db-mini-stat__value">
                            {item.recruiterName || item.recruiterEmail || "Not added"}
                          </span>
                        </div>

                        <div className="db-mini-stat">
                          <span className="db-mini-stat__label">Updated</span>
                          <span className="db-mini-stat__value">
                            {formatDate(item.updatedAt || item.createdAt) || "—"}
                          </span>
                        </div>
                      </div>

                      {item.notes && (
                        <div className="db-app-card__preview">
                          <p>{item.notes}</p>
                        </div>
                      )}

                      {isExpanded && (
                        <div className="db-app-card__expand">
                          <div className="db-expand-grid">
                            <div className="db-expand-block">
                              <div className="db-expand-block__label">Timeline</div>
                              <div className="db-expand-block__value">
                                Applied: {formatDate(item.appliedDate) || "—"}
                              </div>
                              <div className="db-expand-block__value">
                                Follow-up: {formatDate(item.followupDate) || "—"}
                              </div>
                              <div className="db-expand-block__value">
                                Interview: {formatDate(item.interviewDate) || "—"}
                              </div>
                            </div>

                            <div className="db-expand-block">
                              <div className="db-expand-block__label">Recruiter</div>
                              <div className="db-expand-block__value">
                                {item.recruiterName || "No recruiter"}
                              </div>
                              <div className="db-expand-block__muted">
                                {item.recruiterEmail || "No recruiter email"}
                              </div>
                            </div>

                            <div className="db-expand-block">
                              <div className="db-expand-block__label">Application</div>
                              <div className="db-expand-block__value">
                                Source: {sourceLabelMap[item.source] || item.source || "—"}
                              </div>
                              <div className="db-expand-block__value">
                                Type: {jobTypeLabelMap[item.jobType] || item.jobType || "—"}
                              </div>
                              <div className="db-expand-block__value">
                                Created: {formatDate(item.createdAt) || "—"}
                              </div>
                            </div>
                          </div>

                          <div className="db-expand-notes">
                            <div className="db-expand-block__label">Notes</div>
                            <p>{item.notes || "No notes added yet."}</p>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}

            <div className="apps-paginator-shell">
              <Paginator
                first={page * rows}
                rows={rows}
                totalRecords={totalRecords}
                rowsPerPageOptions={[10, 20, 30, 50]}
                onPageChange={(e) => {
                  setPage(e.page);
                  setRows(e.rows);
                  setExpandedId(null);
                }}
                template="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} to {last} of {totalRecords}"
              />
            </div>
          </div>
          </div>
          </div>

        <ApplicationFormDialog
          visible={createOpen}
          onHide={() => setCreateOpen(false)}
          onSave={saveApplication}
        />

        <ApplicationFormDialog
          visible={!!editingItem}
          onHide={() => setEditingItem(null)}
          onSave={saveApplication}
          initialValue={editingItem}
        />
      </DashboardLayout>
    </>
  );
}