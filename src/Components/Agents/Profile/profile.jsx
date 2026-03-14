import InformationSection from './Informationsection'
import SocialMediaSection from './Socialmediasection'
import AccountRoleSection from './Accountrolesection'
import ChangePasswordSection from './Changepasswordsection'
import DeleteAccountSection from './Deleteaccountsection'

export default function ProfilePage() {
  return (
    <>
      <style>{`
        .nf-page-root.profile-layout { margin-left: 0; min-height: 100vh; background: #f9fafb; }
        .profile-inner  { max-width: 860px; margin: 0 auto; padding: 72px 16px 60px; }

        @media (min-width: 480px) { .profile-inner { padding: 72px 20px 60px; } }
        @media (min-width: 640px) { .profile-inner { padding: 72px 28px 60px; } }
        @media (min-width: 768px) {
          .nf-page-root.profile-layout { margin-left: 260px; }
          .profile-inner  { padding: 36px 32px 60px; }
        }
        @media (min-width: 1024px) { .profile-inner { padding: 40px 40px 60px; } }

        .profile-header { flex-direction: column !important; gap: 12px !important; align-items: flex-start !important; }
        @media (min-width: 480px) { .profile-header { flex-direction: row !important; align-items: center !important; gap: 0 !important; } }
      `}</style>

      {/* Main content — sidebar is rendered by the parent Dashboard, just like CreateListingPage */}
      <div className="nf-page-root profile-layout">
        <div className="profile-inner">

          {/* Page Header */}
          <div className="profile-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
            <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 700, color: "#0b1a2e", margin: 0 }}>
              My Profile
            </h1>
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
    </>
  )
}