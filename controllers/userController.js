// login, logout, signup, getUser
const User = require('./../model/userModel');
const jwt = require('jsonwebtoken');

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(200).json({
                status: 'error',
                message: 'Please enter Email and Password.'
            });
        }

        const user = await User.findOne({ email }).select('+password');
        const checkedUserPassword = user.checkPassword(password, user.password);

        if (!user || !checkedUserPassword) {
            return res.status(200).json({
                status: 'error',
                message: 'Incorrect Email and Password.'
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET_HASH_KEY, {
            expiresIn: process.env.EXPIRES_IN
        });

        res.cookie('jwt', token, {
            expires: new Date(Date.now() + process.env.EXPIRES_IN * 24 * 60 * 60 * 1000),
            httpOnly: true
        });

        res.status(200).json({
            status: 'success',
            token
        });
    }
    catch (err) {
        console.log(err);
        res.status(200).json({
            status: 'error',
            message: 'Error'
        });
    }
};

exports.logout = (req, res, next) => {
    res.cookie('jwt', 'loggedOut', {
        expiresIn: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({
        status: 'success',
    });
};

exports.signUp = async (req, res, next) => {
    try {
        const newUser = await User.create({
            fullName: req.body.fullName,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
        });

        const token = jwt.sign({ id: newUser._id }, process.env.SECRET_HASH_KEY, {
            expiresIn: process.env.EXPIRES_IN
        });

        res.cookie('jwt', token, {
            expires: new Date(Date.now() + process.env.EXPIRES_IN * 24 * 60 * 60 * 1000),
            httpOnly: true
        });

        res.status(200).json({
            status: 'success',
            token,
            // data: newUser
        });

    } catch (err) {
        console.log(err);
        res.status(400).json({
            status: 'error',
            error: err
        });
    }
};

exports.getUser = async (req, res, next) => {
    const users = await User.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        data: users
    });
};