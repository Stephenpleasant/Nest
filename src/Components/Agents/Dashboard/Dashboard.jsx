// src/Dashboard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Icon components ────────────────────────────────────────────────────────
const IconMoney = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <circle cx="12" cy="12" r="3"/>
    <path d="M6 12h.01M18 12h.01"/>
  </svg>
);
const IconHome = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IconEye = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconPlus = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconBed = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M2 9V5a2 2 0 012-2h16a2 2 0 012 2v4"/><path d="M2 22V17a2 2 0 012-2h16a2 2 0 012 2v5"/><path d="M6 15v-3a2 2 0 012-2h8a2 2 0 012 2v3"/>
  </svg>
);
const IconLocation = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconDots = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
  </svg>
);
const IconTrendUp = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
);

// ── Mock listing data ──────────────────────────────────────────────────────
const MOCK_LISTINGS = [
  { id: 1, title: "3 Bedroom Flat, Lekki Phase 1", type: "Apartment", status: "Active", price: "₦2,500,000/yr", location: "Lekki, Lagos", beds: 3, views: 142, purpose: "Rent", img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=80" },
  { id: 2, title: "5 Bedroom Duplex, Maitama", type: "House", status: "Active", price: "₦85,000,000", location: "Maitama, Abuja", beds: 5, views: 98, purpose: "Sale", img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&q=80" },
  { id: 3, title: "Commercial Space, Victoria Island", type: "Commercial", status: "Pending", price: "₦5,000,000/yr", location: "VI, Lagos", beds: null, views: 76, purpose: "Rent", img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80" },
  { id: 4, title: "2 Bedroom Apartment, Ikeja GRA", type: "Apartment", status: "Active", price: "₦1,800,000/yr", location: "Ikeja, Lagos", beds: 2, views: 203, purpose: "Rent", img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80" },
  { id: 5, title: "Land, Epe Expressway", type: "Land", status: "Sold", price: "₦12,000,000", location: "Epe, Lagos", beds: null, views: 55, purpose: "Sale", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80" },
  { id: 6, title: "4 Bedroom Terrace, Wuse 2", type: "House", status: "Active", price: "₦45,000,000", location: "Wuse 2, Abuja", beds: 4, views: 119, purpose: "Sale", img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80" },
];

const STATUS_FILTERS = ["All", "Active", "Pending", "Sold"];
const TYPE_FILTERS   = ["All Types", "Apartment", "House", "Land", "Commercial"];

const STATUS_STYLE = {
  Active:  { bg: "#dcfce7", color: "#16a34a" },
  Pending: { bg: "#fef9c3", color: "#ca8a04" },
  Sold:    { bg: "#fee2e2", color: "#dc2626" },
};

// ── Stat card ──────────────────────────────────────────────────────────────
const StatCard = ({ icon, iconBg, iconColor, borderColor, label, value, sub }) => (
  <div style={{
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderTop: `3px solid ${borderColor}`,
    borderRadius: 14,
    padding: "22px 26px",
    display: "flex", alignItems: "center", gap: 18, flex: 1,
    boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
  }}>
    <div style={{
      width: 50, height: 50, borderRadius: 12,
      background: iconBg, color: iconColor,
      display: "grid", placeItems: "center", flexShrink: 0,
    }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: 26, fontWeight: 700, color: "#0b1a2e", lineHeight: 1.1, fontFamily: "'Poppins',sans-serif" }}>{value}</div>
      <div style={{ fontSize: 13, color: "#6b7280", marginTop: 3 }}>{label}</div>
      {sub && (
        <div style={{ fontSize: 11.5, color: "#16a34a", marginTop: 4, display: "flex", alignItems: "center", gap: 3, fontWeight: 600 }}>
          <IconTrendUp /> {sub}
        </div>
      )}
    </div>
  </div>
);

// ── Listing card ───────────────────────────────────────────────────────────
const ListingCard = ({ listing }) => {
  const st = STATUS_STYLE[listing.status];
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 14,
      overflow: "hidden",
      boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
      transition: "box-shadow 0.2s, transform 0.2s",
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(26,86,219,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 6px rgba(0,0,0,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 160, overflow: "hidden" }}>
        <img src={listing.img} alt={listing.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", top: 10, left: 10 }}>
          <span style={{ background: "#1a56db", color: "#fff", fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20 }}>
            {listing.purpose}
          </span>
        </div>
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <span style={{ background: st.bg, color: st.color, fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20 }}>
            {listing.status}
          </span>
        </div>
        <button style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(255,255,255,0.9)", border: "none", borderRadius: 8, width: 30, height: 30, display: "grid", placeItems: "center", cursor: "pointer", color: "#6b7280" }}>
          <IconDots />
        </button>
      </div>

      {/* Info */}
      <div style={{ padding: "14px 16px" }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0b1a2e", marginBottom: 6, lineHeight: 1.3 }}>{listing.title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#9ca3af", marginBottom: 10 }}>
          <IconLocation /> {listing.location}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1a56db", fontFamily: "'Poppins',sans-serif" }}>{listing.price}</div>
          <div style={{ display: "flex", gap: 10, fontSize: 11.5, color: "#6b7280" }}>
            {listing.beds && (
              <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <IconBed /> {listing.beds} beds
              </span>
            )}
            <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <IconEye /> {listing.views}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Dashboard ─────────────────────────────────────────────────────────
export default function AdashBoard({ onNavigate }) {
  const navigate = useNavigate();
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter]   = useState("All Types");

  const filtered = MOCK_LISTINGS.filter(l => {
    const matchSearch = l.title.toLowerCase().includes(search.toLowerCase()) || l.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || l.status === statusFilter;
    const matchType   = typeFilter === "All Types" || l.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const activeCount   = MOCK_LISTINGS.filter(l => l.status === "Active").length;
  const totalViews    = MOCK_LISTINGS.reduce((s, l) => s + l.views, 0);

  return (
    <div style={{ minHeight: "100vh", background: "#f3f7ff", padding: "32px 36px" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 24, fontWeight: 700, color: "#0b1a2e", margin: 0 }}>
            Dashboard
          </h1>
          <p style={{ fontSize: 13.5, color: "#6b7280", marginTop: 4 }}>Welcome back, Jane. Here's your property overview.</p>
        </div>
        <button
          onClick={() => navigate("/create-listing")}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "#1a56db", color: "#fff",
            border: "none", borderRadius: 10,
            padding: "11px 22px", fontSize: 14, fontWeight: 600,
            cursor: "pointer", fontFamily: "'Poppins',sans-serif",
            boxShadow: "0 4px 14px rgba(26,86,219,0.30)",
            transition: "background 0.2s, transform 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#1648c0"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#1a56db"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          <IconPlus /> Create a Listing
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: "flex", gap: 18, marginBottom: 32 }}>
        <StatCard
          icon={<IconMoney />}
          iconBg="#eff6ff" iconColor="#1a56db" borderColor="#1a56db"
          label="Total Earnings"
          value="₦4.2M"
          sub="+12% this month"
        />
        <StatCard
          icon={<IconHome />}
          iconBg="#f0fdf4" iconColor="#16a34a" borderColor="#16a34a"
          label="Listed Properties"
          value={MOCK_LISTINGS.length}
          sub={`${activeCount} currently active`}
        />
        <StatCard
          icon={<IconEye />}
          iconBg="#fff7ed" iconColor="#ea580c" borderColor="#ea580c"
          label="Total Views"
          value={totalViews.toLocaleString()}
          sub="+34 this week"
        />
      </div>

      {/* ── Listings Section ── */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: "24px 28px", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>

        {/* Section header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0b1a2e", margin: 0, fontFamily: "'Poppins',sans-serif" }}>My Listings</h2>
            <p style={{ fontSize: 12.5, color: "#9ca3af", marginTop: 2 }}>{filtered.length} propert{filtered.length === 1 ? "y" : "ies"} found</p>
          </div>
        </div>

        {/* Search + filters */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}>
              <IconSearch />
            </span>
            <input
              type="text"
              placeholder="Search your listings..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: "100%", height: 40, paddingLeft: 38, paddingRight: 14,
                border: "1px solid #e5e7eb", borderRadius: 9, fontSize: 13.5,
                color: "#374151", outline: "none", fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Status filter pills */}
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {STATUS_FILTERS.map(f => (
              <button key={f} onClick={() => setStatusFilter(f)} style={{
                padding: "7px 16px", borderRadius: 20, fontSize: 12.5, fontWeight: 500,
                border: statusFilter === f ? "none" : "1px solid #e5e7eb",
                background: statusFilter === f ? "#1a56db" : "#fff",
                color: statusFilter === f ? "#fff" : "#6b7280",
                cursor: "pointer", transition: "all 0.15s",
              }}>{f}</button>
            ))}
          </div>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            style={{
              height: 40, padding: "0 14px", borderRadius: 9, border: "1px solid #e5e7eb",
              fontSize: 13, color: "#374151", background: "#fff", cursor: "pointer", outline: "none",
            }}
          >
            {TYPE_FILTERS.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18 }}>
            {filtered.map(l => <ListingCard key={l.id} listing={l} />)}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🏠</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#6b7280" }}>No listings found</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Try adjusting your search or filters</div>
          </div>
        )}
      </div>
    </div>
  );
}