import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, User, Settings, HelpCircle, LogOut } from "lucide-react";

const NAV_ITEMS = [
  { to: "/dashboard",  icon: Home,       label: "Dashboard" },
  { to: "/bookings",   icon: BookOpen,   label: "My Bookings" },
  { to: "/profile",    icon: User,       label: "Profile" },
  { to: "/settings",   icon: Settings,   label: "Settings" },
  { to: "/support",    icon: HelpCircle, label: "Support" },
];

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:40 }} />
      )}

      <nav style={{
        position:"fixed",left:0,top:0,height:"100vh",width:256,
        background:"#fff",boxShadow:"4px 0 20px rgba(0,0,0,0.06)",
        display:"flex",flexDirection:"column",zIndex:50,
        transition:"transform 0.3s ease-in-out",
      }} className={`nestfind-sidebar${mobileOpen ? " open" : ""}`}>

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
              <Link key={to} to={to} onClick={() => setMobileOpen(false)} style={{
                display:"flex",alignItems:"center",gap:12,padding:"11px 14px",borderRadius:12,
                textDecoration:"none",background:active?"#eff6ff":"transparent",
                border:active?"1px solid #bfdbfe":"1px solid transparent",transition:"all 0.18s",position:"relative",
              }}
                onMouseEnter={e=>{ if(!active) e.currentTarget.style.background="#eff6ff"; }}
                onMouseLeave={e=>{ if(!active) e.currentTarget.style.background="transparent"; }}
              >
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
            onMouseLeave={e=>{ e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor="transparent"; }}
          >
            <LogOut size={19} color="#ef4444" strokeWidth={1.8}/>
            <span style={{ fontSize:13.5,fontWeight:500,color:"#ef4444" }}>Log out</span>
          </button>
        </div>
      </nav>

      <style>{`
        .nestfind-sidebar { transform: translateX(-100%); }
        .nestfind-sidebar.open { transform: translateX(0); }
        @media (min-width: 768px) { .nestfind-sidebar { transform: translateX(0) !important; } }
      `}</style>
    </>
  );
};

export default Sidebar;