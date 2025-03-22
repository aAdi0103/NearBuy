import { Link } from 'react-router-dom'
import SignForm from './SignForm'

const SignPage = () => {
  return (
    <div className="mt-[-8vh] flex min-h-screen flex-col justify-center sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <img className="mx-auto w-[20vw] mt-20" src="/NearBuy.svg" alt="NearBuy" />
      </div>
      <div className="mt-8 shadow-md sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <SignForm />

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Already on NearBuy?</span>
              </div>
            </div>
            <div className="mt-2">
              <Link
                to="/login"
                className="text-md flex w-full justify-center rounded-md border border-transparent bg-white px-4 font-bold text-blue-600 shadow-sm hover:bg-gray-50"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default SignPage
