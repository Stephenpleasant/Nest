import { useState, useEffect, useCallback } from "react";

const BLUE  = "#1a56db";
const NAVY  = "#0b1a2e";
const WHITE = "#ffffff";

const API_BASE = "https://gtimeconnect.onrender.com/api/v1/admin";
const getToken = () => localStorage.getItem("token") || "";
const AUTH_HEADERS = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// ── Helpers ────────────────────────────────────────────────────────────────────
const IMG_BASE = "https://gtimeconnect.onrender.com";

const resolveImg = (raw) => {
  if (!raw) return null;
  const s = typeof raw === "string" ? raw : raw?.url || raw?.src || raw?.path || null;
  if (!s || s === "null" || s === "undefined") return null;
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return `${IMG_BASE}${s.startsWith("/") ? "" : "/"}${s}`;
};

const fmtPrice = (v) =>
  v == null ? "—" : "₦" + new Intl.NumberFormat("en-NG").format(v);

const fmtNum = (val) =>
  val == null ? "—" : new Intl.NumberFormat("en-NG").format(val);

const fmtMoney = (val) => {
  if (val == null) return "—";
  if (val >= 1_000_000) return `₦${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000)     return `₦${(val / 1_000).toFixed(1)}K`;
  return `₦${val}`;
};

const mapProperty = (p) => ({
  _id:          p._id || p.id,
  title:        p.title || "Untitled",
  location:     [p.area, p.city, p.state].filter(Boolean).join(", ") || p.location || "—",
  price:        p.price,
  purpose:      (p.purpose || "rent").toLowerCase() === "sale" ? "sale" : "rent",
  propertyType: p.type || p.propertyType || "—",
  bedrooms:     p.bedrooms ?? 0,
  bathrooms:    p.bathrooms ?? 0,
  sqft:         p.propertySize ?? p.squareFeet ?? 0,
  status:       (p.status || "active").toLowerCase(),
  inspectionFee: p.inspectionFee ?? p.agent?.fee ?? null,
  createdAt:    p.createdAt || null,
  image:        resolveImg(p.images?.[0]) || resolveImg(p.image) ||
                "https://placehold.co/600x400/e5e7eb/6b7280?text=🏠",
  agent: {
    name:   p.agent?.fullName || p.agent?.name || p.agentName || "—",
    avatar: resolveImg(p.agent?.avatar) || null,
  },
  videoUrl: (() => {
    const v = p.videoUrl || p.video || (Array.isArray(p.videos) ? p.videos[0] : null);
    if (!v) return null;
    return typeof v === "string" ? v : v?.url || v?.src || null;
  })(),
});

// ── Sparkline ──────────────────────────────────────────────────────────────────
function Sparkline({ data = [], color = BLUE }) {
  const svgW = 300, svgH = 52;
  const max = Math.max(...data, 1), min = Math.min(...data, 0);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * svgW},${svgH - ((v - min) / range) * (svgH - 6) - 3}`)
    .join(" ");
  const lastX = svgW;
  const lastY = svgH - ((data[data.length - 1] - min) / range) * (svgH - 6) - 3;
  const areapts = `0,${svgH} ${pts} ${svgW},${svgH}`;
  const gradId = `sg-${color.replace("#", "")}`;
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${svgW} ${svgH}`} preserveAspectRatio="none" style={{ display: "block" }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areapts} fill={`url(#${gradId})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r="4" fill={color} opacity="0.9" />
    </svg>
  );
}

// ── Stat Card ──────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, spark, color, icon, loading, trend }) {
  return (
    <div
      style={{
        background: WHITE, borderRadius: 20,
        padding: "clamp(14px, 2.2vh, 26px) clamp(16px, 2vw, 28px)",
        display: "flex", flexDirection: "column",
        boxShadow: "0 4px 24px rgba(11,26,46,0.08)",
        border: "1px solid #f0f2f7", position: "relative",
        overflow: "hidden", transition: "transform 0.2s, box-shadow 0.2s",
        height: "100%", boxSizing: "border-box",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 14px 40px rgba(11,26,46,0.12), 0 2px 8px ${color}22`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(11,26,46,0.08)"; }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${color}, ${color}99)`, borderRadius: "20px 20px 0 0" }} />
      <div style={{ position: "absolute", top: -24, right: -24, width: 100, height: 100, borderRadius: "50%", background: color + "0a", pointerEvents: "none" }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "clamp(10px, 1.5vh, 18px)", flexShrink: 0 }}>
        <div style={{ width: "clamp(36px, 3.5vw, 50px)", height: "clamp(36px, 3.5vw, 50px)", borderRadius: 14, background: color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "clamp(17px, 1.8vw, 24px)", flexShrink: 0, border: `1.5px solid ${color}25` }}>
          {icon}
        </div>
        <span style={{ fontSize: "clamp(9px, 0.7vw, 11px)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#adb5c2" }}>{label}</span>
      </div>
      <p style={{ margin: "0 0 4px", fontSize: "clamp(24px, 3vw, 40px)", fontWeight: 800, color: loading ? "#e5e7eb" : NAVY, fontFamily: "Poppins, sans-serif", lineHeight: 1, letterSpacing: "-1px", flexShrink: 0, background: loading ? "#f3f4f6" : "none", borderRadius: loading ? 8 : 0, minHeight: "1em" }}>
        {loading ? "" : value}
      </p>
      <p style={{ margin: "0 0 clamp(6px, 1vh, 14px)", fontSize: "clamp(11px, 1vw, 13px)", color: "#9ca3af", fontWeight: 500, flexShrink: 0, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        {!loading && trend != null && (
          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 20, background: trend >= 0 ? "#dcfce7" : "#fee2e2", color: trend >= 0 ? "#16a34a" : "#dc2626" }}>
            {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}%
          </span>
        )}
        {loading ? "" : sub}
      </p>
      <div style={{ flex: 1, minHeight: 0, marginLeft: -2, marginRight: -2, marginBottom: -2 }}>
        <Sparkline data={spark} color={color} />
      </div>
    </div>
  );
}

// ── Property Detail Modal ──────────────────────────────────────────────────────
function PropertyDetailModal({ prop, onClose }) {
  if (!prop) return null;
  const statusColor = {
    active:   { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
    pending:  { bg: "#fefce8", color: "#854d0e", border: "#fde68a" },
    inactive: { bg: "#f3f4f6", color: "#6b7280", border: "#e5e7eb" },
    sold:     { bg: "#fdf4ff", color: "#7c3aed", border: "#e9d5ff" },
  }[prop.status] || { bg: "#f3f4f6", color: "#6b7280", border: "#e5e7eb" };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(7,20,34,0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: WHITE, borderRadius: 22, width: "100%", maxWidth: 580, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(0,0,0,0.4)", animation: "modalUp .3s cubic-bezier(.22,1,.36,1) both" }}>
        {/* Image */}
        <div style={{ position: "relative", height: 220, overflow: "hidden", borderRadius: "22px 22px 0 0", background: "#e5e7eb" }}>
          <img src={prop.image} alt={prop.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.currentTarget.src = "https://placehold.co/600x400/e5e7eb/6b7280?text=🏠"; }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(7,20,34,0.6) 0%, transparent 55%)" }} />
          <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, width: 34, height: 34, borderRadius: "50%", background: "rgba(0,0,0,0.45)", border: "none", color: WHITE, fontSize: 18, cursor: "pointer", display: "grid", placeItems: "center" }}>✕</button>
          <div style={{ position: "absolute", bottom: 14, left: 16, right: 16, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div>
              <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: WHITE, fontFamily: "Poppins,sans-serif", lineHeight: 1.2 }}>{prop.title}</p>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "rgba(255,255,255,0.8)" }}>📍 {prop.location}</p>
            </div>
            <span style={{ fontSize: 10.5, fontWeight: 700, padding: "4px 10px", borderRadius: 100, background: statusColor.bg, color: statusColor.color, border: `1px solid ${statusColor.border}`, textTransform: "capitalize", whiteSpace: "nowrap" }}>{prop.status}</span>
          </div>
        </div>
        {/* Body */}
        <div style={{ padding: "20px 24px 28px" }}>
          {/* Price + purpose */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
            <div>
              <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color: BLUE, fontFamily: "Poppins,sans-serif" }}>{fmtPrice(prop.price)}</p>
              {prop.inspectionFee && <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9ca3af" }}>Inspection fee: {fmtPrice(prop.inspectionFee)}</p>}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 100, background: prop.purpose === "rent" ? "#eff6ff" : NAVY, color: prop.purpose === "rent" ? BLUE : WHITE, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {prop.purpose === "rent" ? "For Rent" : "For Sale"}
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 100, background: "#f3f4f6", color: "#374151" }}>{prop.propertyType}</span>
              {prop.videoUrl && <span style={{ fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 100, background: "#eff6ff", color: BLUE, border: "1px solid #bfdbfe" }}>🎬 Video Tour</span>}
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
            {[["🛏", `${prop.bedrooms} Bed${prop.bedrooms !== 1 ? "s" : ""}`, "#eff6ff", BLUE], ["🚿", `${prop.bathrooms} Bath${prop.bathrooms !== 1 ? "s" : ""}`, "#f0fdf4", "#16a34a"], prop.sqft > 0 && ["📐", `${prop.sqft.toLocaleString()} sqft`, "#fefce8", "#854d0e"]].filter(Boolean).map(([icon, label, bg, color]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 14px", borderRadius: 10, background: bg }}>
                <span style={{ fontSize: 16 }}>{icon}</span>
                <span style={{ fontSize: 12.5, fontWeight: 700, color }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Agent */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "#f8fafc", borderRadius: 12, marginBottom: 16 }}>
            {prop.agent.avatar
              ? <img src={prop.agent.avatar} alt={prop.agent.name} style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover", border: "2px solid #e5e7eb", flexShrink: 0 }} onError={e => { e.currentTarget.style.display = "none"; }} />
              : <div style={{ width: 42, height: 42, borderRadius: "50%", background: BLUE + "20", display: "grid", placeItems: "center", fontSize: 16, fontWeight: 800, color: BLUE, flexShrink: 0 }}>{prop.agent.name[0]}</div>
            }
            <div>
              <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: NAVY }}>{prop.agent.name}</p>
              <p style={{ margin: "2px 0 0", fontSize: 11.5, color: "#9ca3af" }}>Listing Agent</p>
            </div>
          </div>

          {/* Listed date */}
          {prop.createdAt && (
            <p style={{ margin: 0, fontSize: 12, color: "#9ca3af", textAlign: "center" }}>
              Listed on {new Date(prop.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Properties View ────────────────────────────────────────────────────────────
function AdminPropertiesView() {
  const [properties, setProperties]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [search, setSearch]           = useState("");
  const [purposeFilter, setPurpose]   = useState("all");
  const [statusFilter, setStatus]     = useState("all");
  const [sortBy, setSortBy]           = useState("newest");
  const [page, setPage]               = useState(1);
  const [selectedProp, setSelected]   = useState(null);
  const [deletingId, setDeletingId]   = useState(null);
  const [confirmId, setConfirmId]     = useState(null);
  const PER_PAGE = 8;

  const fetchProperties = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API_BASE}/properties`, { headers: AUTH_HEADERS() });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const json = await res.json();
      const raw =
        Array.isArray(json.data?.properties) ? json.data.properties :
        Array.isArray(json.data)             ? json.data             :
        Array.isArray(json.properties)       ? json.properties       :
        Array.isArray(json)                  ? json                  : [];
      setProperties(raw.map(mapProperty));
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await fetch(`${API_BASE}/properties/${id}`, { method: "DELETE", headers: AUTH_HEADERS() });
      setProperties(prev => prev.filter(p => p._id !== id));
    } catch { /* keep row on failure */ }
    finally { setDeletingId(null); setConfirmId(null); }
  };

  const filtered = properties
    .filter(p => {
      const q = search.toLowerCase();
      const matchSearch = !q || p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) || p.agent.name.toLowerCase().includes(q);
      const matchPurpose = purposeFilter === "all" || p.purpose === purposeFilter;
      const matchStatus  = statusFilter  === "all" || p.status === statusFilter;
      return matchSearch && matchPurpose && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === "newest")    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      if (sortBy === "oldest")    return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      if (sortBy === "price_asc") return (a.price || 0) - (b.price || 0);
      if (sortBy === "price_dsc") return (b.price || 0) - (a.price || 0);
      return 0;
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const forRent   = properties.filter(p => p.purpose === "rent").length;
  const forSale   = properties.filter(p => p.purpose === "sale").length;
  const withVideo = properties.filter(p => p.videoUrl).length;

  const STATUS_BADGE = {
    active:   { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
    pending:  { bg: "#fefce8", color: "#854d0e", border: "#fde68a" },
    inactive: { bg: "#f3f4f6", color: "#6b7280", border: "#e5e7eb" },
    sold:     { bg: "#fdf4ff", color: "#7c3aed", border: "#e9d5ff" },
  };

  return (
    <div style={{ padding: "clamp(16px,3vh,36px) clamp(16px,3vw,40px)", maxWidth: 1280, margin: "0 auto", boxSizing: "border-box" }}>

      {/* ── Section header ── */}
      <div style={{ marginBottom: 22 }}>
        <p style={{ margin: "0 0 3px", fontSize: 11, fontWeight: 700, color: BLUE, letterSpacing: "1.5px", textTransform: "uppercase" }}>Admin Panel</p>
        <h2 style={{ margin: 0, fontSize: "clamp(18px,2.2vw,26px)", fontWeight: 800, color: NAVY, fontFamily: "Poppins,sans-serif" }}>All Properties</h2>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>Every listing uploaded on Nestfind — view, search and manage.</p>
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div style={{ marginBottom: 16, padding: "10px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, fontSize: 13, color: "#dc2626", display: "flex", alignItems: "center", gap: 8 }}>
          ⚠️ {error}
          <button onClick={fetchProperties} style={{ marginLeft: "auto", padding: "4px 12px", background: "#ef4444", color: WHITE, border: "none", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Retry</button>
        </div>
      )}

      {/* ── Mini stat strip ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 22 }}>
        {[
          { icon: "🏠", label: "Total Listings",  value: loading ? "—" : properties.length, color: BLUE },
          { icon: "🔑", label: "For Rent",          value: loading ? "—" : forRent,           color: "#059669" },
          { icon: "🏷️", label: "For Sale",          value: loading ? "—" : forSale,           color: "#d97706" },
          { icon: "🎬", label: "With Video Tour",   value: loading ? "—" : withVideo,         color: "#7c3aed" },
        ].map(({ icon, label, value, color }) => (
          <div key={label} style={{ background: WHITE, borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 2px 12px rgba(11,26,46,0.07)", border: "1px solid #f0f2f7", transition: "transform .2s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: color + "15", display: "grid", placeItems: "center", fontSize: 20, flexShrink: 0, border: `1.5px solid ${color}25` }}>{icon}</div>
            <div>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color, fontFamily: "Poppins,sans-serif", lineHeight: 1 }}>{value}</p>
              <p style={{ margin: "3px 0 0", fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 200px", minWidth: 140 }}>
          <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", fontSize: 13, pointerEvents: "none" }}>🔍</span>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search title, location, agent…"
            style={{ width: "100%", padding: "9px 12px 9px 32px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 13, color: NAVY, outline: "none", background: WHITE, boxSizing: "border-box", transition: "border-color .2s", fontFamily: "inherit" }}
            onFocus={e => { e.currentTarget.style.borderColor = BLUE; }}
            onBlur={e => { e.currentTarget.style.borderColor = "#e5e7eb"; }} />
        </div>

        {/* Purpose filter */}
        <select value={purposeFilter} onChange={e => { setPurpose(e.target.value); setPage(1); }}
          style={{ padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 13, color: "#374151", background: WHITE, cursor: "pointer", outline: "none", fontFamily: "inherit" }}>
          <option value="all">All Purposes</option>
          <option value="rent">For Rent</option>
          <option value="sale">For Sale</option>
        </select>

        {/* Status filter */}
        <select value={statusFilter} onChange={e => { setStatus(e.target.value); setPage(1); }}
          style={{ padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 13, color: "#374151", background: WHITE, cursor: "pointer", outline: "none", fontFamily: "inherit" }}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="inactive">Inactive</option>
          <option value="sold">Sold</option>
        </select>

        {/* Sort */}
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          style={{ padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 13, color: "#374151", background: WHITE, cursor: "pointer", outline: "none", fontFamily: "inherit" }}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price_asc">Price ↑</option>
          <option value="price_dsc">Price ↓</option>
        </select>

        {/* Refresh */}
        <button onClick={fetchProperties}
          style={{ padding: "9px 16px", border: "1.5px solid #e5e7eb", borderRadius: 10, background: WHITE, fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap", fontFamily: "inherit", transition: "all .15s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = BLUE; e.currentTarget.style.color = BLUE; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#374151"; }}>
          ↻ Refresh
        </button>

        <span style={{ marginLeft: "auto", fontSize: 12, color: "#9ca3af", whiteSpace: "nowrap" }}>
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Table ── */}
      <div style={{ background: WHITE, borderRadius: 18, boxShadow: "0 4px 24px rgba(11,26,46,0.07)", border: "1px solid #f0f2f7", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          {loading ? (
            <div style={{ padding: "70px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, color: "#9ca3af" }}>
              <div style={{ width: 36, height: 36, border: "3px solid #e5e7eb", borderTopColor: BLUE, borderRadius: "50%", animation: "spin .7s linear infinite" }} />
              <p style={{ margin: 0, fontSize: 13 }}>Fetching properties from server…</p>
            </div>
          ) : paginated.length === 0 ? (
            <div style={{ padding: "70px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 52, marginBottom: 12 }}>🏚️</div>
              <p style={{ fontWeight: 700, fontSize: 15, color: NAVY, margin: "0 0 6px" }}>No properties found</p>
              <p style={{ fontSize: 13, color: "#9ca3af" }}>Try adjusting your search or filters.</p>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #f0f2f7" }}>
                  {["Property", "Type", "Purpose", "Price", "Details", "Agent", "Status", "Listed", "Actions"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 10.5, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.09em", textTransform: "uppercase", background: "#f8fafc", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((prop, idx) => {
                  const sb = STATUS_BADGE[prop.status] || STATUS_BADGE.inactive;
                  const isDeleting = deletingId === prop._id;
                  const isConfirming = confirmId === prop._id;
                  return (
                    <tr key={prop._id}
                      style={{ borderBottom: "1px solid #f3f4f6", transition: "background .15s", animationDelay: `${idx * 30}ms` }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>

                      {/* Property image + title */}
                      <td style={{ padding: "13px 16px", minWidth: 220 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                          <div style={{ width: 54, height: 54, borderRadius: 11, overflow: "hidden", flexShrink: 0, background: "#e5e7eb", cursor: "pointer" }} onClick={() => setSelected(prop)}>
                            <img src={prop.image} alt={prop.title}
                              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .3s" }}
                              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08)"; }}
                              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
                              onError={e => { e.currentTarget.src = "https://placehold.co/100x100/e5e7eb/6b7280?text=🏠"; }} />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <p onClick={() => setSelected(prop)} style={{ margin: 0, fontWeight: 700, fontSize: 13, color: NAVY, fontFamily: "Poppins,sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 170, cursor: "pointer" }}
                              onMouseEnter={e => { e.currentTarget.style.color = BLUE; }}
                              onMouseLeave={e => { e.currentTarget.style.color = NAVY; }}>
                              {prop.title}
                            </p>
                            <p style={{ margin: "3px 0 0", fontSize: 11, color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 170 }}>📍 {prop.location}</p>
                            {prop.videoUrl && <span style={{ display: "inline-block", marginTop: 3, fontSize: 9, fontWeight: 700, letterSpacing: "0.5px", padding: "2px 6px", borderRadius: 100, background: "#eff6ff", color: BLUE, border: "1px solid #bfdbfe" }}>🎬 VIDEO</span>}
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                        <span style={{ padding: "4px 10px", borderRadius: 8, background: "#f3f4f6", fontSize: 12, fontWeight: 600, color: "#374151" }}>{prop.propertyType}</span>
                      </td>

                      {/* Purpose */}
                      <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 100, letterSpacing: "0.5px", textTransform: "uppercase", background: prop.purpose === "rent" ? "#eff6ff" : NAVY, color: prop.purpose === "rent" ? BLUE : WHITE }}>
                          {prop.purpose === "rent" ? "For Rent" : "For Sale"}
                        </span>
                      </td>

                      {/* Price */}
                      <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                        <p style={{ margin: 0, fontWeight: 800, fontSize: 13.5, color: BLUE, fontFamily: "Poppins,sans-serif" }}>{fmtPrice(prop.price)}</p>
                        {prop.inspectionFee ? <p style={{ margin: "2px 0 0", fontSize: 10.5, color: "#9ca3af" }}>Insp: {fmtPrice(prop.inspectionFee)}</p> : null}
                      </td>

                      {/* Beds / Baths / sqft */}
                      <td style={{ padding: "13px 16px", fontSize: 12, color: "#374151", whiteSpace: "nowrap" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                          <span>🛏 {prop.bedrooms}</span>
                          <span style={{ color: "#d1d5db" }}>·</span>
                          <span>🚿 {prop.bathrooms}</span>
                          {prop.sqft > 0 && <><span style={{ color: "#d1d5db" }}>·</span><span>📐 {prop.sqft.toLocaleString()}</span></>}
                        </span>
                      </td>

                      {/* Agent */}
                      <td style={{ padding: "13px 16px", minWidth: 130 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {prop.agent.avatar
                            ? <img src={prop.agent.avatar} alt={prop.agent.name} style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", border: "2px solid #e5e7eb", flexShrink: 0 }} onError={e => { e.currentTarget.style.display = "none"; }} />
                            : <div style={{ width: 28, height: 28, borderRadius: "50%", background: BLUE + "20", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 800, color: BLUE, flexShrink: 0 }}>{(prop.agent.name || "?")[0]}</div>
                          }
                          <span style={{ fontSize: 12, fontWeight: 600, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 90 }}>{prop.agent.name}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 100, background: sb.bg, color: sb.color, border: `1px solid ${sb.border}`, textTransform: "capitalize" }}>
                          {prop.status}
                        </span>
                      </td>

                      {/* Listed date */}
                      <td style={{ padding: "13px 16px", fontSize: 12, color: "#9ca3af", whiteSpace: "nowrap" }}>
                        {prop.createdAt ? new Date(prop.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          {/* View */}
                          <button onClick={() => setSelected(prop)}
                            style={{ padding: "5px 12px", background: "#eff6ff", color: BLUE, border: "1px solid #bfdbfe", borderRadius: 8, fontSize: 11.5, fontWeight: 700, cursor: "pointer", transition: "all .15s" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "#dbeafe"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "#eff6ff"; }}>
                            View
                          </button>

                          {/* Delete / Confirm */}
                          {isConfirming ? (
                            <>
                              <button onClick={() => handleDelete(prop._id)} disabled={isDeleting}
                                style={{ padding: "5px 11px", background: "#ef4444", color: WHITE, border: "none", borderRadius: 8, fontSize: 11.5, fontWeight: 700, cursor: isDeleting ? "not-allowed" : "pointer", opacity: isDeleting ? 0.6 : 1, transition: "all .15s" }}>
                                {isDeleting ? "…" : "Confirm"}
                              </button>
                              <button onClick={() => setConfirmId(null)}
                                style={{ padding: "5px 9px", background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 8, fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}>
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button onClick={() => setConfirmId(prop._id)}
                              style={{ padding: "5px 12px", background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca", borderRadius: 8, fontSize: 11.5, fontWeight: 700, cursor: "pointer", transition: "all .15s" }}
                              onMouseEnter={e => { e.currentTarget.style.background = "#fee2e2"; }}
                              onMouseLeave={e => { e.currentTarget.style.background = "#fef2f2"; }}>
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Pagination ── */}
      {!loading && totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, flexWrap: "wrap", marginTop: 20 }}>
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
            style={{ padding: "7px 14px", borderRadius: 9, border: "1.5px solid #e5e7eb", background: WHITE, fontSize: 12.5, fontWeight: 600, cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.4 : 1, color: "#374151", fontFamily: "inherit" }}>
            ‹ Prev
          </button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            let p;
            if (totalPages <= 7)        p = i + 1;
            else if (page <= 4)         p = i + 1;
            else if (page >= totalPages - 3) p = totalPages - 6 + i;
            else                        p = page - 3 + i;
            return p;
          }).map(p => (
            <button key={p} onClick={() => setPage(p)}
              style={{ minWidth: 36, height: 36, borderRadius: 9, border: "1.5px solid", borderColor: page === p ? BLUE : "#e5e7eb", background: page === p ? BLUE : WHITE, color: page === p ? WHITE : "#374151", fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all .15s" }}>
              {p}
            </button>
          ))}
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
            style={{ padding: "7px 14px", borderRadius: 9, border: "1.5px solid #e5e7eb", background: WHITE, fontSize: 12.5, fontWeight: 600, cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.4 : 1, color: "#374151", fontFamily: "inherit" }}>
            Next ›
          </button>
        </div>
      )}

      {/* ── Property Detail Modal ── */}
      {selectedProp && <PropertyDetailModal prop={selectedProp} onClose={() => setSelected(null)} />}
    </div>
  );
}

// ── Main Admin Dashboard ───────────────────────────────────────────────────────
export default function AdminDashboard({ initialTab }) {
  const [time, setTime]                 = useState(new Date());
  const [stats, setStats]               = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError]     = useState(null);
  const [activeTab, setActiveTab]       = useState(initialTab || "overview"); // "overview" | "properties"

  // Sync if parent changes initialTab (e.g. sidebar nav click)
  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

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

  const totalUsers      = stats?.users?.total;
  const totalAgents     = stats?.agents?.total;
  const totalRevenue    = stats?.transactions?.totalAmount ?? stats?.revenue?.total;
  const totalProperties = stats?.properties?.total;
  const newUsersMonth   = stats?.users?.newThisMonth   ?? stats?.users?.newToday   ?? null;
  const newAgentsMonth  = stats?.agents?.newThisMonth  ?? stats?.agents?.newToday  ?? null;
  const txThisMonth     = stats?.transactions?.total   ?? stats?.transactions?.count ?? null;
  const newPropsMonth   = stats?.properties?.newThisMonth ?? stats?.properties?.newToday ?? null;

  const cards = [
    { label: "All Users",          value: fmtNum(totalUsers),       icon: "👥", color: "#1a56db", trend: 12,   sub: newUsersMonth != null ? `+${fmtNum(newUsersMonth)} this month` : "Registered users",  spark: [30,45,38,60,55,72,80,75,90,88] },
    { label: "All Agents",         value: fmtNum(totalAgents),      icon: "🛡️", color: "#059669", trend: 8,    sub: newAgentsMonth != null ? `+${fmtNum(newAgentsMonth)} this month` : "Active agents",    spark: [12,18,14,22,19,25,21,28,24,30] },
    { label: "Transactions",       value: fmtMoney(totalRevenue),   icon: "💳", color: "#7c3aed", trend: null, sub: txThisMonth != null ? `${fmtNum(txThisMonth)} this month` : "Total volume",           spark: [40,55,48,70,65,82,78,95,88,105] },
    { label: "Properties Listed",  value: fmtNum(totalProperties),  icon: "🏠", color: "#d97706", trend: 5,    sub: newPropsMonth != null ? `+${fmtNum(newPropsMonth)} this month` : "Total listings",    spark: [80,95,110,100,130,120,145,155,140,165] },
  ];

  const TABS = [
    { id: "overview",    label: "Overview",        icon: "📊" },
    { id: "properties",  label: "All Properties",  icon: "🏠" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700;800&display=swap');
        @keyframes fadeUp  { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes modalUp { from { opacity:0; transform:translateY(24px) scale(.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes spin    { to { transform:rotate(360deg); } }
        .stat-card-anim { animation: fadeUp 0.4s cubic-bezier(.22,1,.36,1) both; }

        .admin-shell {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
          box-sizing: border-box;
          overflow: hidden;
          background: #f5f7fb;
        }

        /* Tab bar */
        .admin-tabs {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 12px 20px 0;
          background: #fff;
          border-bottom: 2px solid #f0f2f7;
          flex-shrink: 0;
        }

        .admin-tab-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 10px 18px;
          border: none;
          background: transparent;
          border-bottom: 3px solid transparent;
          margin-bottom: -2px;
          font-size: 13px;
          font-weight: 600;
          color: #9ca3af;
          cursor: pointer;
          transition: all .18s;
          font-family: inherit;
          white-space: nowrap;
          border-radius: 8px 8px 0 0;
        }
        .admin-tab-btn:hover  { color: #374151; background: #f8fafc; }
        .admin-tab-btn.active { color: #1a56db; border-bottom-color: #1a56db; background: #eff6ff; font-weight: 700; }

        /* Scrollable content pane */
        .admin-content {
          flex: 1;
          overflow-y: auto;
          min-height: 0;
        }

        /* Overview grid */
        .overview-wrap {
          display: flex;
          flex-direction: column;
          padding: clamp(16px, 3vh, 36px) clamp(16px, 3vw, 40px);
          max-width: 1100px;
          margin: 0 auto;
          box-sizing: border-box;
          height: 100%;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr;
          gap: clamp(10px,1.6vh,20px);
          flex: 1;
          min-height: 0;
        }
        .stats-grid > div { min-height: 0; }

        @media (max-width: 680px) { .stats-grid { gap: clamp(8px,1.4vh,14px); } }
        @media (max-width: 400px) {
          .admin-content { overflow-y: auto; }
          .stats-grid { grid-template-columns:1fr; grid-template-rows:repeat(4,minmax(160px,1fr)); }
        }
      `}</style>

      <div className="admin-shell">

        {/* ── Tab bar ── */}
        <div className="admin-tabs">
          {TABS.map(tab => (
            <button key={tab.id} className={`admin-tab-btn${activeTab === tab.id ? " active" : ""}`} onClick={() => setActiveTab(tab.id)}>
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* ── Content pane ── */}
        <div className="admin-content">

          {/* ══ OVERVIEW TAB ══ */}
          {activeTab === "overview" && (
            <div className="overview-wrap">
              {/* Header */}
              <div style={{ flexShrink: 0, marginBottom: "clamp(10px,2vh,24px)" }}>
                <p style={{ margin: "0 0 2px", fontSize: "clamp(11px,1vw,13px)", color: "#adb5c2", fontWeight: 500, letterSpacing: "0.05em" }}>
                  {time.toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>
                <h1 style={{ margin: 0, fontSize: "clamp(18px,2.4vw,28px)", fontWeight: 800, color: NAVY, fontFamily: "Poppins,sans-serif", letterSpacing: "-0.5px", lineHeight: 1.2 }}>
                  {greeting}, Admin 👋
                </h1>
                <p style={{ margin: "3px 0 0", fontSize: "clamp(12px,1vw,14px)", color: "#6b7280" }}>
                  Here's what's happening on Nestfind today.
                </p>
              </div>

              {/* Error banner */}
              {statsError && (
                <div style={{ flexShrink: 0, marginBottom: 12, padding: "9px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, fontSize: 13, color: "#dc2626", display: "flex", alignItems: "center", gap: 8 }}>
                  ⚠️ Could not load live stats: {statsError}
                </div>
              )}

              {/* Quick-link to properties */}
              <div style={{ flexShrink: 0, marginBottom: 16 }}>
                <button onClick={() => setActiveTab("properties")}
                  style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 18px", background: `linear-gradient(135deg,${BLUE},#1444b8)`, color: WHITE, border: "none", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "Poppins,sans-serif", boxShadow: "0 4px 14px rgba(26,86,219,0.3)", transition: "transform .15s" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}>
                  🏠 View All Properties →
                </button>
              </div>

              {/* 2×2 Stat grid */}
              <div className="stats-grid">
                {cards.map((c, i) => (
                  <div key={c.label} className="stat-card-anim" style={{ animationDelay: `${i * 80}ms` }}>
                    <StatCard {...c} loading={statsLoading} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ PROPERTIES TAB ══ */}
          {activeTab === "properties" && <AdminPropertiesView />}
        </div>
      </div>
    </>
  );
}