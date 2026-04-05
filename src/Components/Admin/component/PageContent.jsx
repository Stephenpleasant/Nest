import { useState, useEffect } from "react";
import AdminDashboard from "../Properties/Admindashboard";
import AllAgentsPage  from "./Users/Allagentpage";
import AllUsersPage   from "./Users/Alluserspage";
import WithdrawPage   from "../Withdraw/Withdrawpage";
import axios from "axios";
import { Eye, EyeOff, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";

const BLUE     = "#1a56db";
const NAVY     = "#0b1a2e";
const LIGHTBG  = "#f0f5ff";
const GREY     = "#6b7280";
const BORDER   = "#e5e7eb";
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

/* ── Focus / blur helpers ────────────────────────────────────────────────── */
const onFocus = (e) => {
  e.target.style.borderColor = BLUE;
  e.target.style.boxShadow   = "0 0 0 3px rgba(26,86,219,0.13)";
};
const onBlur = (e) => {
  e.target.style.borderColor = BORDER;
  e.target.style.boxShadow   = "none";
};

const inputBase = {
  width: "100%", padding: "11px 14px", border: `1.5px solid ${BORDER}`,
  borderRadius: 9, fontSize: 14, color: NAVY, outline: "none",
  transition: "border-color .2s, box-shadow .2s",
  background: WHITE, boxSizing: "border-box", fontFamily: "'Inter',sans-serif",
};

/* ── Create Admin Page ───────────────────────────────────────────────────── */
function CreateAdminPage() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    phone: "", password: "", confirmPassword: "",
  });
  const [showPw, setShowPw]           = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [success, setSuccess]         = useState("");

  // ── Admin list — GET /api/v1/admin/list ──────────────────────────────────
  const [admins, setAdmins]           = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError]     = useState("");

  const fetchAdmins = async () => {
    setListLoading(true); setListError("");
    try {
      const res = await axios.get(`${API_BASE}/api/v1/admin/list`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = res.data?.data ?? res.data;
      setAdmins(Array.isArray(data) ? data : []);
    } catch {
      setListError("Could not load admin list.");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => { fetchAdmins(); }, []);

  const passMatch = form.confirmPassword === "" || form.password === form.confirmPassword;

  const change = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (error)   setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match."); return;
    }
    setError(""); setLoading(true);
    try {
      await axios.post(`${API_BASE}/api/v1/admin/register`, {
        fullName:        `${form.firstName} ${form.lastName}`.trim(),
        firstName:       form.firstName,
        lastName:        form.lastName,
        email:           form.email,
        password:        form.password,
        confirmPassword: form.confirmPassword,
        phone:           form.phone,
        role:            "admin",
        userType:        "admin",
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSuccess(`Admin account for ${form.firstName} ${form.lastName} created successfully!`);
      setForm({ firstName:"", lastName:"", email:"", phone:"", password:"", confirmPassword:"" });
      fetchAdmins(); // refresh the list
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error   ||
        `Registration failed (${err.response?.status ?? "network error"}). Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "36px 40px", maxWidth: 620 }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .ca-spinner { width:17px; height:17px; border:2px solid rgba(255,255,255,0.3); border-top-color:white; border-radius:50%; display:inline-block; animation:spin .7s linear infinite; }
        .ca-col2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        @media(max-width:560px) { .ca-col2 { grid-template-columns:1fr; } }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
          <div style={{ width:38, height:38, borderRadius:9, background:NAVY, display:"grid", placeItems:"center", flexShrink:0, boxShadow:"0 4px 12px rgba(11,26,46,0.2)" }}>
            <ShieldCheck size={18} color={WHITE} />
          </div>
          <h1 style={{ margin:0, fontSize:22, fontWeight:800, color:NAVY, fontFamily:"'Poppins',sans-serif", letterSpacing:"-0.4px" }}>
            Create Admin Account
          </h1>
        </div>
        <p style={{ margin:0, fontSize:14, color:GREY }}>
          Register a new administrator. They will have full access to the Nestfind admin panel.
        </p>
      </div>

      {/* Card */}
      <div style={{ background:WHITE, borderRadius:18, padding:"28px 32px 32px", boxShadow:"0 2px 20px rgba(0,0,0,0.07)", border:"1px solid #f3f4f6" }}>

        {/* Info badge */}
        <div style={{ display:"flex", alignItems:"center", gap:10, background:LIGHTBG, border:"1px solid rgba(26,86,219,0.18)", borderRadius:11, padding:"11px 15px", marginBottom:24 }}>
          <ShieldCheck size={15} color={BLUE} style={{ flexShrink:0 }} />
          <p style={{ margin:0, fontSize:13, color:BLUE, fontWeight:500 }}>
            This account will have full admin privileges on the platform.
          </p>
        </div>

        {success && (
          <div style={{ display:"flex", alignItems:"center", gap:8, background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:9, padding:"10px 14px", color:"#15803d", fontSize:13.5, marginBottom:16 }}>
            <CheckCircle2 size={15} /> {success}
          </div>
        )}
        {error && (
          <div style={{ display:"flex", alignItems:"center", gap:8, background:"#fef2f2", border:"1px solid #fecaca", borderRadius:9, padding:"10px 14px", color:"#dc2626", fontSize:13.5, marginBottom:16 }}>
            <AlertCircle size={15} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name row */}
          <div className="ca-col2" style={{ marginBottom:14 }}>
            <div>
              <label style={{ display:"block", fontSize:13.5, fontWeight:600, color:"#1f2937", marginBottom:6 }}>First Name</label>
              <input name="firstName" type="text" placeholder="John"
                value={form.firstName} onChange={change}
                style={inputBase} onFocus={onFocus} onBlur={onBlur}
                required disabled={loading} autoComplete="given-name" />
            </div>
            <div>
              <label style={{ display:"block", fontSize:13.5, fontWeight:600, color:"#1f2937", marginBottom:6 }}>Last Name</label>
              <input name="lastName" type="text" placeholder="Doe"
                value={form.lastName} onChange={change}
                style={inputBase} onFocus={onFocus} onBlur={onBlur}
                required disabled={loading} autoComplete="family-name" />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="ca-col2" style={{ marginBottom:14 }}>
            <div>
              <label style={{ display:"block", fontSize:13.5, fontWeight:600, color:"#1f2937", marginBottom:6 }}>Email Address</label>
              <input name="email" type="email" placeholder="admin@nestfind.com"
                value={form.email} onChange={change}
                style={inputBase} onFocus={onFocus} onBlur={onBlur}
                required disabled={loading} autoComplete="email" />
            </div>
            <div>
              <label style={{ display:"block", fontSize:13.5, fontWeight:600, color:"#1f2937", marginBottom:6 }}>Phone Number</label>
              <input name="phone" type="tel" placeholder="+234 800 000 0000"
                value={form.phone} onChange={change}
                style={inputBase} onFocus={onFocus} onBlur={onBlur}
                required disabled={loading} autoComplete="tel" />
            </div>
          </div>

          {/* Password row */}
          <div className="ca-col2" style={{ marginBottom:22 }}>
            <div>
              <label style={{ display:"block", fontSize:13.5, fontWeight:600, color:"#1f2937", marginBottom:6 }}>Password</label>
              <div style={{ position:"relative" }}>
                <input name="password" type={showPw ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={form.password} onChange={change}
                  style={{ ...inputBase, paddingRight:42 }}
                  onFocus={onFocus} onBlur={onBlur}
                  required disabled={loading} minLength={6} autoComplete="new-password" />
                <button type="button" onClick={() => setShowPw(p => !p)} tabIndex={-1}
                  style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:GREY, display:"flex", alignItems:"center", padding:0 }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label style={{ display:"block", fontSize:13.5, fontWeight:600, color:"#1f2937", marginBottom:6 }}>Confirm Password</label>
              <div style={{ position:"relative" }}>
                <input name="confirmPassword" type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={form.confirmPassword} onChange={change}
                  style={{ ...inputBase, paddingRight:42, borderColor: form.confirmPassword && !passMatch ? "#dc2626" : BORDER }}
                  onFocus={e => {
                    e.target.style.borderColor = form.confirmPassword && !passMatch ? "#dc2626" : BLUE;
                    e.target.style.boxShadow   = form.confirmPassword && !passMatch ? "0 0 0 3px rgba(220,38,38,0.12)" : "0 0 0 3px rgba(26,86,219,0.13)";
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = form.confirmPassword && !passMatch ? "#dc2626" : BORDER;
                    e.target.style.boxShadow   = "none";
                  }}
                  required disabled={loading} minLength={6} autoComplete="new-password" />
                <button type="button" onClick={() => setShowConfirm(p => !p)} tabIndex={-1}
                  style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:GREY, display:"flex", alignItems:"center", padding:0 }}>
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.confirmPassword && (
                <p style={{ fontSize:12, marginTop:4, color: passMatch ? "#16a34a" : "#dc2626" }}>
                  {passMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
                </p>
              )}
            </div>
          </div>

          <button type="submit"
            disabled={loading || (form.confirmPassword.length > 0 && !passMatch)}
            style={{
              width:"100%", padding:"13px 0", background: BLUE, color:"white",
              border:"none", borderRadius:11, fontSize:15, fontWeight:700, cursor:"pointer",
              transition:"background .2s, transform .15s, box-shadow .2s",
              boxShadow:"0 6px 22px rgba(26,86,219,0.35)", fontFamily:"'Inter',sans-serif",
              opacity: (loading || (form.confirmPassword.length > 0 && !passMatch)) ? 0.7 : 1,
            }}
          >
            {loading
              ? <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:9 }}><span className="ca-spinner" />Creating account…</span>
              : "Create Admin Account"}
          </button>
        </form>
      </div>

      {/* ── Existing Admins — GET /api/v1/admin/list ── */}
      <div style={{ marginTop:36, maxWidth:860 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
          <div>
            <h2 style={{ margin:0, fontSize:18, fontWeight:800, color:NAVY, fontFamily:"'Poppins',sans-serif" }}>
              Existing Admins
            </h2>
            <p style={{ margin:"3px 0 0", fontSize:13, color:GREY }}>
              All administrators currently registered on the platform.
            </p>
          </div>
          <button onClick={fetchAdmins}
            style={{ padding:"8px 16px", borderRadius:9, border:`1.5px solid ${BORDER}`, background:WHITE, fontSize:13, fontWeight:600, color:NAVY, cursor:"pointer" }}>
            ↻ Refresh
          </button>
        </div>

        <div style={{ background:WHITE, borderRadius:16, border:`1px solid ${BORDER}`, overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,0.05)" }}>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 2fr 1.5fr 1fr", padding:"11px 20px", background:"#f9fafb", borderBottom:`1px solid ${BORDER}` }}>
            {["Name","Email","Phone","Role"].map(h => (
              <span key={h} style={{ fontSize:11, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.07em" }}>{h}</span>
            ))}
          </div>

          {listLoading ? (
            <div style={{ padding:"36px 0", textAlign:"center", color:"#9ca3af", fontSize:13 }}>Loading admins…</div>
          ) : listError ? (
            <div style={{ padding:"28px 20px", color:"#dc2626", fontSize:13 }}>⚠️ {listError}</div>
          ) : admins.length === 0 ? (
            <div style={{ padding:"36px 0", textAlign:"center", color:"#9ca3af", fontSize:13 }}>No admins found.</div>
          ) : (
            admins.map((a, i) => {
              const name     = (a.fullName ?? `${a.firstName ?? ""} ${a.lastName ?? ""}`.trim()) || "—";
              const initials = name.split(" ").slice(0,2).map(w => w[0]?.toUpperCase() ?? "").join("");
              return (
                <div key={a._id ?? a.id ?? i}
                  style={{ display:"grid", gridTemplateColumns:"2fr 2fr 1.5fr 1fr", padding:"13px 20px", alignItems:"center", borderBottom: i < admins.length - 1 ? "1px solid #f3f4f6" : "none", transition:"background .15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fafbff"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#1a56db,#0b1a2e)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:WHITE, flexShrink:0 }}>
                      {initials || "A"}
                    </div>
                    <span style={{ fontSize:13.5, fontWeight:600, color:NAVY }}>{name}</span>
                  </div>
                  <span style={{ fontSize:13, color:"#374151", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {a.email ?? "—"}
                  </span>
                  <span style={{ fontSize:13, color:"#374151" }}>
                    {a.phone ?? a.phoneNumber ?? "—"}
                  </span>
                  <span style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:999, background:"#eff6ff", color:BLUE, border:"1px solid #bfdbfe", display:"inline-block", textTransform:"capitalize" }}>
                    {a.role ?? a.userType ?? "Admin"}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

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
    fetch(`${API_BASE}/api/v1/admin/properties`, {
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
        <div style={{ width:40, height:40, border:"3px solid #e5e7eb", borderTopColor:BLUE, borderRadius:"50%", animation:"spin .8s linear infinite", margin:"0 auto 12px" }}/>
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
          style={{ flex:1, minWidth:200, padding:"9px 14px", border:"1.5px solid #e5e7eb", borderRadius:10, fontSize:13.5, color:NAVY, outline:"none", fontFamily:"'Inter',sans-serif" }}
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
                  <span style={{ position:"absolute", top:10, left:10, background:badgeColor, color:WHITE, fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:100, textTransform:"uppercase", letterSpacing:"0.5px" }}>{badge}</span>
                </div>
                <div style={{ padding:"14px 16px 16px" }}>
                  <div style={{ marginBottom:10 }}><CopyId id={id} /></div>
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
      {activeId === "dashboard"    && <AdminDashboard />}
      {activeId === "all-agents"   && <AllAgentsPage  />}
      {activeId === "all-users"    && <AllUsersPage   />}
      {activeId === "properties"   && <AdminPropertiesView />}
      {activeId === "create-admin" && <CreateAdminPage />}
      {activeId === "withdraw"     && <WithdrawPage />}

      {activeId !== "dashboard"    &&
       activeId !== "all-agents"   &&
       activeId !== "all-users"    &&
       activeId !== "properties"   &&
       activeId !== "create-admin" &&
       activeId !== "withdraw"     && (
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