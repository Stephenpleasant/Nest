import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

/* ── Color tokens ──────────────────────────────────────────────────────────── */
const BLUE    = "#1a56db";
const NAVY    = "#0b1a2e";
const LIGHTBG = "#f0f5ff";
const GREY    = "#6b7280";
const BORDER  = "#e5e7eb";
const WHITE   = "#ffffff";

const BASE = import.meta.env.VITE_API_BASE_URL || 'https://gtimeconnect.onrender.com';

/* ── Focus / blur helpers ──────────────────────────────────────────────────── */
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

/* ══════════════════════════════════════════════════════════════════════════════
   PAGE SHELL  (matches existing Auth.jsx shell exactly)
══════════════════════════════════════════════════════════════════════════════ */
const Shell = ({ children }) => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@600;700;800&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html, body { height: 100%; font-family: 'Inter', sans-serif; }
      @keyframes fadeUp  { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
      @keyframes spin    { to { transform: rotate(360deg); } }
      @keyframes shimmer { 0%,100% { opacity:.55; } 50% { opacity:.8; } }
      input::placeholder { color: #9ca3af; }
      ::-webkit-scrollbar { width: 8px; }
      ::-webkit-scrollbar-thumb { background: #1a56db; border-radius: 4px; }
      .aa-page { min-height:100vh; display:flex; align-items:flex-start; justify-content:center; padding:100px 16px 60px; position:relative; overflow-y:auto; overflow-x:hidden; }
      .aa-bg   { position:fixed; inset:0; background-image:url('https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1800&q=85'); background-size:cover; background-position:center; background-attachment:fixed; z-index:0; }
      .aa-bg::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(11,26,46,0.80) 0%,rgba(26,86,219,0.35) 50%,rgba(7,20,34,0.88) 100%); backdrop-filter:blur(3px); }
      .aa-orb { position:fixed; border-radius:50%; pointer-events:none; z-index:1; animation:shimmer 6s ease-in-out infinite; }
      .aa-orb1 { width:380px; height:380px; top:-80px; right:-60px; background:radial-gradient(circle,rgba(26,86,219,0.30) 0%,transparent 70%); }
      .aa-orb2 { width:260px; height:260px; bottom:-60px; left:-40px; background:radial-gradient(circle,rgba(96,165,250,0.22) 0%,transparent 70%); animation-delay:3s; }
      .aa-card { position:relative; z-index:10; width:100%; max-width:480px; margin-top:20px; background:rgba(255,255,255,0.97); border-radius:24px; box-shadow:0 40px 100px rgba(0,0,0,0.5),0 0 0 1px rgba(255,255,255,0.15); overflow:hidden; animation:fadeUp .55s cubic-bezier(.16,1,.3,1) both; }
      .aa-topbar  { height:5px; background:linear-gradient(90deg,#1a56db 0%,#60a5fa 40%,#3b82f6 70%,#1a56db 100%); }
      .aa-body    { padding:40px 44px 32px; }
      .aa-back    { position:fixed; top:20px; left:20px; z-index:20; display:flex; align-items:center; gap:7px; color:rgba(255,255,255,0.9); background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.22); backdrop-filter:blur(8px); border-radius:10px; padding:8px 16px; font-size:13px; font-weight:500; text-decoration:none; transition:background .2s; }
      .aa-back:hover { background:rgba(255,255,255,0.2); }
      .aa-tab-row { display:flex; border-bottom:2px solid ${BORDER}; margin-bottom:22px; }
      .aa-tab  { flex:1; padding:10px 0; text-align:center; font-size:14px; font-weight:600; border:none; background:none; cursor:pointer; margin-bottom:-2px; font-family:'Inter',sans-serif; }
      .aa-tab.active   { color:${BLUE}; border-bottom:2px solid ${BLUE}; }
      .aa-tab.inactive { color:${GREY}; border-bottom:2px solid transparent; }
      .aa-field   { margin-bottom:14px; }
      .aa-label   { display:block; font-size:13.5px; font-weight:600; color:#1f2937; margin-bottom:6px; }
      .aa-pass    { position:relative; }
      .aa-eye     { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:${GREY}; display:flex; align-items:center; padding:0; }
      .aa-error   { background:#fef2f2; border:1px solid #fecaca; border-radius:9px; padding:10px 14px; color:#dc2626; font-size:13.5px; margin-bottom:16px; display:flex; align-items:center; gap:8px; }
      .aa-success { background:#f0fdf4; border:1px solid #bbf7d0; border-radius:9px; padding:10px 14px; color:#15803d; font-size:13.5px; margin-bottom:16px; display:flex; align-items:center; gap:8px; }
      .aa-btn     { width:100%; padding:13px 0; background:${BLUE}; color:white; border:none; border-radius:11px; font-size:15px; font-weight:700; cursor:pointer; margin-top:8px; transition:background .2s,transform .15s,box-shadow .2s; box-shadow:0 6px 22px rgba(26,86,219,0.35); font-family:'Inter',sans-serif; }
      .aa-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 10px 28px rgba(26,86,219,0.42); }
      .aa-btn:disabled { background:#9ca3af; cursor:not-allowed; box-shadow:none; transform:none; }
      .aa-switch  { text-align:center; margin-top:16px; font-size:14px; color:${GREY}; }
      .aa-slink   { color:${BLUE}; font-weight:600; background:none; border:none; cursor:pointer; font-size:14px; font-family:'Inter',sans-serif; }
      .aa-badge   { display:flex; align-items:center; gap:10px; background:${LIGHTBG}; border:1px solid rgba(26,86,219,0.18); border-radius:12px; padding:12px 16px; margin-bottom:24px; }
      .aa-col2    { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
      .spinner    { width:17px; height:17px; border:2px solid rgba(255,255,255,0.3); border-top-color:white; border-radius:50%; display:inline-block; animation:spin .7s linear infinite; }
      .spin-row   { display:flex; align-items:center; justify-content:center; gap:9px; }
      @media(max-width:540px) { .aa-body { padding:28px 22px 24px; } .aa-col2 { grid-template-columns:1fr; } .aa-card { border-radius:18px; } }
    `}</style>
    <div className="aa-page">
      <div className="aa-bg" />
      <div className="aa-orb aa-orb1" />
      <div className="aa-orb aa-orb2" />
      <Link to="/" className="aa-back"><ArrowLeft size={14} /> Back to Home</Link>
      <div className="aa-card">
        <div className="aa-topbar" />
        <div className="aa-body">
          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:10, justifyContent:"center", marginBottom:6 }}>
            <div style={{ width:40, height:40, background:NAVY, borderRadius:10, display:"grid", placeItems:"center", boxShadow:"0 4px 14px rgba(11,26,46,0.3)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22" stroke="white" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            <span style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:22, color:NAVY }}>
              Nest<span style={{ color:BLUE }}>find</span>
            </span>
          </div>
          <p style={{ textAlign:"center", fontSize:11, color:"#9ca3af", letterSpacing:"1.2px", textTransform:"uppercase", marginBottom:22, fontWeight:500 }}>
            Admin Portal
          </p>
          {children}
        </div>
        <div style={{ height:5, background:`linear-gradient(90deg,${NAVY} 0%,${BLUE} 50%,${NAVY} 100%)` }} />
      </div>
    </div>
  </>
);

/* ══════════════════════════════════════════════════════════════════════════════
   ADMIN AUTH COMPONENT
══════════════════════════════════════════════════════════════════════════════ */
export default function AdminAuth() {
  const [isLogin, setIsLogin]           = useState(true);
  const [showPw, setShowPw]             = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const [success, setSuccess]           = useState('');

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
    phone: '',
  });

  const navigate = useNavigate();

  const change = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (error)   setError('');
    if (success) setSuccess('');
  };

  const passMatch = form.confirmPassword === '' || form.password === form.confirmPassword;

  /* ── LOGIN ─────────────────────────────────────────────────────────────── */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res  = await axios.post(`${BASE}/api/v1/auth/admin/login`, {
        email:    form.email,
        password: form.password,
      });
      const data  = res.data.data ?? res.data;
      const token = data.token ?? res.data.token;
      const admin = data.admin ?? data.user ?? data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({
        ...admin,
        userType: 'admin',
        name:  admin.firstName ? `${admin.firstName} ${admin.lastName}`.trim() : admin.name ?? '',
        email: admin.email ?? form.email,
      }));

      setSuccess('Signed in successfully! Redirecting…');
      setTimeout(() => navigate('/admin', { replace: true }), 600);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error   ||
        `Login failed (${err.response?.status ?? 'network error'}). Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  /* ── REGISTER ──────────────────────────────────────────────────────────── */
  const handleRegister = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.'); return;
    }
    setError(''); setLoading(true);
    try {
      const res = await axios.post(`${BASE}/api/v1/admin/register`, {
        fullName:        `${form.firstName} ${form.lastName}`.trim(),
        firstName:       form.firstName,
        lastName:        form.lastName,
        email:           form.email,
        password:        form.password,
        confirmPassword: form.confirmPassword,
        phone:           form.phone,
        role:            'admin',
        userType:        'admin',
      });
      const data  = res.data.data ?? res.data;
      const token = data.token ?? res.data.token;

      if (token) {
        /* Some APIs return token immediately on register */
        const admin = data.admin ?? data.user ?? data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({
          ...admin,
          userType: 'admin',
          name:  admin.firstName ? `${admin.firstName} ${admin.lastName}`.trim() : admin.name ?? '',
          email: admin.email ?? form.email,
        }));
        setSuccess('Account created! Redirecting…');
        setTimeout(() => navigate('/admin', { replace: true }), 600);
      } else {
        /* API sends a verification email first */
        setSuccess('Account created! Check your email to verify, then sign in.');
        setTimeout(() => setIsLogin(true), 2500);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error   ||
        `Registration failed (${err.response?.status ?? 'network error'}). Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setForm({ firstName:'', lastName:'', email:'', password:'', confirmPassword:'', phone:'' });
    setError(''); setSuccess('');
  };

  /* ── RENDER ────────────────────────────────────────────────────────────── */
  return (
    <Shell>
      {/* Admin badge */}
      <div className="aa-badge">
        <div style={{ width:34, height:34, borderRadius:8, background:NAVY, display:"grid", placeItems:"center", flexShrink:0 }}>
          <ShieldCheck size={17} color={WHITE} />
        </div>
        <div>
          <p style={{ fontSize:13, fontWeight:700, color:NAVY, margin:0 }}>Admin Access Only</p>
          <p style={{ fontSize:12, color:GREY, margin:0 }}>This portal is restricted to Nestfind administrators.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="aa-tab-row">
        <button className={`aa-tab ${isLogin ? 'active' : 'inactive'}`}
          onClick={() => { setIsLogin(true); reset(); }}>Sign In</button>
        <button className={`aa-tab ${!isLogin ? 'active' : 'inactive'}`}
          onClick={() => { setIsLogin(false); reset(); }}>Create Account</button>
      </div>

      <h1 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:"1.35rem", color:NAVY, textAlign:"center", marginBottom:4 }}>
        {isLogin ? 'Admin Sign In' : 'Create Admin Account'}
      </h1>
      <p style={{ fontSize:13.5, color:GREY, textAlign:"center", marginBottom:20 }}>
        {isLogin ? 'Sign in to the Nestfind admin dashboard' : 'Register a new administrator account'}
      </p>

      {success && (
        <div className="aa-success">
          <CheckCircle2 size={15} /> {success}
        </div>
      )}
      {error && (
        <div className="aa-error">
          <AlertCircle size={15} /> {error}
        </div>
      )}

      {/* ── LOGIN FORM ── */}
      {isLogin && (
        <form onSubmit={handleLogin}>
          <div className="aa-field">
            <label className="aa-label">Email Address</label>
            <input name="email" type="email" placeholder="admin@nestfind.com"
              value={form.email} onChange={change}
              style={inputBase} onFocus={onFocus} onBlur={onBlur}
              required disabled={loading} autoComplete="email" />
          </div>
          <div className="aa-field">
            <label className="aa-label">Password</label>
            <div className="aa-pass">
              <input name="password" type={showPw ? 'text' : 'password'}
                placeholder="Enter your password"
                value={form.password} onChange={change}
                style={{ ...inputBase, paddingRight: 42 }}
                onFocus={onFocus} onBlur={onBlur}
                required disabled={loading} autoComplete="current-password" />
              <button type="button" className="aa-eye" onClick={() => setShowPw(p => !p)} tabIndex={-1}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" className="aa-btn" disabled={loading}>
            {loading
              ? <span className="spin-row"><span className="spinner" />Signing in…</span>
              : 'Sign In to Admin Panel'}
          </button>
        </form>
      )}

      {/* ── REGISTER FORM ── */}
      {!isLogin && (
        <form onSubmit={handleRegister}>
          <div className="aa-col2">
            <div className="aa-field">
              <label className="aa-label">First Name</label>
              <input name="firstName" type="text" placeholder="John"
                value={form.firstName} onChange={change}
                style={inputBase} onFocus={onFocus} onBlur={onBlur}
                required disabled={loading} autoComplete="given-name" />
            </div>
            <div className="aa-field">
              <label className="aa-label">Last Name</label>
              <input name="lastName" type="text" placeholder="Doe"
                value={form.lastName} onChange={change}
                style={inputBase} onFocus={onFocus} onBlur={onBlur}
                required disabled={loading} autoComplete="family-name" />
            </div>
          </div>

          <div className="aa-col2">
            <div className="aa-field">
              <label className="aa-label">Email Address</label>
              <input name="email" type="email" placeholder="admin@nestfind.com"
                value={form.email} onChange={change}
                style={inputBase} onFocus={onFocus} onBlur={onBlur}
                required disabled={loading} autoComplete="email" />
            </div>
            <div className="aa-field">
              <label className="aa-label">Phone Number</label>
              <input name="phone" type="tel" placeholder="+234 800 000 0000"
                value={form.phone} onChange={change}
                style={inputBase} onFocus={onFocus} onBlur={onBlur}
                required disabled={loading} autoComplete="tel" />
            </div>
          </div>

          <div className="aa-col2">
            <div className="aa-field">
              <label className="aa-label">Password</label>
              <div className="aa-pass">
                <input name="password" type={showPw ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={form.password} onChange={change}
                  style={{ ...inputBase, paddingRight: 42 }}
                  onFocus={onFocus} onBlur={onBlur}
                  required disabled={loading} minLength={6} autoComplete="new-password" />
                <button type="button" className="aa-eye" onClick={() => setShowPw(p => !p)} tabIndex={-1}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="aa-field">
              <label className="aa-label">Confirm Password</label>
              <div className="aa-pass">
                <input name="confirmPassword" type={showConfirm ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  value={form.confirmPassword} onChange={change}
                  style={{
                    ...inputBase, paddingRight: 42,
                    borderColor: form.confirmPassword && !passMatch ? '#dc2626' : BORDER,
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = form.confirmPassword && !passMatch ? '#dc2626' : BLUE;
                    e.target.style.boxShadow   = form.confirmPassword && !passMatch
                      ? "0 0 0 3px rgba(220,38,38,0.12)" : "0 0 0 3px rgba(26,86,219,0.13)";
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = form.confirmPassword && !passMatch ? '#dc2626' : BORDER;
                    e.target.style.boxShadow   = "none";
                  }}
                  required disabled={loading} minLength={6} autoComplete="new-password" />
                <button type="button" className="aa-eye" onClick={() => setShowConfirm(p => !p)} tabIndex={-1}>
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.confirmPassword && (
                <p style={{ fontSize:12, marginTop:4, color: passMatch ? '#16a34a' : '#dc2626' }}>
                  {passMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
            </div>
          </div>

          <button type="submit" className="aa-btn"
            disabled={loading || (form.confirmPassword.length > 0 && !passMatch)}>
            {loading
              ? <span className="spin-row"><span className="spinner" />Creating account…</span>
              : 'Create Admin Account'}
          </button>
        </form>
      )}

      <p className="aa-switch">
        {isLogin ? "Need an account? " : "Already have an account? "}
        <button className="aa-slink" onClick={() => { setIsLogin(p => !p); reset(); }}>
          {isLogin ? 'Register' : 'Sign In'}
        </button>
      </p>
    </Shell>
  );
}