const { mongoose } = require('../config/dbConnection');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    refreshToken: { type: String, default: null }, // Optional for JWT refresh tokens
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    // This just means if the password is not modified, then skip this step
    this.password = await bcrypt.hash(this.password, 12); // Salt rounds
    next();
});

// Compare password during login
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;


/*
EXMAPLE JSON DATA:

{
    "username": "john",
    "email": "johnboy@gmail.com",
    "password": "password",
    "role": "admin"
}

*/