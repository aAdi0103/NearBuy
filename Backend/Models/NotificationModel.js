import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    receiver: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    sender: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    message: { 
      type: String, 
      required: true 
    },
    relatedPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
    },  
    status: { type: String, enum: ["sent", "pending", "accepted", "rejected"], default: "sent" },
    
    expiresAt: { 
      type: Date, 
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    sentAt: { 
      type: Date, 
      default: Date.now 
    }
  },
  { timestamps: true }
);

notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
