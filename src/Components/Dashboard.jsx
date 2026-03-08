import { useState, useEffect } from "react";
import {
  Eye, EyeOff, Lock, Mail, User, Phone, MapPin, Search,
  Star, Check, Plus, X, Menu, Home, Building, Building2,
  Shield, CreditCard, Users, TrendingUp, Heart, AlertCircle,
  BarChart2, MessageSquare, ClipboardList, PlusSquare, Calendar
} from "lucide-react";

/* ─── Nigerian States ────────────────────────────────────────────────────── */
const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT – Abuja","Gombe",
  "Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos",
  "Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto",
  "Taraba","Yobe","Zamfara",
];

const API_BASE = "https://gtimeconnect.onrender.com";

/* ─── Demo Properties ───────────────────────────────────────────────────── */
const DEMO_PROPERTIES = [
  { id:1, title:"Luxury Villa, Lekki Phase 1",      price:"₦45,000,000",   type:"For Sale", beds:5, baths:4, sqft:"450 sqm", location:"Lekki, Lagos",          img:"https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80", badge:"Best Deal" },
  { id:2, title:"Modern Apartment, Victoria Island", price:"₦18,500,000",   type:"For Sale", beds:3, baths:2, sqft:"180 sqm", location:"Victoria Island, Lagos", img:"https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80", badge:"New Listing" },
  { id:3, title:"Executive Duplex, Maitama",         price:"₦55,000,000",   type:"For Sale", beds:6, baths:5, sqft:"600 sqm", location:"Maitama, Abuja",         img:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80", badge:null },
  { id:4, title:"Serviced Flat, Ikoyi",              price:"₦850,000/mo",   type:"For Rent", beds:2, baths:2, sqft:"120 sqm", location:"Ikoyi, Lagos",           img:"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80", badge:"Hot" },
  { id:5, title:"Smart Terrace, Asokoro",            price:"₦32,000,000",   type:"For Sale", beds:4, baths:3, sqft:"300 sqm", location:"Asokoro, Abuja",         img:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80", badge:null },
  { id:6, title:"Penthouse Suite, Oniru",            price:"₦1,200,000/mo", type:"For Rent", beds:4, baths:3, sqft:"280 sqm", location:"Oniru, Lagos",           img:"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80", badge:"Premium" },
];

const TESTIMONIALS = [
  { name:"Fola",  avatar:"https://i.pravatar.cc/60?img=11", text:"Booking an inspection used to be stressful. I scheduled mine in less than 5 minutes and everything was organized professionally. Highly recommended!" },
  { name:"Annie", avatar:"https://i.pravatar.cc/60?img=5",  text:"As someone relocating to Abuja, I needed a reliable way to inspect properties. This platform gave me peace of mind and helped me secure my apartment without hassle." },
];

const FAQS = [
  { q:"What is Nestfind?",                a:"Nestfind is a trusted real estate platform connecting buyers, sellers, and agents across Nigeria." },
  { q:"How does Nestfind work?",          a:"Sign up, browse verified listings, book inspections, compare properties, and track every step from your dashboard." },
  { q:"Is it safe to pay through Nestfind?", a:"Yes, all payments go through our secure escrow system — funds are only released after inspection confirmation." },
  { q:"How do I Book Inspection?",        a:"After finding your desired property, click 'Book Inspection', pick a time slot, and our agent will confirm within 24 hours." },
];

/* ─── Empty form ─────────────────────────────────────────────────────────── */
const EMPTY = { firstName:"", lastName:"", email:"", phone:"", address:"", state:"", password:"", confirmPassword:"" };

/* ─── Tiny helpers ───────────────────────────────────────────────────────── */
const inp = (extra="") =>
  `w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 bg-white
   focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all ${extra}`;

const Lbl = ({ children }) => (
  <label className="block text-xs font-semibold text-gray-700 mb-1">{children}</label>
);

const EyeBtn = ({ show, toggle }) => (
  <button type="button" onClick={toggle} tabIndex={-1}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
    {show ? <EyeOff size={15}/> : <Eye size={15}/>}
  </button>
);

const ErrBox = ({ msg }) => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm mb-4 flex items-center gap-2">
    <AlertCircle size={15} className="shrink-0"/>{msg}
  </div>
);

const Spinner = () => (
  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
);

/* ═══════════════════════════════════════════════════════════════════════════
   AUTH MODAL  (mirrors Auth.jsx logic exactly)
═══════════════════════════════════════════════════════════════════════════ */
function AuthModal({ onClose }) {
  const [tab, setTab]         = useState("signin");   // "signin" | "register"
  const [userType, setUT]     = useState("user");     // "user" | "agent"
  const [form, setForm]       = useState(EMPTY);
  const [showPw, setShowPw]   = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [loginOk, setLoginOk] = useState(false);

  // OTP
  const [otpScreen, setOtpScreen] = useState(false);
  const [otp, setOtp]             = useState("");
  const [regEmail, setRegEmail]   = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  const passMatch = !form.confirmPassword || form.password === form.confirmPassword;

  const reset = (keepEmail=false) => {
    setForm(EMPTY); setError(""); setShowPw(false); setShowCpw(false); setLoginOk(false);
    if (!keepEmail) { setOtpScreen(false); setOtp(""); setRegEmail(""); }
  };

  const handle = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  /* Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tab === "register" && form.password !== form.confirmPassword) {
      setError("Passwords do not match."); return;
    }
    setError(""); setLoading(true); setLoginOk(false);

    const isReg = tab === "register";
    const endpoint = isReg
      ? (userType === "user" ? "/api/v1/users/registerr" : "/api/v1/agents/register")
      : "/api/auth/login";

    const payload = isReg
      ? { firstName:form.firstName, lastName:form.lastName, email:form.email,
          password:form.password, phone:form.phone, address:form.address, state:form.state }
      : { email:form.email, password:form.password };

    try {
      const res  = await fetch(`${API_BASE}${endpoint}`, {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Operation failed. Please try again.");

      if (!isReg) {
        const ud = {
          ...(data.user ?? data), userType,
          name:  data.user?.firstName ? `${data.user.firstName} ${data.user.lastName}`.trim() : data.name ?? "",
          email: data.user?.email ?? data.email ?? form.email,
        };
        localStorage.setItem("token", data.token);
        localStorage.setItem("user",  JSON.stringify({ ...ud, userType }));
        localStorage.setItem("nestfind_user", JSON.stringify({ name:ud.name, email:ud.email }));
        setLoginOk(true);
        setTimeout(() => onClose("login_success"), 1200);
      } else {
        setRegEmail(form.email);
        reset(true);
        setOtpScreen(true);
      }
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  /* Verify OTP */
  const handleVerify = async (e) => {
    e.preventDefault();
    setError(""); setVerifying(true);
    try {
      const res  = await fetch(`${API_BASE}/api/v1/auth/verify`, {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ otp, email: regEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid code. Please try again.");
      if (data.token) {
        const ud = {
          ...(data.user ?? data), userType,
          name:  data.user?.firstName ? `${data.user.firstName} ${data.user.lastName}`.trim() : data.name ?? "",
          email: data.user?.email ?? data.email ?? regEmail,
        };
        localStorage.setItem("token", data.token);
        localStorage.setItem("user",  JSON.stringify({ ...ud, userType }));
        localStorage.setItem("nestfind_user", JSON.stringify({ name:ud.name, email:ud.email }));
      }
      onClose("verified");
    } catch (err) {
      setError(err.message);
    } finally { setVerifying(false); }
  };

  /* Resend */
  const handleResend = async () => {
    setResending(true); setError("");
    try {
      await fetch(`${API_BASE}/api/v1/auth/resend-verification`, {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ email: regEmail }),
      });
    } catch (err) { setError(err.message || "Failed to resend."); }
    finally { setResending(false); }
  };

  /* ── OTP Screen ── */
  if (otpScreen) return (
    <ModalShell onClose={onClose}>
      <div className="text-center py-2">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail size={28} className="text-blue-600"/>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Check Your Email</h2>
        <p className="text-gray-500 text-sm mb-6">
          We sent a 6-digit code to<br/>
          <strong className="text-gray-900">{regEmail}</strong>
        </p>
        {error && <ErrBox msg={error}/>}
        <form onSubmit={handleVerify}>
          <input
            type="text" inputMode="numeric" maxLength={6} placeholder="••••••"
            value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,"").slice(0,6))}
            className="w-full border-2 border-gray-200 rounded-xl py-4 text-center text-3xl font-bold tracking-[14px] text-gray-900 focus:outline-none focus:border-blue-500 transition-all mb-4"
            required
          />
          <button type="submit" disabled={verifying || otp.length < 6}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm disabled:opacity-50 transition-all">
            {verifying ? <span className="flex items-center justify-center gap-2"><Spinner/>Verifying…</span> : "Verify Email"}
          </button>
        </form>
        <p className="text-sm text-gray-500 mt-4">
          Didn't get the code?{" "}
          <button onClick={handleResend} disabled={resending} className="text-blue-600 font-semibold hover:underline">
            {resending ? "Sending…" : "Resend"}
          </button>
        </p>
        <button onClick={() => { setOtpScreen(false); reset(); }}
          className="text-gray-400 text-sm mt-3 hover:text-gray-600 block mx-auto">
          ← Back to registration
        </button>
      </div>
    </ModalShell>
  );

  const submitDisabled = loading || (tab === "register" && form.confirmPassword.length > 0 && !passMatch);

  /* ── Main form ── */
  return (
    <ModalShell onClose={onClose}>
      {/* Role toggle */}
      <div className="flex bg-blue-50 rounded-xl p-1 gap-1 mb-5">
        {[
          { key:"user",  Icon:User,      label: tab==="register" ? "Register as User"  : "Sign in as User"  },
          { key:"agent", Icon:Building2, label: tab==="register" ? "Register as Agent" : "Sign in as Agent" },
        ].map(({ key, Icon, label }) => (
          <button key={key} onClick={() => { setUT(key); setError(""); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all
              ${userType===key ? "bg-blue-600 text-white shadow-md shadow-blue-600/30" : "text-gray-500 hover:text-gray-700"}`}>
            <Icon size={14}/>{label}
          </button>
        ))}
      </div>

      {/* Sign In / Create Account tabs */}
      <div className="flex border-b-2 border-gray-200 mb-5">
        {[["signin","Sign In"],["register","Create Account"]].map(([key,lbl]) => (
          <button key={key} onClick={() => { setTab(key); reset(); }}
            className={`flex-1 py-2.5 text-sm font-semibold transition-all
              ${tab===key ? "text-blue-600 border-b-2 border-blue-600 -mb-[2px]" : "text-gray-500"}`}>
            {lbl}
          </button>
        ))}
      </div>

      <h2 className="text-xl font-bold text-gray-900 text-center mb-1">
        {tab==="register" ? `Create ${userType==="user" ? "User" : "Agent"} Account` : "Welcome Back"}
      </h2>
      <p className="text-gray-500 text-sm text-center mb-5">
        {tab==="register"
          ? `Join Nestfind as a${userType==="agent" ? "n agent" : " user"} to get started`
          : `Sign in to your ${userType} account`}
      </p>

      {loginOk && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-green-700 text-sm flex items-center justify-center gap-2 mb-4">
          <Check size={15}/> Signed in successfully! Redirecting…
        </div>
      )}
      {error && <ErrBox msg={error}/>}

      <form onSubmit={handleSubmit}>
        {tab === "register" && (
          <>
            {/* Row 1: First + Last */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <Lbl>First Name</Lbl>
                <input name="firstName" type="text" placeholder="John" value={form.firstName} onChange={handle}
                  required disabled={loading} autoComplete="given-name" className={inp()}/>
              </div>
              <div>
                <Lbl>Last Name</Lbl>
                <input name="lastName" type="text" placeholder="Doe" value={form.lastName} onChange={handle}
                  required disabled={loading} autoComplete="family-name" className={inp()}/>
              </div>
            </div>

            {/* Row 2: Email + Phone */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <Lbl>Email Address</Lbl>
                <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handle}
                  required disabled={loading} autoComplete="email" className={inp()}/>
              </div>
              <div>
                <Lbl>Phone Number</Lbl>
                <input name="phone" type="tel" placeholder="+234 800 000 0000" value={form.phone} onChange={handle}
                  required disabled={loading} autoComplete="tel" className={inp()}/>
              </div>
            </div>

            {/* Row 3: Address + State */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <Lbl>Street Address</Lbl>
                <input name="address" type="text" placeholder="123 Broad Street" value={form.address} onChange={handle}
                  required disabled={loading} autoComplete="street-address" className={inp()}/>
              </div>
              <div>
                <Lbl>State</Lbl>
                <select name="state" value={form.state} onChange={handle}
                  required disabled={loading}
                  className={inp(`appearance-none ${!form.state ? "text-gray-400" : "text-gray-900"}`)}>
                  <option value="" disabled>Select your state</option>
                  {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Row 4: Password + Confirm */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div>
                <Lbl>Password</Lbl>
                <div className="relative">
                  <input name="password" type={showPw ? "text" : "password"} placeholder="Min. 6 characters"
                    value={form.password} onChange={handle} required disabled={loading} minLength={6}
                    autoComplete="new-password" className={inp("pr-10")}/>
                  <EyeBtn show={showPw} toggle={() => setShowPw(p=>!p)}/>
                </div>
              </div>
              <div>
                <Lbl>Confirm Password</Lbl>
                <div className="relative">
                  <input name="confirmPassword" type={showCpw ? "text" : "password"} placeholder="Re-enter password"
                    value={form.confirmPassword} onChange={handle} required disabled={loading} minLength={6}
                    autoComplete="new-password"
                    className={inp(`pr-10 ${form.confirmPassword && !passMatch ? "border-red-400 focus:border-red-400 focus:ring-red-500/15" : ""}`)}/>
                  <EyeBtn show={showCpw} toggle={() => setShowCpw(p=>!p)}/>
                </div>
                {form.confirmPassword && (
                  <p className={`text-xs mt-1 ${passMatch ? "text-green-600" : "text-red-500"}`}>
                    {passMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Sign-in fields only */}
        {tab === "signin" && (
          <>
            <div className="mb-3">
              <Lbl>Email Address</Lbl>
              <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handle}
                required disabled={loading} autoComplete="email" className={inp()}/>
            </div>
            <div className="mb-1">
              <Lbl>Password</Lbl>
              <div className="relative">
                <input name="password" type={showPw ? "text" : "password"} placeholder="Enter your password"
                  value={form.password} onChange={handle} required disabled={loading}
                  autoComplete="current-password" className={inp("pr-10")}/>
                <EyeBtn show={showPw} toggle={() => setShowPw(p=>!p)}/>
              </div>
            </div>
            <div className="text-right mb-5">
              <a href="#" className="text-blue-600 text-sm font-medium hover:underline">Forgot password?</a>
            </div>
          </>
        )}

        <button type="submit" disabled={submitDisabled}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm transition-all
            disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/25">
          {loading
            ? <span className="flex items-center justify-center gap-2"><Spinner/>Please wait…</span>
            : tab==="register"
              ? `Create ${userType==="user" ? "User" : "Agent"} Account`
              : `Sign In as ${userType==="user" ? "User" : "Agent"}`
          }
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-4">
        {tab==="register" ? "Already have an account? " : "Don't have an account? "}
        <button onClick={() => { setTab(tab==="register" ? "signin" : "register"); reset(); }}
          className="text-blue-600 font-semibold hover:underline">
          {tab==="register" ? "Sign In" : "Create Account"}
        </button>
      </p>
    </ModalShell>
  );
}

/* ─── Modal shell ────────────────────────────────────────────────────────── */
function ModalShell({ onClose, children }) {
  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative max-h-[92vh] overflow-y-auto">
        <div className="h-1.5 rounded-t-3xl bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600"/>
        <div className="px-8 py-7">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
              <Home size={18} className="text-white"/>
            </div>
            <span className="font-extrabold text-xl text-gray-900">Nest<span className="text-blue-600">find</span></span>
          </div>
          <p className="text-center text-[11px] text-gray-400 uppercase tracking-widest mb-6 font-medium">
            Nigeria's Trusted Real Estate Platform
          </p>
          {children}
        </div>
        <div className="h-1 rounded-b-3xl bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600"/>
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 transition-colors">
          <X size={16}/>
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════════════════════
   HOW IT WORKS — tabbed Clients / Agent
═══════════════════════════════════════════════════════════════════════════ */
const CLIENT_STEPS = [
  { icon:"🏠", title:"Sign up & explore",   desc:"Create your free account in seconds and browse hundreds of verified property listings across Nigeria." },
  { icon:"🔍", title:"Book Inspection",      desc:"Choose a property you love and schedule an inspection at a time that suits you — fully online." },
  { icon:"⚖️", title:"Compare Properties",   desc:"Side-by-side comparison by price, location, size and amenities to help you make the smartest decision." },
  { icon:"📊", title:"Track Every Step",     desc:"Follow your transaction from inspection to handover in real-time through your personal dashboard." },
];

const AGENT_STEPS = [
  { icon:"✍️", title:"Sign Up as Agent",      desc:"Create your verified agent profile, upload credentials, and get approved to start listing properties." },
  { icon:"📸", title:"Create a Listing",      desc:"Add detailed property listings with photos, pricing, location, and amenities to attract serious buyers." },
  { icon:"📅", title:"Manage Inspections",    desc:"Accept or reschedule inspection requests, confirm bookings, and guide clients through every visit." },
  { icon:"📈", title:"Grow Your Business",    desc:"Track leads, measure listing performance, and use data insights to close more deals faster." },
];

function HowItWorks({ onSignUp }) {
  const [tab, setTab] = useState("clients");
  const steps = tab === "clients" ? CLIENT_STEPS : AGENT_STEPS;

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-blue-500 font-semibold text-sm uppercase tracking-wider mb-3">Process</div>
          <h2 className="text-4xl font-black text-gray-900">Use app in 4 Easy Steps</h2>
          <p className="text-gray-400 mt-2 text-base">Use Nestfind in four simple steps</p>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-3 mb-14">
          <button onClick={() => setTab("clients")}
            className={`px-7 py-2.5 rounded-full text-sm font-bold transition-all ${tab==="clients" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
            Clients
          </button>
          <button onClick={() => setTab("agent")}
            className={`px-7 py-2.5 rounded-full text-sm font-bold transition-all ${tab==="agent" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
            Agent
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {steps.map(({ icon, title, desc }, i) => (
            <div key={i}
              className="group relative bg-gray-50 border border-gray-100 rounded-3xl p-7 text-center hover:bg-blue-600 hover:border-blue-600 transition-all duration-300 cursor-default overflow-hidden">
              {/* Icon circle */}
              <div className="w-16 h-16 bg-blue-100 group-hover:bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-colors text-3xl">
                {icon}
              </div>
              <h3 className="font-bold text-gray-900 group-hover:text-white text-base mb-2 transition-colors">{title}</h3>
              <p className="text-gray-500 group-hover:text-blue-100 text-sm leading-relaxed transition-colors">{desc}</p>
            </div>
          ))}
        </div>

        {/* CTA under cards */}
        <div className="text-center mt-10">
          <button onClick={onSignUp}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/25 transition-all">
            Get Started Free →
          </button>
        </div>
      </div>
    </section>
  );
}

export default function NestFind() {

  const [modal, setModal]         = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [filterType, setFilter]   = useState("All");
  const [openFaq, setOpenFaq]     = useState(null);
  const [liked, setLiked]         = useState({});
  const [toast, setToast]         = useState(null);
  const [heroIdx, setHeroIdx]     = useState(0);

  const heroImgs = [
    "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1400&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80",
  ];

  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i+1) % heroImgs.length), 4500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
  };

  const handleModalClose = (reason) => {
    setModal(false);
    if (reason === "login_success") showToast("Welcome back! You're now signed in. 🎉");
    if (reason === "verified")      showToast("Email verified! Your account is ready. 🎉");
  };

  const filtered = filterType === "All" ? DEMO_PROPERTIES : DEMO_PROPERTIES.filter(p => p.type === filterType);

  return (
    <div className="font-sans bg-white text-gray-900 overflow-x-hidden pb-16 md:pb-0">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-[200] bg-blue-600 text-white px-6 py-3 rounded-xl shadow-xl text-sm font-semibold">
          {toast}
        </div>
      )}

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a1628] shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => scrollTo("home")} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center"><Home size={16} className="text-white"/></div>
            <span className="text-white text-xl font-bold">Nest<span className="text-blue-400">find</span></span>
          </button>

          <div className="hidden md:flex items-center gap-7">
            {["Home","About","Properties","How it Works","Features","Contact"].map(l => (
              <button key={l} onClick={() => scrollTo(l.toLowerCase().replace(/ /g,"-"))}
                className="text-white/80 hover:text-white text-sm font-medium transition-colors">{l}</button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => setModal(true)}
              className="text-white border border-white/30 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-white/10 transition-all">Log In</button>
            <button onClick={() => setModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-blue-500/30 transition-all">Sign Up</button>
          </div>

          {/* Mobile: Sign In button instead of hamburger */}
          <button className="md:hidden bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-all"
            onClick={() => setModal(true)}>
            Sign In
          </button>
        </div>
      </nav>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-around px-2 py-2 pb-safe">
          {[
            { label:"Home",     icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"/><path strokeLinecap="round" strokeLinejoin="round" d="M9 21V12h6v9"/></svg>,         id:"home" },
            { label:"Explore",  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35"/></svg>,         id:"properties" },
            { label:"Bookings", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><rect x="3" y="4" width="18" height="18" rx="2"/><path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 10h18"/></svg>, id:"how-it-works" },
            { label:"Profile",  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><circle cx="12" cy="8" r="4"/><path strokeLinecap="round" strokeLinejoin="round" d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,     id:"contact" },
          ].map(({ label, icon, id }) => {
            const isActive = id === "home";
            return (
              <button key={label} onClick={() => scrollTo(id)}
                className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-all ${isActive ? "text-rose-500" : "text-gray-400 hover:text-gray-600"}`}>
                <span className={isActive ? "text-rose-500" : ""}>{icon}</span>
                <span className={`text-[10px] font-medium ${isActive ? "text-rose-500" : "text-gray-400"}`}>{label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="home" className="relative min-h-screen bg-[#0a1628] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          {heroImgs.map((src,i) => (
            <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i===heroIdx?"opacity-30":"opacity-0"}`}
              style={{ backgroundImage:`url(${src})`, backgroundSize:"cover", backgroundPosition:"center" }}/>
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628] via-[#0a1628]/80 to-transparent"/>
        </div>
        <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-16 grid md:grid-cols-2 gap-12 items-center w-full">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-wider">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"/>Trusted Real Estate Platform
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6">
              Find your Perfect{" "}<span className="text-blue-400">Property</span>{" "}with Ease
            </h1>
            <p className="text-white/60 text-lg mb-8 max-w-lg">
              Whether you're searching for your dream home or managing a portfolio of properties, Nestfind has everything you need.
            </p>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 flex flex-col sm:flex-row gap-2 border border-white/20 mb-10">
              <div className="flex-1 flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3">
                <Search size={16} className="text-white/50"/>
                <input placeholder="Search location, property…" className="bg-transparent text-white placeholder-white/40 text-sm flex-1 outline-none"/>
              </div>
              <select value={filterType} onChange={e=>setFilter(e.target.value)}
                className="bg-white/10 text-white text-sm px-4 py-3 rounded-xl outline-none cursor-pointer">
                <option value="For Sale" className="text-gray-900">For Sale</option>
                <option value="For Rent" className="text-gray-900">For Rent</option>
                <option value="All" className="text-gray-900">All</option>
              </select>
              <button onClick={() => scrollTo("properties")}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all">Search</button>
            </div>
            <div className="flex gap-8">
              {[["10K+","Listed Properties"],["95%","Satisfied Clients"],["12+","Years Experience"]].map(([n,l]) => (
                <div key={l}><div className="text-white font-black text-2xl">{n}</div><div className="text-white/40 text-xs">{l}</div></div>
              ))}
            </div>
          </div>

          <div className="hidden md:block relative">
            <div className="grid grid-cols-2 gap-4">
              {DEMO_PROPERTIES.slice(0,2).map(p => (
                <div key={p.id} className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:scale-105 transition-transform duration-300">
                  <img src={p.img} alt={p.title} className="w-full h-36 object-cover"/>
                  <div className="p-3">
                    <div className="text-white font-bold text-sm truncate">{p.title}</div>
                    <div className="text-blue-400 font-black text-base">{p.price}</div>
                    <div className="text-white/40 text-xs flex items-center gap-1 mt-1"><MapPin size={10}/>{p.location}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-2xl px-6 py-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp size={18} className="text-green-600"/>
              </div>
              <div>
                <div className="font-black text-gray-900 text-sm">Best Deal Available</div>
                <div className="text-blue-600 font-bold text-base">₦45,000,000</div>
                <div className="text-gray-400 text-xs flex items-center gap-1"><MapPin size={10}/>Victoria Island, Lagos</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-blue-500 font-semibold text-sm uppercase tracking-wider mb-3">About Us</div>
            <h2 className="text-4xl font-black text-gray-900 leading-tight mb-5">Nigeria's Most Trusted Real Estate Platform</h2>
            <p className="text-gray-500 text-lg mb-6">We connect buyers, sellers, and verified agents to make property transactions seamless, transparent, and secure across Nigeria.</p>
            <div className="grid grid-cols-2 gap-4">
              {[["10K+","Active Listings"],["500+","Verified Agents"],["95%","Success Rate"],["₦50B+","Transactions"]].map(([n,l]) => (
                <div key={l} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="text-blue-600 font-black text-2xl">{n}</div>
                  <div className="text-gray-500 text-sm">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700&q=80" alt="about" className="rounded-3xl shadow-2xl w-full h-96 object-cover"/>
            <div className="absolute -bottom-6 -left-6 bg-blue-600 text-white rounded-2xl p-5 shadow-xl">
              <div className="font-black text-3xl">12+</div>
              <div className="text-blue-100 text-sm">Years of Excellence</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <HowItWorks onSignUp={() => setModal(true)} />

      {/* ── FEATURES ── */}
      <section id="features" className="py-20 bg-[#0a1628] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage:"url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=50)", backgroundSize:"cover" }}/>
        <div className="absolute inset-0 bg-[#0a1628]/80"/>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-blue-400 font-semibold text-sm uppercase tracking-wider mb-3">Why Choose Us</div>
            <h2 className="text-4xl font-black text-white">Core Features</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon:"🛡️", title:"Verified Agents",    desc:"Agents with certified identity can list properties and connect with buyers safely." },
              { icon:"💳", title:"Escrow Payment",     desc:"Payment is safely held and released only after inspection is confirmed." },
              { icon:"✅", title:"Trust & Transparency", desc:"Ratings and a verified dispute system ensure fair transactions for all parties." },
            ].map(({ icon, title, desc }, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-7 hover:bg-white/20 transition-all group">
                <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-4 text-2xl group-hover:bg-blue-500/30 transition-colors">
                  {icon}
                </div>
                <div className="font-bold text-white mb-2">{title}</div>
                <div className="text-white/50 text-sm leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO IS IT FOR ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-blue-500 font-semibold text-sm uppercase tracking-wider mb-3">For Everyone</div>
            <h2 className="text-4xl font-black text-gray-900">Who is it for</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { role:"Client",        img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", desc:"Browse hundreds of verified listings, compare properties, book inspections, and track every step from your personal dashboard." },
              { role:"Agent", img:"https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&q=80", desc:"List properties, manage client inquiries, schedule inspections, and grow your real estate business with powerful agent tools." },
            ].map(({ role, img, desc }) => (
              <div key={role} className="rounded-3xl overflow-hidden shadow-xl border border-gray-100 flex flex-col md:flex-row">
                <img src={img} alt={role} className="w-full md:w-56 h-48 md:h-auto object-cover"/>
                <div className="p-8 flex flex-col justify-center">
                  <div className="text-blue-600 font-bold text-lg mb-2">{role}</div>
                  <p className="text-gray-500 text-sm mb-5">{desc}</p>
                  <button onClick={() => setModal(true)}
                    className="self-start bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all">
                    Get Started
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROPERTIES ── */}
      <section id="properties" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="text-blue-500 font-semibold text-sm uppercase tracking-wider mb-2">Listings</div>
              <h2 className="text-4xl font-black text-gray-900">Featured Properties</h2>
            </div>
            <div className="flex gap-2">
              {["All","For Sale","For Rent"].map(t => (
                <button key={t} onClick={() => setFilter(t)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filterType===t ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(p => (
              <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="relative">
                  <img src={p.img} alt={p.title} className="w-full h-52 object-cover"/>
                  <span className="absolute top-3 right-3 bg-white/90 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">{p.type}</span>
                  {p.badge && <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">{p.badge}</span>}
                </div>
                <div className="p-4">
                  <div className="font-bold text-gray-900 text-base mb-1 truncate">{p.title}</div>
                  <div className="flex items-center gap-1 text-gray-400 text-xs mb-3"><MapPin size={11}/>{p.location}</div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-gray-900 font-black text-lg">{p.price}</div>
                      <div className="text-gray-400 text-xs">per year</div>
                    </div>
                    <button onClick={() => setModal(true)}
                      className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all">
                      View Details
                    </button>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <img src={`https://i.pravatar.cc/40?img=${p.id + 10}`} alt="agent" className="w-6 h-6 rounded-full object-cover"/>
                      <span className="text-xs text-gray-500">Listed by <span className="font-medium text-gray-700">Agent #{p.id}</span></span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={12} className="fill-yellow-400 text-yellow-400"/>
                      <span className="text-xs font-semibold text-gray-700">4.{5 + (p.id % 2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="text-blue-500 font-semibold text-sm uppercase tracking-wider mb-2">Reviews</div>
              <h2 className="text-3xl font-black text-gray-900">What People Say About Nestfind</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-gray-900">4.8</span>
              <div className="flex">{[...Array(5)].map((_,i) => <Star key={i} size={16} className="fill-yellow-400 text-yellow-400"/>)}</div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t,i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="text-blue-400 text-4xl font-black leading-none mb-4">"</div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">{t.text}</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover"/>
                  <div className="font-semibold text-gray-900">— {t.name},</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ + CONTACT ── */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <div>
            <div className="text-blue-500 font-semibold text-sm uppercase tracking-wider mb-3">Support</div>
            <h2 className="text-3xl font-black text-gray-900 mb-8">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {FAQS.map((f,i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq===i?null:i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
                    {f.q}<Plus size={18} className={`text-gray-400 transition-transform ${openFaq===i ? "rotate-45" : ""}`}/>
                  </button>
                  {openFaq===i && <div className="px-5 pb-4 text-gray-500 text-sm">{f.a}</div>}
                </div>
              ))}
            </div>
            <div className="mt-8 bg-blue-50 rounded-2xl p-6 flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center text-2xl">?</div>
              <div className="font-bold text-gray-900">Have more questions?</div>
              <div className="text-gray-500 text-sm">Send a direct email to our customer care.</div>
              <button className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all">Send Email</button>
            </div>
          </div>
          <div>
            <div className="text-blue-500 font-semibold text-sm uppercase tracking-wider mb-3">Get in Touch</div>
            <h2 className="text-3xl font-black text-gray-900 mb-8">Contact Us</h2>
            <div className="space-y-4">
              {[["Name","John Smith","text"],["Email","johnsmith@gmail.com","email"],["Complaint","Delayed delivery","text"]].map(([lbl,ph,type]) => (
                <div key={lbl}>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">{lbl}</label>
                  <input type={type} placeholder={ph} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"/>
                </div>
              ))}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Note</label>
                <textarea rows={4} placeholder="Write your full message here" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"/>
              </div>
              <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all">
                <Check size={16}/> Submit
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-blue-700">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black text-white">Ready to make House Inspection</h2>
            <p className="text-blue-200 text-lg">Booking, easy and safe?</p>
          </div>
          <button onClick={() => setModal(true)}
            className="bg-white text-blue-700 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all whitespace-nowrap">
            Get started
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0a1628] text-white py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center"><Home size={16}/></div>
            <span className="font-bold text-xl">Nest<span className="text-blue-400">find</span></span>
          </div>
          <div className="text-white/40 text-sm">© 2026 Nestfind. All rights reserved.</div>
          <div className="flex gap-6">
            {["Privacy","Terms","Contact"].map(l => (
              <a key={l} href="#" className="text-white/50 hover:text-white text-sm transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>

      {/* ── AUTH MODAL ── */}
      {modal && <AuthModal onClose={handleModalClose}/>}
    </div>
  );
}