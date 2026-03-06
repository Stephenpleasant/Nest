import { useState } from 'react'
import Sidebar from '../Dashboard/Navbar'
import InformationSection from './Informationsection'
import SocialMediaSection from './Socialmediasection'
import AccountRoleSection from './Accountrolesection'
import ChangePasswordSection from './Changepasswordsection'
import DeleteAccountSection from './Deleteaccountsection'

export default function ProfilePage() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main content pushed right by sidebar width (256px) */}
      <div style={{ marginLeft: 256 }}>
        <div className="max-w-5xl mx-auto px-6 py-8">

          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <button
              type="button"
              className="px-4 py-2 text-sm font-semibold text-white bg-gray-800 rounded-md hover:bg-gray-700 transition"
            >
              View Public Profile
            </button>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <InformationSection />
            <SocialMediaSection />
            <AccountRoleSection />
            <ChangePasswordSection />
            <DeleteAccountSection />
          </div>

        </div>
      </div>
    </div>
  )
}