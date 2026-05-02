import Sidebar from '../Dashboard/Navbar'
import InformationSection from './Informationsection'
import SocialMediaSection from './Socialmediasection'
import AccountRoleSection from './Accountrolesection'
import ChangePasswordSection from './Changepasswordsection'
import DeleteAccountSection from './Deleteaccountsection'

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activePage="My Profile" onNavigate={() => {}} />

      <div className="md:ml-[260px] pt-14 md:pt-0">
        <div className="px-8 py-8 pb-20">

          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <button
              type="button"
              className="px-4 py-2 text-sm font-semibold text-white bg-gray-800 rounded-md hover:bg-gray-700 transition"
            >
              View Public Profile
            </button>
          </div>

          {/* Sections */}
          <div className="space-y-4">
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