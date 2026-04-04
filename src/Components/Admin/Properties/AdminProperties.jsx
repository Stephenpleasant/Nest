/**
 * AdminPage.jsx
 *
 * Wraps the Sidebar + AdminDashboard together.
 * When the sidebar's "View Properties" item is selected,
 * the AdminDashboard opens directly on the "All Properties" tab.
 *
 * NAV_ITEMS in NavConfig should include:
 *   { id: "properties", label: "View Properties", icon: <BuildingIcon /> }
 *
 * The id "overview" maps to the dashboard overview tab.
 * The id "properties" maps to the All Properties tab.
 */

import { useState } from "react";
import Sidebar from "./Navbar";          // your existing Sidebar/Navbar
import AdminDashboard from "./Admindashboard";

// Map sidebar nav IDs to AdminDashboard tab IDs
const NAV_TO_TAB = {
  dashboard:  "overview",
  overview:   "overview",
  properties: "properties",
};

export default function AdminPage() {
  const [activeNavId, setActiveNavId] = useState("dashboard");

  const handleSelect = (id) => {
    setActiveNavId(id);
  };

  // Derive which tab the dashboard should show
  const dashboardTab = NAV_TO_TAB[activeNavId] ?? "overview";

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#f5f7fb" }}>
      {/* ── Sidebar ── */}
      <Sidebar activeId={activeNavId} onSelect={handleSelect} />

      {/* ── Main content ── */}
      <main style={{ flex: 1, marginLeft: 240, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <AdminDashboard initialTab={dashboardTab} />
      </main>
    </div>
  );
}