import { createContext, useContext, useEffect, useMemo, useState } from "react";

const SettingsContext = createContext(null);

const DEFAULT_ACCENT = "#4f46e5";

function isValidHexColor(value) {
  return /^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(value || "");
}

function normalizeHexColor(value) {
  const trimmed = (value || "").trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("#")) return trimmed;
  return `#${trimmed}`;
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const normalized =
    clean.length === 3
      ? clean.split("").map((char) => char + char).join("")
      : clean;

  const num = parseInt(normalized, 16);

  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function applyAccentColor(hex) {
  const safeHex = isValidHexColor(hex) ? hex : DEFAULT_ACCENT;
  const { r, g, b } = hexToRgb(safeHex);
  const root = document.documentElement;

  root.style.setProperty("--db-accent", safeHex);
  root.style.setProperty("--db-accent-rgb", `${r}, ${g}, ${b}`);
  root.style.setProperty("--db-accent-soft", `rgba(${r}, ${g}, ${b}, 0.09)`);
}

export function SettingsProvider({ children }) {
  const [accentColor, setAccentColorState] = useState(() => {
    const saved = window.localStorage.getItem("careerflow.accentColor");
    return saved && isValidHexColor(saved) ? saved : DEFAULT_ACCENT;
  });

  useEffect(() => {
    applyAccentColor(accentColor);
    window.localStorage.setItem("careerflow.accentColor", accentColor);
  }, [accentColor]);

  const setAccentColor = (nextColor) => {
    const normalized = normalizeHexColor(nextColor);
    if (!isValidHexColor(normalized)) return false;

    setAccentColorState(normalized);
    return true;
  };

  const value = useMemo(
    () => ({
      accentColor,
      setAccentColor,
      isValidHexColor,
      normalizeHexColor,
    }),
    [accentColor]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }

  return context;
}