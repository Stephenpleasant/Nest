// src/Dashboard.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://gtimeconnect.onrender.com";

// ── Icons ──────────────────────────────────────────────────────────────────
const IconMoney = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="12" cy="12" r="3"/>
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
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
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
    <path d="M2 9V5a2 2 0 012-2h16a2 2 0 012 2v4"/>
    <path d="M2 22V17a2 2 0 012-2h16a2 2 0 012 2v5"/>
    <path d="M6 15v-3a2 2 0 012-2h8a2 2 0 012 2v3"/>
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
const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IconTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const IconClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// ── Helpers ────────────────────────────────────────────────────────────────
const STATUS_FILTERS = ["All", "Active", "Pending", "Sold"];
const TYPE_FILTERS   = ["All Types", "Apartment", "House", "Land", "Commercial"];

const STATUS_STYLE = {
  Active:   { bg: "#dcfce7", color: "#16a34a" },
  Pending:  { bg: "#fef9c3", color: "#ca8a04" },
  Sold:     { bg: "#fee2e2", color: "#dc2626" },
  active:   { bg: "#dcfce7", color: "#16a34a" },
  pending:  { bg: "#fef9c3", color: "#ca8a04" },
  sold:     { bg: "#fee2e2", color: "#dc2626" },
};

const fmt = (val) => {
  if (!val) return "—";
  const n = Number(val);
  if (isNaN(n)) return val;
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `₦${(n / 1_000).toFixed(0)}K`;
  return `₦${n.toLocaleString()}`;
};

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// ── Stat Card ──────────────────────────────────────────────────────────────
const StatCard = ({ icon, iconBg, iconColor, borderColor, label, value, sub }) => (
  <div style={{
    background: "#fff", border: "1px solid #e5e7eb",
    borderTop: `3px solid ${borderColor}`, borderRadius: 14,
    padding: "18px 20px", display: "flex", alignItems: "center",
    gap: 14, flex: 1, boxShadow: "0 1px 6px rgba(0,0,0,0.05)", minWidth: 0,
  }}>
    <div style={{ width: 46, height: 46, borderRadius: 12, background: iconBg, color: iconColor, display: "grid", placeItems: "center", flexShrink: 0 }}>
      {icon}
    </div>
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: "#0b1a2e", lineHeight: 1.1, fontFamily: "'Poppins',sans-serif" }}>{value}</div>
      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 3 }}>{label}</div>
      {sub && (
        <div style={{ fontSize: 11, color: "#16a34a", marginTop: 4, display: "flex", alignItems: "center", gap: 3, fontWeight: 600 }}>
          <IconTrendUp /> {sub}
        </div>
      )}
    </div>
  </div>
);

// ── Delete Confirm Modal ───────────────────────────────────────────────────
const DeleteModal = ({ listing, onCancel, onConfirm, isDeleting }) => (
  <div style={{
    position: "fixed", inset: 0, zIndex: 1000,
    background: "rgba(11,26,46,0.5)", backdropFilter: "blur(3px)",
    display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
  }}>
    <div style={{ background: "#fff", borderRadius: 16, padding: 28, maxWidth: 400, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
      <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#fee2e2", display: "grid", placeItems: "center", margin: "0 auto 16px" }}>
        <IconTrash />
      </div>
      <h3 style={{ textAlign: "center", fontSize: 17, fontWeight: 700, color: "#0b1a2e", margin: "0 0 8px", fontFamily: "'Poppins',sans-serif" }}>
        Delete Listing?
      </h3>
      <p style={{ textAlign: "center", fontSize: 13.5, color: "#6b7280", margin: "0 0 24px", lineHeight: 1.5 }}>
        Are you sure you want to delete <strong style={{ color: "#0b1a2e" }}>{listing?.title}</strong>? This action cannot be undone.
      </p>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onCancel} disabled={isDeleting} style={{
          flex: 1, height: 42, borderRadius: 9, border: "1px solid #e5e7eb",
          background: "#fff", fontSize: 14, fontWeight: 600, color: "#6b7280", cursor: "pointer",
        }}>
          Cancel
        </button>
        <button onClick={onConfirm} disabled={isDeleting} style={{
          flex: 1, height: 42, borderRadius: 9, border: "none",
          background: "#dc2626", fontSize: 14, fontWeight: 600, color: "#fff",
          cursor: "pointer", opacity: isDeleting ? 0.6 : 1,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}>
          {isDeleting ? "Deleting…" : "Yes, Delete"}
        </button>
      </div>
    </div>
  </div>
);

// ── Listing Card ───────────────────────────────────────────────────────────
const ListingCard = ({ listing, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const rawStatus = listing.status || "Pending";
  const statusKey = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase();
  const st = STATUS_STYLE[statusKey] || STATUS_STYLE["Pending"];

  const purpose = listing.purpose || listing.listingType || "";
  const purposeLabel = purpose.charAt(0).toUpperCase() + purpose.slice(1).toLowerCase().replace("_", " ");

  const imageUrl =
    (listing.images && listing.images.length > 0 && (listing.images[0]?.url || listing.images[0]))
    || "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=80";

  const location = [listing.city, listing.state].filter(Boolean).join(", ") || "—";
  const price = listing.price ? `${fmt(listing.price)}` : "—";

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div style={{
      background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14,
      overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
      transition: "box-shadow 0.2s, transform 0.2s",
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(26,86,219,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 6px rgba(0,0,0,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 160, overflow: "hidden" }}>
        <img src={imageUrl} alt={listing.title} style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={e => { e.target.src = "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=80"; }}
        />
        {purposeLabel && (
          <div style={{ position: "absolute", top: 10, left: 10 }}>
            <span style={{ background: "#1a56db", color: "#fff", fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20 }}>
              {purposeLabel}
            </span>
          </div>
        )}
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <span style={{ background: st.bg, color: st.color, fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20 }}>
            {statusKey}
          </span>
        </div>

        {/* Three-dot menu */}
        <div ref={menuRef} style={{ position: "absolute", bottom: 10, right: 10 }}>
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{ background: "rgba(255,255,255,0.92)", border: "none", borderRadius: 8, width: 30, height: 30, display: "grid", placeItems: "center", cursor: "pointer", color: "#6b7280" }}
          >
            <IconDots />
          </button>
          {menuOpen && (
            <div style={{
              position: "absolute", bottom: 36, right: 0,
              background: "#fff", borderRadius: 10, boxShadow: "0 8px 28px rgba(0,0,0,0.14)",
              border: "1px solid #e5e7eb", minWidth: 130, zIndex: 50, overflow: "hidden",
            }}>
              <button
                onClick={() => { setMenuOpen(false); onEdit(listing); }}
                style={{ width: "100%", padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, border: "none", background: "none", fontSize: 13, color: "#374151", cursor: "pointer", fontWeight: 500 }}
                onMouseEnter={e => e.currentTarget.style.background = "#f3f7ff"}
                onMouseLeave={e => e.currentTarget.style.background = "none"}
              >
                <IconEdit /> Edit Listing
              </button>
              <div style={{ height: 1, background: "#f3f4f6" }} />
              <button
                onClick={() => { setMenuOpen(false); onDelete(listing); }}
                style={{ width: "100%", padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, border: "none", background: "none", fontSize: 13, color: "#dc2626", cursor: "pointer", fontWeight: 500 }}
                onMouseEnter={e => e.currentTarget.style.background = "#fff1f1"}
                onMouseLeave={e => e.currentTarget.style.background = "none"}
              >
                <IconTrash /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "14px 16px" }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0b1a2e", marginBottom: 6, lineHeight: 1.3 }}>
          {listing.title || "Untitled Property"}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#9ca3af", marginBottom: 10 }}>
          <IconLocation /> {location}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1a56db", fontFamily: "'Poppins',sans-serif" }}>{price}</div>
          <div style={{ display: "flex", gap: 10, fontSize: 11.5, color: "#6b7280" }}>
            {listing.bedrooms > 0 && (
              <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <IconBed /> {listing.bedrooms} beds
              </span>
            )}
            {listing.views > 0 && (
              <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <IconEye style={{ width: 12, height: 12 }} /> {listing.views}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Responsive CSS ─────────────────────────────────────────────────────────
const RESPONSIVE_CSS = `
  /* Mobile: full width, offset for fixed topbar (56px) */
  .dash-layout { margin-left: 0 !important; }
  .dash-root   { padding: 72px 16px 32px; min-height: 100vh; }
  .dash-header { flex-direction: column !important; gap: 14px; align-items: flex-start !important; }
  .dash-stat-grid { flex-direction: column !important; }
  .dash-filters { flex-direction: column !important; gap: 10px !important; }
  .dash-status-pills { overflow-x: auto; padding-bottom: 2px; flex-wrap: nowrap !important; -webkit-overflow-scrolling: touch; }
  .dash-status-pills::-webkit-scrollbar { display: none; }
  .dash-type-select { width: 100% !important; }
  .dash-create-btn { width: 100% !important; justify-content: center !important; }

  @media (min-width: 480px) {
    .dash-root { padding: 72px 20px 32px; }
    .dash-stat-grid { flex-direction: row !important; flex-wrap: wrap !important; }
    .dash-stat-grid > * { flex: 1 1 calc(50% - 9px) !important; }
  }
  @media (min-width: 640px) {
    .dash-root { padding: 72px 28px 32px; }
    .dash-header { flex-direction: row !important; align-items: flex-start !important; }
    .dash-create-btn { width: auto !important; }
    .dash-filters { flex-direction: row !important; flex-wrap: wrap !important; }
    .dash-status-pills { flex-wrap: wrap !important; }
    .dash-type-select { width: auto !important; }
  }
  /* Desktop: sidebar is 260px wide, main shifts right */
  @media (min-width: 768px) {
    .dash-layout { margin-left: 260px !important; }
    .dash-root   { padding: 32px 28px 32px; }
  }
  @media (min-width: 900px) {
    .dash-root { padding: 32px 36px 32px; }
    .dash-stat-grid { flex-wrap: nowrap !important; }
    .dash-stat-grid > * { flex: 1 !important; }
  }

  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

// ── Main Dashboard ─────────────────────────────────────────────────────────
export default function AdashBoard({ onNavigate }) {
  const navigate = useNavigate();

  const [listings, setListings]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [fetchError, setFetchError]       = useState("");

  const [search, setSearch]               = useState("");
  const [statusFilter, setStatusFilter]   = useState("All");
  const [typeFilter, setTypeFilter]       = useState("All Types");

  const [deleteTarget, setDeleteTarget]   = useState(null);
  const [isDeleting, setIsDeleting]       = useState(false);
  const [deleteError, setDeleteError]     = useState("");

  // ── Fetch all agent properties ──
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setFetchError("");

      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;

      let agentId = null;
      try {
        const a = parsedUser?.agent;
        agentId = (a && (a._id || a.id)) || parsedUser?._id || parsedUser?.id || null;
      } catch (_) {}

      if (!token) {
        setFetchError("You are not logged in. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(
          `${API_BASE}/api/v1/properties/agent/properties`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const list =
          data?.properties ||
          data?.data       ||
          data?.listings   ||
          (Array.isArray(data) ? data : []);
        setListings(list);
      } catch (err) {
        const errData = err.response?.data;
        const msg =
          errData?.message ||
          errData?.error   ||
          (typeof errData === "string" ? errData : null) ||
          `Error ${err.response?.status || ""}: Failed to load listings.`;
        console.error("Fetch error:", errData);
        setFetchError(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // ── Delete handler ──
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setDeleteError("");
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${API_BASE}/api/v1/properties/delete/${deleteTarget._id || deleteTarget.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setListings(prev => prev.filter(l => (l._id || l.id) !== (deleteTarget._id || deleteTarget.id)));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete error:", err.response?.data);
      setDeleteError(err.response?.data?.message || "Failed to delete listing.");
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Edit handler — pass full listing object via router state ──
  const handleEdit = (listing) => {
    navigate(`/edit/${listing._id || listing.id}`, {
      state: { listing },
    });
  };

  // ── Filter ──
  const filtered = listings.filter(l => {
    const title    = (l.title || "").toLowerCase();
    const loc      = [l.city, l.state].filter(Boolean).join(", ").toLowerCase();
    const matchSearch = title.includes(search.toLowerCase()) || loc.includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || (l.status || "").toLowerCase() === statusFilter.toLowerCase();
    const matchType   = typeFilter === "All Types" || (l.propertyType || l.type || "").toLowerCase() === typeFilter.toLowerCase();
    return matchSearch && matchStatus && matchType;
  });

  const activeCount = listings.filter(l => (l.status || "").toLowerCase() === "active").length;
  const totalViews  = listings.reduce((s, l) => s + (l.views || 0), 0);

  return (
    <>
      <style>{RESPONSIVE_CSS}</style>

      {deleteTarget && (
        <DeleteModal
          listing={deleteTarget}
          onCancel={() => { setDeleteTarget(null); setDeleteError(""); }}
          onConfirm={handleDeleteConfirm}
          isDeleting={isDeleting}
        />
      )}

      <div className="nf-page-root dash-layout" style={{ minHeight: "100vh", background: "#f3f7ff" }}>
      <div className="dash-root">

        {/* ── Header ── */}
        <div className="dash-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 22, fontWeight: 700, color: "#0b1a2e", margin: 0 }}>
              Dashboard
            </h1>
            <p style={{ fontSize: 13.5, color: "#6b7280", marginTop: 4 }}>Welcome back! Here's your property overview.</p>
          </div>
          <button
            className="dash-create-btn"
            onClick={() => navigate("/create-listing")}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "#1a56db", color: "#fff",
              border: "none", borderRadius: 10,
              padding: "11px 22px", fontSize: 14, fontWeight: 600,
              cursor: "pointer", fontFamily: "'Poppins',sans-serif",
              boxShadow: "0 4px 14px rgba(26,86,219,0.30)",
              transition: "background 0.2s, transform 0.15s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#1648c0"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#1a56db"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <IconPlus /> Create a Listing
          </button>
        </div>

        {/* ── Stat Cards ── */}
        <div className="dash-stat-grid" style={{ display: "flex", gap: 14, marginBottom: 28 }}>
          <StatCard
            icon={<IconMoney />} iconBg="#eff6ff" iconColor="#1a56db" borderColor="#1a56db"
            label="Total Earnings" value="₦4.2M" sub="+12% this month"
          />
          <StatCard
            icon={<IconHome />} iconBg="#f0fdf4" iconColor="#16a34a" borderColor="#16a34a"
            label="Listed Properties" value={loading ? "…" : listings.length}
            sub={`${activeCount} currently active`}
          />
          <StatCard
            icon={<IconEye />} iconBg="#fff7ed" iconColor="#ea580c" borderColor="#ea580c"
            label="Total Views" value={loading ? "…" : totalViews.toLocaleString()}
            sub="+34 this week"
          />
        </div>

        {/* ── Listings Section ── */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: "20px 16px", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0b1a2e", margin: 0, fontFamily: "'Poppins',sans-serif" }}>
                My Listings
              </h2>
              <p style={{ fontSize: 12.5, color: "#9ca3af", marginTop: 2 }}>
                {loading ? "Loading…" : `${filtered.length} propert${filtered.length === 1 ? "y" : "ies"} found`}
              </p>
            </div>
          </div>

          {/* Delete error */}
          {deleteError && (
            <div style={{ marginBottom: 14, padding: "10px 14px", background: "#fee2e2", borderRadius: 9, fontSize: 13, color: "#dc2626", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              ⚠ {deleteError}
              <button onClick={() => setDeleteError("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626" }}>
                <IconClose />
              </button>
            </div>
          )}

          {/* Fetch error */}
          {fetchError && (
            <div style={{ marginBottom: 14, padding: "12px 16px", background: "#fee2e2", borderRadius: 9, fontSize: 13, color: "#dc2626", lineHeight: 1.5 }}>
              <strong>⚠ Could not load listings</strong><br />
              <span style={{ fontSize: 12, opacity: 0.85 }}>{fetchError}</span>
              <br />
              <button
                onClick={() => window.location.reload()}
                style={{ marginTop: 8, padding: "5px 12px", background: "#dc2626", color: "#fff", border: "none", borderRadius: 6, fontSize: 12, cursor: "pointer", fontWeight: 600 }}
              >
                Retry
              </button>
            </div>
          )}

          {/* Search + filters */}
          <div className="dash-filters" style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
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
                  color: "#374151", outline: "none", fontFamily: "inherit", boxSizing: "border-box",
                }}
              />
            </div>

            <div className="dash-status-pills" style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {STATUS_FILTERS.map(f => (
                <button key={f} onClick={() => setStatusFilter(f)} style={{
                  padding: "7px 14px", borderRadius: 20, fontSize: 12.5, fontWeight: 500,
                  border: statusFilter === f ? "none" : "1px solid #e5e7eb",
                  background: statusFilter === f ? "#1a56db" : "#fff",
                  color: statusFilter === f ? "#fff" : "#6b7280",
                  cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap", flexShrink: 0,
                }}>{f}</button>
              ))}
            </div>

            <select
              className="dash-type-select"
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

          {/* Loading skeleton */}
          {loading && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 260px), 1fr))", gap: 16 }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ borderRadius: 14, overflow: "hidden", border: "1px solid #e5e7eb" }}>
                  <div style={{ height: 160, background: "linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }} />
                  <div style={{ padding: "14px 16px" }}>
                    <div style={{ height: 14, background: "#f3f4f6", borderRadius: 6, marginBottom: 8, width: "80%" }} />
                    <div style={{ height: 12, background: "#f3f4f6", borderRadius: 6, width: "50%" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Grid */}
          {!loading && filtered.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 260px), 1fr))", gap: 16 }}>
              {filtered.map(l => (
                <ListingCard
                  key={l._id || l.id}
                  listing={l}
                  onEdit={handleEdit}
                  onDelete={setDeleteTarget}
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && filtered.length === 0 && !fetchError && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🏠</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#6b7280" }}>No listings found</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>
                {listings.length === 0 ? "You haven't created any listings yet." : "Try adjusting your search or filters"}
              </div>
              {listings.length === 0 && (
                <button
                  onClick={() => navigate("/create-listing")}
                  style={{
                    marginTop: 16, padding: "10px 22px", background: "#1a56db", color: "#fff",
                    border: "none", borderRadius: 9, fontSize: 13.5, fontWeight: 600, cursor: "pointer",
                    display: "inline-flex", alignItems: "center", gap: 6,
                  }}
                >
                  <IconPlus /> Create your first listing
                </button>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
    </>
  );
}