import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import './index.css'
import LandingPage from './Components/Dashboard'
import UserDashboard from './Components/Users/Dashboard/Dashboard'
import PropertyDetail from './Components/Users/Dashboard/propertiesdetails'
import MyBookings from './Components/Users/Dashboard/Booking'
import ProfilePage from './Components/Users/Profile/profile'
import WalletPage from './Components/Agents/Wallet/Wallet'
import AdashBoard from './Components/Agents/Dashboard/Dashboard'
import CreateListingPage from './Components/Agents/Dashboard/Createlistingpage'
import Sidebar from './Components/Agents/navbar'
import AgentOrdersPage from './Components/Agents/Bookings/AgentOrders'

const NAV_W = 260

// Wraps all agent pages with the fixed sidebar
function AgentLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()

  // Each key matches exactly the NavLink `id` in navbar.jsx
  const routeMap = {
    'Dashboard':        '/agent-dashboard',
    'Bookings':         '/agent-bookings',
    'Create a Listing': '/create-listing',
    'Wallet':           '/wallet',
    'My Profile':       '/profile',
  }

  // Highlight the correct nav item based on current URL
  const activePage = Object.entries(routeMap).find(
    ([, path]) => path === location.pathname
  )?.[0] ?? 'Dashboard'

  // Called by navbar.jsx when user clicks a nav item
  const handleNavigate = (page) => {
    const path = routeMap[page]
    if (path) navigate(path)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />
      <main style={{ marginLeft: NAV_W, flex: 1, minHeight: '100vh', background: '#f3f7ff' }}>
        {children}
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public / user routes */}
        <Route path="/"               element={<LandingPage />} />
        <Route path="/dashboard"      element={<UserDashboard />} />
        <Route path="/userdashboard"  element={<UserDashboard />} />
        <Route path="/properties/:id" element={<PropertyDetail />} />
        <Route path="/bookings"       element={<MyBookings />} />
        <Route path="/profile"        element={<ProfilePage />} />

        {/* Agent routes — all wrapped with the agent sidebar */}
        <Route path="/agent-dashboard" element={<AgentLayout><AdashBoard /></AgentLayout>} />
        <Route path="/agent-bookings"  element={<AgentLayout><AgentOrdersPage /></AgentLayout>} />
        <Route path="/wallet"          element={<AgentLayout><WalletPage /></AgentLayout>} />
        <Route path="/create-listing"  element={<AgentLayout><CreateListingPage /></AgentLayout>} />
        <Route path="/profile"  element={<AgentLayout><ProfilePage /></AgentLayout>} />

      </Routes>
    </BrowserRouter>
  )
}

export default App