const express = require("express");
const router = express.Router();
const uploadpost = require("../middlewere/uploadpost")
const usermidd = require("../middlewere/userMidd");
const {publie , updatepost,deletepost,userpost,likepost, dislikepost} = require("../controllers/postcontroller")
const User = require("../model/User")
const Post = require("../model/Post")
const Comment = require("../model/Comment")

// API OF POST : 

router.post("/create",usermidd,uploadpost.array("Post",5),publie )

router.put("/update/:postId",updatepost)

router.delete("/delete/:postId",deletepost)

router.get("/userpost",usermidd,userpost)

router.put("/likes/:postId",usermidd,likepost)

router.put("/dislikes/:postId",usermidd,dislikepost)



module.exports = router