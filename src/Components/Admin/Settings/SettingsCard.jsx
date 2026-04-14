export default function SettingsCard({ title, children }) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="text-sm font-bold text-[#0b1a2e] uppercase tracking-wide font-['Poppins',sans-serif]">
            {title}
          </h2>
        </div>
        <div className="px-6 py-5">
          {children}
        </div>
      </div>
    );
  }