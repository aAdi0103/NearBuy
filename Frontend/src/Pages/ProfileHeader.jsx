import React, { useState } from 'react'
import { MapPin, Camera } from 'lucide-react'

function ProfileHeader({ userData, onSave }) {
  const [editedData, setEditedData] = useState(userData)

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditedData((prev) => ({
          ...prev,
          profilePic: reader.result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-row items-start gap-x-8 rounded-xl bg-gradient-to-br from-white to-gray-50 p-8 shadow-2xl">
      {/* Profile Picture Upload */}
      <div className="relative flex-shrink-0">
        <div className="relative h-32 w-32">
          <img
            className="h-32 w-32 rounded-full object-cover shadow-xl ring-4 ring-white"
            src={editedData.profilePic || ''}
            alt={editedData.name}
          />
          <label className="absolute bottom-0 right-0 translate-x-2 translate-y-2 transform cursor-pointer rounded-full bg-white p-2.5 shadow-lg transition-all duration-300 hover:bg-gray-50 group-hover:scale-110">
            <Camera size={20} className="text-gray-600" />
            <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
          </label>
        </div>
      </div>

      {/* Profile Details Section */}
      <div className="flex-grow space-y-6">
        {/* Name Input */}
        <div className="relative">
          <input
            type="text"
            value={editedData.name}
            onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
            className="focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-lg font-semibold outline-none transition-all duration-300 focus:ring-2"
            placeholder="Your Name"
          />
        </div>

        {/* Role Input */}
        <div className="relative">
          <input
            type="text"
            value={editedData.role ?? 'User'}
            onChange={(e) => setEditedData({ ...editedData, role: e.target.value })}
            className="focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-600 outline-none transition-all duration-300 focus:ring-2"
            placeholder="Your Role"
          />
        </div>

        {/* Location Inputs */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-500">
            <MapPin size={18} />
            <span className="text-sm font-medium">Location Details</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <input
              type="text"
              value={editedData.location?.area || ''}
              onChange={(e) =>
                setEditedData({
                  ...editedData,
                  location: { ...editedData.location, area: e.target.value },
                })
              }
              className="focus:border-primary focus:ring-primary/20 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-600 outline-none transition-all duration-300 focus:ring-2"
              placeholder="Area"
            />
            <input
              type="text"
              value={editedData.location?.city || ''}
              onChange={(e) =>
                setEditedData({
                  ...editedData,
                  location: { ...editedData.location, city: e.target.value },
                })
              }
              className="focus:border-primary focus:ring-primary/20 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-600 outline-none transition-all duration-300 focus:ring-2"
              placeholder="City"
            />
            <input
              type="text"
              value={editedData.location?.state || ''}
              onChange={(e) =>
                setEditedData({
                  ...editedData,
                  location: { ...editedData.location, state: e.target.value },
                })
              }
              className="focus:border-primary focus:ring-primary/20 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-600 outline-none transition-all duration-300 focus:ring-2"
              placeholder="State"
            />
            <input
              type="text"
              value={editedData.location?.country || ''}
              onChange={(e) =>
                setEditedData({
                  ...editedData,
                  location: { ...editedData.location, country: e.target.value },
                })
              }
              className="focus:border-primary focus:ring-primary/20 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-600 outline-none transition-all duration-300 focus:ring-2"
              placeholder="Country"
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          className="bg-primary hover:bg-primary/90 focus:ring-primary/20 mt-4 w-full transform rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 focus:ring-4"
          onClick={() => onSave(editedData)}
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}

export default ProfileHeader
