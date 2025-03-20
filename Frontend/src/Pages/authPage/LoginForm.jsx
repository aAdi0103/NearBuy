import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { axiosInstance } from '../../lib/axios'
import toast from 'react-hot-toast'
import { Loader } from 'lucide-react'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const queryClient = useQueryClient()

  const { mutate: loginMutation, isLoading } = useMutation({
    mutationFn: (userData) => axiosInstance.post('/auth/login', userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] })
    },
    onError: (err) => {
      toast.error(err.response.data.message || 'Something went wrong')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    loginMutation({ email, password })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
    >
      <h2 className="mb-[-18px] text-center text-2xl font-semibold text-gray-800">Welcome Back!</h2>
      <p className="text-center text-sm text-gray-500">
        Enter your credentials to access your account.
      </p>

      <div className="relative">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-shadow focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="relative">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-shadow focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full transform rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 py-3 font-semibold text-white shadow-md transition-transform hover:scale-105 hover:from-blue-600 hover:to-indigo-700"
      >
        {isLoading ? <Loader className="mx-auto size-5 animate-spin" /> : 'Login'}
      </button>

      <p className="text-center text-sm text-gray-500">
        Don't have an account?{' '}
        <a href="/signup" className="text-blue-500 hover:underline">
          Sign Up
        </a>
      </p>
    </form>
  )
}
export default LoginForm
