type dropdownItemType = {
  label: string,
  value: string
}

export const APP_NAME: string = "CareerFlow";

export const STORAGE_KEYS = {
  token: "token",
  userEmail: "userEmail",
};

export const APPLICATION_STATUS = {
  SAVED:      { label: "Saved",       color: "#475569", bg: "#f1f5f9", dot: "#94a3b8" },
  APPLIED:    { label: "Applied",     color: "#2563eb", bg: "#eff6ff", dot: "#3b82f6" },
  OA:         { label: "Online Assessment",color: "#d97706", bg: "#fffbeb", dot: "#f59e0b" },
  INTERVIEW:  { label: "Interview",   color: "#7c3aed", bg: "#f5f3ff", dot: "#8b5cf6" },
  OFFER:      { label: "Offer",       color: "#059669", bg: "#ecfdf5", dot: "#10b981" },
  REJECTED:   { label: "Rejected",    color: "#e11d48", bg: "#fff1f2", dot: "#f43f5e" },
  WITHDRAWN:  { label: "Withdrawn",   color: "#92400e", bg: "#fef3c7", dot: "#d97706" },
};

export const STATUS_OPTIONS: Array<dropdownItemType> = Object.entries(APPLICATION_STATUS).map(([value, meta]) => ({
  value,
  label: meta.label,
}));

export const JOB_TYPE_OPTIONS: Array<dropdownItemType> = [
  { value: "FULL_TIME",   label: "Full-time" },
  { value: "PART_TIME",   label: "Part-time" },
  { value: "CONTRACT",    label: "Contract" },
  { value: "INTERNSHIP",  label: "Internship" },
  { value: "FREELANCE",   label: "Freelance" },
];

export const SOURCE_OPTIONS: Array<dropdownItemType> = [
  { value: "LINKEDIN",     label: "LinkedIn" },
  { value: "INDEED",       label: "Indeed" },
  { value: "COMPANY_SITE", label: "Company Site" },
  { value: "REFERRAL",     label: "Referral" },
  { value: "GLASSDOOR",    label: "Glassdoor" },
  { value: "OTHER",        label: "Other" },
];