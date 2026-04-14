import { useState } from "react";
import SettingsCard from "./SettingsCard";

export default function SecuritySettings() {
  const [pwForm, setPwForm]   = useState({ current: "", next: "", confirm: "" });
  const [twoFA, setTwoFA]     = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState("");

  const handleChange = (e) =>
    setPwForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = () => {
    setError("");
    if (!pwForm.current || !pwForm.next || !pwForm.confirm) {
      return setError("All fields are required.");
    }
    if (pwForm.next !== pwForm.confirm) {
      return setError("New passwords do not match.");
    }
    if (pwForm.next.length < 8) {
      return setError("Password must be at least 8 characters.");
    }
    setSaved(true);
    setPwForm({ current: "", next: "", confirm: "" });
    setTimeout(() => setSaved(false), 2500);
  };

  const sessions = [
    { device: "Chrome on Windows", location: "Lagos, NG", time: "Active now",    current: true  },
    { device: "Safari on iPhone",  location: "Lagos, NG", time: "2 hours ago",   current: false },
    { device: "Firefox on Mac",    location: "Abuja, NG", time: "3 days ago",    current: false },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Change Password */}
      <SettingsCard title="Change Password">
        <div className="flex flex-col gap-4">
          <PwField label="Current Password"  name="current"  value={pwForm.current}  onChange={handleChange} />
          <PwField label="New Password"      name="next"     value={pwForm.next}     onChange={handleChange} />
          <PwField label="Confirm Password"  name="confirm"  value={pwForm.confirm}  onChange={handleChange} />

          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

          <div className="flex items-center gap-3 mt-1">
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-[#1a56db] text-white text-sm font-semibold rounded-xl hover:bg-[#1444b8] transition-colors"
            >
              Update Password
            </button>
            {saved && (
              <span className="text-sm text-green-600 font-medium">✓ Password updated</span>
            )}
          </div>
        </div>
      </SettingsCard>

      {/* Two-Factor Auth */}
      <SettingsCard title="Two-Factor Authentication">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-gray-700 font-medium">Authenticator App</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Add an extra layer of security by requiring a verification code on login.
            </p>
          </div>
          <button
            onClick={() => setTwoFA(v => !v)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 shrink-0 ${twoFA ? "bg-[#1a56db]" : "bg-gray-200"}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${twoFA ? "translate-x-6" : "translate-x-0.5"}`} />
          </button>
        </div>
        {twoFA && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 font-medium">
            ✓ Two-factor authentication is enabled on your account.
          </div>
        )}
      </SettingsCard>

      {/* Active Sessions */}
      <SettingsCard title="Active Sessions">
        <div className="flex flex-col gap-3">
          {sessions.map((s, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full shrink-0 ${s.current ? "bg-green-400" : "bg-gray-300"}`} />
                <div>
                  <p className="text-sm font-medium text-gray-700">{s.device}</p>
                  <p className="text-xs text-gray-400">{s.location} · {s.time}</p>
                </div>
              </div>
              {!s.current && (
                <button className="text-xs text-red-500 font-semibold hover:text-red-600 transition-colors">
                  Revoke
                </button>
              )}
              {s.current && (
                <span className="text-xs text-green-600 font-semibold bg-green-50 px-2.5 py-1 rounded-full">
                  Current
                </span>
              )}
            </div>
          ))}
        </div>
      </SettingsCard>
    </div>
  );
}

function PwField({ label, name, value, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
      <div className="relative">
        <input
          name={name} type={show ? "text" : "password"} value={value} onChange={onChange}
          className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a56db]/30 focus:border-[#1a56db] transition-all"
        />
        <button
          type="button" onClick={() => setShow(v => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}