import { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { TabView, TabPanel } from "primereact/tabview";
import {
  STATUS_OPTIONS,
  JOB_TYPE_OPTIONS,
  SOURCE_OPTIONS,
} from "../utils/constants";

const emptyForm = {
  title: "",
  company: "",
  status: "APPLIED",
  url: "",
  job_type: "",
  location: "",
  source: "",
  applied_date: null,
  followup_date: null,
  interview_date: null,
  recruiter_name: "",
  recruiter_email: "",
  notes: "",
};

function parseDate(val) {
  if (!val) return null;
  const d = new Date(val);
  return isNaN(d) ? null : d;
}

export default function ApplicationFormDialog({ visible, onHide, onSave, initialValue }) {
  const [form, setForm] = useState(emptyForm);
  const isEdit = !!initialValue;

  useEffect(() => {
    if (initialValue) {
      setForm({
        title:          initialValue.title          || "",
        company:        initialValue.company        || "",
        status:         initialValue.status         || "APPLIED",
        url:            initialValue.url            || "",
        job_type:       initialValue.job_type       || "",
        location:       initialValue.location       || "",
        source:         initialValue.source         || "",
        applied_date:   parseDate(initialValue.applied_date),
        followup_date:  parseDate(initialValue.followup_date),
        interview_date: parseDate(initialValue.interview_date),
        recruiter_name: initialValue.recruiter_name || "",
        recruiter_email:initialValue.recruiter_email|| "",
        notes:          initialValue.notes          || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialValue, visible]);

  const set = (key) => (e) => {
    const val = e?.target !== undefined ? e.target.value : e;
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const footer = (
    <div className="app-dialog__footer">
      <Button label="Cancel" severity="secondary" text onClick={onHide} />
      <Button
        label={isEdit ? "Save changes" : "Create application"}
        icon={isEdit ? "pi pi-check" : "pi pi-plus"}
        onClick={() => onSave(form)}
      />
    </div>
  );

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      modal
      draggable={false}
      resizable={false}
      className="app-dialog"
      header={
        <div className="app-dialog__header">
          <div className="app-dialog__eyebrow">{isEdit ? "Edit application" : "New application"}</div>
          <div className="app-dialog__title">
            {isEdit
              ? (initialValue?.title || "Edit application")
              : "Add application"}
          </div>
        </div>
      }
      footer={footer}
      breakpoints={{ "960px": "90vw", "640px": "96vw" }}
      style={{ width: "44rem" }}
    >
      <div className="app-dialog__body">
        <TabView className="app-dialog__tabs">

          {/* ── TAB 1: Basic ── */}
          <TabPanel header="Basic">
            <div className="app-dialog__fields">
              <div className="field">
                <label htmlFor="f-title">Job title <span className="required">*</span></label>
                <InputText
                  id="f-title"
                  value={form.title}
                  onChange={set("title")}
                  placeholder="Frontend Developer"
                />
              </div>

              <div className="field">
                <label htmlFor="f-company">Company <span className="required">*</span></label>
                <InputText
                  id="f-company"
                  value={form.company}
                  onChange={set("company")}
                  placeholder="Shopify"
                />
              </div>

              <div className="field-row">
                <div className="field">
                  <label htmlFor="f-status">Status</label>
                  <Dropdown
                    id="f-status"
                    value={form.status}
                    options={STATUS_OPTIONS}
                    onChange={(e) => setForm((p) => ({ ...p, status: e.value }))}
                    placeholder="Select status"
                  />
                </div>

                <div className="field">
                  <label htmlFor="f-job-type">Job type</label>
                  <Dropdown
                    id="f-job-type"
                    value={form.job_type}
                    options={JOB_TYPE_OPTIONS}
                    onChange={(e) => setForm((p) => ({ ...p, job_type: e.value }))}
                    placeholder="Full-time"
                    showClear
                  />
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label htmlFor="f-location">Location</label>
                  <InputText
                    id="f-location"
                    value={form.location}
                    onChange={set("location")}
                    placeholder="Toronto, ON / Remote"
                  />
                </div>

                <div className="field">
                  <label htmlFor="f-source">Source</label>
                  <Dropdown
                    id="f-source"
                    value={form.source}
                    options={SOURCE_OPTIONS}
                    onChange={(e) => setForm((p) => ({ ...p, source: e.value }))}
                    placeholder="LinkedIn"
                    showClear
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="f-url">Job posting URL</label>
                <InputText
                  id="f-url"
                  value={form.url}
                  onChange={set("url")}
                  placeholder="https://jobs.example.com/role/123"
                />
              </div>
            </div>
          </TabPanel>

          {/* ── TAB 2: Dates & Notes ── */}
          <TabPanel header="Dates & Notes">
            <div className="app-dialog__fields">
              <div className="field-row">
                <div className="field">
                  <label htmlFor="f-applied">Applied date</label>
                  <Calendar
                    id="f-applied"
                    value={form.applied_date}
                    onChange={(e) => setForm((p) => ({ ...p, applied_date: e.value }))}
                    dateFormat="M d, yy"
                    showIcon
                    showButtonBar
                    placeholder="Select date"
                  />
                </div>

                <div className="field">
                  <label htmlFor="f-followup">Follow-up date</label>
                  <Calendar
                    id="f-followup"
                    value={form.followup_date}
                    onChange={(e) => setForm((p) => ({ ...p, followup_date: e.value }))}
                    dateFormat="M d, yy"
                    showIcon
                    showButtonBar
                    placeholder="Select date"
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="f-interview">Interview date</label>
                <Calendar
                  id="f-interview"
                  value={form.interview_date}
                  onChange={(e) => setForm((p) => ({ ...p, interview_date: e.value }))}
                  dateFormat="M d, yy"
                  showIcon
                  showButtonBar
                  placeholder="Select date"
                />
              </div>

              <div className="field">
                <label htmlFor="f-notes">Notes</label>
                <InputTextarea
                  id="f-notes"
                  value={form.notes}
                  onChange={set("notes")}
                  rows={4}
                  placeholder="Any notes about this application…"
                  autoResize
                />
              </div>
            </div>
          </TabPanel>

          {/* ── TAB 3: Recruiter ── */}
          <TabPanel header="Recruiter">
            <div className="app-dialog__fields">
              <div className="field">
                <label htmlFor="f-rec-name">Recruiter name</label>
                <InputText
                  id="f-rec-name"
                  value={form.recruiter_name}
                  onChange={set("recruiter_name")}
                  placeholder="Jane Smith"
                />
              </div>

              <div className="field">
                <label htmlFor="f-rec-email">Recruiter email</label>
                <InputText
                  id="f-rec-email"
                  value={form.recruiter_email}
                  onChange={set("recruiter_email")}
                  placeholder="jane@company.com"
                />
              </div>
            </div>
          </TabPanel>

        </TabView>
      </div>
    </Dialog>
  );
}