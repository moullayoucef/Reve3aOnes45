const User = require("../model/User")
const Post = require("../model/Post");
const Comment = require("../model/Comment")


// le path fichier 
const generateFileUrl = (filename)=>{
    return process.env.URL + `/uploads/${filename}`
}
// creation de poblication 
const publie = async (req,res)=>{
    const {_id} = req.user._doc
    const {caption} = req.body
    const files = req.files;
    try {
        if (files.length > 4){
            return res.status(500).json('vous pouvez publie 4 publication a la fois au maximum')
        }
        const user = await User.findById(_id)
        if(!user){
            return res.status(404).json("not found")
        }
        const imageUrl= files.map((i)=>generateFileUrl(i.filename))
        const newpost = new Post({
            user : _id,
            caption,
            image: imageUrl
        })
        await newpost.save();
        user.post.push(newpost._id);
        await user.save();
        res.status(200).json("posted succefuly") 
    } catch (error) {
        res.status(500).json(error)
    }
}

// update post 

const updatepost  = async(req,res)=>{
    const {postId} = req.params
    const {caption} = req.body
    try {
        const findpost = await Post.findByIdAndUpdate(postId,{caption},{new : true})
        if (!findpost){
            return res.status(500).json("Post Not Found");
        }
        res.status(200).json("update successefuly");
    } catch (error) {
        res.status(500).json(error)
    }
}

//deletepost
const deletepost = async(req,res)=>{
    const { postId } = req.params
    try {
        const findpost = await Post.findByIdAndDelete(postId)
        if (!findpost){
            return res.status(404).json("User Not Found")
        }
        const uss = await User.findById(findpost.user)
        if(!uss){
            return res.status(404).json("user Not Found");
        }
        uss.post = uss.post.filter((i)=>i.toString()!== findpost._id.toString())
        await uss.save();
        res.status(200).json('user Deleted successefuly')
    } catch (error) {
        res.status(500).json(error)
    }
}
// get poste of users :

const userpost = async(req,res)=>{
    const {_id} = req.user._doc
    try {
        const user = await User.findById(_id)
        if(!user){
            return res.status(404).json("user Not Found")
        }
        const posts = user.post
        let total = {user: user.username, posts: [{}]}
        for (let i = 0 ; i<posts.length;i++){
            const postss = await Post.findById(posts[i])
            if (!postss){
                continue;
            }
            total.posts.push({caption: postss.caption, image : postss.image, likes : postss.likes.length})
        }
        res.status(200).json(total)

    } catch (error) {
        res.status(500).json(error)
    }
}

//like postes : 
const likepost = async(req,res)=>{
    const {postId} = req.params;
    const {_id} = req.user._doc
    try {
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json("Post Not Found");
        }
        if (post.likes.includes(_id)){
            return res.status(500).json("Déja liké ")
        }
        post.likes.push(_id);
        await post.save();
        res.status(201).json("likes successefuly")
    } catch (error) {
        res.status(500).json(error)
    }
}
// dislike post : 
const dislikepost = async(req,res)=>{
    const {postId } = req.params;
    const {_id} = req.user._doc
    try {
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json("Post Not Found");
        }
        if(!post.likes.includes(_id)){
            return res.status(404).json("vous avez pas likes cette publication ")
        }
        post.likes = post.likes.filter((i)=>i.toString()!==_id.toString())
        await post.save();
        res.status(200).json("Disliked ")
    } catch (error) {
        res.status(500).json(error)
    }
}



module.exports  = {publie,updatepost,deletepost, userpost, likepost, dislikepost}