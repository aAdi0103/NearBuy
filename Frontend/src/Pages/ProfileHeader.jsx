import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { MapPin, Camera } from "lucide-react";

function ProfileHeader({ userData, onSave, isOwnProfile }) {
  
  
	const [isEditing, setIsEditing] = useState(false);
	const [editedData, setEditedData] = useState({});
	const queryClient = useQueryClient();
	console.log(userData)
  console.log(editedData)

	const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const handleImageChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setEditedData((prev) => ({ ...prev, [event.target.name]: reader.result }));
			};
			reader.readAsDataURL(file);
		}
	};


  const handleSave = () => {
		onSave(editedData);
		setIsEditing(false);
	};

  return (
    <div className="bg-slate-400">


<div className='relative -mt-20 mb-4 bg-red-400'>
					<img
						className='w-32 h-32 rounded-full mx-auto object-cover'
						src={editedData.profilePic || userData.profilePic || ""}
						alt={userData.name}
					/>

					{isEditing && (
						<label className='absolute bottom-0 right-1/2 transform translate-x-16 bg-white p-2 rounded-full shadow cursor-pointer'>
							<Camera size={20} />
							<input
								type='file'
								className='hidden'
								name='profilePic'
								onChange={handleImageChange}
								accept='image/*'
							/>
						</label>
					)}
				</div>


     {isEditing ? (
						<input
							type='text'
							value={editedData.name ?? userData.name}
							onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
							className='text-2xl font-bold mb-2 text-center w-full'
						/>
					) : (
						<h1 className='text-2xl font-bold mb-2'>{userData.name}</h1>
					)}

{isEditing ? (
  <input
    type="text"
    value={editedData.role ?? userData.role ?? "User"}
    onChange={(e) => setEditedData({ ...editedData, role: e.target.value })}
    className="text-gray-600 text-center w-full"
  />
) : (
  <p className="text-gray-600">{userData.role ?? "User"}</p>
)}

<div className='flex flex-col items-center mt-2'>
  <MapPin size={16} className='text-gray-500 mb-1' />
  
  {isEditing ? (
    <div className="flex flex-col gap-1">
      <input
        type='text'
        value={editedData.location?.city ?? userData.location.city}
        onChange={(e) =>
          setEditedData({
            ...editedData,
            location: {
              city: e.target.value,
              state: editedData.location?.state ?? userData.location.state,
              country: editedData.location?.country ?? userData.location.country,
            },
          })
        }
        className='text-gray-600 text-center border rounded p-1'
        placeholder='Enter City'
      />
      <input
        type='text'
        value={editedData.location?.state ?? userData.location.state}
        onChange={(e) =>
          setEditedData({
            ...editedData,
            location: {
              city: editedData.location?.city ?? userData.location.city,
              state: e.target.value,
              country: editedData.location?.country ?? userData.location.country,
            },
          })
        }
        className='text-gray-600 text-center border rounded p-1'
        placeholder='Enter State'
      />
      <input
        type='text'
        value={editedData.location?.country ?? userData.location.country}
        onChange={(e) =>
          setEditedData({
            ...editedData,
            location: {
              city: editedData.location?.city ?? userData.location.city,
              state: editedData.location?.state ?? userData.location.state,
              country: e.target.value,
            },
          })
        }
        className='text-gray-600 text-center border rounded p-1'
        placeholder='Enter Country'
      />
    </div>
  ) : (
    <span className='text-gray-600 text-center'>
      {userData.location.city}, {userData.location.state}, {userData.location.country}
    </span>
  )}
</div>


{isOwnProfile ? (
					isEditing ? (
						<button
							className='w-full bg-primary text-blue-700 py-2 px-4 rounded-full hover:bg-primary-dark
							 transition duration-300'
							onClick={handleSave}
						>
							Save Profile
						</button>
					) : (
						<button
							onClick={() => setIsEditing(true)}
							className='w-full bg-primary text-yellow-600 py-2 px-4 rounded-full hover:bg-primary-dark
							 transition duration-300'
						>
							Edit Profile
						</button>
					)
				) : (
					<div className='flex justify-center'>{renderConnectionButton()}</div>
				)}
    </div>
  );
}

export default ProfileHeader;
