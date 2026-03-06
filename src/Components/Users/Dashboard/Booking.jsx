import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, CheckCircle, XCircle } from "lucide-react";
import Sidebar from "./Navbar";

const BLUE = "#1a56db";
const NAVY = "#0b1a2e";
const WHITE = "#ffffff";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function formatDateLabel(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

const formatPrice = (price) => "₦" + new Intl.NumberFormat("en-NG").format(price);

const STATUS_STYLES = {
  "Pending Confirmation": { bg: "#fefce8", color: "#854d0e", border: "#fde68a" },
  "Confirmed":            { bg: "#f0fdf4", color: "#166534", border: "#bbf7d0" },
  "Cancelled":            { bg: "#fef2f2", color: "#991b1b", border: "#fecaca" },
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("nestfind_bookings") || "[]");
    setBookings(stored);
  }, []);

  const cancelBooking = (id) => {
    const updated = bookings.map(b => b.id === id ? { ...b, status: "Cancelled" } : b);
    setBookings(updated);
    localStorage.setItem("nestfind_bookings", JSON.stringify(updated));
  };

  const confirmInspection = (id) => {
    const updated = bookings.map(b => b.id === id ? { ...b, status: "Confirmed" } : b);
    setBookings(updated);
    localStorage.setItem("nestfind_bookings", JSON.stringify(updated));
  };

  return (
    <>
      <style>{`
        html, body, #root {
          margin: 0; padding: 0;
          width: 100%; min-height: 100vh;
          background: linear-gradient(145deg, #eef2fb 0%, #f3f6fd 40%, #edf9f0 100%);
        }
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .booking-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease !important;
          animation: fadeInUp 0.35s ease both;
        }
        .booking-card:hover {
          transform: translateY(-3px) !important;
          box-shadow: 0 14px 40px rgba(26,86,219,0.13) !important;
        }
        .stat-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.1) !important; }
        .action-btn { transition: all 0.15s ease; }
        .action-btn:hover { filter: brightness(0.94); transform: scale(1.04); }
      `}</style>

      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet" />

      <div style={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        fontFamily: "Inter, sans-serif",
        background: "linear-gradient(145deg, #eef2fb 0%, #f3f6fd 40%, #edf9f0 100%)",
      }}>
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        <main style={{
          marginLeft: 256,
          flex: 1,
          minHeight: "100vh",
          width: "calc(100% - 256px)",
          padding: "44px 52px 80px",
        }}>

          {/* ── Page Header ── */}
          <div style={{ marginBottom: 34, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 14 }}>
            <div>
              <p style={{ fontSize: 11.5, fontWeight: 700, color: BLUE, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
                Dashboard › My Bookings
              </p>
              <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: "1.9rem", color: NAVY, lineHeight: 1.2, margin: 0 }}>
                My Bookings
              </h1>
              <p style={{ color: "#6b7280", fontSize: 14, marginTop: 7 }}>
                Track and manage all your property inspection appointments.
              </p>
            </div>
            <button
              onClick={() => window.location.href = "/dashboard"}
              style={{
                padding: "11px 24px",
                background: `linear-gradient(135deg, ${BLUE}, #1444b8)`,
                color: WHITE, border: "none", borderRadius: 11,
                fontWeight: 700, fontSize: 13.5, cursor: "pointer",
                fontFamily: "Poppins, sans-serif",
                boxShadow: "0 6px 20px rgba(26,86,219,0.32)",
              }}
            >+ Book Inspection</button>
          </div>

          {/* ── Stats Cards ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 36 }}>
            {[
              { label: "Total Bookings", value: bookings.length,                                                      icon: "📋", color: BLUE,      bg: "linear-gradient(135deg,#eff6ff,#dbeafe)" },
              { label: "Pending",        value: bookings.filter(b => b.status === "Pending Confirmation").length,     icon: "⏳", color: "#d97706", bg: "linear-gradient(135deg,#fffbeb,#fef3c7)" },
              { label: "Confirmed",      value: bookings.filter(b => b.status === "Confirmed").length,                icon: "✅", color: "#16a34a", bg: "linear-gradient(135deg,#f0fdf4,#dcfce7)" },
            ].map(({ label, value, icon, color, bg }) => (
              <div key={label} className="stat-card" style={{
                background: WHITE, borderRadius: 18, padding: "24px 28px",
                boxShadow: "0 4px 18px rgba(0,0,0,0.07)",
                border: "1px solid rgba(255,255,255,0.85)",
                display: "flex", alignItems: "center", gap: 18,
                position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", right: -20, top: -20,
                  width: 100, height: 100, borderRadius: "50%",
                  background: bg, opacity: 0.65,
                }} />
                <div style={{
                  width: 54, height: 54, borderRadius: 15, background: bg,
                  display: "grid", placeItems: "center", fontSize: 26,
                  flexShrink: 0, zIndex: 1,
                  boxShadow: "0 3px 10px rgba(0,0,0,0.09)",
                }}>{icon}</div>
                <div style={{ zIndex: 1 }}>
                  <p style={{ fontSize: 34, fontWeight: 800, color, margin: 0, fontFamily: "Poppins, sans-serif", lineHeight: 1 }}>{value}</p>
                  <p style={{ fontSize: 13, color: "#6b7280", margin: "5px 0 0", fontWeight: 600 }}>{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── List / Empty State ── */}
          {bookings.length === 0 ? (
            <div style={{
              background: WHITE, borderRadius: 22, padding: "80px 24px",
              textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
              border: "1px solid rgba(255,255,255,0.9)",
            }}>
              <div style={{ fontSize: 64, marginBottom: 18 }}>📭</div>
              <h3 style={{ fontFamily: "Poppins, sans-serif", color: NAVY, fontSize: "1.2rem", marginBottom: 10 }}>No Bookings Yet</h3>
              <p style={{ color: "#6b7280", fontSize: 14, maxWidth: 380, margin: "0 auto 28px" }}>
                You haven't booked any property inspections yet. Start exploring listings and book your first inspection!
              </p>
              <button onClick={() => window.location.href = "/dashboard"} style={{
                padding: "13px 32px",
                background: `linear-gradient(135deg, ${BLUE}, #1444b8)`,
                color: WHITE, border: "none", borderRadius: 12,
                fontWeight: 700, fontSize: 14, cursor: "pointer",
                fontFamily: "Poppins, sans-serif",
                boxShadow: "0 6px 20px rgba(26,86,219,0.32)",
              }}>Browse Properties</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Section divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: NAVY, whiteSpace: "nowrap" }}>All Appointments</span>
                <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
                <span style={{ fontSize: 12.5, color: "#9ca3af", whiteSpace: "nowrap" }}>
                  {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
                </span>
              </div>

              {bookings.map((booking, idx) => {
                const statusStyle = STATUS_STYLES[booking.status] || STATUS_STYLES["Pending Confirmation"];
                return (
                  <div
                    key={booking.id}
                    className="booking-card"
                    style={{
                      background: WHITE, borderRadius: 18, overflow: "hidden",
                      boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
                      border: "1px solid rgba(255,255,255,0.85)",
                      display: "flex",
                      animationDelay: `${idx * 0.07}s`,
                    }}
                  >
                    {/* Left: image */}
                    <div style={{ width: 170, flexShrink: 0, position: "relative", overflow: "hidden" }}>
                      <img
                        src={booking.propertyImage}
                        alt={booking.propertyTitle}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                      <div style={{
                        position: "absolute", bottom: 10, left: 10,
                        background: booking.priceType === "rent" ? BLUE : NAVY,
                        color: WHITE, fontSize: 10, fontWeight: 700,
                        padding: "3px 11px", borderRadius: 100,
                        letterSpacing: "0.5px", textTransform: "uppercase",
                      }}>
                        {booking.priceType === "rent" ? "For Rent" : "For Sale"}
                      </div>
                    </div>

                    {/* Right: content */}
                    <div style={{ flex: 1, padding: "22px 28px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      {/* Title + status */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
                        <div>
                          <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "1.05rem", color: NAVY, margin: "0 0 6px" }}>
                            {booking.propertyTitle}
                          </h3>
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <MapPin size={12} color="#9ca3af" />
                            <span style={{ fontSize: 12.5, color: "#6b7280" }}>{booking.propertyAddress}</span>
                          </div>
                        </div>
                        <span style={{
                          fontSize: 11.5, fontWeight: 700, padding: "5px 14px", borderRadius: 100,
                          background: statusStyle.bg, color: statusStyle.color,
                          border: `1px solid ${statusStyle.border}`,
                          whiteSpace: "nowrap", flexShrink: 0,
                        }}>
                          {booking.status}
                        </span>
                      </div>

                      {/* Info chips */}
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
                        {[
                          { icon: <Calendar size={13} color={BLUE} />, text: formatDateLabel(booking.date) },
                          { icon: <Clock size={13} color={BLUE} />,    text: booking.time },
                          { icon: <span style={{ fontSize: 13 }}>👤</span>, text: `Agent: ${booking.agentName}` },
                        ].map(({ icon, text }) => (
                          <div key={text} style={{
                            display: "flex", alignItems: "center", gap: 6,
                            background: "#f8fafc", border: "1px solid #f3f4f6",
                            padding: "6px 13px", borderRadius: 9,
                            fontSize: 12.5, fontWeight: 600, color: NAVY,
                          }}>
                            {icon} {text}
                          </div>
                        ))}
                        <div style={{
                          display: "flex", alignItems: "center", gap: 5,
                          background: "#eff6ff", border: "1px solid #bfdbfe",
                          padding: "6px 13px", borderRadius: 9,
                        }}>
                          <span style={{ fontSize: 13.5, fontWeight: 800, color: BLUE, fontFamily: "Poppins, sans-serif" }}>
                            {formatPrice(booking.price)}
                          </span>
                          <span style={{ fontSize: 11, color: "#60a5fa" }}>
                            {booking.priceType === "rent" ? "/ yr" : " asking"}
                          </span>
                        </div>
                      </div>

                      {/* Footer */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 12, color: "#9ca3af" }}>
                          Booked on {new Date(booking.bookedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        <div style={{ display: "flex", gap: 9 }}>
                          {booking.status === "Pending Confirmation" && (
                            <button className="action-btn"
                              onClick={() => cancelBooking(booking.id)}
                              style={{
                                display: "flex", alignItems: "center", gap: 5,
                                padding: "8px 16px",
                                background: "#fef2f2", color: "#ef4444",
                                border: "1px solid #fecaca",
                                borderRadius: 9, fontSize: 12.5, fontWeight: 700, cursor: "pointer",
                              }}
                            >
                              <XCircle size={13} /> Cancel
                            </button>
                          )}
                          {booking.status !== "Confirmed" && (
                          <button className="action-btn"
                            onClick={() => confirmInspection(booking.id)}
                            style={{
                              display: "flex", alignItems: "center", gap: 5,
                              padding: "8px 16px",
                              background: "#f0fdf4", color: "#16a34a",
                              border: "1px solid #bbf7d0",
                              borderRadius: 9, fontSize: 12.5, fontWeight: 700, cursor: "pointer",
                            }}
                          >
                            <CheckCircle size={13} /> Confirm Inspection
                          </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default MyBookings;