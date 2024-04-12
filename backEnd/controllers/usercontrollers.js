const User = require("../model/User")
const Post = require("../model/Post")
const Comment = require("../model/Comment")




// get user by id
const getUserId = async(req,res)=>{
    const {userId}= req.params
    console.log("user :",userId)
    try {
        console.log('je suis dans try')
        const found = await User.findById(userId);
        console.log(found)
        if (!found){
            return res.status(404).json("not found")
        }
        const { password , ...data} = found._doc;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json(error)
    }
}

// update user
const updateUser = async (req, res) => {
    const { _id } = req.user._doc
    console.log(req.user)
    const updatedData = req.body;
    try {
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).json({ error: "User not found" }); 
        }
        if(req.body.email){
            const found= await User.findOne({email : req.body.email})
            if(found){
                return res.status(500).json("email est deja utilisé")
            }
        }
        if(req.body.username){
            const found = await User.findOne({username : req.body.username})
            if (found){
                return res.status(500).json("username deja utilisé")
            }
        }
        Object.assign(user, updatedData);
        await user.save(); 
        res.status(200).json({ message: "Update success" }); 
    } catch (error) {
        res.status(500).json({ error: error.message }); 
    }
}
// delete user 
const deleteUser = async (req, res) => {
    const {_id} = req.user._doc;
    try {
        const user = await User.findByIdAndDelete(_id);
        if (!user) {
            return res.status(404).json("user not found");
        }
        await Post.deleteMany({ user: user._id });
        await Post.deleteMany({ "comments.user": user._id });
        await Comment.deleteMany({ user: user._id });
        await Post.updateMany({ likes: user._id }, { $pull: { likes: user._id } });
        res.status(200).json("user deleted successfully");
    } catch (error) {
        res.status(500).json(error);
    }
};

// generate file function 
const generateFileUrl = (filename)=>{
    return process.env.URL + `/uploads/${filename}`
}


// uploadprofile picture 
const uploadprofilepicture = async(req,res)=>{
    const { _id }= req.user._doc
    const {filename}= req.file
    try {
        const user = await User.findByIdAndUpdate(_id,{profilePicture:generateFileUrl(filename)},{new:true});
        if(!user){
            res.status(404).json("user Not found")
        }
        res.status(200).json({message: "profile picture upload",user})
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports =  {getUserId, updateUser,deleteUser,uploadprofilepicture}