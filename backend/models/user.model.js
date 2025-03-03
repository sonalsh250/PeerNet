import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default:""
    },
    bannerImage: {
        type: String,
        default:""
    },
    headLine: {
        type: String,
        default:"PeerNet User"
    },
    location: {
        type: String,
        default:"PeerNet User"
    },
    College: {
        type: String,
        default:""
    },
    About: {
        type: String,
        default:""
    },
    skills:[String],
    Experience: {
        type: String,
        company: String,
        startDate: Date,
        endDate: Date,
        description: String
    },
    Education: [
        {
            school: String,
            fieldOfStudy: String,
            startDate: Number,
            endDate: Number
        }
    ],
    connection : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
},
{timestamps: true});

const User = mongoose.model("User", userSchema);
export default User;