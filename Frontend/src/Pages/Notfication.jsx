import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { ExternalLink, Eye, MessageSquare, ThumbsUp, XCircle , UserPlus,CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
	FaArrowLeft,
  } from 'react-icons/fa'
const Notification = () => {
	const navigate = useNavigate()
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });

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
		<div className='grid grid-cols-1 lg:grid-cols-4 mt-8 gap-6'>
			
			
			<div className='col-span-1 lg:col-span-3'>
				<div className='bg-white rounded-lg shadow p-6'>
					<h1 className='text-2xl font-bold mb-6'>Notifications</h1>

					{isLoading ? (
						<p>Loading notifications...</p>
					) : notifications && notifications.data.notifications.length > 0 ? (
						<ul>
							{notifications.data.notifications.map((notification) => (
								<li
									key={notification._id}
									className={`bg-white border rounded-lg p-4 my-4 transition-all hover:shadow-md ${
										!notification.read ? "border-blue-500" : "border-gray-200"
									}`}
								>
									<div className='flex items-start justify-between'>
										<div className='flex items-center space-x-4'>
											<Link to={`/profile/${notification.sender.email}`}>
											</Link>

											<div>
												<div className='flex items-center gap-2'>
													
												</div>
												<p className='text-xs text-gray-500 mt-1'>
													{formatDistanceToNow(new Date(notification.createdAt), {
														addSuffix: true,
													})}
												</p>
											</div>
										</div>

										<div className='flex gap-2'>

                                        <div className="flex items-center gap-2">
  {/* Accept Button */}
  <button
    onClick={() => markAsReadMutation(notification._id)}
    className={`flex items-center gap-x-1 px-2 py-1 rounded transition-colors ${
      notification.status === "accepted"
        ? "bg-green-100 text-green-600 cursor-not-allowed"
        : "bg-blue-100 text-blue-600 hover:bg-blue-200"
    }`}
    aria-label="Accept notification"
    disabled={notification.status === "accepted"}
  >
    <CheckCircle size={16} />
    <span>{notification.status === "accepted" ? "Accepted" : "Accept"}</span>
  </button>

  {/* Reject Button */}
  <button
    onClick={() => markAsRejectMutation(notification._id)}
    className={`flex items-center gap-x-1 px-2 py-1 rounded transition-colors ${
      notification.status === "rejected"
        ? "bg-gray-200 text-gray-600 cursor-not-allowed"
        : "bg-red-100 text-red-600 hover:bg-red-200"
    }`}
    aria-label="Reject notification"
    disabled={notification.status === "rejected"}
  >
    <XCircle size={16} />
    <span>{notification.status === "rejected" ? "Rejected" : "Reject"}</span>
  </button>
</div>



										</div>
									</div>
								</li>
							))}
						</ul>
					) : (
						<p>No notification at the moment.</p>
					)}
				</div>
			</div>
		</div>
		</>
	);
};

export default Notification;
