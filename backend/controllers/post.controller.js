import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js"; //notification

export const getFeedPosts = async(req, res) => {
    try {
        //take posts from users that we are connected with from req.users.connections
        const posts = await Post.find({ author: { $in: req.user.connections } })
        .populate("author", "name username profilePicture college headline")
        .populate("comments.user", "name profilePicture")
        .sort({createdAt: - 1});

        res.status(200).json(posts);
    } catch (error) {
        console.log("Error in getFeedPosts controller", error);
        res.status(500).json({message: "Internal server error"});
    }
};

export const createPosts = async(req, res) => {
    try {
        const {content, image} = req.body; 

        let newPost;
        if(image)
        {
            const imgResult = await cloudinary.uploader.upload(image);
            newPost = new Post({
                author: req.user._id,
                content,
                image: imgResult.url
            });
        }
        else
        {
            newPost = new Post({
                author: req.user._id,
                content
            });
        }

        await newPost.save();

        res.status(201).json(newPost); //resource has been created
    } catch (error) {
        console.log("Error in createPosts controller", error);
        res.status(500).json({message: "Internal server error"});
    }
};

export const deletePosts = async(req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if(!post)
        {
            return res.status(404).json({message: "Post not found"});
        }

        //check if the current user is the author of the post
        if(post.author.toString() !== userId.toString())
        {
            return res.status(403).json({message: "You can only delete your own posts"});
        }

        //if post has an image, it needs to be deleted from cloudinary too 
        if(post.image)
        {
            //when we upload an image, a ural is generated and stored. 
            //this url contains the id of the picture
            //delete the image depending on that id

            await cloudinary.uploader.destroy(post.image.split("/").pop().split(".")[0]);
        }

        await Post.findByIdAndDelete(postId);
        res.status(200).json({message: "Post deleted successfully"});
    } catch (error) {
        console.log("Error in deletePosts controller", error);
        res.status(500).json({message: "Internal server error"});
    }
};

export const getPostById = async(req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId)
        .populate("author", "name username profilePicture college headline")
        .populate("comments.user", "name profilePicture");

        res.status(200).json(post);
    } catch (error) {
        console.log("Error in getPostById controller", error);
        res.status(500).json({message: "Internal server error"});
    }
};

export const createComment = async(req, res) => {
    try {
        const postId = req.params.id;
        const {content} = req.body;

        const post = await Post.findByIdAndUpdate(
            postId, {
                $push: {comments: {user: req.user._id, content}},
            },
            {new: true}
        ).populate("author", "name email username profilePicture college headline");

        //create a notification for the comment
        if(post.author.toString() !== req.user._id.toString())
        {
            const newNotification = new Notification ({
                receipient: post.author,
                type: "comment",
                relatedUser: req.user._id,
                relatedPost: post._id
            });
            await newNotification.save();
            try {
               // send email
               const postUrl = process.env.CLIENT_URL + "/post/" + postId;
               await sendCommentNotificatioEmail(post.author.email, post.author.name, req.user.name, postUrl, content);
            } catch (error) {
                console.log("Error in sendCommentNotificatioEmail", error);
            }
        }
        res.status(200).json(post);
    } 
    catch (error) {
        console.log("Error in createComment controller", error);
        res.status(500).json({message: "Internal server error"});
    }
};