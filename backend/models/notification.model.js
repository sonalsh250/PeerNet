import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
	{
		recipient: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		type: {
			type: String,
			required: true,
			enum: ["like", "comment", "connectionAccepted"],
            //it can be like, comment, connectionAccepted notification
		},
		relatedUser: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
            //from which user the notification is coming from
		},
		relatedPost: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
		},
		read: {
			type: Boolean,
			default: false,
            //whether the notification has been viewed or not
		},
	},
	{ timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;