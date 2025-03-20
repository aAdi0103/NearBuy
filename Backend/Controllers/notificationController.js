import Notification from "../Models/notificationModel.js";
import mongoose from "mongoose";


export const createNotification = async (req, res) => {
    try {
      const { receiver, sender, message, relatedPost } = req.body;

      if (!mongoose.Types.ObjectId.isValid(receiver) || !mongoose.Types.ObjectId.isValid(sender)) {
        return res.status(400).json({ error: "Invalid receiver or sender ID" });
      }
  
      const notification = new Notification({
        receiver,
        sender,
        message,
        relatedPost,
      });
  
      await notification.save();
  
      return res.status(201).json({ success: true, notification });
    } catch (error) {
      console.error("Error creating notification:", error);
      return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  };

  export const status = async (req,res) => {
    try {
        const { userId, postId } = req.params;
        // Find the latest notification related to the booking request
        const booking = await Notification.findOne({
          receiver: userId, // The authenticated user
          relatedPost: postId,
        }).sort({ createdAt: -1 }); // Sort by latest request
    
        if (!booking) {
          return res.status(200).json({ status: "not_requested" });
        }
    
        return res.status(200).json({ status: booking.status });
      } catch (error) {
        console.error("Error fetching booking status:", error);
        res.status(500).json({ message: "Internal server error" });
      }
  }

   export const getUserNotifications = async (req, res) => {
    try {
       const userId = req.user._id;
      // Find all notifications where the user is the receiver, sorted by most recent
      const notifications = await Notification.find({ receiver: userId }).sort({ createdAt: -1 });
  
      if (!notifications || notifications.length === 0) {
        return res.status(200).json({ message: "No notifications found", notifications: [] });
      }
      return res.status(200).json({ notifications });
    } catch (error) {
      console.error("Error fetching user notifications:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  


  export const markNotificationAsAccepted = async (req, res) => {
	const {id} = req.params;
	try {
		const notification = await Notification.findOneAndUpdate(
			{ _id: id, receiver: req.user._id },
			{ status: "accepted" }, 
			{ new: true }
		);

		if (!notification) {
			return res.status(404).json({ message: "Notification not found or unauthorized" });
		}

		res.json(notification);
	} catch (error) {
		console.error("Error in markNotificationAsAccepted controller:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};


export const markNotificationAsRejected = async (req, res) => {
	const { id } = req.params;

	try {
		const notification = await Notification.findOneAndUpdate(
			{ _id: id, receiver: req.user._id }, 
			{ status: "rejected" },
			{ new: true }
		);

		if (!notification) {
			return res.status(404).json({ message: "Notification not found or unauthorized" });
		}

		res.json(notification);
	} catch (error) {
		console.error("Error in markNotificationAsRejected controller:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};


