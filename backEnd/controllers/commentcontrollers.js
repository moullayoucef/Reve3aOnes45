const Post = require("../model/Post");
const User = require("../model/User")
const Comment = require("../model/Comment");
const Notification = require("../model/notification");


const creatcomment =  async (req, res) => {
    console.log('je suis dans le commantaire ')
    const { postId } = req.params;
    const { _id } = req.user._doc;
    const { text } = req.body;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            res.status(404).json("Post Not Found");
        }
        const comment = new Comment({
            user: _id,
            post: postId,
            text
        });
        post.comments.push(comment._id);
        console.log(post)
        const user = await User.findById(_id);
        console.log(user)
        const newNotification = new Notification({
            user: user.username,
            type: 'comment',
            postId: postId
        });
        console.log("notificatino"+newNotification)
        const notuser = await User.findById(post.user);
        notuser.notification.push(newNotification._id);
        await newNotification.save();
        await notuser.save();
        await post.save();
        await comment.save();
        res.status(200).json("Commentaire ajouté");
    } catch (error) {
        res.status(500).json(error);
    }
}

//==========================
const updatecomment = async(req,res)=>{
    const {commentId} = req.params;
    const {text}= req.body
    try {
        const comment = await Comment.findByIdAndUpdate(commentId,{text},{new: true});
        if(!comment){
            res.status(404).json("comment Not Found");
        }
        res.status(200).json("Update success")
    } catch (error) {
        res.status(500).json(error)
    }
}

const deletecomment = async(req,res)=>{
    const {commentId} = req.params;
    try {
        const comment = await Comment.findByIdAndDelete(commentId)
        if(!comment){
            res.status(404).json("Comment Not Found")
        }
        const post = await Post.findById(comment.post);
        post.comments = post.comments.filter((i)=>i.toString()!== commentId.toString())
        await post.save()
        res.status(200).json("Comment deleted seccessefuly");
    } catch (error) {
        
    }
}



module.exports = {creatcomment,updatecomment,deletecomment}