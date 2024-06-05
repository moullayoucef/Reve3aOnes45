const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// ============================================= sign ===================================
const sign = async(req,res)=>{
    const {username, email, password,usertype} = req.body
    console.log(username, email, password,usertype)
    try {
        const found = await User.findOne({$or:[{username},{email}]})
        if (found){
            return res.status(401).json({message : "user deja existant"});
        }
        const passhash =await  bcrypt.hash(password,10);
        const userad = await User.create({
            username,
            email, 
            password : passhash,
            usertype
        })
        console.log(userad)
        const refreshtoken = jwt.sign({
                id : userad._id
        },process.env.REFRESH,{expiresIn: "7d"})
        res.cookie("token",refreshtoken,{
            httpOnly: true,
            secure : true , 
            sameSite: "none",
            maxAge : 1000 * 60 * 60 * 24 * 7
        })
        res.json(userad.username)
    } catch (error) {
        res.status(500).json(error)
    }
}

//========================================== login ======================================
const login = async(req,res)=>{
    const {password} = req.body
    try {
        let found;
        if (req.body.email) {
            found = await User.findOne({ email: req.body.email });
        } else {
            found = await User.findOne({ username: req.body.username });
        }
        if (!found){
            return res.status(401).json({message: 'email not found'})
        }
        const just = await bcrypt.compare(password,found.password);
    if(!just){
        return res.json({error: "mot de passe incorrecte"})
    }
    const refreshtoken = jwt.sign({
            id : found._id
    },process.env.REFRESH,{expiresIn: "7d"})
    res.cookie("token",refreshtoken,{
        httpOnly: true,
        secure : true , 
        sameSite: "none",
        maxAge : 1000 * 60 * 60 * 24 * 7
    })
    res.json({message : "je suis bien connecté ",
    username : found.username
})
} catch (error) {
    res.status(500).json(error)
}
}
//  ================================================= logout ===================================

const logout = async(req,res)=>{
    try {
        res.clearCookie("token",{sameSite: "none",secure : true}).status(200).json("logout success")
    } catch (error) {
        res.status(500).json(erro)
    }
}
// ============================ forget_password =================================
const forget_password = async(req,res)=>{
    const {email}= req.body;
    try {
        const found = await User.findOne({email})
        if (!found){
            return res.status(404).json({message : "utilisateur not found"})
        }
        const secret = process.env.REFRESH + found.password
        const token = jwt.sign({email : found.email , id : found._id},secret , {expiresIn : '10m'})
        const link = `http://localhost:5000/auth/reset-password/${found._id}/${token}`
        // envoie d'un email
        const nodemailer = require('nodemailer');
    
    // Créez un transporteur SMTP pour Outlook
    const transporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });
    
    // Options de l'e-mail
    const mailOptions = {
        from: process.env.EMAIL,
        to: found.email,
        subject: 'mot de passe oublier',
        text: ` clique sur ce link pour changer votre mot de passe \n${link} \n \nmerci beaucoup `
    };
    
    // Envoyer l'e-mail
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
            return res.json({error})
        } else {
            console.log('E-mail envoyé avec succès :', info.response);
        }
    });
    
          // fin de la procedure d'envoi des email
        res.status(200).json({message:" je suis bien envoyer"})
    } catch (error) {
        res.status(400).json({err : error})
    }
    }
// ==========================================reset ==================================
const reset = async(req,res)=>{
    const {id,token} = req.params;
    const found = await User.findOne({_id : id});
    if(!found){
        return res.status(404).json({message : "user not Found"})
    }
    const secret = process.env.REFRESH + found.password
    try {
        const verfie = jwt.verify(token, secret)
        res.send('verivied')
    } catch (error) {
        res.send('Not Verify')
    }
}
//+============================================== reset password ================================
const reset_password = async(req,res)=>{
    const {id,token}=req.params
    const found = await User.findOne({_id : id})
    if (!found){
        return res.status(404).json({message : "user not found"})
    }
    const secret = process.env.REFRESH + found.password
    try {
        const veref = jwt.verify(token,secret)
        const { password , confpass } = req.body
        if (password !== confpass){
            return res.json({message : "il ne sont pas les meme"})
        }
        const hash = await bcrypt.hash(password , 10)
        const newuser = await User.findOneAndUpdate({email: veref.email},{password :hash})
        res.send(newuser)
    } catch (error) {
        res.json(error)
    }

}

module.exports = {sign, login , logout,forget_password,reset_password , reset}