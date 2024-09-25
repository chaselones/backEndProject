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
        const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        // Optionally, store refresh token in DB
        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true }); // Store refresh token in httpOnly cookie
        res.json({ accessToken });
    },

    // refresh token logic:

    refresh: async (req, res) => {
        const { jwt: refreshToken } = req.cookies;

        if (!refreshToken) return res.sendStatus(401);

        try {
            const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const user = await User.findById(payload.id);

            if (!user || user.refreshToken !== refreshToken) {
                return res.sendStatus(403); // Invalid refresh token
            }

            // Generate new access token
            const newAccessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
            res.json({ accessToken: newAccessToken });
        } catch (error) {
            res.sendStatus(403);
        }
    },

    logout: async (req, res) => {
        const { jwt: refreshToken } = req.cookies;

        if (!refreshToken) return res.sendStatus(204); // No content

        const user = await User.findOne({ refreshToken });
        if (user) {
            user.refreshToken = null; // Invalidate refresh token
            await user.save();
        }

        res.clearCookie('jwt', { httpOnly: true, secure: true });
        res.json({ message: 'Logged out' });
    },

    // forgot password logic:
    passwordReset: async (req, res) => {
        console.log("implement this feature.")
    }
}