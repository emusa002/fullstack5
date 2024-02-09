const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: false,
        default: ""
    },
    lastName: {
        type: String,
        required: false,
        default: "",
    },
    twitterUsername: {
        type: String,
        required: false,
        default: "",
    },
    avatarUrl: {
        type: String,
        required: false,
        default: "",
    },
    notes: {
        type: String,
        required: false,
        default: "",
    },
    favorite: {
        type: Boolean,
        required: false,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Duplicate the ID field.
ContactSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
ContactSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Contact', ContactSchema);
