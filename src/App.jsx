import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './index.css'
import LandingPage        from './Components/Dashboard'
import UserDashboard      from './Components/Users/Dashboard/Dashboard'
import PropertyDetail     from './Components/Users/Dashboard/propertiesdetails'
import MyBookings         from './Components/Users/Dashboard/Booking'
import ProfilePage        from './Components/Users/Profile/profile'
import AgentProfilePage   from './Components/Agents/Profile/profile'
import WalletPage         from './Components/Agents/Wallet/Wallet'
import AdashBoard         from './Components/Agents/Dashboard/Dashboard'
import CreateListingPage  from './Components/Agents/Dashboard/Createlistingpage'
import EditListingPage    from './Components/Agents/Dashboard/Editlistingpage'
import Sidebar            from './Components/Agents/navbar'
import UserSidebar        from './Components/Users/Dashboard/Navbar'
import AgentOrdersPage    from './Components/Agents/Bookings/AgentOrders'
import Settings           from './Components/Users/Settings/Setting'

const NAV_W = 260

// ── Route map shared by all agent layouts ─────────────────────────────────────

const AGENT_ROUTE_MAP = {
  'Dashboard':        '/agent-dashboard',
  'Bookings':         '/agent-bookings',
  'Create a Listing': '/create-listing',
  'Wallet':           '/wallet',
  'My Profile':       '/agent-profile',
  'Settings':         '/settings',       // ← added
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const getUser = () => {
  try { return JSON.parse(localStorage.getItem('user') || '{}') } catch { return {} }
}

const isAuthenticated = () => {
  try {
    const token = localStorage.getItem('token')
    const user  = getUser()
    return !!(token && token !== 'undefined' && token !== 'null' && user && Object.keys(user).length)
  } catch { return false }
}

const getRedirectPath = () => {
  try {
    const user = getUser()
    if (!isAuthenticated()) return '/'
    return user.userType === 'agent' ? '/agent-dashboard' : '/dashboard'
  } catch { return '/' }
}

// ── Protected Route ───────────────────────────────────────────────────────────

function ProtectedRoute({ children, agentOnly = false }) {
  if (!isAuthenticated()) return <Navigate to="/" replace />
  if (agentOnly && getUser().userType !== 'agent') return <Navigate to="/dashboard" replace />
  return children
}

// ── Agent Layout ──────────────────────────────────────────────────────────────

function AgentLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()

  const activePage = Object.entries(AGENT_ROUTE_MAP).find(
    ([, path]) => path === location.pathname
  )?.[0] ?? 'Dashboard'

  const handleNavigate = (page) => {
    const path = AGENT_ROUTE_MAP[page]
    if (path) navigate(path)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />
      <main className="agent-main-content" style={{ flex: 1, minHeight: '100vh', background: '#f3f7ff', minWidth: 0, overflow: 'hidden' }}>
        {children}
      </main>
      <style>{`
        .agent-main-content { margin-left: 0; width: 100%; }
        @media (min-width: 768px) { .agent-main-content { margin-left: ${NAV_W}px; width: calc(100% - ${NAV_W}px); } }
      `}</style>
    </div>
  )
}

// ── Settings Layout ───────────────────────────────────────────────────────────

function SettingsLayout() {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const user = getUser()
  const isAgent = user?.userType === 'agent'

  if (isAgent) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar
          activePage="Settings"
          onNavigate={(page) => {
            const path = AGENT_ROUTE_MAP[page]
            if (path) navigate(path)
          }}
        />
        <main className="settings-main-content" style={{ minHeight: '100vh', background: '#f3f7ff', flex: 1 }}>
          <Settings />
        </main>
        <style>{`
          .settings-main-content { margin-left: 0; }
          @media (min-width: 768px) { .settings-main-content { margin-left: ${NAV_W}px; } }
        `}</style>
      </div>
    )
  }

  // Regular user — uses the user sidebar (Navbar.jsx)
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <UserSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <main className="settings-main-content" style={{ minHeight: '100vh', background: '#f3f7ff', flex: 1 }}>
        <Settings />
      </main>
      <style>{`
        .settings-main-content { margin-left: 0; }
        @media (min-width: 768px) { .settings-main-content { margin-left: 256px; } }
      `}</style>
    </div>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────

function App() {
  const [, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    const sync = () => setToken(localStorage.getItem('token'))
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  return (
    <BrowserRouter>
      <Routes>

        {/* ── Landing page ── */}
        <Route
          path="/"
          element={isAuthenticated() ? <Navigate to={getRedirectPath()} replace /> : <LandingPage />}
        />

        {/* ── User routes ── */}
        <Route path="/dashboard"      element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="/userdashboard"  element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="/bookings"       element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
        <Route path="/profile"        element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/properties/:id" element={<PropertyDetail />} />

        {/* ── Settings (agents + users) ── */}
        <Route
          path="/settings"
          element={<ProtectedRoute><SettingsLayout /></ProtectedRoute>}
        />

        {/* ── Agent routes ── */}
        <Route
          path="/agent-dashboard"
          element={<ProtectedRoute agentOnly><AgentLayout><AdashBoard /></AgentLayout></ProtectedRoute>}
        />
        <Route
          path="/agent-bookings"
          element={<ProtectedRoute agentOnly><AgentLayout><AgentOrdersPage /></AgentLayout></ProtectedRoute>}
        />
        <Route
          path="/wallet"
          element={<ProtectedRoute agentOnly><AgentLayout><WalletPage /></AgentLayout></ProtectedRoute>}
        />
        <Route
          path="/create-listing"
          element={<ProtectedRoute agentOnly><AgentLayout><CreateListingPage /></AgentLayout></ProtectedRoute>}
        />
        <Route
          path="/edit/:id"
          element={<ProtectedRoute agentOnly><AgentLayout><EditListingPage /></AgentLayout></ProtectedRoute>}
        />
        <Route
          path="/agent-profile"
          element={<ProtectedRoute agentOnly><AgentLayout><AgentProfilePage /></AgentLayout></ProtectedRoute>}
        />

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App