import { useState } from 'react'
import SectionCard from './Sectioncard'
import FormField from './Formfield'
import AvatarUpload from './Avatarupload'

export default function InformationSection() {
  const [form, setForm] = useState({
    username: 'Brian',
    email: 'frankemmax76@gmail.com',
    firstName: 'Uchenna',
    lastName: 'Brian',
    publicName: 'Brian',
    title: '',
    license: '',
    mobile: '090722561352',
    whatsapp: '',
    taxNumber: '',
    phone: '',
    faxNumber: '',
    language: '',
    companyName: '',
    address: '',
    serviceAreas: '',
    specialties: '',
    about: '',
  })
  const [avatarPreview, setAvatarPreview] = useState(null)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleAvatarChange = (file) => {
    const url = URL.createObjectURL(file)
    setAvatarPreview(url)
  }

  return (
    <div id="information">
      <style>{`
        .info-wrapper { display: flex; flex-direction: column; gap: 24px; }
        .info-fields  { display: grid; grid-template-columns: 1fr; gap: 16px; flex: 1; min-width: 0; }
        .info-full    { grid-column: 1 / -1; }
        @media (min-width: 640px) {
          .info-wrapper { flex-direction: row; align-items: flex-start; }
          .info-fields  { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <SectionCard>
        <div className="info-wrapper">
          {/* Avatar */}
          <div style={{ flexShrink: 0 }}>
            <AvatarUpload preview={avatarPreview} onFileChange={handleAvatarChange} />
          </div>

          {/* Form fields */}
          <div className="info-fields">
            <FormField label="Username"   placeholder="Username"   value={form.username}   onChange={set('username')} />
            <FormField label="Email"      placeholder="Email"      value={form.email}      onChange={set('email')} type="email" />
            <FormField label="First Name" placeholder="First Name" value={form.firstName}  onChange={set('firstName')} />
            <FormField label="Last Name"  placeholder="Last Name"  value={form.lastName}   onChange={set('lastName')} />

            <div className="info-full" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label className="text-sm font-medium text-gray-700">Select Your Public Name</label>
              <select
                value={form.publicName}
                onChange={set('publicName')}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              >
                <option>Brian</option>
                <option>Uchenna</option>
                <option>Uchenna Brian</option>
              </select>
            </div>

            <FormField label="Title / Position"   placeholder="Enter your title or position"     value={form.title}       onChange={set('title')} />
            <FormField label="License"            placeholder="Enter your license"               value={form.license}     onChange={set('license')} />
            <FormField label="Mobile"             placeholder="Enter your mobile"                value={form.mobile}      onChange={set('mobile')} />
            <FormField label="Whatsapp"           placeholder="Enter number with country code"   value={form.whatsapp}    onChange={set('whatsapp')} />
            <FormField label="Tax Number"         placeholder="Enter your tax number"            value={form.taxNumber}   onChange={set('taxNumber')} />
            <FormField label="Phone"              placeholder="Enter your phone number"          value={form.phone}       onChange={set('phone')} />
            <FormField label="Fax Number"         placeholder="Enter your fax number"            value={form.faxNumber}   onChange={set('faxNumber')} />
            <FormField label="Language"           placeholder="English, Spanish, French"         value={form.language}    onChange={set('language')} />
            <FormField label="Company Name"       placeholder="Enter your company name"          value={form.companyName} onChange={set('companyName')} />
            <FormField label="Address"            placeholder="Enter your address"               value={form.address}     onChange={set('address')} />

            <div className="info-full" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label className="text-sm font-medium text-gray-700">Service Areas</label>
              <input
                type="text"
                placeholder="Enter your service areas"
                value={form.serviceAreas}
                onChange={set('serviceAreas')}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              />
            </div>

            <div className="info-full" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label className="text-sm font-medium text-gray-700">Specialties</label>
              <input
                type="text"
                placeholder="Enter your specialties"
                value={form.specialties}
                onChange={set('specialties')}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              />
            </div>

            <div className="info-full" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label className="text-sm font-medium text-gray-700">About me</label>
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <div className="flex items-center gap-1 px-3 py-2 bg-gray-50 border-b border-gray-200 flex-wrap">
                  <select className="text-xs border border-gray-200 rounded px-1 py-0.5 bg-white text-gray-600 mr-2">
                    <option>Paragraph</option>
                    <option>Heading 1</option>
                    <option>Heading 2</option>
                  </select>
                  {['B', 'I', '≡', '⁼', '❝', '⟵', '⟶'].map((t, i) => (
                    <button key={i} type="button" className="px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 rounded transition">{t}</button>
                  ))}
                </div>
                <textarea
                  rows={5}
                  value={form.about}
                  onChange={set('about')}
                  placeholder="Write something about yourself..."
                  className="w-full px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-start">
          <button
            type="button"
            className="px-5 py-2 text-sm font-semibold text-white bg-emerald-500 rounded-md hover:bg-emerald-600 transition"
          >
            Update Profile
          </button>
        </div>
      </SectionCard>
    </div>
  )
}