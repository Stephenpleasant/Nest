import { useState } from 'react'
import SectionCard from './Sectioncard'

const roles = ['Seller', 'Buyer', 'Agent', 'Admin']

export default function AccountRoleSection() {
  const [role, setRole] = useState('Seller')

  return (
    <div id="account-role">
      <SectionCard title="Account Role">
        <div className="flex items-center gap-6">
          <label className="text-sm font-medium text-gray-700 w-32">Account Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition w-48"
          >
            {roles.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
      </SectionCard>
    </div>
  )
}