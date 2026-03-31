import { useState, useEffect } from "react";
import AdminDashboard from "../Properties/Admindashboard";
import AllAgentsPage  from "./Users/Allagentpage";
import AllUsersPage   from "./Users/Alluserspage";

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

/* ── Copy-ID button ──────────────────────────────────────────────────────── */
function CopyId({ id }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(id).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };
  return (
    <button
      onClick={copy}
      title="Click to copy property ID"
      style={{
        display:"flex", alignItems:"center", gap:5,
        fontSize:11, fontWeight:600,
        color:   copied ? "#059669" : BLUE,
        background: copied ? "#d1fae5" : "#eff6ff",
        border: `1px solid ${copied ? "#6ee7b7" : "#bfdbfe"}`,
        borderRadius:6, padding:"3px 8px", cursor:"pointer",
        transition:"all .2s", whiteSpace:"nowrap",
        fontFamily:"'Courier New', monospace",
      }}
    >
      {copied ? "✓ Copied!" : `ID: ${id}`}
    </button>
  );
}

/* ── Admin Properties Grid ─────────────────────────────────────────────────── */
function AdminPropertiesView() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(false);
  const [search, setSearch]         = useState("");
  const [filter, setFilter]         = useState("all");

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/properties/all`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => {
        const inner = data.data ?? data;
        const list  = Array.isArray(inner) ? inner : (inner.properties || inner.data || []);
        setProperties(list);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:320 }}>
      <div style={{ textAlign:"center" }}>
        <div style={{
          width:40, height:40, border:"3px solid #e5e7eb", borderTopColor:BLUE,
          borderRadius:"50%", animation:"spin .8s linear infinite", margin:"0 auto 12px",
        }}/>
        <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
        <p style={{ color:"#6b7280", fontSize:14 }}>Loading properties…</p>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ padding:40, textAlign:"center" }}>
      <div style={{ fontSize:48, marginBottom:12 }}>⚠️</div>
      <p style={{ color:"#ef4444", fontWeight:600, fontSize:14 }}>Failed to load properties.</p>
      <p style={{ color:"#9ca3af", fontSize:13 }}>Make sure you are logged in and the API is reachable.</p>
    </div>
  );

  const filtered = properties.filter((p) => {
    const matchesFilter = filter === "all" || p.purpose === filter || p.type === filter;
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      (p.title || "").toLowerCase().includes(q)    ||
      (p.location || "").toLowerCase().includes(q)  ||
      (p.city || "").toLowerCase().includes(q)      ||
      (p._id || p.id || "").toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  if (!properties.length) return (
    <div style={{ padding:40, textAlign:"center" }}>
      <div style={{ fontSize:48, marginBottom:12 }}>🏠</div>
      <p style={{ color:"#6b7280", fontSize:15 }}>No properties found.</p>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes spin { to { transform:rotate(360deg); } }
        .admin-prop-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:20px; padding:20px 28px 28px; }
        .admin-prop-card { background:${WHITE}; border-radius:14px; overflow:hidden; box-shadow:0 2px 14px rgba(0,0,0,0.07); transition:transform .2s, box-shadow .2s; border:1px solid #f3f4f6; }
        .admin-prop-card:hover { transform:translateY(-4px); box-shadow:0 8px 28px rgba(0,0,0,0.13); }
      `}</style>

      {/* Toolbar */}
      <div style={{ padding:"20px 28px 0", display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
        <input
          type="text" placeholder="Search by title, location or ID…"
          value={search} onChange={e => setSearch(e.target.value)}
          style={{
            flex:1, minWidth:200, padding:"9px 14px",
            border:"1.5px solid #e5e7eb", borderRadius:10,
            fontSize:13.5, color:NAVY, outline:"none",
            fontFamily:"'Inter',sans-serif",
          }}
          onFocus={e => { e.target.style.borderColor=BLUE; e.target.style.boxShadow="0 0 0 3px rgba(26,86,219,0.1)"; }}
          onBlur={e  => { e.target.style.borderColor="#e5e7eb"; e.target.style.boxShadow="none"; }}
        />
        {["all","rent","sale"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding:"8px 16px", borderRadius:20, fontSize:13, fontWeight:600,
            border:`1.5px solid ${filter===f ? BLUE : "#e5e7eb"}`,
            background: filter===f ? BLUE : WHITE,
            color: filter===f ? WHITE : "#6b7280",
            cursor:"pointer", transition:"all .18s", textTransform:"capitalize",
          }}>
            {f==="all" ? "All" : f==="rent" ? "For Rent" : "For Sale"}
          </button>
        ))}
        <span style={{ fontSize:13, color:"#9ca3af", marginLeft:"auto" }}>
          {filtered.length} of {properties.length} properties
        </span>
      </div>

      {filtered.length === 0 ? (
        <div style={{ padding:40, textAlign:"center" }}>
          <p style={{ color:"#6b7280", fontSize:15 }}>No properties match your search.</p>
        </div>
      ) : (
        <div className="admin-prop-grid">
          {filtered.map((p) => {
            const id         = p._id || p.id || "—";
            const img        = resolveImage(p);
            const loc        = [p.area, p.city, p.state].filter(Boolean).join(", ");
            const purpose    = p.purpose || p.type || "";
            const badge      = purpose === "sale" ? "For Sale" : "For Rent";
            const badgeColor = purpose === "sale" ? NAVY : BLUE;

            return (
              <div key={id} className="admin-prop-card">
                <div style={{ position:"relative" }}>
                  <img src={img} alt={p.title}
                    style={{ width:"100%", height:170, objectFit:"cover", display:"block" }}
                    onError={e => { e.target.src="https://placehold.co/400x170/e5e7eb/6b7280?text=Property"; }}
                  />
                  <span style={{
                    position:"absolute", top:10, left:10,
                    background:badgeColor, color:WHITE,
                    fontSize:10, fontWeight:700, padding:"3px 10px",
                    borderRadius:100, textTransform:"uppercase", letterSpacing:"0.5px",
                  }}>{badge}</span>
                </div>
                <div style={{ padding:"14px 16px 16px" }}>
                  {/* Property ID — always visible, click to copy */}
                  <div style={{ marginBottom:10 }}>
                    <CopyId id={id} />
                  </div>
                  <p style={{ fontWeight:700, fontSize:14.5, color:NAVY, margin:"0 0 4px", fontFamily:"Poppins,sans-serif", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {p.title}
                  </p>
                  <p style={{ fontSize:12.5, color:"#6b7280", margin:"0 0 10px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    📍 {loc || p.location || "Lagos"}
                  </p>
                  <div style={{ display:"flex", gap:10, fontSize:12, color:"#6b7280", marginBottom:12, flexWrap:"wrap" }}>
                    {p.bedrooms  != null && <span>🛏 {p.bedrooms} bed</span>}
                    {p.bathrooms != null && <span>🚿 {p.bathrooms} bath</span>}
                    {(p.propertySize || p.sqft) && <span>📐 {(p.propertySize || p.sqft).toLocaleString()} sqft</span>}
                  </div>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <p style={{ fontWeight:800, color:BLUE, fontSize:15.5, margin:0, fontFamily:"Poppins,sans-serif" }}>
                      {formatPrice(p.price)}
                    </p>
                    <span style={{ fontSize:11, color:"#9ca3af", fontStyle:"italic" }}>
                      {purpose === "sale" ? "asking price" : "/ year"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

/* ── PageContent ─────────────────────────────────────────────────────────── */
export default function PageContent({ activeId, page }) {
  return (
    <main style={{ marginLeft:240, flex:1, minHeight:"100vh", overflowY:"auto", background:"#f9fafb" }}>
      {activeId === "dashboard"  && <AdminDashboard />}
      {activeId === "all-agents" && <AllAgentsPage  />}
      {activeId === "all-users"  && <AllUsersPage   />}
      {activeId === "properties" && <AdminPropertiesView />}

      {activeId !== "dashboard"  &&
       activeId !== "all-agents" &&
       activeId !== "all-users"  &&
       activeId !== "properties" && (
        <div style={{ padding:40 }}>
          <div style={{ maxWidth:720 }}>
            <p style={{ fontSize:36, marginBottom:12 }}>{page.emoji}</p>
            <h1 style={{ fontSize:28, fontWeight:700, color:NAVY, letterSpacing:"-0.5px", marginBottom:8, marginTop:0 }}>
              {page.title}
            </h1>
            <p style={{ color:"#6b7280", fontSize:15, marginTop:0 }}>{page.subtitle}</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginTop:40 }}>
              {[...Array(4)].map((_,i) => (
                <div key={i} style={{ background:WHITE, border:"1px solid #e5e7eb", borderRadius:16, padding:20, height:110 }}/>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}