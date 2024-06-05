const express = require("express");
const router = express.Router();
const uploadpost = require("../middlewere/uploadpost")
const usermidd = require("../middlewere/userMidd");
const User = require("../model/User")
const Post = require("../model/Post")
const Comment = require("../model/Comment")

const {publie , updatepost,deletepost,userpost,likepost, dislikepost,savepost,getsavepost,deletesave,getallpost} = require("../controllers/postcontroller")
// API OF POST : 

router.post("/create",usermidd,uploadpost.array("Post",5),publie )

router.put("/update/:postId",updatepost)

router.put("/savepost/:postId",usermidd,savepost)

router.get("/savedpost",usermidd,getsavepost)

router.delete("/deletesave/:postId",usermidd,deletesave)

router.get("/allpost",getallpost)

router.delete("/delete/:postId",deletepost)

router.get("/userpost",usermidd,userpost)

router.put("/likes/:postId",usermidd,likepost)

router.put("/dislikes/:postId",usermidd,dislikepost)



module.exports = router