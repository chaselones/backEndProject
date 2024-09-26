const jwt = require('jsonwebtoken');

module.exports = {
    authJWT: (req, res, next) => {
        // get tokens from session:
        const token = req?.session?.accessToken;

        if (!token) return res.sendStatus(401);

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user; // Attach user data to request
            next();
        });
    },

    isAdmin: (req, res, next) => {
        if (req.user.role !== 'admin') return res.sendStatus(403);
        next();
    },

    isUser: (req, res, next) => {
        if (req.user.role !== 'user') return res.sendStatus(403);
        next();
    }


}