const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('./../model/userModel');

exports.protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return res.status(200).json({
            status: 'error',
            message: 'You are not Logged In'
        });
    }

    const verify = await promisify(jwt.verify)(token, process.env.SECRET_HASH_KEY);

    const freshUser = await User.findById(verify.id);
    if (!freshUser) {
        return res.status(400).json({
            status: 'error',
            message: 'User doesn\'t exist'
        });
    }
    console.log('reached');
    req.user = freshUser;
    next();
};