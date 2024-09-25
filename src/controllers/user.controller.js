// Bring in the User model
const User = require('../models/user.model');

module.exports = {
    create: async(req, res)=>{
        const { username, email, password } = req.body;

        try{
            const user = await User.create({ username, email, password });
            res.status(201).json({ user });
        } catch(err){
            res.status(400).json({ message: err.message });
        }
    }
}