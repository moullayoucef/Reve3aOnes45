const User = require("../model/User")
const Post = require("../model/Post");
const Comment = require("../model/Comment")
const Notification = require("../model/notification");


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
        const imagetype = files.map((i)=>i.mimetype)
        if(imagetype.length==0){
            imagetype.push("text")
        }
        const newpost = new Post({
            user : _id,
            caption,
            image: imageUrl,
            type : imagetype,
        })
        await newpost.save();
        user.post.push(newpost._id);
        await user.save();
        res.status(200).json({id : newpost._id, message : "le poste est crée"}) 
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
            total.posts.push({caption: postss.caption, image : postss.image,type : postss.type, likes : postss.likes.length})
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
        const user = await User.findById(_id);
        const newNotification = new Notification({
            user: user.username,
            type: 'like',
            postId: postId
        });
        const notuser = await User.findById(post.user)
        console.log(notuser)
        notuser.notification.push(newNotification._id)
        console.log(notuser)
        await newNotification.save();
        await notuser.save();
        console.log('je suis presque a la fin ')
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
const savepost = async(req,res)=>{
    const { _id }= req.user._doc
    const {postId} = req.params
    try {
        const user = await User.findById(_id);
        if(!user){
            res.status(404).json("user Not found")
        }
        console.log(user)
        user.postSauv.push(postId);
        res.status(200).json({message: "Post saved"}) 
        await user.save();
    } catch (error) {
        res.status(500).json(error)
    }
}
//===============================================

const getsavepost = async(req,res)=>{
    const {_id} = req.user._doc
    try {
        const user = await User.findById(_id)
        if(!user){
            return res.status(404).json("user Not Found")
        }
        const posts = user.postSauv
        console.log(posts)
        console.log(posts[0])
        let total = {posts: [{}]}
        for (let i = 0 ; i<posts.length;i++){
            const postss = await Post.findById(posts[i])
            console.log(postss)
            if (!postss){
                continue;
            }
            const userf = await User.findById(postss.user);
            total.posts.push({user : userf.username , caption: postss.caption, image : postss.image,type : postss.type, likes : postss.likes.length})
        }
        res.status(200).json(total)

    } catch (error) {
        res.status(500).json(error)
    }
}
// ===========================================

const deletesave = async(req,res)=>{
    const { postId } = req.params
    const {_id}= req.user._doc
    try {
        const user = await User.findById(_id)
        if(!user){
            return res.status(404).json("user Not Found")
        }
        user.postSauv = user.postSauv.filter((i)=>i.toString()!== postId.toString())
        await user.save();
        res.status(200).json('poste desaved ')
    } catch (error) {
        res.status(500).json(error)
    }
}

const getallpost = async (req, res) => {
    try {
        // Récupérer tous les posts depuis la base de données et peupler le champ 'user' avec le nom de l'utilisateur associé
        const posts = await Post.find().populate({
            path: 'user',
            select: 'username', // Sélectionnez uniquement le champ 'name' de l'utilisateur
            options: { sort: { createdAt: -1 } } 
        });

        // Vérifier si aucun post n'a été trouvé
        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: 'Aucun post trouvé.' });
        }

        // Préparer les données à retourner, incluant le nom de l'utilisateur, le lien de l'image du post et le type de l'image
        const postData = posts.map(post => ({
            userName: post.user.username,
            imageUrl: post.image, // Supposons que le lien de l'image est stocké dans le champ 'image' du post
            imageType: post.type, // Supposons que le type de l'image est stocké dans le champ 'imageType' du post
            time : post.createdAt
        }));

        // Envoyer les données au client
        res.status(200).json(postData);
    } catch (error) {
        // Gérer les erreurs
        res.status(500).json({ message: 'Erreur lors de la récupération des posts.', error: error });
    }
}



module.exports  = {publie,updatepost,deletepost, userpost, likepost, dislikepost,savepost,getsavepost,deletesave,getallpost}