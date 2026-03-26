import { useState, useEffect } from "react";
import AllAgentsPage from "./Users/Allagentpage";
import AllUsersPage  from "./Users/Alluserspage";

/* ── constants ─────────────────────────────────────────────────────────────── */
const BLUE     = "#1a56db";
const NAVY     = "#0b1a2e";
const WHITE    = "#ffffff";
const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://gtimeconnect.onrender.com";

const formatPrice = (price) =>
  "₦" + new Intl.NumberFormat("en-NG").format(price || 0);

const resolveImage = (p) => {
  const raw = p.images?.[0] || p.image || p.thumbnail;
  if (!raw) return "https://placehold.co/400x200/e5e7eb/6b7280?text=Property";
  if (typeof raw === "string") return raw;
  return raw?.url || raw?.src || raw?.path || "https://placehold.co/400x200/e5e7eb/6b7280?text=Property";
};

/* ── Admin Properties Grid ─────────────────────────────────────────────────── */
function AdminPropertiesView() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/properties/all`, {                   // ✅ correct endpoint
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => {
        const inner = data.data ?? data;                            // ✅ matches Dashboard unwrap
        const list  = Array.isArray(inner)
          ? inner
          : (inner.properties || inner.data || []);
        setProperties(list);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  /* ── loading ── */
  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 320 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 40, height: 40,
          border: "3px solid #e5e7eb", borderTopColor: BLUE,
          borderRadius: "50%", animation: "spin .8s linear infinite",
          margin: "0 auto 12px",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: "#6b7280", fontSize: 14 }}>Loading properties…</p>
      </div>
    </div>
  );

  /* ── error ── */
  if (error) return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
      <p style={{ color: "#ef4444", fontWeight: 600, fontSize: 14 }}>
        Failed to load properties.
      </p>
      <p style={{ color: "#9ca3af", fontSize: 13 }}>
        Make sure you are logged in and the API is reachable.
      </p>
    </div>
  );

  /* ── empty ── */
  if (!properties.length) return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🏠</div>
      <p style={{ color: "#6b7280", fontSize: 15 }}>No properties found.</p>
    </div>
  );

  /* ── grid ── */
  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .admin-prop-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
          gap: 20px;
          padding: 28px;
        }
        .admin-prop-card {
          background: ${WHITE};
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 2px 14px rgba(0,0,0,0.07);
          transition: transform .2s, box-shadow .2s;
          cursor: pointer;
        }
        .admin-prop-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 28px rgba(0,0,0,0.13);
        }
      `}</style>

      <div className="admin-prop-grid">
        {properties.map((p) => {
          const img        = resolveImage(p);
          const loc        = [p.area, p.city, p.state].filter(Boolean).join(", ");
          const badge      = p.purpose === "sale" ? "For Sale" : "For Rent";
          const badgeColor = p.purpose === "sale" ? NAVY : BLUE;

          return (
            <div key={p._id || p.id} className="admin-prop-card">

              {/* Image */}
              <div style={{ position: "relative" }}>
                <img
                  src={img}
                  alt={p.title}
                  style={{ width: "100%", height: 175, objectFit: "cover", display: "block" }}
                  onError={(e) => {
                    e.target.src = "https://placehold.co/400x175/e5e7eb/6b7280?text=Property";
                  }}
                />
                <span style={{
                  position: "absolute", top: 10, left: 10,
                  background: badgeColor, color: WHITE,
                  fontSize: 10, fontWeight: 700,
                  padding: "3px 10px", borderRadius: 100,
                  textTransform: "uppercase", letterSpacing: "0.5px",
                }}>
                  {badge}
                </span>
              </div>

              {/* Body */}
              <div style={{ padding: "14px 16px 16px" }}>
                <p style={{
                  fontWeight: 700, fontSize: 14.5, color: NAVY,
                  margin: "0 0 4px", fontFamily: "Poppins, sans-serif",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {p.title}
                </p>
                <p style={{
                  fontSize: 12.5, color: "#6b7280", margin: "0 0 10px",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  📍 {loc || p.location || "Lagos"}
                </p>

                {/* Specs */}
                <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#6b7280", marginBottom: 12 }}>
                  {p.bedrooms  != null && <span>🛏 {p.bedrooms} bed</span>}
                  {p.bathrooms != null && <span>🚿 {p.bathrooms} bath</span>}
                  {(p.propertySize || p.sqft) && (
                    <span>📐 {(p.propertySize || p.sqft).toLocaleString()} sqft</span>
                  )}
                </div>

                {/* Price row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{
                    fontWeight: 800, color: BLUE, fontSize: 15.5,
                    margin: 0, fontFamily: "Poppins, sans-serif",
                  }}>
                    {formatPrice(p.price)}
                  </p>
                  <span style={{ fontSize: 11, color: "#9ca3af", fontStyle: "italic" }}>
                    {p.purpose === "sale" ? "asking price" : "/ year"}
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </>
  );
}

/* ── PageContent ────────────────────────────────────────────────────────────── */
export default function PageContent({ activeId, page }) {
  return (
    <main
      style={{
        marginLeft: 240,
        flex: 1,
        minHeight: "100vh",
        overflowY: "auto",
        background: "#f9fafb",
      }}
    >
      {activeId === "all-agents" && <AllAgentsPage />}
      {activeId === "all-users"  && <AllUsersPage  />}
      {activeId === "properties" && <AdminPropertiesView />}

      {/* Default skeleton for dashboard, withdraw, etc. */}
      {activeId !== "all-agents" &&
       activeId !== "all-users"  &&
       activeId !== "properties" && (
        <div style={{ padding: 40 }}>
          <div style={{ maxWidth: 720 }}>
            <p style={{ fontSize: 36, marginBottom: 12 }}>{page.emoji}</p>
            <h1 style={{
              fontSize: 28, fontWeight: 700, color: NAVY,
              letterSpacing: "-0.5px", marginBottom: 8, marginTop: 0,
            }}>
              {page.title}
            </h1>
            <p style={{ color: "#6b7280", fontSize: 15, marginTop: 0 }}>
              {page.subtitle}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 40 }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} style={{
                  background: WHITE, border: "1px solid #e5e7eb",
                  borderRadius: 16, padding: 20, height: 110,
                }} />
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}


