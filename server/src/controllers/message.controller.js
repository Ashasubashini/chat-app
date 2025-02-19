import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getusers = async (req, res) => {
    try {
        const loggedInUser = req.user_id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUser } }).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getusers: ", error.message);
        res.status(500).json({ message: "Something went wrong" });
    }
};
export const getMessages = async (req, res) => {
    try {
        const { id: userTChatId } = req.params;
        const myId = req.user_id;

        // Validate if both IDs are valid ObjectIds
        if (!mongoose.Types.ObjectId.isValid(userTChatId) || !mongoose.Types.ObjectId.isValid(myId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const message = await Message.find({
            $or: [
                { senderId: new mongoose.Types.ObjectId(myId), receiverId: new mongoose.Types.ObjectId(userTChatId) },
                { senderId: new mongoose.Types.ObjectId(userTChatId), receiverId: new mongoose.Types.ObjectId(myId) },
            ],
        });

        res.status(200).json(message);
    } catch (error) {
        console.log("Error in getMessages: ", error.message);
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const {text, image, video} = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user_id;

        let imageurl;
        let videourl;

        if (image, video) {
            const uploadedResponse = await cloudinary.uploader.upload(image, video);
            imageurl = uploadedResponse.secure_url;
            videourl = uploadedResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageurl,
            video: videourl,
        });

        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage: ", error.message);
        res.status(500).json({ message: "Something went wrong" });
    }
};
