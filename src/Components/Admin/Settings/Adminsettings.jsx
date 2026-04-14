import { useState } from "react";
import ProfileSettings from "./ProfileSettings";
import SecuritySettings from "./SecuritySettings";
import NotificationSettings from "./NotificationSettings";
import AppearanceSettings from "./AppearanceSettings";

const TABS = [
  { id: "profile",       label: "Profile",        icon: "👤" },
  { id: "security",      label: "Security",       icon: "🔐" },
  { id: "notifications", label: "Notifications",  icon: "🔔" },
  { id: "appearance",    label: "Appearance",     icon: "🎨" },
];

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("profile");

  const renderTab = () => {
    switch (activeTab) {
      case "profile":       return <ProfileSettings />;
      case "security":      return <SecuritySettings />;
      case "notifications": return <NotificationSettings />;
      case "appearance":    return <AppearanceSettings />;
      default:              return <ProfileSettings />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100 px-8 py-5">
        <h1 className="text-2xl font-bold text-[#0b1a2e] font-['Poppins',sans-serif]">
          Settings
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your admin account and platform preferences</p>
      </div>

      <div className="px-8 py-6 flex gap-6">
        {/* Sidebar tabs */}
        <aside className="w-56 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-2 flex flex-col gap-1">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 text-left
                    ${activeTab === tab.id
                      ? "bg-[#eff6ff] text-[#1a56db] border border-[#bfdbfe]"
                      : "text-gray-600 hover:bg-gray-50 border border-transparent"
                    }`}
                >
                  <span className="text-base">{tab.icon}</span>
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#1a56db]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Tab content */}
        <main className="flex-1 min-w-0">
          {renderTab()}
        </main>
      </div>
    </div>
  );
}