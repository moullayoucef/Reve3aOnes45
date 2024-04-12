const express = require("express")
const router = express.Router();
const User = require("../model/User");
const Comment = require("../model/Comment");
const usermidd= require("../middlewere/userMidd");
const Post = require("../model/Post");

//crée un commentaire : 
router.post("/create/:postId",usermidd, async(req,res)=>{
    const {postId } = req.params ;
    const {_id} = req.user._doc
    const {text} = req.body;
    try {
        const post = await Post.findById(postId);
        if(!post){
            res.status(404).json("Post Not Found");
        }
        const comment = new Comment({
            user : _id,
            post : postId,
            text
        })
        post.comments.push(comment._id)
        await post.save();
        await comment.save();
        res.status(200).json("commentaire ajouter")
    } catch (error) {
        res.status(500).json(error)
    }
})
// update comment 

router.put("/update/:commentId",async(req,res)=>{
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
})

//delete a Commentaire : 
router.delete("/delete/:commentId",async(req,res)=>{
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
})














module.exports = router