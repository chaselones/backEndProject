const mongoose = require('mongoose');
const { Schema } = mongoose;


// TODO, decide on actual user schema.
// for now, just plugging things in...
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    }
},
{
    timestamps: true,
    collection: 'users'
});

module.exports = mongoose.model('User', userSchema);