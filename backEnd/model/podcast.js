const mongoose = require("mongoose");
const audioSchema = new mongoose.Schema({
    filename: String,
    path: String,
    size: Number
});
const Audio = mongoose.model('Audio', audioSchema);
module.exports = Audio ;
