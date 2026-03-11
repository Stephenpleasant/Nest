import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, CheckCircle, XCircle, Menu } from "lucide-react";
import Sidebar from "./Navbar";

const BLUE  = "#1a56db";
const NAVY  = "#0b1a2e";
const WHITE = "#ffffff";
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function formatDateLabel(dateStr) {
  if (!dateStr) return "";
  const [y,m,d] = dateStr.split("-").map(Number);
  return `${MONTHS[m-1]} ${d}, ${y}`;
}

const formatPrice = (price) => "₦" + new Intl.NumberFormat("en-NG").format(price);

const STATUS_STYLES = {
  "Pending Confirmation": { bg:"#fefce8",color:"#854d0e",border:"#fde68a" },
  "Confirmed":            { bg:"#f0fdf4",color:"#166534",border:"#bbf7d0" },
  "Cancelled":            { bg:"#fef2f2",color:"#991b1b",border:"#fecaca" },
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("nestfind_bookings")||"[]");
    setBookings(stored);
  }, []);

  const cancelBooking = (id) => {
    const updated = bookings.map(b => b.id===id ? { ...b,status:"Cancelled" } : b);
    setBookings(updated);
    localStorage.setItem("nestfind_bookings", JSON.stringify(updated));
  };

  const confirmInspection = (id) => {
    const updated = bookings.map(b => b.id===id ? { ...b,status:"Confirmed" } : b);
    setBookings(updated);
    localStorage.setItem("nestfind_bookings", JSON.stringify(updated));
  };

  return (
    <>
      <style>{`
        html,body,#root { margin:0;padding:0;width:100%;min-height:100vh;background:linear-gradient(145deg,#eef2fb 0%,#f3f6fd 40%,#edf9f0 100%); }
        *,*::before,*::after { box-sizing:border-box; }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .booking-card { transition:transform .2s ease,box-shadow .2s ease!important;animation:fadeInUp .35s ease both; }
        .booking-card:hover { transform:translateY(-3px)!important;box-shadow:0 14px 40px rgba(26,86,219,.13)!important; }
        .stat-card { transition:transform .2s ease,box-shadow .2s ease; }
        .stat-card:hover { transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,0,0,.1)!important; }
        .action-btn { transition:all .15s ease; }
        .action-btn:hover { filter:brightness(.94);transform:scale(1.04); }

        .nestfind-sidebar { transform:translateX(-100%); }
        .nestfind-sidebar.open { transform:translateX(0); }
        @media (min-width:768px) { .nestfind-sidebar { transform:translateX(0)!important; } }

        .booking-main { margin-left:0!important; }
        @media (min-width:768px) { .booking-main { margin-left:256px!important; } }

        .booking-padding { padding:24px 16px 80px!important; }
        @media (min-width:640px) { .booking-padding { padding:32px 28px 80px!important; } }
        @media (min-width:1024px) { .booking-padding { padding:44px 52px 80px!important; } }

        .stats-grid { grid-template-columns:1fr!important; }
        @media (min-width:480px) { .stats-grid { grid-template-columns:repeat(3,1fr)!important; } }

        .booking-card-inner { flex-direction:column!important; }
        @media (min-width:600px) { .booking-card-inner { flex-direction:row!important; } }

        .booking-img { width:100%!important;height:180px!important; }
        @media (min-width:600px) { .booking-img { width:150px!important;height:auto!important; } }

        .booking-footer { flex-direction:column!important;align-items:flex-start!important;gap:12px!important; }
        @media (min-width:480px) { .booking-footer { flex-direction:row!important;align-items:center!important; } }

        .mobile-topbar { display:flex; }
        @media (min-width:768px) { .mobile-topbar { display:none!important; } }

        .page-header { flex-direction:column!important;align-items:flex-start!important; }
        @media (min-width:640px) { .page-header { flex-direction:row!important;align-items:flex-end!important; } }
      `}</style>

      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet"/>

      <div style={{ display:"flex",minHeight:"100vh",width:"100%",fontFamily:"Inter,sans-serif",background:"linear-gradient(145deg,#eef2fb 0%,#f3f6fd 40%,#edf9f0 100%)" }}>
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/>

        <main className="booking-main" style={{ flex:1,minHeight:"100vh",width:"100%",boxSizing:"border-box" }}>

          {/* Mobile top bar */}
          <div className="mobile-topbar" style={{ alignItems:"center",justifyContent:"space-between",padding:"14px 16px",background:WHITE,boxShadow:"0 1px 8px rgba(0,0,0,0.08)",position:"sticky",top:0,zIndex:30 }}>
            <span style={{ fontFamily:"Poppins,sans-serif",fontWeight:700,fontSize:17,color:NAVY }}>
              Nest<span style={{ color:BLUE }}>find</span>
            </span>
            <button onClick={()=>setMobileOpen(true)} style={{ background:"none",border:"none",cursor:"pointer",padding:4,display:"flex",alignItems:"center" }}>
              <Menu size={24} color={NAVY}/>
            </button>
          </div>

          <div className="booking-padding">
            {/* Page Header */}
            <div className="page-header" style={{ marginBottom:28,display:"flex",justifyContent:"space-between",gap:14 }}>
              <div>
                <p style={{ fontSize:11,fontWeight:700,color:BLUE,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6 }}>Dashboard › My Bookings</p>
                <h1 style={{ fontFamily:"Poppins,sans-serif",fontWeight:800,fontSize:"1.7rem",color:NAVY,lineHeight:1.2,margin:"0 0 6px" }}>My Bookings</h1>
                <p style={{ color:"#6b7280",fontSize:13.5,margin:0 }}>Track and manage all your property inspection appointments.</p>
              </div>
              <button onClick={()=>window.location.href="/dashboard"} style={{ padding:"10px 20px",background:`linear-gradient(135deg,${BLUE},#1444b8)`,color:WHITE,border:"none",borderRadius:11,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"Poppins,sans-serif",boxShadow:"0 6px 20px rgba(26,86,219,0.32)",whiteSpace:"nowrap",alignSelf:"flex-start" }}>
                + Book Inspection
              </button>
            </div>

            {/* Stats */}
            <div className="stats-grid" style={{ display:"grid",gap:16,marginBottom:30 }}>
              {[
                { label:"Total Bookings",value:bookings.length,                                                     icon:"📋",color:BLUE,     bg:"linear-gradient(135deg,#eff6ff,#dbeafe)" },
                { label:"Pending",       value:bookings.filter(b=>b.status==="Pending Confirmation").length,        icon:"⏳",color:"#d97706",bg:"linear-gradient(135deg,#fffbeb,#fef3c7)" },
                { label:"Confirmed",     value:bookings.filter(b=>b.status==="Confirmed").length,                   icon:"✅",color:"#16a34a",bg:"linear-gradient(135deg,#f0fdf4,#dcfce7)" },
              ].map(({ label,value,icon,color,bg }) => (
                <div key={label} className="stat-card" style={{ background:WHITE,borderRadius:18,padding:"20px 24px",boxShadow:"0 4px 18px rgba(0,0,0,0.07)",border:"1px solid rgba(255,255,255,0.85)",display:"flex",alignItems:"center",gap:16,position:"relative",overflow:"hidden" }}>
                  <div style={{ position:"absolute",right:-20,top:-20,width:90,height:90,borderRadius:"50%",background:bg,opacity:0.65 }}/>
                  <div style={{ width:50,height:50,borderRadius:14,background:bg,display:"grid",placeItems:"center",fontSize:24,flexShrink:0,zIndex:1,boxShadow:"0 3px 10px rgba(0,0,0,0.09)" }}>{icon}</div>
                  <div style={{ zIndex:1 }}>
                    <p style={{ fontSize:30,fontWeight:800,color,margin:0,fontFamily:"Poppins,sans-serif",lineHeight:1 }}>{value}</p>
                    <p style={{ fontSize:12.5,color:"#6b7280",margin:"4px 0 0",fontWeight:600 }}>{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bookings list */}
            {bookings.length === 0 ? (
              <div style={{ background:WHITE,borderRadius:22,padding:"60px 24px",textAlign:"center",boxShadow:"0 4px 20px rgba(0,0,0,0.07)",border:"1px solid rgba(255,255,255,0.9)" }}>
                <div style={{ fontSize:56,marginBottom:14 }}>📭</div>
                <h3 style={{ fontFamily:"Poppins,sans-serif",color:NAVY,fontSize:"1.15rem",marginBottom:8 }}>No Bookings Yet</h3>
                <p style={{ color:"#6b7280",fontSize:13.5,maxWidth:360,margin:"0 auto 24px" }}>You haven't booked any property inspections yet. Start exploring listings and book your first inspection!</p>
                <button onClick={()=>window.location.href="/dashboard"} style={{ padding:"12px 28px",background:`linear-gradient(135deg,${BLUE},#1444b8)`,color:WHITE,border:"none",borderRadius:12,fontWeight:700,fontSize:13.5,cursor:"pointer",fontFamily:"Poppins,sans-serif",boxShadow:"0 6px 20px rgba(26,86,219,0.32)" }}>
                  Browse Properties
                </button>
              </div>
            ) : (
              <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
                <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                  <span style={{ fontSize:13,fontWeight:700,color:NAVY,whiteSpace:"nowrap" }}>All Appointments</span>
                  <div style={{ flex:1,height:1,background:"#e5e7eb" }}/>
                  <span style={{ fontSize:12,color:"#9ca3af",whiteSpace:"nowrap" }}>{bookings.length} booking{bookings.length!==1?"s":""}</span>
                </div>

                {bookings.map((booking, idx) => {
                  const statusStyle = STATUS_STYLES[booking.status]||STATUS_STYLES["Pending Confirmation"];
                  return (
                    <div key={booking.id} className="booking-card" style={{ background:WHITE,borderRadius:18,overflow:"hidden",boxShadow:"0 4px 18px rgba(0,0,0,0.08)",border:"1px solid rgba(255,255,255,0.85)",animationDelay:`${idx*0.07}s` }}>
                      <div className="booking-card-inner" style={{ display:"flex" }}>
                        {/* Image */}
                        <div className="booking-img" style={{ flexShrink:0,position:"relative",overflow:"hidden" }}>
                          <img src={booking.propertyImage} alt={booking.propertyTitle} style={{ width:"100%",height:"100%",objectFit:"cover",display:"block" }}/>
                          <div style={{ position:"absolute",bottom:10,left:10,background:booking.priceType==="rent"?BLUE:NAVY,color:WHITE,fontSize:10,fontWeight:700,padding:"3px 11px",borderRadius:100,letterSpacing:"0.5px",textTransform:"uppercase" }}>
                            {booking.priceType==="rent"?"For Rent":"For Sale"}
                          </div>
                        </div>

                        {/* Content */}
                        <div style={{ flex:1,padding:"18px 20px",display:"flex",flexDirection:"column",justifyContent:"space-between",minWidth:0 }}>
                          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,marginBottom:12,flexWrap:"wrap" }}>
                            <div style={{ minWidth:0 }}>
                              <h3 style={{ fontFamily:"Poppins,sans-serif",fontWeight:700,fontSize:"1rem",color:NAVY,margin:"0 0 5px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{booking.propertyTitle}</h3>
                              <div style={{ display:"flex",alignItems:"center",gap:5 }}>
                                <MapPin size={12} color="#9ca3af"/>
                                <span style={{ fontSize:12,color:"#6b7280",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{booking.propertyAddress}</span>
                              </div>
                            </div>
                            <span style={{ fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:100,background:statusStyle.bg,color:statusStyle.color,border:`1px solid ${statusStyle.border}`,whiteSpace:"nowrap",flexShrink:0 }}>
                              {booking.status}
                            </span>
                          </div>

                          <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:14 }}>
                            {[
                              { icon:<Calendar size={13} color={BLUE}/>,text:formatDateLabel(booking.date) },
                              { icon:<Clock size={13} color={BLUE}/>,   text:booking.time },
                              { icon:<span style={{ fontSize:13 }}>👤</span>,text:`Agent: ${booking.agentName}` },
                            ].map(({ icon, text }) => (
                              <div key={text} style={{ display:"flex",alignItems:"center",gap:6,background:"#f8fafc",border:"1px solid #f3f4f6",padding:"5px 11px",borderRadius:9,fontSize:12,fontWeight:600,color:NAVY }}>
                                {icon} {text}
                              </div>
                            ))}
                            <div style={{ display:"flex",alignItems:"center",gap:5,background:"#eff6ff",border:"1px solid #bfdbfe",padding:"5px 11px",borderRadius:9 }}>
                              <span style={{ fontSize:13,fontWeight:800,color:BLUE,fontFamily:"Poppins,sans-serif" }}>{formatPrice(booking.price)}</span>
                              <span style={{ fontSize:10.5,color:"#60a5fa" }}>{booking.priceType==="rent"?"/ yr":" asking"}</span>
                            </div>
                          </div>

                          <div className="booking-footer" style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                            <span style={{ fontSize:11.5,color:"#9ca3af" }}>
                              Booked on {new Date(booking.bookedAt).toLocaleDateString("en-GB",{ day:"numeric",month:"short",year:"numeric" })}
                            </span>
                            <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                              {booking.status==="Pending Confirmation" && (
                                <button className="action-btn" onClick={()=>cancelBooking(booking.id)} style={{ display:"flex",alignItems:"center",gap:5,padding:"7px 14px",background:"#fef2f2",color:"#ef4444",border:"1px solid #fecaca",borderRadius:9,fontSize:12,fontWeight:700,cursor:"pointer" }}>
                                  <XCircle size={13}/> Cancel
                                </button>
                              )}
                              {booking.status!=="Confirmed" && (
                                <button className="action-btn" onClick={()=>confirmInspection(booking.id)} style={{ display:"flex",alignItems:"center",gap:5,padding:"7px 14px",background:"#f0fdf4",color:"#16a34a",border:"1px solid #bbf7d0",borderRadius:9,fontSize:12,fontWeight:700,cursor:"pointer" }}>
                                  <CheckCircle size={13}/> Confirm
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default MyBookings;