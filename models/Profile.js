const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    gender: {
        type: String,
        required: true
    },
    preference: {
        type: String,
        required: true
    },
    biography: {
        type: String,
        required: true
    },
    tags: {
        type: [String]
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    history: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    gps: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Profile', ProfileSchema);