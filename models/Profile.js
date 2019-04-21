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
    likes: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        }
    ],
    history: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model('Profile', ProfileSchema);