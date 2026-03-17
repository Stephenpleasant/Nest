import InformationSection from './Informationsection'
import SocialMediaSection from './Socialmediasection'
import AccountRoleSection from './Accountrolesection'
import ChangePasswordSection from './Changepasswordsection'
import DeleteAccountSection from './Deleteaccountsection'

export default function ProfilePage() {
  return (
    <>
      <style>{`
        .profile-layout { min-height: 100vh; background: #f9fafb; width: 100%; box-sizing: border-box; }
        .profile-inner  { max-width: 960px; margin: 0 auto; padding: 72px 16px 60px; width: 100%; box-sizing: border-box; }

        @media (min-width: 480px) { .profile-inner { padding: 72px 20px 60px; } }
        @media (min-width: 640px) { .profile-inner { padding: 72px 28px 60px; } }
        @media (min-width: 768px) { .profile-inner { padding: 36px 32px 60px; } }
        @media (min-width: 1024px) { .profile-inner { padding: 40px 44px 60px; } }

        .profile-header { flex-direction: column !important; gap: 12px !important; align-items: flex-start !important; }
        @media (min-width: 480px) { .profile-header { flex-direction: row !important; align-items: center !important; gap: 0 !important; } }

        /* Social media grid: 1 col mobile, 2 col sm+ */
        .social-grid { grid-template-columns: 1fr !important; }
        @media (min-width: 540px) { .social-grid { grid-template-columns: 1fr 1fr !important; } }
      `}</style>

      <div className="profile-layout">
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