const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

module.exports = function(req, res, next) {
    let token = req.headers["authorization"];

    if (token) {
        jwt.verify(token, keys.secret, function(err, decoded) {
            if (err) {
                res.json({
                    success: false,
                    message: 'Failer to authenticate token'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.status(403).json({
            success: false,
            message: 'No token provided'
        });
    }
}