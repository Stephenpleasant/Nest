import { useState, useEffect } from "react";

const BLUE  = "#1a56db";
const NAVY  = "#0b1a2e";
const WHITE = "#ffffff";

const API_BASE = "https://gtimeconnect.onrender.com/api/v1/admin";
const getToken = () => localStorage.getItem("token") || "";
const AUTH_HEADERS = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// ── Sparkline ──────────────────────────────────────────────────────────────────
function Sparkline({ data = [], color = BLUE }) {
  const svgW = 300;
  const svgH = 52;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * svgW},${svgH - ((v - min) / range) * (svgH - 6) - 3}`)
    .join(" ");
  const lastX = svgW;
  const lastY = svgH - ((data[data.length - 1] - min) / range) * (svgH - 6) - 3;
  const areapts = `0,${svgH} ${pts} ${svgW},${svgH}`;
  const gradId = `sg-${color.replace("#", "")}`;

  return (
    <svg
      width="100%" height="100%"
      viewBox={`0 0 ${svgW} ${svgH}`}
      preserveAspectRatio="none"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areapts} fill={`url(#${gradId})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r="4" fill={color} opacity="0.9" />
    </svg>
  );
}

// ── Stat Card ──────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, spark, color, icon, loading, trend }) {
  return (
    <div
      style={{
        background: WHITE,
        borderRadius: 20,
        padding: "clamp(14px, 2.2vh, 26px) clamp(16px, 2vw, 28px)",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 4px 24px rgba(11,26,46,0.08)",
        border: "1px solid #f0f2f7",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
        height: "100%",
        boxSizing: "border-box",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = `0 14px 40px rgba(11,26,46,0.12), 0 2px 8px ${color}22`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 24px rgba(11,26,46,0.08)";
      }}
    >
      {/* Accent top bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 4,
        background: `linear-gradient(90deg, ${color}, ${color}99)`,
        borderRadius: "20px 20px 0 0",
      }} />

      {/* Decorative bg circle */}
      <div style={{
        position: "absolute", top: -24, right: -24,
        width: 100, height: 100, borderRadius: "50%",
        background: color + "0a", pointerEvents: "none",
      }} />

      {/* Top row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "clamp(10px, 1.5vh, 18px)", flexShrink: 0 }}>
        <div style={{
          width: "clamp(36px, 3.5vw, 50px)", height: "clamp(36px, 3.5vw, 50px)",
          borderRadius: 14, background: color + "15",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "clamp(17px, 1.8vw, 24px)", flexShrink: 0,
          border: `1.5px solid ${color}25`,
        }}>
          {icon}
        </div>
        <span style={{
          fontSize: "clamp(9px, 0.7vw, 11px)", fontWeight: 700,
          letterSpacing: "0.1em", textTransform: "uppercase", color: "#adb5c2",
        }}>
          {label}
        </span>
      </div>

      {/* Value */}
      <p style={{
        margin: "0 0 4px",
        fontSize: "clamp(24px, 3vw, 40px)",
        fontWeight: 800, color: loading ? "#e5e7eb" : NAVY,
        fontFamily: "Poppins, sans-serif", lineHeight: 1,
        letterSpacing: "-1px", flexShrink: 0,
        background: loading ? "#f3f4f6" : "none",
        borderRadius: loading ? 8 : 0,
        minHeight: "1em",
      }}>
        {loading ? "" : value}
      </p>

      {/* Sub + trend */}
      <p style={{
        margin: "0 0 clamp(6px, 1vh, 14px)",
        fontSize: "clamp(11px, 1vw, 13px)",
        color: "#9ca3af", fontWeight: 500, flexShrink: 0,
        display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap",
      }}>
        {!loading && trend != null && (
          <span style={{
            fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 20,
            background: trend >= 0 ? "#dcfce7" : "#fee2e2",
            color: trend >= 0 ? "#16a34a" : "#dc2626",
          }}>
            {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}%
          </span>
        )}
        {loading ? "" : sub}
      </p>

      {/* Sparkline — flex-grow fills remaining card height */}
      <div style={{ flex: 1, minHeight: 0, marginLeft: -2, marginRight: -2, marginBottom: -2 }}>
        <Sparkline data={spark} color={color} />
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [time, setTime]                 = useState(new Date());
  const [stats, setStats]               = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError]     = useState(null);

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    (async () => {
      setStatsLoading(true); setStatsError(null);
      try {
        const res = await fetch(`${API_BASE}/dashboard/stats`, { headers: AUTH_HEADERS() });
        if (!res.ok) throw new Error(`Failed to load stats (${res.status})`);
        const json = await res.json();
        setStats(json.data ?? json);
      } catch (e) { setStatsError(e.message); }
      finally { setStatsLoading(false); }
    })();
  }, []);

  const greeting =
    time.getHours() < 12 ? "Good morning"
    : time.getHours() < 17 ? "Good afternoon"
    : "Good evening";

  const fmtMoney = (val) => {
    if (val == null) return "—";
    if (val >= 1_000_000) return `₦${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000)     return `₦${(val / 1_000).toFixed(1)}K`;
    return `₦${val}`;
  };
  const fmtNum = (val) => val == null ? "—" : new Intl.NumberFormat("en-NG").format(val);

  const totalUsers      = stats?.users?.total;
  const totalAgents     = stats?.agents?.total;
  const totalRevenue    = stats?.transactions?.totalAmount ?? stats?.revenue?.total;
  const totalProperties = stats?.properties?.total;
  const newUsersMonth   = stats?.users?.newThisMonth   ?? stats?.users?.newToday   ?? null;
  const newAgentsMonth  = stats?.agents?.newThisMonth  ?? stats?.agents?.newToday  ?? null;
  const txThisMonth     = stats?.transactions?.total   ?? stats?.transactions?.count ?? null;
  const newPropsMonth   = stats?.properties?.newThisMonth ?? stats?.properties?.newToday ?? null;

  const cards = [
    {
      label: "All Users", value: fmtNum(totalUsers), icon: "👥", color: "#1a56db", trend: 12,
      sub: newUsersMonth != null ? `+${fmtNum(newUsersMonth)} this month` : "Registered users",
      spark: [30, 45, 38, 60, 55, 72, 80, 75, 90, 88],
    },
    {
      label: "All Agents", value: fmtNum(totalAgents), icon: "🛡️", color: "#059669", trend: 8,
      sub: newAgentsMonth != null ? `+${fmtNum(newAgentsMonth)} this month` : "Active agents",
      spark: [12, 18, 14, 22, 19, 25, 21, 28, 24, 30],
    },
    {
      label: "Transactions", value: fmtMoney(totalRevenue), icon: "💳", color: "#7c3aed", trend: null,
      sub: txThisMonth != null ? `${fmtNum(txThisMonth)} this month` : "Total volume",
      spark: [40, 55, 48, 70, 65, 82, 78, 95, 88, 105],
    },
    {
      label: "Properties Listed", value: fmtNum(totalProperties), icon: "🏠", color: "#d97706", trend: 5,
      sub: newPropsMonth != null ? `+${fmtNum(newPropsMonth)} this month` : "Total listings",
      spark: [80, 95, 110, 100, 130, 120, 145, 155, 140, 165],
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700;800&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .stat-card-anim { animation: fadeUp 0.4s cubic-bezier(.22,1,.36,1) both; }

        /*
          KEY: The dashboard must fill the height of its parent container.
          Your layout's main content area should have height: 100% or flex: 1.
          This component uses height: 100% + flex column to fill that space exactly.
        */
        .admin-dashboard {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
          padding: clamp(16px, 3vh, 36px) clamp(16px, 3vw, 40px);
          box-sizing: border-box;
          max-width: 1100px;
          margin: 0 auto;
          overflow: hidden;
        }

        .dash-header {
          flex-shrink: 0;
          margin-bottom: clamp(10px, 2vh, 24px);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr;
          gap: clamp(10px, 1.6vh, 20px);
          flex: 1;       /* fills ALL remaining vertical space */
          min-height: 0; /* critical — lets grid shrink inside flex */
        }

        .stats-grid > div {
          min-height: 0; /* critical — lets card shrink inside grid */
        }

        /* Tablet */
        @media (max-width: 680px) {
          .stats-grid { gap: clamp(8px, 1.4vh, 14px); }
        }

        /* Small phone — single column, allow scroll */
        @media (max-width: 400px) {
          .admin-dashboard { overflow-y: auto; }
          .stats-grid {
            grid-template-columns: 1fr;
            grid-template-rows: repeat(4, minmax(160px, 1fr));
          }
        }
      `}</style>

      <div className="admin-dashboard">
        {/* Header */}
        <div className="dash-header">
          <p style={{ margin: "0 0 2px", fontSize: "clamp(11px,1vw,13px)", color: "#adb5c2", fontWeight: 500, letterSpacing: "0.05em" }}>
            {time.toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
          <h1 style={{
            margin: 0, fontSize: "clamp(18px, 2.4vw, 28px)", fontWeight: 800,
            color: NAVY, fontFamily: "Poppins, sans-serif", letterSpacing: "-0.5px", lineHeight: 1.2,
          }}>
            {greeting}, Admin 👋
          </h1>
          <p style={{ margin: "3px 0 0", fontSize: "clamp(12px, 1vw, 14px)", color: "#6b7280" }}>
            Here's what's happening on Nestfind today.
          </p>
        </div>

        {/* Error banner */}
        {statsError && (
          <div style={{
            flexShrink: 0, marginBottom: 12, padding: "9px 16px",
            background: "#fef2f2", border: "1px solid #fecaca",
            borderRadius: 10, fontSize: 13, color: "#dc2626",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            ⚠️ Could not load live stats: {statsError}
          </div>
        )}

        {/* 2×2 Grid — stretches to fill remaining height */}
        <div className="stats-grid">
          {cards.map((c, i) => (
            <div key={c.label} className="stat-card-anim" style={{ animationDelay: `${i * 80}ms` }}>
              <StatCard {...c} loading={statsLoading} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}