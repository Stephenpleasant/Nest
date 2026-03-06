import { useState } from 'react'
import Sidebar, { NAV_W } from './navbar'
import Dashboard from './dashboard'
import ProfilePage from './component/profile'
import CreateListingPage from './Createlistingpage'
import WalletPage from './component/Wallet/Wallet'
import AgentOrdersPage from './component/Bookings/AgentOrders'

function App() {
  const [activePage, setActivePage] = useState('Dashboard')

  const renderPage = () => {
    switch (activePage) {
      case 'Dashboard':        return <Dashboard onNavigate={setActivePage} />
      case 'My Profile':       return <ProfilePage />
      case 'Bookings':         return <AgentOrdersPage />
      case 'Create a Listing': return <CreateListingPage />
      case 'Wallet':           return <WalletPage />
      default:                 return <Dashboard onNavigate={setActivePage} />
    }
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      <main style={{
        marginLeft: NAV_W,
        flex: 1,
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
      }}>
        {renderPage()}
      </main>
    </div>
  )
}

export default App