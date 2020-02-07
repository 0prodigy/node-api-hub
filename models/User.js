const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    }, 
    avatar: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
}
);

module.exports = users = mongoose.model('users', UserSchema);