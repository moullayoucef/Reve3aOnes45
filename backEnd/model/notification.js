const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {type : String }, 
    type: { type: String, enum: ['like', 'comment', 'other'] }, 
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }, 
    createdAt: { type: Date, default: Date.now } 
});

const notification = mongoose.model('Notification', notificationSchema);

module.exports = notification;
