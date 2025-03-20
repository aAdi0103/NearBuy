import { useState } from 'react'

const EditContact = ({ userData, isOwnProfile, onSave }) => {
  const [phoneNumber, setPhoneNumber] = useState(userData?.Phone || '')

  const handleSave = () => {
    onSave({ Phone: phoneNumber })
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Edit Contact</h2>
      <input
        type="tel"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Enter your phone number"
        className="w-full rounded-lg border p-2"
      />
      <button
        onClick={handleSave}
        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
      >
        Save
      </button>
    </div>
  )
}

export default EditContact
