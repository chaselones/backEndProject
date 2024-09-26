const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

module.exports = {
    login: async (req, res) => {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate Access and Refresh Tokens
        const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_SECRET, { expiresIn: '7d' });

        // the reason we store the refresh token in the database is to invalidate it when the user logs out.
        user.refreshToken = refreshToken;
        await user.save();

        // res.cookie('jwt', refreshToken, { httpOnly: true, secure: true }); // Store refresh token in httpOnly cookie
        // store acces and refresh tokens in session:
        req.session.accessToken = accessToken;
        req.session.refreshToken = refreshToken;

        res.json({ accessToken });
    },

    // refresh token logic:
    // no need for refresh token logic, as we store it in the session.
    // we have a middleware that automatically refreshes the access token!

    logout: async (req, res) => {
        const { refreshToken } = req.session;

        if (!refreshToken) return res.sendStatus(204); // No content

        const user = await User.findOne({ refreshToken });
        if (user) {
            user.refreshToken = null; // Invalidate refresh token
            await user.save();
        }

        req.session = null; // Clear session
        res.json({ message: 'Logged out' });
    },

    // forgot password logic:
    passwordReset: async (req, res) => {
        console.log("implement this feature.")
    }
}