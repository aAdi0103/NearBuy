import React from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '../lib/axios'
import ProfileHeader from './ProfileHeader'
import { toast } from 'react-hot-toast'
import EditContact from './EditContact'
import {useNavigate } from 'react-router-dom'
import {
	FaArrowLeft,
  } from 'react-icons/fa'
function EditProfile() {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data: authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
  })

  const {
    data: userProfile,
    isLoading: isUserProfileLoading,
    error,
  } = useQuery({
    queryKey: ['userProfile', id],
    queryFn: () => axiosInstance.get(`/users/${id}`).then((res) => res.data),
    enabled: !!id,
    onError: (err) => console.error('Error fetching user profile:', err),
  })

  const { mutate: updateProfile } = useMutation({
    mutationFn: async (updatedData) => {
      const response = await axiosInstance.put('/users/updateUser', updatedData)
      return response.data
    },
    onSuccess: (updatedUser) => {
      toast.success('Profile updated successfully')

      queryClient.setQueryData(['userProfile', id], (oldData) => ({
        ...oldData,
        ...updatedUser,
      }))

      queryClient.setQueryData(['authUser'], (oldAuthUser) => {
        if (oldAuthUser && oldAuthUser._id === updatedUser._id) {
          return { ...oldAuthUser, ...updatedUser }
        }
        return oldAuthUser
      })

      // Optional: Invalidate to ensure consistency
      queryClient.invalidateQueries(['userProfile', id])
      queryClient.invalidateQueries(['authUser'])
    },
  })

  if (isLoading || isUserProfileLoading) return null

  const isOwnProfile = authUser._id === userProfile._id
  const userData = isOwnProfile ? authUser : userProfile

  const handleSave = (updatedData) => {
    console.log(updatedData)
    updateProfile(updatedData)
  }
  console.log(authUser)

  return (
    <>
    <button
                          onClick={() => navigate(-1)}
                          className="text-black-700 absolute left-8 top-8 flex items-center transition-all hover:text-blue-900"
                        >
                          <FaArrowLeft className="text-md mr-2" /> <span className="font-medium">Back</span>
                        </button>
    <div className="mx-auto flex max-w-4xl flex-col gap-8 p-4">
      <ProfileHeader userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
      <EditContact userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
    </div>
    </>
  )
}

export default EditProfile
