import React from 'react'
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import ProfileHeader from './ProfileHeader';

function EditProfile() {

  const { id } = useParams();
const queryClient = useQueryClient();

const { data: authUser, isLoading } = useQuery({
  queryKey: ["authUser"],
});

const { data: userProfile, isLoading: isUserProfileLoading, error } = useQuery({
  queryKey: ["userProfile", id],
  queryFn: () => axiosInstance.get(`/users/${id}`).then(res => res.data),
  enabled: !!id, // Fetch only when id is defined
  onError: (err) => console.error("Error fetching user profile:", err),
});


const { mutate: updateProfile } = useMutation({
	mutationFn: async (updatedData) => {
		const response = await axiosInstance.put("/users/updateUser", updatedData);
		return response.data; // Return updated user data
	},
	onSuccess: (updatedUser) => {
		toast.success("Profile updated successfully");

		// ✅ Update the "userProfile" cache instantly
		queryClient.setQueryData(["userProfile", id], (oldData) => ({
			...oldData,
			...updatedUser, // Merge updated data
		}));

		// ✅ If it's the logged-in user, update "authUser" cache too
		queryClient.setQueryData(["authUser"], (oldAuthUser) => {
			if (oldAuthUser && oldAuthUser._id === updatedUser._id) {
				return { ...oldAuthUser, ...updatedUser };
			}
			return oldAuthUser;
		});

		// Optional: Invalidate to ensure consistency
		queryClient.invalidateQueries(["userProfile", id]);
		queryClient.invalidateQueries(["authUser"]);
	},
});



  if (isLoading || isUserProfileLoading) return null;

  const isOwnProfile = authUser._id === userProfile._id;
	const userData = isOwnProfile ? authUser : userProfile;


  const handleSave = (updatedData) => {
		updateProfile(updatedData);
	};
  


  return (
		<div className='max-w-4xl mx-auto p-4'>
			<ProfileHeader userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
			
		</div>
  )
}

export default EditProfile
