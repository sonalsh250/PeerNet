import Notification from "../models/notification.model.js";
export const getUserNotifications = async(req, res) => {
    try { 
        //req.user._id means current user id
        //sort({createdAt: -1}) to see latest notifications at the top
        const notifications = await Notification.find({recipient: req.user._id}).sort({createdAt: -1})
        .populate("relatedUser", "name username profilePicture")
        .populate("relatedPost", "content image"); //post title and image

        res.status(200).json(notifications);
    } catch (error) {
        console.log("Error in getUserNotifications controller", error);
        res.status(500).json({message: "Internal server error"}); 
    }
};

export const markNotificationAsRead = async(req, res) => {
    const notificationId = req.params.id;
    try {
        const notification = await Notification.findByIdAndUpdate(
            {_id: notificationId, recipient: req.user._id}, //filter
            {read: true}, //mark as unread
            {new: true} //return the new value
        );

        res.json(notification);
    } catch (error) {
        console.log("Error in markNotificationAsRead controller", error);
        res.status(500).json({message: "Internal server error"});
    }
};

export const deleteNotification = async (req, res) => {
	const notificationId = req.params.id;

	try {
		await Notification.findOneAndDelete({
			_id: notificationId,
			recipient: req.user._id,
		});

		res.json({ message: "Notification deleted successfully" });
	} catch (error) {
        console.error("error in deleteNotification controller", error);
		res.status(500).json({ message: "Server error" });
	}
};