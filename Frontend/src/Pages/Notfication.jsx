import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { XCircle,CheckCircle} from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from 'react-icons/fa';

const Notification = () => {
	const navigate = useNavigate();
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
   console.log(authUser._id)
	const queryClient = useQueryClient();

	const { data: notifications, isLoading } = useQuery({
		queryKey: ["notifications"],
		queryFn: () => axiosInstance.get("/notifications"),
	});
	console.log(notifications)

	const { mutate: markAsReadMutation } = useMutation({
		mutationFn: (id) => axiosInstance.put(`/notifications/accepted/${id}`),
		onSuccess: () => {
			queryClient.invalidateQueries(["notifications"]);
		},
	});

	const { mutate: markAsRejectMutation } = useMutation({
		mutationFn: (id) => axiosInstance.put(`/notifications/rejected/${id}`),
		onSuccess: () => {
			queryClient.invalidateQueries(["notifications"]);
		},
	});


	return (
		<>
			<button
				onClick={() => navigate(-1)}
				className="text-black-700 absolute left-5 top-4 flex items-center transition-all hover:text-blue-900"
			>
				<FaArrowLeft className="text-md mr-2" /> <span className="font-medium">Back</span>
			</button>
			<div className='grid grid-cols-1 lg:grid-cols-4 mt-8 gap-6 p-4 sm:p-6'>
				<div className='col-span-1 lg:col-span-3'>
					<div className='bg-white rounded-lg shadow p-4 sm:p-6'>
						<h1 className='text-xl sm:text-2xl font-bold mb-4 sm:mb-6'>Notifications</h1>

						{isLoading ? (
							<p>Loading notifications...</p>
						) : notifications && notifications.data.notifications.length > 0 ? (
							<ul>
								{notifications.data.notifications.map((notification) => (
									<li
										key={notification._id}
										className={`bg-white border rounded-lg p-4 my-4 transition-all hover:shadow-md flex flex-col sm:flex-row sm:justify-between sm:items-center ${
											!notification.read ? "border-blue-500" : "border-gray-200"
										}`}
									>
										<div className='flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4'>
											<p className='text-sm sm:text-base'>{notification.message}</p>
											<p className='text-xs text-gray-500'>{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</p>
										</div>

										<div className='flex gap-2 mt-2 sm:mt-0'>
											<button
												onClick={() => markAsReadMutation(notification._id)}
												className={`flex items-center gap-x-1 px-2 py-1 rounded transition-colors text-sm ${
													notification.status === "accepted"
														? "bg-green-100 text-green-600 cursor-not-allowed"
														: "bg-blue-100 text-blue-600 hover:bg-blue-200"
												}`}
												disabled={notification.status === "accepted"}
											>
												<CheckCircle size={16} />
												<span>{notification.status === "accepted" ? "Accepted" : "Accept"}</span>
											</button>
											<button
												onClick={() => markAsRejectMutation(notification._id)}
												className={`flex items-center gap-x-1 px-2 py-1 rounded transition-colors text-sm ${
													notification.status === "rejected"
														? "bg-gray-200 text-gray-600 cursor-not-allowed"
														: "bg-red-100 text-red-600 hover:bg-red-200"
												}`}
												disabled={notification.status === "rejected"}
											>
												<XCircle size={16} />
												<span>{notification.status === "rejected" ? "Rejected" : "Reject"}</span>
											</button>
											
										</div>
									</li>
								))}
							</ul>
						) : (
							<p>No notifications at the moment.</p>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default Notification;