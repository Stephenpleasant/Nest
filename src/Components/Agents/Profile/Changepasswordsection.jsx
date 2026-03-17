import { useState } from 'react'
import SectionCard from './Sectioncard'
import FormField from './Formfield'

export default function ChangePasswordSection() {
  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    setError('')
    setSuccess(false)
  }

  const handleSubmit = () => {
    if (!form.newPassword || !form.confirmPassword) {
      setError('Please fill in both fields.')
      return
    }
    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setSuccess(true)
    setForm({ newPassword: '', confirmPassword: '' })
  }

  return (
    <div id="change-password">
      <SectionCard title="Change Password">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          <FormField
            label="New Password"
            placeholder="Enter your new password"
            type="password"
            value={form.newPassword}
            onChange={set('newPassword')}
          />
          <FormField
            label="Confirm New Password"
            placeholder="Enter your new password again"
            type="password"
            value={form.confirmPassword}
            onChange={set('confirmPassword')}
          />
        </div>

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
        {success && <p className="mt-3 text-sm text-emerald-600">Password updated successfully!</p>}

        <div className="mt-5">
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 text-sm font-semibold text-white bg-emerald-500 rounded-md hover:bg-emerald-600 transition"
          >
            Update Password
          </button>
        </div>
      </SectionCard>
    </div>
  )
}