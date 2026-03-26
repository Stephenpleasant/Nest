import { useState } from "react";
import {
  Search, X, Phone, Mail, MapPin,
  Facebook, Twitter, Instagram, Linkedin,
  Globe, UserRound, Eye, ChevronLeft, ChevronRight,
  Trash2, AlertTriangle, Home, Calendar,
} from "lucide-react";

/* ── Mock Data ─────────────────────────────────────────────────────────────── */
const INITIAL_USERS = [
  {
    id: 1, name: "Funmilayo Okafor", phone: "+234 701 111 2233",
    email: "funmi.okafor@gmail.com", location: "Lagos, Nigeria",
    status: "Active", joined: "Feb 3, 2024", bookings: 5, avatar: "FO",
    avatarColor: "linear-gradient(135deg,#1a56db,#0b1a2e)",
    bio: "Property buyer actively searching for a 3-bedroom apartment in Lekki. Prefers gated estates with 24/7 security.",
    social: { facebook: "facebook.com/funmiokafor", twitter: "@funmi_okafor", instagram: "@funmi.homes", linkedin: "linkedin.com/in/funmiokafor", website: "" },
  },
  {
    id: 2, name: "Babajide Martins", phone: "+234 702 222 3344",
    email: "babajide.martins@yahoo.com", location: "Abuja, Nigeria",
    status: "Active", joined: "Mar 17, 2024", bookings: 2, avatar: "BM",
    avatarColor: "linear-gradient(135deg,#7c3aed,#4f46e5)",
    bio: "First-time home buyer looking for affordable options in the Lugbe and Kubwa axis of Abuja.",
    social: { facebook: "facebook.com/babajide.martins", twitter: "@baba_martins", instagram: "@babajide.martins", linkedin: "", website: "" },
  },
  {
    id: 3, name: "Chidinma Eze", phone: "+234 703 333 4455",
    email: "chidinma.eze@outlook.com", location: "Enugu, Nigeria",
    status: "Inactive", joined: "Jan 9, 2024", bookings: 0, avatar: "CE",
    avatarColor: "linear-gradient(135deg,#059669,#0d9488)",
    bio: "Relocating professional who previously inspected two properties but placed searches on hold.",
    social: { facebook: "", twitter: "@chidi_eze", instagram: "@chidinma.eze", linkedin: "linkedin.com/in/chidinmaeze", website: "" },
  },
  {
    id: 4, name: "Emeka Nwosu", phone: "+234 704 444 5566",
    email: "emeka.nwosu@gmail.com", location: "Port Harcourt, Nigeria",
    status: "Active", joined: "Apr 22, 2024", bookings: 8, avatar: "EN",
    avatarColor: "linear-gradient(135deg,#dc2626,#db2777)",
    bio: "Experienced property investor with a portfolio across Rivers and Delta states. Looking to expand.",
    social: { facebook: "facebook.com/emekanwosu", twitter: "@emeka_nwosu", instagram: "@emeka.invest", linkedin: "linkedin.com/in/emekanwosu", website: "emekanwosu.ng" },
  },
  {
    id: 5, name: "Halima Suleiman", phone: "+234 705 555 6677",
    email: "halima.suleiman@gmail.com", location: "Kano, Nigeria",
    status: "Pending", joined: "Jun 1, 2024", bookings: 0, avatar: "HS",
    avatarColor: "linear-gradient(135deg,#d97706,#f59e0b)",
    bio: "New user who just registered and is yet to complete profile verification.",
    social: { facebook: "", twitter: "@halima_sul", instagram: "@halima.sul", linkedin: "", website: "" },
  },
  {
    id: 6, name: "Tochukwu Obiora", phone: "+234 706 666 7788",
    email: "tochukwu.obiora@gmail.com", location: "Onitsha, Nigeria",
    status: "Active", joined: "May 5, 2024", bookings: 3, avatar: "TO",
    avatarColor: "linear-gradient(135deg,#0891b2,#0284c7)",
    bio: "Young professional seeking rental accommodation close to Awka metropolis for easy commuting.",
    social: { facebook: "facebook.com/tochukwu.obiora", twitter: "@tochu_obiora", instagram: "@tochukwu.homes", linkedin: "linkedin.com/in/tochukwuobiora", website: "" },
  },
  {
    id: 7, name: "Aisha Garba", phone: "+234 707 777 8899",
    email: "aisha.garba@gmail.com", location: "Kaduna, Nigeria",
    status: "Active", joined: "Feb 28, 2024", bookings: 4, avatar: "AG",
    avatarColor: "linear-gradient(135deg,#be185d,#9d174d)",
    bio: "Interior designer looking for a large open-plan apartment to double as her studio and residence.",
    social: { facebook: "facebook.com/aishagarba", twitter: "@aisha_garba", instagram: "@aisha.designs", linkedin: "linkedin.com/in/aishagarba", website: "aishadesigns.com.ng" },
  },
  {
    id: 8, name: "Seun Adeyinka", phone: "+234 708 888 9900",
    email: "seun.adeyinka@gmail.com", location: "Ibadan, Nigeria",
    status: "Inactive", joined: "Mar 30, 2024", bookings: 1, avatar: "SA",
    avatarColor: "linear-gradient(135deg,#92400e,#b45309)",
    bio: "University lecturer searching for a quiet neighbourhood property near the University of Ibadan.",
    social: { facebook: "", twitter: "@seun_adeyinka", instagram: "", linkedin: "linkedin.com/in/seunadeyinka", website: "" },
  },
];

/* ── Status Badge ───────────────────────────────────────────────────────────── */
const STATUS = {
  Active:   { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  Inactive: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  Pending:  { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
};

function StatusBadge({ status }) {
  const s = STATUS[status] ?? STATUS.Pending;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, display: "inline-block" }} />
      {status}
    </span>
  );
}

/* ── Delete Confirmation Modal ──────────────────────────────────────────────── */
function DeleteModal({ user, onConfirm, onCancel }) {
  if (!user) return null;
  return (
    <div
      onClick={onCancel}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(11,26,46,0.6)", backdropFilter: "blur(5px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 24, width: "100%", maxWidth: 420,
          boxShadow: "0 32px 64px rgba(11,26,46,0.2)",
          overflow: "hidden", animation: "modalIn 0.22s ease",
        }}
      >
        {/* Red header */}
        <div style={{
          background: "linear-gradient(135deg,#dc2626,#b91c1c)",
          padding: "28px 28px 22px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px solid rgba(255,255,255,0.25)",
          }}>
            <AlertTriangle size={26} color="#fff" />
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>Delete User</div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12.5, marginTop: 4 }}>
              This action cannot be undone
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "24px 28px" }}>
          {/* User preview */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            background: "#fef2f2", border: "1px solid #fecaca",
            borderRadius: 14, padding: "14px 16px", marginBottom: 18,
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: "50%",
              background: user.avatarColor,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 800, color: "#fff", flexShrink: 0,
            }}>
              {user.avatar}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#0b1a2e" }}>{user.name}</div>
              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{user.phone} · {user.location}</div>
            </div>
          </div>

          <p style={{ fontSize: 13.5, color: "#4b5563", lineHeight: 1.7, margin: "0 0 22px" }}>
            Are you sure you want to permanently delete{" "}
            <strong style={{ color: "#0b1a2e" }}>{user.name}</strong>'s account?
            All their bookings, data, and activity will be removed from the platform.
          </p>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={onCancel}
              style={{
                flex: 1, padding: "11px", borderRadius: 12,
                border: "1.5px solid #e5e7eb", background: "#fff",
                color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              style={{
                flex: 1, padding: "11px", borderRadius: 12,
                border: "none", background: "linear-gradient(135deg,#dc2626,#b91c1c)",
                color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <Trash2 size={14} /> Yes, Delete
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.94) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ── User Detail Modal ──────────────────────────────────────────────────────── */
function UserModal({ user, onClose, onDelete }) {
  if (!user) return null;

  const socialLinks = [
    { icon: Facebook,  key: "facebook",  label: "Facebook",  color: "#1877f2" },
    { icon: Twitter,   key: "twitter",   label: "Twitter",   color: "#1da1f2" },
    { icon: Instagram, key: "instagram", label: "Instagram", color: "#e1306c" },
    { icon: Linkedin,  key: "linkedin",  label: "LinkedIn",  color: "#0077b5" },
    { icon: Globe,     key: "website",   label: "Website",   color: "#1a56db" },
  ];
  const hasSocial = socialLinks.some(({ key }) => user.social[key]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 999,
        background: "rgba(11,26,46,0.55)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 24, width: "100%", maxWidth: 520,
          boxShadow: "0 32px 64px rgba(11,26,46,0.18)",
          overflow: "hidden", animation: "modalIn 0.22s ease",
        }}
      >
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg,#0b1a2e 0%,#1a56db 100%)",
          padding: "28px 28px 22px", position: "relative",
        }}>
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 16, right: 16,
              background: "rgba(255,255,255,0.15)", border: "none",
              borderRadius: "50%", width: 32, height: 32,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#fff",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
          >
            <X size={16} />
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: user.avatarColor,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, fontWeight: 800, color: "#fff",
              border: "3px solid rgba(255,255,255,0.3)", flexShrink: 0,
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            }}>
              {user.avatar}
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 20 }}>{user.name}</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12.5, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                <UserRound size={12} /> Registered User · {user.bookings} bookings
              </div>
              <div style={{ marginTop: 10 }}><StatusBadge status={user.status} /></div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "22px 28px", maxHeight: "58vh", overflowY: "auto" }}>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 22 }}>
            {[
              { label: "Bookings", value: user.bookings,                               emoji: "📋" },
              { label: "Joined",   value: user.joined.split(" ").slice(0,2).join(" "), emoji: "📅" },
              { label: "Status",   value: user.status,                                 emoji: "✅" },
            ].map(({ label, value, emoji }) => (
              <div key={label} style={{
                background: "#f9fafb", borderRadius: 14, padding: "12px 10px",
                border: "1px solid #e5e7eb", textAlign: "center",
              }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{emoji}</div>
                <div style={{ fontWeight: 800, fontSize: 14, color: "#0b1a2e" }}>{value}</div>
                <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Bio */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>About</div>
            <p style={{
              fontSize: 13.5, color: "#4b5563", lineHeight: 1.75, margin: 0,
              background: "#f9fafb", borderRadius: 12, padding: "12px 14px", border: "1px solid #e5e7eb",
            }}>
              {user.bio}
            </p>
          </div>

          {/* Contact */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Contact Details</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { icon: Phone,  value: user.phone,    color: "#16a34a", bg: "#f0fdf4" },
                { icon: Mail,   value: user.email,    color: "#1a56db", bg: "#eff6ff" },
                { icon: MapPin, value: user.location, color: "#dc2626", bg: "#fef2f2" },
              ].map(({ icon: Icon, value, color, bg }) => (
                <div key={value} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 14px", borderRadius: 12,
                  background: "#fff", border: "1px solid #e5e7eb",
                }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={14} color={color} />
                  </div>
                  <span style={{ fontSize: 13.5, color: "#374151", fontWeight: 500 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Social */}
          {hasSocial && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Social Media & Links</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {socialLinks.map(({ icon: Icon, key, label, color }) =>
                  user.social[key] ? (
                    <div key={key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, background: "#fff", border: "1px solid #e5e7eb" }}>
                      <div style={{ width: 30, height: 30, borderRadius: 9, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon size={14} color={color} />
                      </div>
                      <div style={{ overflow: "hidden" }}>
                        <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase" }}>{label}</div>
                        <div style={{ fontSize: 12, color: "#374151", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.social[key]}</div>
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 28px 20px", borderTop: "1px solid #f3f4f6", display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "11px", borderRadius: 12,
              border: "1.5px solid #e5e7eb", background: "#fff",
              color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
          >
            Close
          </button>
          <button
            onClick={onDelete}
            style={{
              flex: 1, padding: "11px", borderRadius: 12,
              border: "1.5px solid #fecaca", background: "#fef2f2",
              color: "#dc2626", fontSize: 13, fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#dc2626"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "#dc2626"; }}
          >
            <Trash2 size={13} /> Delete User
          </button>
          <button
            style={{
              flex: 2, padding: "11px", borderRadius: 12, border: "none",
              background: "linear-gradient(135deg,#1a56db,#0b1a2e)",
              color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Send Message
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.94) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ── Main Page ──────────────────────────────────────────────────────────────── */
const PAGE_SIZE = 5;

export default function AllUsersPage() {
  const [users, setUsers]       = useState(INITIAL_USERS);
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("All");
  const [selected, setSelected] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [page, setPage]         = useState(1);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = u.name.toLowerCase().includes(q) || u.phone.includes(q) || u.location.toLowerCase().includes(q);
    const matchFilter = filter === "All" || u.status === filter;
    return matchSearch && matchFilter;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = (user) => {
    const remaining = users.filter((u) => u.id !== user.id);
    setUsers(remaining);
    setToDelete(null);
    setSelected(null);
    const newFiltered = remaining.filter((u) => {
      const q = search.toLowerCase();
      return (u.name.toLowerCase().includes(q) || u.phone.includes(q) || u.location.toLowerCase().includes(q)) &&
             (filter === "All" || u.status === filter);
    });
    const newTotalPages = Math.ceil(newFiltered.length / PAGE_SIZE);
    if (page > newTotalPages && newTotalPages > 0) setPage(newTotalPages);
  };

  const openDelete = (user) => {
    setSelected(null);
    setTimeout(() => setToDelete(user), 150);
  };

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1000, margin: "0 auto" }}>

      {/* Page Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 11,
            background: "linear-gradient(135deg,#1a56db,#0b1a2e)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <UserRound size={18} color="#fff" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0b1a2e", margin: 0, letterSpacing: "-0.5px" }}>
            All Users
          </h1>
        </div>
        <p style={{ fontSize: 14, color: "#6b7280", margin: 0, marginLeft: 48 }}>
          View and manage every user on the platform.
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 28 }}>
        {[
          { label: "Total Users", value: users.length,                                    color: "#1a56db", bg: "#eff6ff", emoji: "👤" },
          { label: "Active",      value: users.filter(u => u.status === "Active").length,  color: "#16a34a", bg: "#f0fdf4", emoji: "✅" },
          { label: "Pending",     value: users.filter(u => u.status === "Pending").length, color: "#d97706", bg: "#fffbeb", emoji: "⏳" },
        ].map(({ label, value, color, bg, emoji }) => (
          <div key={label} style={{
            background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16,
            padding: "16px 20px", display: "flex", alignItems: "center", gap: 14,
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}>
            <div style={{
              width: 46, height: 46, borderRadius: 13,
              background: bg, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 20, flexShrink: 0,
            }}>
              {emoji}
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af", marginTop: 3 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
          <Search size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, phone or location…"
            style={{
              width: "100%", paddingLeft: 38, paddingRight: 14, paddingTop: 10, paddingBottom: 10,
              border: "2px solid #e5e7eb", borderRadius: 12, fontSize: 13,
              color: "#374151", outline: "none", background: "#fff", boxSizing: "border-box",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#1a56db")}
            onBlur={(e)  => (e.target.style.borderColor = "#e5e7eb")}
          />
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["All", "Active", "Inactive", "Pending"].map((f) => (
            <button key={f} onClick={() => { setFilter(f); setPage(1); }} style={{
              padding: "9px 15px", borderRadius: 10, fontSize: 12, fontWeight: 600,
              cursor: "pointer", border: "2px solid",
              borderColor: filter === f ? "#1a56db" : "#e5e7eb",
              background:   filter === f ? "#1a56db" : "#fff",
              color:        filter === f ? "#fff"    : "#6b7280",
              transition: "all 0.15s",
            }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{
        background: "#fff", border: "1px solid #e5e7eb",
        borderRadius: 20, overflow: "hidden",
        boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
      }}>
        {/* Head */}
        <div style={{
          display: "grid", gridTemplateColumns: "2.2fr 1.5fr 1fr 160px",
          padding: "13px 24px", background: "#f9fafb",
          borderBottom: "1px solid #e5e7eb",
        }}>
          {["User", "Phone Number", "Status", "Actions"].map((h) => (
            <div key={h} style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        {paginated.length === 0 ? (
          <div style={{ padding: "56px", textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>No users found</div>
            <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>Try adjusting your search or filter.</div>
          </div>
        ) : (
          paginated.map((user, i) => (
            <div
              key={user.id}
              style={{
                display: "grid", gridTemplateColumns: "2.2fr 1.5fr 1fr 160px",
                padding: "15px 24px", alignItems: "center",
                borderBottom: i < paginated.length - 1 ? "1px solid #f3f4f6" : "none",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#fafbff")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {/* Name + Avatar */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: user.avatarColor,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 800, color: "#fff", flexShrink: 0,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                }}>
                  {user.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13.5, color: "#0b1a2e" }}>{user.name}</div>
                  <div style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 1 }}>
                    <MapPin size={10} style={{ display: "inline", marginRight: 2 }} />
                    {user.location}
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <Phone size={13} color="#9ca3af" />
                <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{user.phone}</span>
              </div>

              {/* Status */}
              <div><StatusBadge status={user.status} /></div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => setSelected(user)}
                  style={{
                    display: "flex", alignItems: "center", gap: 5,
                    padding: "7px 13px", borderRadius: 10,
                    background: "#eff6ff", border: "1.5px solid #bfdbfe",
                    color: "#1a56db", fontSize: 12, fontWeight: 700,
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#1a56db"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#1a56db"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#eff6ff"; e.currentTarget.style.color = "#1a56db"; e.currentTarget.style.borderColor = "#bfdbfe"; }}
                >
                  <Eye size={12} /> View
                </button>

                <button
                  onClick={() => setToDelete(user)}
                  style={{
                    display: "flex", alignItems: "center", gap: 5,
                    padding: "7px 13px", borderRadius: 10,
                    background: "#fef2f2", border: "1.5px solid #fecaca",
                    color: "#dc2626", fontSize: 12, fontWeight: 700,
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#dc2626"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#dc2626"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "#dc2626"; e.currentTarget.style.borderColor = "#fecaca"; }}
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 24px", borderTop: "1px solid #f3f4f6", background: "#fafafa",
          }}>
            <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} users
            </span>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.4 : 1 }}>
                <ChevronLeft size={14} color="#374151" />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} style={{
                  width: 32, height: 32, borderRadius: 8, border: "1.5px solid", fontSize: 12, fontWeight: 700, cursor: "pointer",
                  borderColor: page === i + 1 ? "#1a56db" : "#e5e7eb",
                  background:  page === i + 1 ? "#1a56db" : "#fff",
                  color:       page === i + 1 ? "#fff"    : "#374151",
                }}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.4 : 1 }}>
                <ChevronRight size={14} color="#374151" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      {selected && (
        <UserModal
          user={selected}
          onClose={() => setSelected(null)}
          onDelete={() => openDelete(selected)}
        />
      )}

      {/* Delete Confirm Modal */}
      {toDelete && (
        <DeleteModal
          user={toDelete}
          onConfirm={() => handleDelete(toDelete)}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
}