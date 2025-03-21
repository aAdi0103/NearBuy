import { Link } from 'react-router-dom'
import LoginForm from './LoginForm'

const LoginPage = () => {
  return (
    <div className="flex min-h-screen flex-col justify-center sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
       <div className='flex items-center flex-col justify-center'>
       <img className="mx-auto w-[20vw] mt-7" src="/src/assets/NearBuy.svg" alt="NearBuy" />
       </div>
        <h2 className="text-center text-2xl font-bold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-6 shadow-md sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <LoginForm />
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">New to LocoHub?</span>
              </div>
            </div>
            <div className="mt-2">
              <Link
                to="/signup"
                className="flex w-full justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm hover:bg-gray-50"
              >
                Join now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default LoginPage
