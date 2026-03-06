import Sidebar from '../navbar'
import InformationSection from './Informationsection'
import SocialMediaSection from './Socialmediasection'
import AccountRoleSection from './Accountrolesection'
import ChangePasswordSection from './Changepasswordsection'
import DeleteAccountSection from './Deleteaccountsection'
import useActiveSection from './Useactivesection'

export default function ProfilePage() {
  const { activeSection, scrollToSection } = useActiveSection()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">

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

        {/* Two-column layout */}
        <div className="flex gap-8 items-start">

          {/* Sidebar */}
          <Sidebar
            activeSection={activeSection}
            onSectionChange={scrollToSection}
          />

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-2">
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