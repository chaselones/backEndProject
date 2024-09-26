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
    },

    list: async(req, res)=>{
        try{
            const users = await User.find();
            res.json({ users });
        } catch(err){
            res.status(400).json({ message: err.message });
        }
    },

    read: async(req, res)=>{
        const { id } = req.params;

        try{
            const user = await User.findById(id);
            res.json({ user });
        } catch(err){
            res.status(400).json({ message: err.message });
        }
    },

    update: async(req, res)=>{
        const { id } = req.params;
        const { username, email, password } = req.body;

        try{
            const user = await User.findByIdAndUpdate
            (id, { username, email, password }, { new: true });
            res.json({ user });
        } catch(err){
            res.status(400).json({ message: err.message });
        }
    },
    
    delete: async(req, res)=>{
        const { id } = req.params;

        try{
            await User.findByIdAndDelete(id);
            res.sendStatus(204);
        } catch(err){
            res.status(400).json({ message: err.message });
        }
    }
}