import { useState } from "react";
import {
  ChevronLeft, ChevronRight, Clock, Mail, CreditCard, CheckCircle, User,
} from "lucide-react";
import {
  BLUE, NAVY, WHITE,
  DAYS, MONTHS, TIME_SLOTS,
  getDaysInMonth, getFirstDayOfMonth, formatDateLabel, formatPrice,
} from "./Constant";

const InspectionModal = ({ property, onClose }) => {
  const today = new Date();
  const [step, setStep] = useState(1); // 1=calendar/time, 2=review & pay, 3=success
  const [calYear, setCalYear]   = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  // Pull user info from your auth context / localStorage — adjust as needed
  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem("nestfind_user") || "{}"); } catch { return {}; }
  })();
  const userEmail = currentUser.email || "";
  const userName  = currentUser.name  || currentUser.displayName || "";

  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;

  const daysInMonth   = getDaysInMonth(calYear, calMonth);
  const firstDayIndex = getFirstDayOfMonth(calYear, calMonth);

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  };

  const isPast = (d) => {
    const ds = `${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    return ds < todayStr;
  };

  const selectDay = (d) => {
    if (isPast(d)) return;
    const ds = `${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    setSelectedDate(ds);
    setSelectedTime(null);
  };

  const handleMakePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPaymentError("");

    try {
      /* ─────────────────────────────────────────────────────────────────────
       * BACKEND INTEGRATION — Replace this block with your real API call.
       *
       * The payload below is sent to your payment endpoint.
       * Your backend should:
       *   1. Create a booking record in your DB (status: "Pending Payment")
       *   2. Initiate a payment charge via Paystack / Flutterwave / etc.
       *   3. Return either:
       *      a) { paymentUrl } → redirect the user to the hosted payment page
       *      b) { reference }  → use an inline popup SDK (Paystack inline, etc.)
       *
       * On successful payment your webhook should update the booking to
       * "Pending Confirmation" and email the user at `userEmail`.
       * ───────────────────────────────────────────────────────────────────── */
      const payload = {
        propertyId:      property._id,
        propertyTitle:   property.title,
        propertyAddress: property.address,
        agentName:       property.agent.name,
        price:           property.price,
        priceType:       property.type,
        date:            selectedDate,
        time:            selectedTime,
        note,
        userEmail,
        userName,
      };

      const res = await fetch("/api/bookings/initiate-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Payment initiation failed. Please try again.");
      }

      const data = await res.json();

      // Option A — redirect to hosted payment page
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }

      // Option B — payment verified inline; save locally and proceed
      const booking = {
        id: Date.now(),
        propertyId:      property._id,
        propertyTitle:   property.title,
        propertyAddress: property.address,
        propertyImage:   property.image,
        agentName:       property.agent.name,
        price:           property.price,
        priceType:       property.type,
        date:            selectedDate,
        time:            selectedTime,
        note,
        userEmail,
        userName,
        bookedAt: new Date().toISOString(),
        status: "Pending Confirmation",
      };
      const existing = JSON.parse(localStorage.getItem("nestfind_bookings") || "[]");
      localStorage.setItem("nestfind_bookings", JSON.stringify([booking, ...existing]));

      setLoading(false);
      setStep(3);

    } catch (err) {
      setLoading(false);
      setPaymentError(err.message || "Something went wrong. Please try again.");
    }
  };

  const inp = {
    width: "100%", padding: "11px 14px", border: "1.5px solid #e5e7eb",
    borderRadius: 9, fontSize: 14, color: NAVY, outline: "none",
    fontFamily: "inherit", boxSizing: "border-box", transition: "border-color .2s", background: WHITE,
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(7,20,34,0.65)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
        overflowY: "auto",
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .cal-day:hover{background:#eff6ff!important;color:#1a56db!important;}
        .time-slot:hover{background:#eff6ff!important;border-color:#bfdbfe!important;color:#1a56db!important;}
      `}</style>

      <div style={{
        background: WHITE, borderRadius: 22, width: "100%", maxWidth: 560,
        boxShadow: "0 32px 80px rgba(0,0,0,0.4)", overflow: "hidden",
        animation: "fadeUp .35s cubic-bezier(.16,1,.3,1) both",
        my: 16,
      }}>
        {/* Header */}
        <div style={{ background: NAVY, padding: "22px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ color: "#93c5fd", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>
              {step === 1 ? "Step 1 of 2 — Pick a Date & Time" : step === 2 ? "Step 2 of 2 — Review & Pay" : "Booking Confirmed"}
            </p>
            <h3 style={{ color: WHITE, fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "1.05rem", margin: 0 }}>
              {step === 3 ? "🎉 Inspection Booked!" : "Book Property Inspection"}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, width: 34, height: 34, display: "grid", placeItems: "center", cursor: "pointer", color: WHITE, fontSize: 18 }}>✕</button>
        </div>

        {/* Progress bar */}
        {step < 3 && (
          <div style={{ height: 4, background: "#f3f4f6" }}>
            <div style={{ height: "100%", width: step === 1 ? "50%" : "100%", background: BLUE, transition: "width .4s ease" }} />
          </div>
        )}

        <div style={{ padding: "24px 28px" }}>

          {/* ── STEP 1: Calendar ── */}
          {step === 1 && (
            <div>
              {/* Property mini card */}
              <div style={{ display: "flex", gap: 12, padding: "12px 14px", background: "#f8fafc", borderRadius: 12, marginBottom: 22, border: "1px solid #f3f4f6" }}>
                <img src={property.image} alt="" style={{ width: 56, height: 56, borderRadius: 9, objectFit: "cover", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: 14, color: NAVY, margin: "0 0 3px", fontFamily: "Poppins, sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{property.title}</p>
                  <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>{property.address}</p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontWeight: 800, fontSize: 13, color: BLUE, margin: "0 0 2px", fontFamily: "Poppins, sans-serif" }}>{formatPrice(property.price)}</p>
                  <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>{property.type === "rent" ? "/ yr" : "asking"}</p>
                </div>
              </div>

              {/* Calendar */}
              <div style={{ background: "#f8fafc", borderRadius: 14, padding: "18px 16px", marginBottom: 20, border: "1px solid #f3f4f6" }}>
                {/* Month nav */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <button onClick={prevMonth} style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid #e5e7eb", background: WHITE, cursor: "pointer", display: "grid", placeItems: "center" }}>
                    <ChevronLeft size={16} color={NAVY} />
                  </button>
                  <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 15, color: NAVY }}>
                    {MONTHS[calMonth]} {calYear}
                  </span>
                  <button onClick={nextMonth} style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid #e5e7eb", background: WHITE, cursor: "pointer", display: "grid", placeItems: "center" }}>
                    <ChevronRight size={16} color={NAVY} />
                  </button>
                </div>

                {/* Day headers */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 8 }}>
                  {DAYS.map(d => (
                    <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: "#9ca3af", padding: "4px 0" }}>{d}</div>
                  ))}
                </div>

                {/* Day cells */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
                  {Array.from({ length: firstDayIndex }).map((_, i) => <div key={`empty-${i}`} />)}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const d = i + 1;
                    const ds = `${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
                    const past = isPast(d);
                    const selected = ds === selectedDate;
                    const isToday = ds === todayStr;
                    return (
                      <button
                        key={d}
                        className={!past && !selected ? "cal-day" : ""}
                        onClick={() => selectDay(d)}
                        disabled={past}
                        style={{
                          width: "100%", aspectRatio: "1", borderRadius: 9, border: "none",
                          fontFamily: "Poppins, sans-serif", fontWeight: selected ? 700 : 500, fontSize: 13,
                          cursor: past ? "not-allowed" : "pointer",
                          background: selected ? BLUE : isToday ? "#eff6ff" : WHITE,
                          color: selected ? WHITE : past ? "#d1d5db" : isToday ? BLUE : NAVY,
                          boxShadow: selected ? "0 4px 12px rgba(26,86,219,0.35)" : "none",
                          transition: "all .15s",
                          outline: isToday && !selected ? `2px solid ${BLUE}` : "none",
                          outlineOffset: -2,
                        }}
                      >{d}</button>
                    );
                  })}
                </div>
              </div>

              {/* Time slots */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
                  <Clock size={15} color={BLUE} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>
                    {selectedDate ? `Available Times — ${formatDateLabel(selectedDate)}` : "Select a date to see available times"}
                  </span>
                </div>
                {selectedDate && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                    {TIME_SLOTS.map(t => {
                      const active = selectedTime === t;
                      return (
                        <button
                          key={t}
                          className={!active ? "time-slot" : ""}
                          onClick={() => setSelectedTime(t)}
                          style={{
                            padding: "10px 6px", borderRadius: 9, fontSize: 13, fontWeight: 600,
                            border: `1.5px solid ${active ? BLUE : "#e5e7eb"}`,
                            background: active ? BLUE : WHITE,
                            color: active ? WHITE : NAVY,
                            cursor: "pointer",
                            boxShadow: active ? "0 4px 12px rgba(26,86,219,0.3)" : "none",
                            transition: "all .15s", fontFamily: "inherit",
                          }}
                        >{t}</button>
                      );
                    })}
                  </div>
                )}
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!selectedDate || !selectedTime}
                style={{
                  marginTop: 22, width: "100%", padding: "13px",
                  background: selectedDate && selectedTime ? `linear-gradient(135deg, ${BLUE}, #1444b8)` : "#e5e7eb",
                  color: selectedDate && selectedTime ? WHITE : "#9ca3af",
                  border: "none", borderRadius: 11, fontWeight: 700, fontSize: 15,
                  cursor: selectedDate && selectedTime ? "pointer" : "not-allowed",
                  fontFamily: "Poppins, sans-serif", transition: "all .2s",
                  boxShadow: selectedDate && selectedTime ? "0 6px 20px rgba(26,86,219,0.32)" : "none",
                }}
              >
                Continue →
              </button>
            </div>
          )}

          {/* ── STEP 2: Review & Pay ── */}
          {step === 2 && (
            <div>
              {/* Booking summary banner */}
              <div style={{ background: "#f0f4ff", borderRadius: 11, padding: "13px 16px", marginBottom: 20, border: "1px solid #bfdbfe", display: "flex", gap: 20 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 3px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Booking Summary</p>
                  <p style={{ fontSize: 13.5, fontWeight: 700, color: NAVY, margin: "0 0 2px", fontFamily: "Poppins, sans-serif" }}>{property.title}</p>
                  <p style={{ fontSize: 12.5, color: "#6b7280", margin: 0 }}>
                    📅 {formatDateLabel(selectedDate)} &nbsp;·&nbsp; 🕐 {selectedTime}
                  </p>
                </div>
                <button onClick={() => setStep(1)} style={{ alignSelf: "center", fontSize: 12, color: BLUE, fontWeight: 600, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Change</button>
              </div>

              {/* Signed-in user notice */}
              <div style={{ background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 10, padding: "11px 14px", marginBottom: 18, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#eff6ff", display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <User size={15} color={BLUE} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {userName && <p style={{ fontSize: 13, fontWeight: 700, color: NAVY, margin: "0 0 1px" }}>{userName}</p>}
                  <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
                    {userEmail
                      ? <>Booking confirmation will be sent to <strong style={{ color: NAVY }}>{userEmail}</strong></>
                      : "Booking confirmation will be sent to your registered email address."}
                  </p>
                </div>
              </div>

              <form onSubmit={handleMakePayment} style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>
                    Additional Notes <span style={{ fontWeight: 400, color: "#9ca3af" }}>(optional)</span>
                  </label>
                  <textarea
                    style={{ ...inp, resize: "none", height: 90 }}
                    placeholder="Any specific requests or questions for the agent…"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    onFocus={e => e.target.style.borderColor = BLUE}
                    onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                  />
                </div>

                {/* Property price strip */}
                <div style={{ background: "#f0f4ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "11px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "#374151" }}>Property Price</span>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: BLUE, fontFamily: "Poppins, sans-serif" }}>{formatPrice(property.price)}</span>
                    <span style={{ fontSize: 11, color: "#60a5fa", marginLeft: 4 }}>{property.type === "rent" ? "/ yr" : "asking"}</span>
                  </div>
                </div>

                {/* Error message */}
                {paymentError && (
                  <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 9, padding: "10px 14px", fontSize: 13, color: "#b91c1c", fontWeight: 500 }}>
                    ⚠️ {paymentError}
                  </div>
                )}

                <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                  <button type="button" onClick={() => setStep(1)} style={{
                    flex: 1, padding: "13px", background: WHITE, color: NAVY,
                    border: "1.5px solid #e5e7eb", borderRadius: 10, fontWeight: 600, fontSize: 14,
                    cursor: "pointer", fontFamily: "Poppins, sans-serif",
                  }}>← Back</button>
                  <button type="submit" disabled={loading} style={{
                    flex: 2, padding: "13px",
                    background: loading ? "#9ca3af" : `linear-gradient(135deg, ${BLUE}, #1444b8)`,
                    color: WHITE, border: "none", borderRadius: 10, fontWeight: 700, fontSize: 15,
                    cursor: loading ? "not-allowed" : "pointer", fontFamily: "Poppins, sans-serif",
                    boxShadow: loading ? "none" : "0 6px 20px rgba(26,86,219,0.3)",
                    transition: "all .2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}>
                    {loading ? (
                      <>
                        <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: WHITE, borderRadius: "50%", display: "inline-block", animation: "spin .7s linear infinite" }} />
                        Processing…
                      </>
                    ) : (
                      <>
                        <CreditCard size={16} />
                        Make Payment
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── STEP 3: Success ── */}
          {step === 3 && (
            <div style={{ textAlign: "center", padding: "10px 0 14px" }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#f0fdf4", display: "grid", placeItems: "center", margin: "0 auto 18px" }}>
                <CheckCircle size={36} color="#16a34a" />
              </div>
              <h4 style={{ fontFamily: "Poppins, sans-serif", color: NAVY, fontSize: "1.15rem", marginBottom: 8 }}>Inspection Booked!</h4>
              <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
                Your inspection for <strong style={{ color: NAVY }}>{property.title}</strong> has been confirmed for<br />
                <strong style={{ color: BLUE }}>{formatDateLabel(selectedDate)}</strong> at <strong style={{ color: BLUE }}>{selectedTime}</strong>.
              </p>

              {/* Email confirmation notice */}
              <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 12, padding: "14px 18px", marginBottom: 22, display: "flex", alignItems: "flex-start", gap: 12, textAlign: "left" }}>
                <Mail size={20} color="#0284c7" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p style={{ fontWeight: 700, fontSize: 13.5, color: "#0c4a6e", margin: "0 0 3px" }}>Confirmation Email Sent</p>
                  <p style={{ fontSize: 13, color: "#0369a1", margin: 0 }}>
                    A booking confirmation has been sent to <strong>{userEmail || "your registered email"}</strong>. Check your inbox (and spam folder).
                  </p>
                </div>
              </div>

              {/* Booking details card */}
              <div style={{ background: "#f8fafc", borderRadius: 12, padding: "14px 16px", marginBottom: 22, textAlign: "left" }}>
                {[
                  ["Property", property.title],
                  ["Date", formatDateLabel(selectedDate)],
                  ["Time", selectedTime],
                  ["Agent", property.agent.name],
                  ["Booked By", userName || "You"],
                  ["Status", "⏳ Pending Agent Confirmation"],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid #f3f4f6" }}>
                    <span style={{ fontSize: 12.5, color: "#6b7280", fontWeight: 600 }}>{label}</span>
                    <span style={{ fontSize: 13, color: NAVY, fontWeight: 600, textAlign: "right", maxWidth: "60%" }}>{value}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={onClose} style={{
                  flex: 1, padding: "12px", background: WHITE, color: NAVY,
                  border: "1.5px solid #e5e7eb", borderRadius: 10, fontWeight: 600, fontSize: 14,
                  cursor: "pointer", fontFamily: "Poppins, sans-serif",
                }}>Close</button>
                <button onClick={() => { window.location.href = "/bookings"; }} style={{
                  flex: 1, padding: "12px", background: BLUE, color: WHITE,
                  border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14,
                  cursor: "pointer", fontFamily: "Poppins, sans-serif",
                }}>View My Bookings</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InspectionModal;