const jwt = require('jsonwebtoken');
const User = require('../model/User')

const usermidd = async (req, res,next) => {
    const token = req.cookies.token
    try {
    const decoded = jwt.verify(token, process.env.REFRESH);
    const user = await User.findById(decoded.id)
    if (!user) {
        res.status(404).json("user not found")
    }
    const {password , ...data} = user;
    req.user = data;
    next()
    } catch (error) {
    res.status(401).send({ error: 'Veuillez vous authentifier.' });
    }
};

module.exports = usermidd;
