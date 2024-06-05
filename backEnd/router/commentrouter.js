const express = require("express")
const router = express.Router();
const User = require("../model/User");
const Comment = require("../model/Comment");
const usermidd= require("../middlewere/userMidd");
const Post = require("../model/Post");
const Notification = require("../model/notification")
const {creatcomment,updatecomment,deletecomment}= require("../controllers/commentcontrollers");



//crée un commentaire : 
router.post("/create/:postId", usermidd, creatcomment);

// update comment 

router.put("/update/:commentId",updatecomment)

//delete a Commentaire : 
router.delete("/delete/:commentId",deletecomment,deletecomment)

// get commentaire :

router.get("/getcomment/:postId",async (req,res)=>{
    const {postId}= req.params;
    try {
        const findpost = await Post.findById(postId);
        if (!findpost){
            return res.status(404).json("post not found");
        }
        const commentaire = findpost.comments;
        console.log(commentaire)
        let total = {commentaires: [{}]}
        console.log(total)
        for (let i = 0 ; i<commentaire.length;i++){
            const commentss = await Comment.findById(commentaire[i])
            if (!commentss){
                continue;
            }
            const userf = await User.findById(commentss.user);
            console.log("je suis user"+userf)
            total.commentaires.push({user : userf.username ,text :commentss.text })
        }
        res.status(201).json(total);
    } catch (error) {
        res.status(500).json({message : "erreur dans la recuperation des commentaires"})
    }
})














module.exports = router