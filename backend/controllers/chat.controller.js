import Chat from '../models/chat.model.js';
import User from '../models/user.model.js';
import mongoose from 'mongoose';

export const getChats = async (req, res) => {
    try {
        const chats = await Chat.find({
            participants: req.user._id
        }).populate('participants', 'name profilePicture username')
          .populate('latestMessage')
          .sort({ updatedAt: -1 });

        res.status(200).json(chats);
    } catch (error) {
        console.error("Error in getChats controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createChat = async (req, res) => {
    try {
        const { receiverId } = req.body;
        
        if (!mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        // Check if users are connected
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if chat already exists
        const existingChat = await Chat.findOne({
            participants: { $all: [req.user._id, receiverId] }
        });

        if (existingChat) {
            return res.status(200).json(existingChat);
        }

        const newChat = new Chat({
            participants: [req.user._id, receiverId]
        });

        await newChat.save();

        // Populate participants before sending response
        const populatedChat = await Chat.findById(newChat._id)
            .populate('participants', 'name profilePicture username');

        res.status(201).json(populatedChat);
    } catch (error) {
        console.error("Error in createChat controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { chatId } = req.params;

        const chat = await Chat.findById(chatId)
            .populate({
                path: 'messages',
                populate: {
                    path: 'sender',
                    select: 'name profilePicture username'
                }
            });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        // Check if user is a participant
        if (!chat.participants.includes(req.user._id)) {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        res.status(200).json(chat.messages);
    } catch (error) {
        console.error("Error in getMessages controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { chatId, content } = req.body;

        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        // Check if user is a participant
        if (!chat.participants.includes(req.user._id)) {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        const newMessage = {
            sender: req.user._id,
            content,
            timestamp: new Date()
        };

        chat.messages.push(newMessage);
        chat.latestMessage = newMessage;
        await chat.save();

        // Populate the sender info before sending response
        const populatedMessage = {
            ...newMessage._doc,
            sender: {
                _id: req.user._id,
                name: req.user.name,
                profilePicture: req.user.profilePicture,
                username: req.user.username
            }
        };

        res.status(201).json(populatedMessage);
    } catch (error) {
        console.error("Error in sendMessage controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};