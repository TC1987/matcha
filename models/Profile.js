const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
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
    likes: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            }
        }
    ],
    views: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            }
        }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model('Profile', ProfileSchema);