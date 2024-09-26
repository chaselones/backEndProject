const jwt = require('jsonwebtoken');

module.exports = {
    authJWT: (req, res, next) => {

        const { accessToken, refreshToken } = req.session;

        if (accessToken) {
            jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
                if (err) {
                    if (!refreshToken) return res.sendStatus(401);
                    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
                        if (err) return res.sendStatus(401);
                        const newAccessToken = jwt.sign({ id: user.id, name: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
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