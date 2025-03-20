import { useState } from 'react'

const AboutSection = ({ userData, isOwnProfile, onSave }) => {
  const [about, setAbout] = useState(userData?.About || '') // Ensuring it handles missing data

  const handleSave = () => {
    if (about.trim()) {
      onSave({ About: about })
    }
  }

  return (
    <div className="mb-6 rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold">About</h2>
      <textarea
        value={about}
        onChange={(e) => setAbout(e.target.value)}
        className="w-full rounded border p-2"
        rows="4"
        placeholder="Write something about yourself..."
      />
      <button
        onClick={handleSave}
        className="bg-primary hover:bg-primary-dark mt-2 rounded bg-blue-600 px-4 py-2 text-white transition duration-300"
      >
        Save
      </button>
    </div>
  )
}

export default AboutSection
