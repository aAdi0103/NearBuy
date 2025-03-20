import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '../../lib/axios'
import { toast } from 'react-hot-toast'
import { Loader } from 'lucide-react'

const SignUpForm = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [location, setlocation] = useState({
    area: '',
    city: '',
    state: '',
    country: '',
  })
  const [password, setPassword] = useState('')

  const queryClient = useQueryClient()

  const { mutate: signUpMutation, isLoading } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post('/auth/signup', data)
      return res.data
    },
    onSuccess: () => {
      toast.success('Account created successfully')
      queryClient.invalidateQueries({ queryKey: ['authUser'] })
    },
    onError: (err) => {
      console.log('We have an error')
      toast.error(err.response.data.message || 'Something went wrong')
    },
  })

  const handleSignUp = (e) => {
    e.preventDefault()
    signUpMutation({ name, location, email, password })
  }
  const handleLocationChange = (e) => {
    setlocation({ ...location, [e.target.name]: e.target.value })
  }

  return (
    <form
      onSubmit={handleSignUp}
      className="flex w-full max-w-md flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
    >
      <h2 className="mb-[-16px] text-center text-2xl font-semibold text-gray-800">
        Create Your Account
      </h2>
      <p className="text-center text-sm text-gray-500">Join us today! It's quick and easy.</p>

      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <input
        type="text"
        name="area"
        placeholder="Area"
        value={location.area}
        onChange={handleLocationChange}
        className="input input-bordered w-full"
        required
      />

      <input
        type="text"
        name="city"
        placeholder="City"
        value={location.city}
        onChange={handleLocationChange}
        className="input input-bordered w-full"
        required
      />

      <input
        type="text"
        name="state"
        placeholder="State"
        value={location.state}
        onChange={handleLocationChange}
        className="input input-bordered w-full"
        required
      />

      <input
        type="text"
        name="country"
        placeholder="Country"
        value={location.country}
        onChange={handleLocationChange}
        className="input input-bordered w-full"
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <input
        type="password"
        placeholder="Password (6+ characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:from-indigo-600 hover:to-blue-500 disabled:opacity-50"
      >
        {isLoading ? <Loader className="mx-auto size-5 animate-spin" /> : 'Agree & Join'}
      </button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <a href="/login" className="font-medium text-blue-500 hover:underline">
          Sign In
        </a>
      </p>
    </form>
  )
}
export default SignUpForm
