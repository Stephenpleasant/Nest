import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home, BookOpen, User, Settings, HelpCircle,
  LogOut, Menu, MapPin, ChevronLeft, ChevronRight,
  BedDouble, Bath, Maximize2, ChevronDown, X,
} from "lucide-react";

const formatPrice = (price) => "₦" + new Intl.NumberFormat("en-NG").format(price);

const CITIES = ["All Cities","Victoria Island","Lekki","Ikoyi","Yaba","Ajah","Surulere","Magodo","Eko Atlantic"];
const PROP_TYPES = ["All Types","house","apartment","condo","townhouse"];

/* ─── SIDEBAR ─────────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { to: "/dashboard", icon: Home,       label: "Dashboard" },
  { to: "/bookings",  icon: BookOpen,   label: "My Bookings" },
  { to: "/profile",   icon: User,       label: "Profile" },
  { to: "/settings",  icon: Settings,   label: "Settings" },
  { to: "/support",   icon: HelpCircle, label: "Support" },
];

function Sidebar({ mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  return (
    <>
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:40 }}/>
      )}
      <nav style={{ position:"fixed",left:0,top:0,height:"100vh",width:256,background:"#fff",boxShadow:"4px 0 20px rgba(0,0,0,0.06)",display:"flex",flexDirection:"column",zIndex:50,transition:"transform 0.3s ease-in-out" }}
        className={`nestfind-sidebar${mobileOpen?" open":""}`}>
        <div style={{ padding:"28px 24px 24px",display:"flex",alignItems:"center",gap:10 }}>
          <div style={{ width:40,height:40,background:"#0b1a2e",borderRadius:10,display:"grid",placeItems:"center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22" stroke="white" strokeWidth="2" fill="none"/>
            </svg>
          </div>
          <span style={{ fontFamily:"Poppins,sans-serif",fontWeight:700,fontSize:18,color:"#0b1a2e" }}>
            Nest<span style={{ color:"#1a56db" }}>find</span>
          </span>
        </div>
        <div style={{ flex:1,padding:"0 12px",display:"flex",flexDirection:"column",gap:4 }}>
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
            const active = isActive(to);
            return (
              <Link key={to} to={to} onClick={() => setMobileOpen(false)} style={{ display:"flex",alignItems:"center",gap:12,padding:"11px 14px",borderRadius:12,textDecoration:"none",background:active?"#eff6ff":"transparent",border:active?"1px solid #bfdbfe":"1px solid transparent",transition:"all 0.18s",position:"relative" }}
                onMouseEnter={e=>{ if(!active) e.currentTarget.style.background="#eff6ff"; }}
                onMouseLeave={e=>{ if(!active) e.currentTarget.style.background="transparent"; }}>
                {active && <span style={{ position:"absolute",left:0,top:"50%",transform:"translateY(-50%)",width:3,height:28,borderRadius:"0 3px 3px 0",background:"#1a56db" }}/>}
                <Icon size={20} color={active?"#1a56db":"#6b7280"} strokeWidth={active?2.2:1.8}/>
                <span style={{ fontSize:13.5,fontWeight:active?700:500,color:active?"#1a56db":"#374151" }}>{label}</span>
              </Link>
            );
          })}
        </div>
        <div style={{ padding:"12px 12px 28px" }}>
          <div style={{ height:1,background:"#f3f4f6",margin:"0 8px 12px" }}/>
          <button onClick={()=>{ localStorage.removeItem("token");localStorage.removeItem("user");localStorage.removeItem("nestfind_user");window.location.href="/"; }}
            style={{ display:"flex",alignItems:"center",gap:12,padding:"11px 14px",borderRadius:12,border:"1px solid transparent",background:"transparent",cursor:"pointer",width:"100%",transition:"all 0.18s" }}
            onMouseEnter={e=>{ e.currentTarget.style.background="#fef2f2";e.currentTarget.style.borderColor="#fecaca"; }}
            onMouseLeave={e=>{ e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor="transparent"; }}>
            <LogOut size={19} color="#ef4444" strokeWidth={1.8}/>
            <span style={{ fontSize:13.5,fontWeight:500,color:"#ef4444" }}>Log out</span>
          </button>
        </div>
      </nav>
    </>
  );
}

/* ─── PROPERTY CARD ───────────────────────────────────────────────────────── */
function PropertyCard({ property }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link to={`/properties/${property._id}`} style={{ textDecoration:"none" }}>
      <div onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)} style={{
        background:"#fff",borderRadius:18,overflow:"hidden",
        boxShadow:hovered?"0 16px 48px rgba(0,0,0,0.13)":"0 2px 14px rgba(0,0,0,0.07)",
        transform:hovered?"translateY(-4px)":"translateY(0)",transition:"all 0.25s ease",
        display:"flex",flexDirection:"column",cursor:"pointer",height:"100%",
      }}>
        <div style={{ position:"relative",height:190,overflow:"hidden",background:"#e5e7eb",flexShrink:0 }}>
          <img src={property.image} alt={property.title} style={{ width:"100%",height:"100%",objectFit:"cover",transform:hovered?"scale(1.06)":"scale(1)",transition:"transform 0.45s ease" }}
            onError={e=>{ e.target.src="https://placehold.co/600x400/e5e7eb/6b7280?text=Property"; }}/>
          <div style={{ position:"absolute",top:14,left:14 }}>
            <span style={{ background:"#1a56db",color:"#fff",fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:100,textTransform:"uppercase",letterSpacing:"0.5px" }}>
              {property.propertyType}
            </span>
          </div>
        </div>
        <div style={{ padding:"16px 18px 18px",flex:1,display:"flex",flexDirection:"column",gap:10 }}>
          <h3 style={{ fontSize:15,fontWeight:700,color:"#0b1a2e",margin:0,fontFamily:"Poppins,sans-serif",lineHeight:1.3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>
            {property.title}
          </h3>
          <div style={{ display:"flex",alignItems:"center",gap:5 }}>
            <MapPin size={13} color="#9ca3af"/>
            <span style={{ fontSize:12,color:"#6b7280",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{property.location}</span>
          </div>
          <div style={{ display:"flex",gap:12,flexWrap:"wrap" }}>
            {[{ icon:BedDouble,value:`${property.bedrooms} Bed` },{ icon:Bath,value:`${property.bathrooms} Bath` },{ icon:Maximize2,value:`${property.sqft} sqft` }].map(({ icon: Icon, value }) => (
              <div key={value} style={{ display:"flex",alignItems:"center",gap:4 }}>
                <Icon size={13} color="#9ca3af"/>
                <span style={{ fontSize:11.5,color:"#6b7280" }}>{value}</span>
              </div>
            ))}
          </div>
          <div style={{ height:1,background:"#f3f4f6" }}/>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",gap:8 }}>
            <div style={{ display:"flex",alignItems:"center",gap:7,minWidth:0 }}>
              <img src={property.agent.avatar||`https://ui-avatars.com/api/?name=${encodeURIComponent(property.agent.name)}&size=30&background=1a56db&color=fff`} alt={property.agent.name}
                style={{ width:28,height:28,borderRadius:"50%",objectFit:"cover",border:"2px solid #e5e7eb",flexShrink:0 }}
                onError={e=>{ e.target.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(property.agent.name)}&size=30&background=1a56db&color=fff`; }}/>
              <span style={{ fontSize:11.5,fontWeight:600,color:"#374151",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{property.agent.name}</span>
            </div>
            <div style={{ textAlign:"right",flexShrink:0 }}>
              <div style={{ fontSize:14,fontWeight:800,color:"#1a56db",fontFamily:"Poppins,sans-serif" }}>{formatPrice(property.price)}</div>
              <div style={{ fontSize:10,color:"#9ca3af" }}>listing price</div>
            </div>
          </div>
          <button style={{ width:"100%",padding:"10px",border:"none",borderRadius:10,background:"#0b1a2e",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",transition:"background 0.2s",fontFamily:"Poppins,sans-serif" }}
            onMouseEnter={e=>{ e.currentTarget.style.background="#1a56db"; }}
            onMouseLeave={e=>{ e.currentTarget.style.background="#0b1a2e"; }}>
            View Property
          </button>
        </div>
      </div>
    </Link>
  );
}

/* ─── MAIN DASHBOARD ──────────────────────────────────────────────────────── */
export default function UserDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("All Cities");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 8;

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true); setFetchError("");
      try {
        const base = import.meta.env.VITE_API_BASE_URL || "https://gtimeconnect.onrender.com";
        const res = await fetch(`${base}/api/v1/properties/all`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
        const data = await res.json();
        const inner = data.data ?? data;
        const list = Array.isArray(inner) ? inner : (inner.properties || inner.data || []);
        if (!Array.isArray(list)) throw new Error("Unexpected API response shape");
        const mapped = list.map(p => ({
          _id: p._id||p.id, title: p.title,
          location: [p.street,p.city,p.state].filter(Boolean).join(", "),
          city: p.city, state: p.state, propertyType: p.propertyType,
          price: p.price, inspectionFee: p.inspectionFee,
          bedrooms: p.bedrooms??0, bathrooms: p.bathrooms??0, sqft: p.squareFeet??0,
          image: p.images?.[0]?.url||"https://placehold.co/600x400/e5e7eb/6b7280?text=Property",
          agent: { name: p.agent?.fullName||p.agent?.name||"Agent", avatar: p.agent?.avatar||null },
        }));
        setProperties(mapped);
      } catch (err) {
        console.error(err);
        setFetchError("Could not load properties. Please try again later.");
      } finally { setLoading(false); }
    };
    fetchProperties();
  }, []);

  const filtered = properties.filter(p => {
    const matchCity  = cityFilter==="All Cities"||p.city===cityFilter||p.state===cityFilter;
    const matchPType = typeFilter==="All Types"||p.propertyType===typeFilter.toLowerCase();
    const matchStatus= filter==="all"||(filter==="rent"?p.type==="rent":p.type==="sale");
    const matchSearch= p.title.toLowerCase().includes(search.toLowerCase())||p.location.toLowerCase().includes(search.toLowerCase())||p.agent.name.toLowerCase().includes(search.toLowerCase());
    return matchCity && matchPType && matchStatus && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((currentPage-1)*PER_PAGE, currentPage*PER_PAGE);

  return (
    <div style={{ minHeight:"100vh",background:"#f8fafc",fontFamily:"Inter,sans-serif",display:"flex" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet"/>

      <style>{`
        .nestfind-sidebar { transform: translateX(-100%); }
        .nestfind-sidebar.open { transform: translateX(0); }
        @media (min-width: 768px) { .nestfind-sidebar { transform: translateX(0) !important; } }

        .dash-main { margin-left: 0 !important; }
        @media (min-width: 768px) { .dash-main { margin-left: 256px !important; } }

        .hero-section { height: 320px; }
        @media (min-width: 768px) { .hero-section { height: 360px; } }

        .hero-title { font-size: 1.6rem !important; }
        @media (min-width: 480px) { .hero-title { font-size: 2rem !important; } }
        @media (min-width: 768px) { .hero-title { font-size: 2.2rem !important; } }

        .search-bar { flex-direction: column !important; border-radius: 14px !important; }
        @media (min-width: 560px) { .search-bar { flex-direction: row !important; } }

        .search-bar .search-divider { border-right: none !important; border-bottom: 1px solid #e5e7eb; }
        @media (min-width: 560px) { .search-bar .search-divider { border-bottom: none !important; border-right: 1px solid #e5e7eb; } }

        .prop-grid { grid-template-columns: 1fr !important; }
        @media (min-width: 480px) { .prop-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (min-width: 900px) { .prop-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (min-width: 1200px) { .prop-grid { grid-template-columns: repeat(4, 1fr) !important; } }

        .dash-padding { padding: 20px 16px 60px !important; }
        @media (min-width: 640px) { .dash-padding { padding: 28px 28px 60px !important; } }
        @media (min-width: 1024px) { .dash-padding { padding: 32px 36px 60px !important; } }

        .mobile-topbar { display: flex; }
        @media (min-width: 768px) { .mobile-topbar { display: none !important; } }

        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/>

      <main className="dash-main" style={{ flex:1,minHeight:"100vh",minWidth:0,boxSizing:"border-box" }}>

        {/* Mobile top bar */}
        <div className="mobile-topbar" style={{ alignItems:"center",justifyContent:"space-between",padding:"14px 16px",background:"#fff",boxShadow:"0 1px 8px rgba(0,0,0,0.08)",position:"sticky",top:0,zIndex:30 }}>
          <span style={{ fontFamily:"Poppins,sans-serif",fontWeight:700,fontSize:17,color:"#0b1a2e" }}>
            Nest<span style={{ color:"#1a56db" }}>find</span>
          </span>
          <button onClick={()=>setMobileOpen(true)} style={{ background:"none",border:"none",cursor:"pointer",padding:4,display:"flex",alignItems:"center" }}>
            <Menu size={24} color="#0b1a2e"/>
          </button>
        </div>

        {/* HERO */}
        <div className="hero-section" style={{ position:"relative",backgroundImage:"url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80)",backgroundSize:"cover",backgroundPosition:"center",display:"flex",alignItems:"center",justifyContent:"center" }}>
          <div style={{ position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(7,20,40,0.55),rgba(7,20,40,0.65))" }}/>
          <div style={{ position:"relative",zIndex:1,textAlign:"center",padding:"0 16px",width:"100%",maxWidth:700 }}>
            <p style={{ fontSize:11,fontWeight:700,color:"#93c5fd",letterSpacing:"2px",textTransform:"uppercase",marginBottom:8 }}>WELCOME TO NESTFIND</p>
            <h1 className="hero-title" style={{ fontFamily:"Poppins,sans-serif",fontWeight:800,color:"#fff",margin:"0 0 8px",lineHeight:1.2 }}>Find Your Next Home</h1>
            <p style={{ color:"rgba(255,255,255,0.8)",fontSize:13,marginBottom:22 }}>Browse available properties across Lagos and book an inspection in minutes.</p>

            {/* Search bar */}
            <div className="search-bar" style={{ display:"flex",alignItems:"stretch",background:"#fff",borderRadius:14,overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,0.25)",maxWidth:580,margin:"0 auto 16px" }}>
              <div className="search-divider" style={{ position:"relative",flex:1 }}>
                <MapPin size={14} color="#9ca3af" style={{ position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",pointerEvents:"none" }}/>
                <select value={cityFilter} onChange={e=>{ setCityFilter(e.target.value);setCurrentPage(1); }} style={{ width:"100%",padding:"13px 28px 13px 34px",border:"none",outline:"none",background:"transparent",fontSize:13,color:"#374151",fontFamily:"inherit",appearance:"none",cursor:"pointer" }}>
                  {CITIES.map(c=><option key={c}>{c}</option>)}
                </select>
                <ChevronDown size={13} color="#9ca3af" style={{ position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none" }}/>
              </div>
              <div className="search-divider" style={{ position:"relative",flex:1 }}>
                <span style={{ position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",fontSize:14,pointerEvents:"none" }}>🏠</span>
                <select value={typeFilter} onChange={e=>{ setTypeFilter(e.target.value);setCurrentPage(1); }} style={{ width:"100%",padding:"13px 28px 13px 34px",border:"none",outline:"none",background:"transparent",fontSize:13,color:"#374151",fontFamily:"inherit",appearance:"none",cursor:"pointer" }}>
                  {PROP_TYPES.map(t=><option key={t}>{t}</option>)}
                </select>
                <ChevronDown size={13} color="#9ca3af" style={{ position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none" }}/>
              </div>
              <button style={{ padding:"13px 22px",background:"#1a56db",color:"#fff",border:"none",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"Poppins,sans-serif",whiteSpace:"nowrap",transition:"background 0.18s" }}
                onMouseEnter={e=>{ e.currentTarget.style.background="#1444b8"; }}
                onMouseLeave={e=>{ e.currentTarget.style.background="#1a56db"; }}>
                Search
              </button>
            </div>

            {/* Status pills */}
            <div style={{ display:"flex",justifyContent:"center",gap:8,flexWrap:"wrap" }}>
              {[{ val:"all",label:"All Status" },{ val:"rent",label:"For Rent" },{ val:"sale",label:"For Sale" }].map(({ val, label }) => (
                <button key={val} onClick={()=>{ setFilter(val);setCurrentPage(1); }} style={{ padding:"7px 18px",borderRadius:100,border:"1.5px solid",borderColor:filter===val?"#fff":"rgba(255,255,255,0.45)",background:filter===val?"#fff":"transparent",color:filter===val?"#0b1a2e":"#fff",fontSize:12.5,fontWeight:600,cursor:"pointer",transition:"all 0.18s",fontFamily:"inherit" }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="dash-padding">
          <p style={{ fontSize:13,color:"#6b7280",marginBottom:20,fontWeight:500 }}>
            Showing <strong style={{ color:"#0b1a2e" }}>{filtered.length}</strong> {filtered.length===1?"property":"properties"}
          </p>

          {loading ? (
            <div style={{ textAlign:"center",padding:"60px 0" }}>
              <div style={{ width:40,height:40,border:"3px solid #e5e7eb",borderTopColor:"#1a56db",borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto 12px" }}/>
              <p style={{ fontSize:14,color:"#6b7280" }}>Loading properties…</p>
            </div>
          ) : fetchError ? (
            <div style={{ textAlign:"center",padding:"60px 20px" }}>
              <div style={{ fontSize:48,marginBottom:12 }}>⚠️</div>
              <p style={{ fontSize:16,fontWeight:600,color:"#374151" }}>{fetchError}</p>
            </div>
          ) : paginated.length > 0 ? (
            <div className="prop-grid" style={{ display:"grid",gap:20,marginBottom:36 }}>
              {paginated.map(p => <PropertyCard key={p._id} property={p}/>)}
            </div>
          ) : (
            <div style={{ textAlign:"center",padding:"60px 20px" }}>
              <div style={{ fontSize:48,marginBottom:12 }}>🏠</div>
              <p style={{ fontSize:16,fontWeight:600,color:"#374151" }}>No properties found</p>
              <p style={{ fontSize:13,color:"#6b7280",marginTop:4 }}>Try adjusting your search or filter.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div style={{ display:"flex",justifyContent:"center",alignItems:"center",gap:8,flexWrap:"wrap" }}>
              <button onClick={()=>setCurrentPage(p=>Math.max(1,p-1))} disabled={currentPage===1} style={{ display:"flex",alignItems:"center",gap:6,padding:"9px 14px",borderRadius:10,border:"1.5px solid #e5e7eb",background:"#fff",fontSize:13,fontWeight:600,cursor:currentPage===1?"not-allowed":"pointer",opacity:currentPage===1?0.4:1,color:"#374151",fontFamily:"inherit" }}>
                <ChevronLeft size={15}/> Prev
              </button>
              {Array.from({ length: totalPages }, (_,i) => (
                <button key={i} onClick={()=>setCurrentPage(i+1)} style={{ width:38,height:38,borderRadius:10,border:"1.5px solid",borderColor:currentPage===i+1?"#1a56db":"#e5e7eb",background:currentPage===i+1?"#1a56db":"#fff",color:currentPage===i+1?"#fff":"#374151",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}>
                  {i+1}
                </button>
              ))}
              <button onClick={()=>setCurrentPage(p=>Math.min(totalPages,p+1))} disabled={currentPage===totalPages} style={{ display:"flex",alignItems:"center",gap:6,padding:"9px 14px",borderRadius:10,border:"1.5px solid #e5e7eb",background:"#fff",fontSize:13,fontWeight:600,cursor:currentPage===totalPages?"not-allowed":"pointer",opacity:currentPage===totalPages?0.4:1,color:"#374151",fontFamily:"inherit" }}>
                Next <ChevronRight size={15}/>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}