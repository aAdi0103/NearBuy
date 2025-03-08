import { Link } from "react-router-dom";
import SignForm from "./SignForm";

const SignPage = () => {
	return (
		<div className='min-h-screen flex flex-col mt-[-8vh] justify-center sm:px-6 lg:px-8'>
			<div className='sm:mx-auto sm:w-full sm:max-w-md'>
				<img className='mx-auto h-32 w-auto' src='/logo.svg' alt='LinkedIn' />
			</div>
			<div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md shadow-md'>
				<div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
					<SignForm />

					<div className='mt-6'>
						<div className='relative'>
							<div className='absolute inset-0 flex items-center'>
								<div className='w-full border-t border-gray-300'></div>
							</div>
							<div className='relative flex justify-center text-sm'>
								<span className='px-2 bg-white text-gray-500'>Already on LinkedIn?</span>
							</div>
						</div>
						<div className='mt-2'>
							<Link
								to='/login'
								className='w-full flex justify-center px-4 border border-transparent rounded-md shadow-sm text-md font-bold text-blue-600 bg-white hover:bg-gray-50'
							>
								Log in
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default SignPage;
