import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home, BookOpen, User, Settings, HelpCircle,
  LogOut, Menu, MapPin, Search, ChevronLeft, ChevronRight,
  BedDouble, Bath, Maximize2, ChevronDown,
} from "lucide-react";

/* ─── REPLACE THIS WITH YOUR BACKEND FETCH ──────────────────────────────────
   Expected shape per property:
   {
     _id: string,
     title: string,
     location: string,
     price: number,
     image: string,          // URL
     agent: {
       name: string,
       avatar: string,       // URL
     },
     bedrooms: number,
     bathrooms: number,
     sqft: number,
     type: "rent" | "sale",
   }
────────────────────────────────────────────────────────────────────────────── */
const MOCK_PROPERTIES = [
  {
    _id: "1",
    title: "3 Bedroom Duplex",
    location: "Victoria Island, Lagos",
    city: "Victoria Island", propertyType: "Duplex",
    price: 2500000,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
    agent: { name: "Emeka Okafor", avatar: "https://i.pravatar.cc/40?img=11" },
    bedrooms: 3, bathrooms: 2, sqft: 1800, type: "rent",
  },
  {
    _id: "2",
    title: "Modern 2-Bedroom Flat",
    location: "Lekki Phase 1, Lagos",
    city: "Lekki", propertyType: "Flat",
    price: 1800000,
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80",
    agent: { name: "Ngozi Adeyemi", avatar: "https://i.pravatar.cc/40?img=22" },
    bedrooms: 2, bathrooms: 2, sqft: 1200, type: "rent",
  },
  {
    _id: "3",
    title: "5 Bedroom Mansion",
    location: "Ikoyi, Lagos",
    city: "Ikoyi", propertyType: "Mansion",
    price: 85000000,
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80",
    agent: { name: "Femi Adedayo", avatar: "https://i.pravatar.cc/40?img=33" },
    bedrooms: 5, bathrooms: 4, sqft: 4500, type: "sale",
  },
  {
    _id: "4",
    title: "Studio Apartment",
    location: "Yaba, Lagos",
    city: "Yaba", propertyType: "Apartment",
    price: 650000,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
    agent: { name: "Amara Eze", avatar: "https://i.pravatar.cc/40?img=44" },
    bedrooms: 1, bathrooms: 1, sqft: 500, type: "rent",
  },
  {
    _id: "5",
    title: "4 Bedroom Terrace",
    location: "Ajah, Lagos",
    city: "Ajah", propertyType: "Terrace",
    price: 45000000,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80",
    agent: { name: "Tunde Bello", avatar: "https://i.pravatar.cc/40?img=55" },
    bedrooms: 4, bathrooms: 3, sqft: 2800, type: "sale",
  },
  {
    _id: "6",
    title: "Mini Flat (Self-Contain)",
    location: "Surulere, Lagos",
    city: "Surulere", propertyType: "Flat",
    price: 480000,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
    agent: { name: "Chioma Nwosu", avatar: "https://i.pravatar.cc/40?img=66" },
    bedrooms: 1, bathrooms: 1, sqft: 420, type: "rent",
  },
  {
    _id: "7",
    title: "3 Bedroom Bungalow",
    location: "Magodo, Lagos",
    city: "Magodo", propertyType: "Bungalow",
    price: 38000000,
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",
    agent: { name: "Lanre Ogundimu", avatar: "https://i.pravatar.cc/40?img=7" },
    bedrooms: 3, bathrooms: 2, sqft: 1600, type: "sale",
  },
  {
    _id: "8",
    title: "Luxury Penthouse",
    location: "Eko Atlantic, Lagos",
    city: "Eko Atlantic", propertyType: "Penthouse",
    price: 12000000,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80",
    agent: { name: "Sandra Igwe", avatar: "https://i.pravatar.cc/40?img=8" },
    bedrooms: 4, bathrooms: 3, sqft: 3200, type: "rent",
  },
];

const formatPrice = (price) =>
  "₦" + new Intl.NumberFormat("en-NG").format(price);

const CITIES = ["All Cities", "Victoria Island", "Lekki", "Ikoyi", "Yaba", "Ajah", "Surulere", "Magodo", "Eko Atlantic"];
const PROP_TYPES = ["All Types", "Duplex", "Flat", "Mansion", "Apartment", "Terrace", "Bungalow", "Penthouse"];

/* ─── SIDEBAR ────────────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { to: "/dashboard", icon: Home, label: "Dashboard" },
  { to: "/bookings", icon: BookOpen, label: "My Bookings" },
  { to: "/profile", icon: User, label: "Profile" },
  { to: "/settings", icon: Settings, label: "Settings" },
  { to: "/support", icon: HelpCircle, label: "Support" },
];

function Sidebar({ mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="md:hidden"
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40,
          }}
        />
      )}

      <nav
        style={{
          position: "fixed", left: 0, top: 0, height: "100vh", width: 256,
          background: "#fff", boxShadow: "4px 0 20px rgba(0,0,0,0.06)",
          display: "flex", flexDirection: "column",
          zIndex: 50, transition: "transform 0.3s ease-in-out",
        }}
        className={`${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo */}
        <div style={{ padding: "28px 24px 24px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 40, height: 40, background: "#0b1a2e", borderRadius: 10,
            display: "grid", placeItems: "center",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" stroke="white" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 18, color: "#0b1a2e" }}>
            Nest<span style={{ color: "#1a56db" }}>find</span>
          </span>
        </div>

        {/* Nav items */}
        <div style={{ flex: 1, padding: "0 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "11px 14px", borderRadius: 12, textDecoration: "none",
                  background: active ? "#eff6ff" : "transparent",
                  border: active ? "1px solid #bfdbfe" : "1px solid transparent",
                  transition: "all 0.18s", position: "relative",
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#eff6ff"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                {active && (
                  <span style={{
                    position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
                    width: 3, height: 28, borderRadius: "0 3px 3px 0", background: "#1a56db",
                  }} />
                )}
                <Icon size={20} color={active ? "#1a56db" : "#6b7280"} strokeWidth={active ? 2.2 : 1.8} />
                <span style={{ fontSize: 13.5, fontWeight: active ? 700 : 500, color: active ? "#1a56db" : "#374151" }}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Logout */}
        <div style={{ padding: "12px 12px 28px" }}>
          <div style={{ height: 1, background: "#f3f4f6", margin: "0 8px 12px" }} />
          <button
            onClick={() => { localStorage.removeItem("token"); window.location.href = "/login"; }}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "11px 14px", borderRadius: 12,
              border: "1px solid transparent", background: "transparent",
              cursor: "pointer", width: "100%", transition: "all 0.18s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.borderColor = "#fecaca"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}
          >
            <LogOut size={19} color="#ef4444" strokeWidth={1.8} />
            <span style={{ fontSize: 13.5, fontWeight: 500, color: "#ef4444" }}>Log out</span>
          </button>
        </div>
      </nav>
    </>
  );
}

/* ─── PROPERTY CARD ──────────────────────────────────────────────────────────── */
function PropertyCard({ property }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link to={`/properties/${property._id}`} style={{ textDecoration: "none" }}>
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff", borderRadius: 18, overflow: "hidden",
        boxShadow: hovered ? "0 16px 48px rgba(0,0,0,0.13)" : "0 2px 14px rgba(0,0,0,0.07)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.25s ease",
        display: "flex", flexDirection: "column", cursor: "pointer",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 200, overflow: "hidden", background: "#e5e7eb" }}>
        <img
          src={property.image}
          alt={property.title}
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            transform: hovered ? "scale(1.06)" : "scale(1)",
            transition: "transform 0.45s ease",
          }}
          onError={e => { e.target.src = "https://placehold.co/600x400/e5e7eb/6b7280?text=Property"; }}
        />
        <div style={{ position: "absolute", top: 14, left: 14 }}>
          <span style={{
            background: property.type === "rent" ? "#1a56db" : "#0b1a2e",
            color: "#fff", fontSize: 11, fontWeight: 700,
            padding: "4px 12px", borderRadius: 100,
            textTransform: "uppercase", letterSpacing: "0.5px",
          }}>
            {property.type === "rent" ? "For Rent" : "For Sale"}
          </span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "18px 20px 20px", flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Title */}
        <h3 style={{
          fontSize: 15.5, fontWeight: 700, color: "#0b1a2e", margin: 0,
          fontFamily: "Poppins, sans-serif", lineHeight: 1.3,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {property.title}
        </h3>

        {/* Location */}
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <MapPin size={13} color="#9ca3af" />
          <span style={{ fontSize: 12.5, color: "#6b7280" }}>{property.location}</span>
        </div>

        {/* Specs */}
        <div style={{ display: "flex", gap: 16 }}>
          {[
            { icon: BedDouble, value: `${property.bedrooms} Bed` },
            { icon: Bath, value: `${property.bathrooms} Bath` },
            { icon: Maximize2, value: `${property.sqft} sqft` },
          ].map(({ icon: Icon, value }) => (
            <div key={value} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Icon size={13} color="#9ca3af" />
              <span style={{ fontSize: 12, color: "#6b7280" }}>{value}</span>
            </div>
          ))}
        </div>

        <div style={{ height: 1, background: "#f3f4f6" }} />

        {/* Agent + Price */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img
              src={property.agent.avatar}
              alt={property.agent.name}
              style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", border: "2px solid #e5e7eb" }}
              onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(property.agent.name)}&size=30&background=1a56db&color=fff`; }}
            />
            <span style={{ fontSize: 12.5, fontWeight: 600, color: "#374151" }}>{property.agent.name}</span>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#1a56db", fontFamily: "Poppins, sans-serif" }}>
              {formatPrice(property.price)}
            </div>
            <div style={{ fontSize: 10.5, color: "#9ca3af" }}>
              {property.type === "rent" ? "/ year" : "total"}
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          style={{
            width: "100%", padding: "10px", border: "none", borderRadius: 10,
            background: "#0b1a2e", color: "#fff",
            fontSize: 13, fontWeight: 700, cursor: "pointer",
            transition: "background 0.2s", fontFamily: "Poppins, sans-serif",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#1a56db"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#0b1a2e"; }}
        >
          View Property
        </button>
      </div>
    </div>
    </Link>
  );
}

/* ─── MAIN DASHBOARD ─────────────────────────────────────────────────────────── */
export default function UserDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("All Cities");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [properties, setProperties] = useState(MOCK_PROPERTIES);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 4;

  /* ── Swap this block with your real API call ──────────────────────────────
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/properties/all`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        setProperties(data.properties || data.data || data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);
  ───────────────────────────────────────────────────────────────────────────── */

  const filtered = properties.filter(p => {
    const matchType   = filter === "all" || p.type === filter;
    const matchCity   = cityFilter === "All Cities" || p.city === cityFilter;
    const matchPType  = typeFilter === "All Types" || p.propertyType === typeFilter;
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      p.agent.name.toLowerCase().includes(search.toLowerCase());
    return matchType && matchCity && matchPType && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "Inter, sans-serif", display: "flex" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet" />

      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main content */}
      <main style={{ marginLeft: 256, flex: 1, minHeight: "100vh", minWidth: 0, boxSizing: "border-box" }}>

        {/* ── HERO BANNER ─────────────────────────────────────────────────────── */}
        <div style={{
          position: "relative",
          height: 360,
          backgroundImage: "url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          {/* dark overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(7,20,40,0.55) 0%, rgba(7,20,40,0.65) 100%)",
          }} />

          {/* Hero content */}
          <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 24px", width: "100%", maxWidth: 700 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#93c5fd", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 10 }}>
              WELCOME TO NESTFIND
            </p>
            <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: "2.2rem", color: "#fff", margin: "0 0 8px", lineHeight: 1.2 }}>
              Find Your Next Home
            </h1>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, marginBottom: 28 }}>
              Browse available properties across Lagos and book an inspection in minutes.
            </p>

            {/* Search row: City dropdown + Type dropdown + Search button */}
            <div style={{
              display: "flex", alignItems: "center", gap: 0,
              background: "#fff", borderRadius: 14, overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0,0,0,0.25)", maxWidth: 580, margin: "0 auto 18px",
            }}>
              {/* City select */}
              <div style={{ position: "relative", flex: 1, borderRight: "1px solid #e5e7eb" }}>
                <MapPin size={14} color="#9ca3af" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <select
                  value={cityFilter}
                  onChange={e => { setCityFilter(e.target.value); setCurrentPage(1); }}
                  style={{
                    width: "100%", padding: "14px 32px 14px 34px",
                    border: "none", outline: "none", background: "transparent",
                    fontSize: 13.5, color: "#374151", fontFamily: "inherit",
                    appearance: "none", cursor: "pointer",
                  }}
                >
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
                <ChevronDown size={13} color="#9ca3af" style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              </div>

              {/* Type select */}
              <div style={{ position: "relative", flex: 1, borderRight: "1px solid #e5e7eb" }}>
                <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", fontSize: 14, pointerEvents: "none" }}>🏠</span>
                <select
                  value={typeFilter}
                  onChange={e => { setTypeFilter(e.target.value); setCurrentPage(1); }}
                  style={{
                    width: "100%", padding: "14px 32px 14px 34px",
                    border: "none", outline: "none", background: "transparent",
                    fontSize: 13.5, color: "#374151", fontFamily: "inherit",
                    appearance: "none", cursor: "pointer",
                  }}
                >
                  {PROP_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
                <ChevronDown size={13} color="#9ca3af" style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              </div>

              {/* Search button */}
              <button
                style={{
                  padding: "14px 28px", background: "#1a56db", color: "#fff",
                  border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer",
                  fontFamily: "Poppins, sans-serif", whiteSpace: "nowrap",
                  transition: "background 0.18s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#1444b8"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#1a56db"; }}
              >
                Search
              </button>
            </div>

            {/* Status filter pills */}
            <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
              {[{ val: "all", label: "All Status" }, { val: "rent", label: "For Rent" }, { val: "sale", label: "For Sale" }].map(({ val, label }) => (
                <button
                  key={val}
                  onClick={() => { setFilter(val); setCurrentPage(1); }}
                  style={{
                    padding: "8px 22px", borderRadius: 100,
                    border: "1.5px solid",
                    borderColor: filter === val ? "#fff" : "rgba(255,255,255,0.45)",
                    background: filter === val ? "#fff" : "transparent",
                    color: filter === val ? "#0b1a2e" : "#fff",
                    fontSize: 13, fontWeight: 600, cursor: "pointer",
                    transition: "all 0.18s", fontFamily: "inherit",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* ── END HERO ─────────────────────────────────────────────────────────── */}

        <div style={{ padding: "32px 36px 60px" }}>

          {/* Results count */}
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20, fontWeight: 500 }}>
            Showing <strong style={{ color: "#0b1a2e" }}>{filtered.length}</strong> {filtered.length === 1 ? "property" : "properties"}
          </p>

          {/* Grid */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{
                width: 40, height: 40, border: "3px solid #e5e7eb",
                borderTopColor: "#1a56db", borderRadius: "50%",
                animation: "spin 0.8s linear infinite", margin: "0 auto 12px",
              }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <p style={{ fontSize: 14, color: "#6b7280" }}>Loading properties…</p>
            </div>
          ) : paginated.length > 0 ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 24, marginBottom: 36,
            }}>
              {paginated.map(p => <PropertyCard key={p._id} property={p} />)}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🏠</div>
              <p style={{ fontSize: 16, fontWeight: 600, color: "#374151" }}>No properties found</p>
              <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>Try adjusting your search or filter.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "9px 16px", borderRadius: 10,
                  border: "1.5px solid #e5e7eb", background: "#fff",
                  fontSize: 13, fontWeight: 600,
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  opacity: currentPage === 1 ? 0.4 : 1, color: "#374151",
                  fontFamily: "inherit",
                }}
              >
                <ChevronLeft size={15} /> Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  style={{
                    width: 38, height: 38, borderRadius: 10,
                    border: "1.5px solid",
                    borderColor: currentPage === i + 1 ? "#1a56db" : "#e5e7eb",
                    background: currentPage === i + 1 ? "#1a56db" : "#fff",
                    color: currentPage === i + 1 ? "#fff" : "#374151",
                    fontSize: 13, fontWeight: 700, cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "9px 16px", borderRadius: 10,
                  border: "1.5px solid #e5e7eb", background: "#fff",
                  fontSize: 13, fontWeight: 600,
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                  opacity: currentPage === totalPages ? 0.4 : 1, color: "#374151",
                  fontFamily: "inherit",
                }}
              >
                Next <ChevronRight size={15} />
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}