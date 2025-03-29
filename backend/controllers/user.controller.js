import User from "../models/user.model.js"
import cloudinary from "../lib/cloudinary.js";

export const getSuggestedConnections = async(req, res) => {
    try {
        const currentUser = await User.findById(req.user._id).select("connections"); 

        //find users who are not already connect and also not our own profile
        const suggestedUser = await User.find({ 
            _id: { 
                $ne: req.user._id, $nin: currentUser.connections 
            }  //ne=not equals to, nin=not in
        }).select("name username profilePicture college headline").limit(3);
        res.json(suggestedUser);
    } catch (error) {
        console.error("Error in getSuggestedConnections controller", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const getPublicProfile = async(req, res) => {
    try {
        const user = await User.findOne({username: req.params.username}).select("-password");
        if(!user)
        {
            return res.status(404).json({message: "User not found"});
        }
        res.json(user);
    } catch (error) {
        console.error("Error in getPublicProfile controller", error);
        res.status(500).json({message: "Internal server error"});
    }
};

export const updateProfile = async(req, res) => {
    try {
        console.log("Request Body:", req.body);
        const allowedFields = [
            "name",
            "username",
            "headline",
            "about",
            "location",
            "college",
            "profilePicture",
            "bannerImg",
            "skills",
            "experience",
            "education"
        ];
        const updatedData = {};

        for(const field of allowedFields)
        {
            if(req.body[field])
            {
                updatedData[field] = req.body[field];
            }
        }

        //profile and banner image change
        if(req.body.profilePicture)
        {
            //upload profile picture to cloudinary and get back it's url
            const result = await cloudinary.uploader.upload(req.body.profilePicture);
            updatedData.profilePicture = result.secure_url;
        }
        if(req.body.bannerImg)
            {
                //upload profile picture to cloudinary and get back it's url
                const result = await cloudinary.uploader.upload(req.body.bannerImg);
                updatedData.bannerImg = result.secure_url;
            }
        const user = await User.findByIdAndUpdate(req.user._id, {$set: updatedData}, {new: true}).select("-password");
        
        res.json(user);
    } catch (error) {
        console.error("Error in updateProfile controller: ", error);
        res.status(500).json({message: "Internal server error"});
    }
};