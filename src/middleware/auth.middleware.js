const jwt = require('jsonwebtoken');
const { User } = require('../models/user.model');

module.exports = {
    authJWT: async (req, res, next) => {

        const { accessToken, refreshToken } = req.session;

        if (accessToken) {
            jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
                if (err) {
                    if (!refreshToken) return res.sendStatus(401);
                    jwt.verify(refreshToken, process.env.REFRESH_SECRET, async (err, user) => {
                        if (err) return res.sendStatus(401);
                        const userData = await User.findById(user.id);
                        // make sure refresh tokens match:
                        if (userData.refreshToken !== refreshToken) return res.sendStatus(401);
                        // generate new access token:
                        const newAccessToken = jwt.sign({ id: userData.id, name: userData.username, role: userData.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
                        req.session.accessToken = newAccessToken;

                        next();
                    });
                } else {
                    req.user = user;
                    next();
                }
            });
        } else {
            if (!refreshToken) return res.sendStatus(401);
            jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
                if (err) return res.sendStatus(401);
                const newAccessToken = jwt.sign({ id: user.id, name: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
                req.session.accessToken = newAccessToken;
                next();
            });
        }
    },

    isAdmin: (req, res, next) => {
        if (req.user.role !== 'admin') return res.sendStatus(403);
        next();
    }
}