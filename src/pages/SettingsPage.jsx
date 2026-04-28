import { useEffect, useMemo, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import DashboardLayout from "../layouts/DashboardLayout";
import { useSettings } from "../context/SettingsContext";
import "../styles/dashboard.css";
import "../styles/settings.css";
import { Button } from "primereact/button";
import LinkedEmailsSection from "../components/LinkedEmailsSection";

const PRESET_COLORS = [
  "#4f46e5",
  "#2563eb",
  "#0f766e",
  "#059669",
  "#d97706",
  "#dc2626",
  "#db2777",
  "#7c3aed",
];

export default function SettingsPage() {
  const toast = useRef(null);
  const { accentColor, setAccentColor, isValidHexColor, normalizeHexColor } = useSettings();
  const [hexInput, setHexInput] = useState(accentColor || "#4f46e5");

  useEffect(() => {
    setHexInput(accentColor || "#4f46e5");
  }, [accentColor]);

  const previewStyle = useMemo(
    () => ({
      "--settings-preview-accent": accentColor,
    }),
    [accentColor]
  );

  const handlePresetClick = (color) => {
    setAccentColor(color);
    toast.current?.show({
      severity: "success",
      summary: "Accent updated",
      detail: `Accent color set to ${color}.`,
      life: 1800,
    });
  };

  const commitHexInput = () => {
    const normalized = normalizeHexColor(hexInput);

    if (isValidHexColor(normalized)) {
      setHexInput(normalized);
      setAccentColor(normalized);
      toast.current?.show({
        severity: "success",
        summary: "Accent updated",
        detail: `Accent color set to ${normalized}.`,
        life: 1800,
      });
      return;
    }

    setHexInput(accentColor);
    toast.current?.show({
      severity: "warn",
      summary: "Invalid color",
      detail: "Enter a valid hex color like #4f46e5.",
      life: 2200,
    });
  };

  return (
    <>
      <Toast ref={toast} position="bottom-right" />

      <DashboardLayout>
        <div className="db-root settings-page">
          <div className="db-board">
            <div className="db-board__header">
              <div>
                <p className="settings-eyebrow">Settings</p>
                <h2 className="db-board__title">Preferences</h2>
                <p className="db-board__sub">
                  Choose the accent color for interactive UI elements across the app.
                </p>
              </div>
            </div>

            <div className="settings-sections">
              <section className="settings-card">
                <div className="settings-card__head">
                  <h3>Color picker</h3>
                  <p>
                    This updates the app accent used for buttons, selected chips, focus states,
                    and active navigation highlights.
                  </p>
                </div>

                <div className="settings-color-row">
                  {PRESET_COLORS.map((color) => {
                    const active = accentColor.toLowerCase() === color.toLowerCase();

                    return (
                      <Button
                        key={color}
                        type="button"
                        className={`settings-swatch ${active ? "is-active" : ""}`}
                        style={{ backgroundColor: color }}
                        onClick={() => handlePresetClick(color)}
                        aria-label={`Choose accent color ${color}`}
                        title={color}
                      >
                        {active && <i className="pi pi-check" />}
                      </Button>
                    );
                  })}
                </div>

                <div className="field">
                  <label htmlFor="settings-accent-text">Custom accent color</label>

                  <div className="settings-custom-color">
                    <input
                      id="settings-accent-picker"
                      type="color"
                      value={isValidHexColor(accentColor) ? accentColor : "#4f46e5"}
                      onChange={(e) => {
                        const next = e.target.value;
                        setHexInput(next);
                        setAccentColor(next);
                      }}
                      aria-label="Choose custom accent color"
                    />

                    <InputText
                      id="settings-accent-text"
                      value={hexInput}
                      onChange={(e) => setHexInput(e.target.value)}
                      onBlur={commitHexInput}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          commitHexInput();
                        }
                      }}
                      placeholder="#4f46e5"
                    />
                  </div>

                  <small className="settings-help">
                    Enter a hex color like #0f766e or use the picker.
                  </small>
                </div>

                <div className="settings-preview" style={previewStyle}>
                  <div className="settings-preview__header">
                    <span className="settings-preview__eyebrow">Preview</span>
                    <h4>Accent-only preview</h4>
                  </div>

                  <div className="settings-preview__grid">
                    <div className="settings-preview__tile">
                      <span className="settings-preview__label">Primary button</span>
                      <Button className="settings-preview__button">New application</Button>
                    </div>

                    <div className="settings-preview__tile">
                      <span className="settings-preview__label">Active chip</span>
                      <span className="settings-preview__chip">
                        <span className="settings-preview__dot" />
                        Selected
                      </span>
                    </div>

                    <div className="settings-preview__tile">
                      <span className="settings-preview__label">Focus state</span>
                      <input
                        className="settings-preview__input"
                        value="Focused field preview"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                          </section>
                          <LinkedEmailsSection />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}