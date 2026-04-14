import { useState } from "react";
import SettingsCard from "./SettingsCard";

const ACCENT_COLORS = [
  { name: "Blue",   value: "#1a56db" },
  { name: "Indigo", value: "#4f46e5" },
  { name: "Teal",   value: "#0d9488" },
  { name: "Green",  value: "#16a34a" },
  { name: "Orange", value: "#ea580c" },
];

const FONT_SIZES = ["Small", "Default", "Large"];

export default function AppearanceSettings() {
  const [theme,     setTheme]     = useState("light");
  const [accent,    setAccent]    = useState("#1a56db");
  const [fontSize,  setFontSize]  = useState("Default");
  const [compact,   setCompact]   = useState(false);
  const [saved,     setSaved]     = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Theme */}
      <SettingsCard title="Theme">
        <div className="grid grid-cols-2 gap-3">
          {[
            { val: "light", label: "Light", preview: "bg-white border-gray-200",   icon: "☀️" },
            { val: "dark",  label: "Dark",  preview: "bg-[#0b1a2e] border-[#1e3a5f]", icon: "🌙" },
          ].map(({ val, label, preview, icon }) => (
            <button
              key={val}
              onClick={() => setTheme(val)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all text-left
                ${theme === val
                  ? "border-[#1a56db] bg-[#eff6ff]"
                  : "border-gray-200 bg-white hover:border-gray-300"
                }`}
            >
              <div className={`w-8 h-8 rounded-lg border ${preview} flex items-center justify-center text-base`}>{icon}</div>
              <div>
                <p className={`text-sm font-semibold ${theme === val ? "text-[#1a56db]" : "text-gray-700"}`}>{label}</p>
                <p className="text-xs text-gray-400">{val === "light" ? "Default" : "Easy on the eyes"}</p>
              </div>
              {theme === val && <span className="ml-auto text-[#1a56db]">✓</span>}
            </button>
          ))}
        </div>
      </SettingsCard>

      {/* Accent Color */}
      <SettingsCard title="Accent Color">
        <div className="flex items-center gap-3 flex-wrap">
          {ACCENT_COLORS.map(({ name, value }) => (
            <button
              key={value}
              onClick={() => setAccent(value)}
              title={name}
              className={`w-9 h-9 rounded-full transition-transform ${accent === value ? "scale-110 ring-2 ring-offset-2" : "hover:scale-105"}`}
              style={{ background: value, ringColor: value }}
            >
              {accent === value && (
                <span className="flex items-center justify-center text-white text-sm font-bold">✓</span>
              )}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">Selected: <span className="font-medium text-gray-600">{ACCENT_COLORS.find(c => c.value === accent)?.name}</span></p>
      </SettingsCard>

      {/* Font Size */}
      <SettingsCard title="Font Size">
        <div className="flex gap-3">
          {FONT_SIZES.map(size => (
            <button
              key={size}
              onClick={() => setFontSize(size)}
              className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all
                ${fontSize === size
                  ? "bg-[#1a56db] border-[#1a56db] text-white"
                  : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
                }`}
            >
              {size}
            </button>
          ))}
        </div>
      </SettingsCard>

      {/* Layout */}
      <SettingsCard title="Layout">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">Compact Mode</p>
            <p className="text-xs text-gray-400 mt-0.5">Reduce spacing and padding across the dashboard.</p>
          </div>
          <button
            onClick={() => setCompact(v => !v)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${compact ? "bg-[#1a56db]" : "bg-gray-200"}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${compact ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
        </div>
      </SettingsCard>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-[#1a56db] text-white text-sm font-semibold rounded-xl hover:bg-[#1444b8] transition-colors"
        >
          Save Appearance
        </button>
        {saved && <span className="text-sm text-green-600 font-medium">✓ Appearance saved</span>}
      </div>
    </div>
  );
}