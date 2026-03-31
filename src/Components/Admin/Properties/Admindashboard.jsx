import { useState, useEffect } from "react";

const BLUE  = "#1a56db";
const NAVY  = "#0b1a2e";
const WHITE = "#ffffff";

// ── Mini sparkline (pure SVG, no lib) ────────────────────────────────────────
function Sparkline({ data = [], color = BLUE, height = 40 }) {
  const w = 120;
  const max = Math.max(...data, 1);
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${height - (v / max) * height}`)
    .join(" ");
  return (
    <svg width={w} height={height} style={{ display: "block" }}>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, spark, color = BLUE, icon }) {
  return (
    <div
      style={{
        background: WHITE,
        borderRadius: 16,
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        border: "1px solid #f3f4f6",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#9ca3af",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: 18,
            width: 36,
            height: 36,
            borderRadius: 10,
            background: color + "18",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </span>
      </div>
      <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: NAVY, fontFamily: "Poppins, sans-serif", lineHeight: 1 }}>
        {value}
      </p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: "#6b7280" }}>{sub}</span>
        {spark && <Sparkline data={spark} color={color} />}
      </div>
    </div>
  );
}

// ── Donut chart (pure SVG) ────────────────────────────────────────────────────
function DonutChart({ slices }) {
  const r = 54, cx = 68, cy = 68, stroke = 18;
  const total = slices.reduce((a, s) => a + s.value, 0);
  let offset = 0;
  const circ = 2 * Math.PI * r;

  return (
    <svg width="136" height="136">
      {slices.map((s, i) => {
        const pct = s.value / total;
        const dashArr = `${pct * circ} ${circ}`;
        const el = (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={stroke}
            strokeDasharray={dashArr}
            strokeDashoffset={-offset * circ}
            strokeLinecap="butt"
            style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
          />
        );
        offset += pct;
        return el;
      })}
      <text x={cx} y={cy - 6} textAnchor="middle" style={{ fontSize: 20, fontWeight: 800, fill: NAVY, fontFamily: "Poppins" }}>
        {total}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" style={{ fontSize: 11, fill: "#9ca3af" }}>
        total
      </text>
    </svg>
  );
}

// ── Bar chart (pure SVG) ──────────────────────────────────────────────────────
function BarChart({ data }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const w = 340, h = 110, barW = 28, gap = (w - data.length * barW) / (data.length + 1);
  return (
    <svg width={w} height={h + 30} style={{ display: "block" }}>
      {data.map((d, i) => {
        const bh = (d.value / max) * h;
        const x = gap + i * (barW + gap);
        const y = h - bh;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={bh} rx={5} fill={BLUE} opacity={0.15 + 0.85 * (d.value / max)} />
            <text x={x + barW / 2} y={h + 18} textAnchor="middle" style={{ fontSize: 10, fill: "#9ca3af" }}>
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Recent Transactions ───────────────────────────────────────────────────────
const TXS = [
  { user: "Adaeze Obi",     type: "Withdrawal",   amount: "₦450,000", status: "pending",  time: "2m ago",   avatar: "AO" },
  { user: "Emeka Nwosu",    type: "Property List", amount: "₦1,200,000", status: "approved", time: "14m ago",  avatar: "EN" },
  { user: "Fatima Bello",   type: "Withdrawal",   amount: "₦320,000", status: "approved", time: "1h ago",   avatar: "FB" },
  { user: "Chidi Okeke",    type: "User Signup",  amount: "—",        status: "new",      time: "2h ago",   avatar: "CO" },
  { user: "Ngozi Adeleke",  type: "Property List", amount: "₦750,000", status: "review",   time: "3h ago",   avatar: "NA" },
];

const STATUS_COLORS = {
  pending:  { bg: "#fef3c7", color: "#92400e" },
  approved: { bg: "#d1fae5", color: "#065f46" },
  new:      { bg: "#ede9fe", color: "#4c1d95" },
  review:   { bg: "#dbeafe", color: "#1e3a8a" },
};

function TxRow({ tx }) {
  const sc = STATUS_COLORS[tx.status] || STATUS_COLORS.new;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 0",
        borderBottom: "1px solid #f3f4f6",
      }}
    >
      <div
        style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "linear-gradient(135deg, #1a56db, #0b1a2e)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 700, color: WHITE }}>{tx.avatar}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: NAVY, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {tx.user}
        </p>
        <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>{tx.type}</p>
      </div>
      <span style={{ fontSize: 13.5, fontWeight: 700, color: NAVY, whiteSpace: "nowrap" }}>{tx.amount}</span>
      <span
        style={{
          fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 100,
          background: sc.bg, color: sc.color, textTransform: "capitalize", whiteSpace: "nowrap",
        }}
      >
        {tx.status}
      </span>
      <span style={{ fontSize: 11, color: "#9ca3af", whiteSpace: "nowrap" }}>{tx.time}</span>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  const greeting = time.getHours() < 12 ? "Good morning" : time.getHours() < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1080, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ margin: "0 0 4px", fontSize: 13, color: "#9ca3af" }}>
          {time.toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: NAVY, fontFamily: "Poppins, sans-serif", letterSpacing: "-0.5px" }}>
          {greeting}, Admin 👋
        </h1>
        <p style={{ margin: "6px 0 0", fontSize: 14, color: "#6b7280" }}>
          Here's what's happening on Nestfind today.
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginBottom: 28 }}>
        <StatCard
          label="Total Users"
          value="3,842"
          sub="+12 this week"
          icon="👥"
          color="#1a56db"
          spark={[30, 45, 38, 60, 55, 72, 80, 75, 90, 88]}
        />
        <StatCard
          label="Active Agents"
          value="148"
          sub="+3 this week"
          icon="🛡️"
          color="#059669"
          spark={[12, 18, 14, 22, 19, 25, 21, 28, 24, 30]}
        />
        <StatCard
          label="Properties Listed"
          value="1,204"
          sub="+27 this month"
          icon="🏠"
          color="#7c3aed"
          spark={[80, 95, 110, 100, 130, 120, 145, 155, 140, 165]}
        />
        <StatCard
          label="Pending Withdrawals"
          value="₦8.4M"
          sub="18 requests"
          icon="💳"
          color="#d97706"
          spark={[20, 30, 25, 40, 35, 50, 45, 60, 55, 70]}
        />
      </div>

      {/* Middle row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
        {/* Monthly listings bar */}
        <div
          style={{
            background: WHITE, borderRadius: 16, padding: "22px 24px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6",
          }}
        >
          <p style={{ margin: "0 0 16px", fontSize: 13, fontWeight: 700, color: NAVY }}>
            Monthly Listings
          </p>
          <BarChart
            data={[
              { label: "Jan", value: 42 },
              { label: "Feb", value: 58 },
              { label: "Mar", value: 51 },
              { label: "Apr", value: 70 },
              { label: "May", value: 65 },
              { label: "Jun", value: 83 },
              { label: "Jul", value: 77 },
              { label: "Aug", value: 95 },
            ]}
          />
        </div>

        {/* User distribution donut */}
        <div
          style={{
            background: WHITE, borderRadius: 16, padding: "22px 24px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6",
          }}
        >
          <p style={{ margin: "0 0 16px", fontSize: 13, fontWeight: 700, color: NAVY }}>
            User Distribution
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <DonutChart
              slices={[
                { label: "Regular Users", value: 3694, color: BLUE },
                { label: "Agents",        value: 148,  color: "#059669" },
              ]}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Regular Users", value: "3,694", color: BLUE },
                { label: "Agents",        value: "148",   color: "#059669" },
              ].map((s) => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12.5, color: "#6b7280" }}>{s.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginLeft: "auto", paddingLeft: 16 }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div
        style={{
          background: WHITE, borderRadius: 16, padding: "22px 24px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: NAVY }}>Recent Activity</p>
          <button
            style={{
              fontSize: 12, fontWeight: 600, color: BLUE, background: "none",
              border: "none", cursor: "pointer", padding: 0,
            }}
          >
            View all →
          </button>
        </div>
        {TXS.map((tx, i) => (
          <TxRow key={i} tx={tx} />
        ))}
      </div>
    </div>
  );
}