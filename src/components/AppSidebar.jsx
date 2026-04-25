import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tooltip } from "primereact/tooltip";
import { Badge } from "primereact/badge";
import { useAuth } from "../context/AuthContext";
import { APP_NAME } from "../utils/constants";

const NAV_SECTIONS = [
  {
    label: "Workspace",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: "pi-home",
        path: "/dashboard",
        badge: null,
      },
      {
        id: "applications",
        label: "Applications",
        icon: "pi-briefcase",
        path: "/applications",
        badge: null,
      },
      {
        id: "calendar",
        label: "Calendar",
        icon: "pi-calendar",
        path: "/calendar",
        badge: null,
        soon: true,
      },
    ],
  },
  {
    label: "Insights",
    items: [
      {
        id: "analytics",
        label: "Analytics",
        icon: "pi-chart-bar",
        path: "/analytics",
        badge: null,
        soon: true,
      },
      {
        id: "goals",
        label: "Goals",
        icon: "pi-flag",
        path: "/goals",
        badge: null,
        soon: true,
      },
    ],
  },
  {
    label: "Tools",
    items: [
      {
        id: "resume",
        label: "Resume",
        icon: "pi-file",
        path: "/resume",
        badge: null,
        soon: true,
      },
      {
        id: "contacts",
        label: "Contacts",
        icon: "pi-users",
        path: "/contacts",
        badge: null,
        soon: true,
      },
      {
        id: "reminders",
        label: "Reminders",
        icon: "pi-bell",
        path: "/reminders",
        badge: null,
        soon: true,
      },
    ],
  },
];

const BOTTOM_ITEMS = [
  { id: "settings", label: "Settings", icon: "pi-cog",           path: "/settings" },
  { id: "help",     label: "Help",     icon: "pi-question-circle", path: "/help", soon: true },
];

/** Derive up-to-2-character initials from a display name or email. */
function getInitials(name, email) {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
  return email ? email.slice(0, 2).toUpperCase() : "AM";
}

export default function AppSidebar({ collapsed = false }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { userEmail, userName, logout } = useAuth();

  const [hoveredId, setHoveredId] = useState(null);

  const initials    = getInitials(userName, userEmail);
  const displayName = userName || userEmail?.split("@")[0] || "Account";
  const shortName   = displayName.length > 22
    ? displayName.slice(0, 22) + "\u2026"
    : displayName;
  const shortEmail  = userEmail
    ? userEmail.length > 22 ? userEmail.slice(0, 22) + "\u2026" : userEmail
    : "";

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`psb ${collapsed ? "psb--collapsed" : ""}`}>
      {/* ── Brand ── */}
      <div className="psb__brand">
        <button
          className="psb__brand-btn"
          onClick={() => navigate("/dashboard")}
          data-pr-tooltip={collapsed ? APP_NAME : undefined}
          data-pr-position="right"
        >
          <span className="psb__mark">AM</span>
          {!collapsed && <span className="psb__app-name">{APP_NAME}</span>}
        </button>
      </div>

      <div className="psb__scroll">
        {/* ── Nav sections ── */}
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="psb__section">
            {!collapsed && (
              <div className="psb__section-label">{section.label}</div>
            )}

            {section.items.map((item) => {
              const active  = isActive(item.path);
              const hovered = hoveredId === item.id;

              return (
                <button
                  key={item.id}
                  className={`psb__item
                    ${active   ? "psb__item--active"  : ""}
                    ${item.soon ? "psb__item--soon"   : ""}
                    ${hovered && !active ? "psb__item--hovered" : ""}
                  `}
                  onClick={() => !item.soon && navigate(item.path)}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  data-pr-tooltip={
                    collapsed
                      ? item.soon ? `${item.label} — coming soon` : item.label
                      : item.soon ? "Coming soon" : undefined
                  }
                  data-pr-position="right"
                  aria-label={item.label}
                  aria-current={active ? "page" : undefined}
                  tabIndex={0}
                >
                  <span className="psb__item-icon">
                    <i className={`pi ${item.icon}`} />
                  </span>

                  {!collapsed && (
                    <>
                      <span className="psb__item-label">{item.label}</span>

                      <span className="psb__item-right">
                        {item.badge && (
                          <Badge
                            value={item.badge.value}
                            severity={item.badge.severity}
                            className="psb__badge"
                          />
                        )}
                        {item.soon && (
                          <span className="psb__soon-chip">Soon</span>
                        )}
                        {active && !item.soon && (
                          <span className="psb__active-dot" />
                        )}
                      </span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* ── Bottom utilities ── */}
      <div className="psb__bottom">
        <div className="psb__divider" />

        {BOTTOM_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`psb__item psb__item--util ${item.soon ? "psb__item--soon" : ""}`}
            onClick={() => !item.soon && navigate(item.path)}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            data-pr-tooltip={
              collapsed
                ? item.soon ? `${item.label} — coming soon` : item.label
                : item.soon ? "Coming soon" : undefined
            }
            data-pr-position="right"
            aria-label={item.label}
          >
            <span className="psb__item-icon">
              <i className={`pi ${item.icon}`} />
            </span>
            {!collapsed && (
              <>
                <span className="psb__item-label">{item.label}</span>
                {item.soon && <span className="psb__soon-chip">Soon</span>}
              </>
            )}
          </button>
        ))}

        <div className="psb__divider" />

        {/* ── Account footer ── */}
        {collapsed ? (
          <button
            className="psb__avatar-btn"
            onClick={logout}
            data-pr-tooltip={`${displayName} — Logout`}
            data-pr-position="right"
            aria-label="Logout"
          >
            <span className="psb__avatar">{initials}</span>
          </button>
        ) : (
          <div className="psb__account">
            <span className="psb__avatar">{initials}</span>
            <div className="psb__account-info">
              <div className="psb__account-name">{shortName}</div>
              <div className="psb__account-email">{shortEmail}</div>
            </div>
            <button
              className="psb__logout-btn"
              onClick={logout}
              data-pr-tooltip="Logout"
              data-pr-position="top"
              aria-label="Logout"
            >
              <i className="pi pi-sign-out" />
            </button>
          </div>
        )}
      </div>

      {/* PrimeReact tooltip target */}
      <Tooltip target="[data-pr-tooltip]" />
    </div>
  );
}
