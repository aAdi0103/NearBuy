import React, { useState } from "react";
import { MapPin, Camera } from "lucide-react";

function ProfileHeader({ userData, onSave }) {

  const [editedData, setEditedData] = useState(userData);


  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedData((prev) => ({
          ...prev,
          profilePic: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-2xl max-w-3xl mx-auto flex flex-row gap-x-8 items-start">

  {/* Profile Picture Upload */}
  <div className="relative flex-shrink-0">
    <div className="relative w-32 h-32">
      <img
        className="w-32 h-32 rounded-full object-cover ring-4 ring-white shadow-xl"
        src={editedData.profilePic || ""}
        alt={editedData.name}
      />
      <label className="absolute bottom-0 right-0 transform translate-x-2 translate-y-2 bg-white p-2.5 rounded-full shadow-lg cursor-pointer hover:bg-gray-50 transition-all duration-300 group-hover:scale-110">
        <Camera size={20} className="text-gray-600" />
        <input
          type="file"
          className="hidden"
          onChange={handleImageChange}
          accept="image/*"
        />
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
        className="w-full px-4 py-3 text-lg font-semibold bg-white rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 outline-none"
        placeholder="Your Name"
      />
    </div>

    {/* Role Input */}
    <div className="relative">
      <input
        type="text"
        value={editedData.role ?? "User"}
        onChange={(e) => setEditedData({ ...editedData, role: e.target.value })}
        className="w-full px-4 py-2.5 text-gray-600 bg-white rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 outline-none"
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
          value={editedData.location?.city || ""}
          onChange={(e) =>
            setEditedData({
              ...editedData,
              location: { ...editedData.location, city: e.target.value },
            })
          }
          className="px-4 py-2.5 text-gray-600 bg-white rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 outline-none"
          placeholder="City"
        />
        <input
          type="text"
          value={editedData.location?.state || ""}
          onChange={(e) =>
            setEditedData({
              ...editedData,
              location: { ...editedData.location, state: e.target.value },
            })
          }
          className="px-4 py-2.5 text-gray-600 bg-white rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 outline-none"
          placeholder="State"
        />
        <input
          type="text"
          value={editedData.location?.country || ""}
          onChange={(e) =>
            setEditedData({
              ...editedData,
              location: { ...editedData.location, country: e.target.value },
            })
          }
          className="px-4 py-2.5 text-gray-600 bg-white rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 outline-none"
          placeholder="Country"
        />
      </div>
    </div>

    {/* Save Button */}
    <button
      className="w-full mt-4 px-6 py-3 bg-primary text-white bg-blue-600 font-medium rounded-xl hover:bg-primary/90 transform hover:-translate-y-0.5 transition-all duration-300 focus:ring-4 focus:ring-primary/20"
      onClick={() => onSave(editedData)}
    >
      Save Changes
    </button>
  </div>

</div>

  );
}

export default ProfileHeader;