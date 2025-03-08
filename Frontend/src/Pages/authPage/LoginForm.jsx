import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const LoginForm = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const queryClient = useQueryClient();

	const { mutate: loginMutation, isLoading } = useMutation({
		mutationFn: (userData) => axiosInstance.post("/auth/login", userData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError: (err) => {
			toast.error(err.response.data.message || "Something went wrong");
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		loginMutation({ username, password });
	};

	return (
		<form
  onSubmit={handleSubmit}
  className="space-y-6 w-full max-w-md p-6 bg-white shadow-lg rounded-2xl border border-gray-200"
>
  <h2 className="text-2xl font-semibold text-center text-gray-800">
    Welcome Back!
  </h2>
  <p className="text-sm text-gray-500 text-center">
    Enter your credentials to access your account.
  </p>

  <div className="relative">
    <input
      type="text"
      placeholder="Username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
      required
    />
  </div>

  <div className="relative">
    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
      required
    />
  </div>

  <button
    type="submit"
    className="w-full py-3 text-white font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 transition-transform transform hover:scale-105"
  >
    {isLoading ? <Loader className="size-5 animate-spin mx-auto" /> : "Login"}
  </button>

  <p className="text-sm text-gray-500 text-center">
    Don't have an account?{" "}
    <a href="/signup" className="text-blue-500 hover:underline">
      Sign Up
    </a>
  </p>
</form>

	);
};
export default LoginForm;
