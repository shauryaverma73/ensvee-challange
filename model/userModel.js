const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Username is Required']
    },
    email: {
        type: String,
        required: [true, 'Email ID is Required'],
        validate: [validator.isEmail, 'Enter Correct Email']
    },
    password: {
        type: String,
        required: [true, 'Username is Required']
    },
    confirmPassword: {
        type: String,
        required: [true, 'Confirm Password is Required'],
        validate: {
            validator: function (el) {
                return el == this.password;
            },
            message: 'Confirm Password and Password are not same'
        }
    }
});

userSchema.pre('save', async function () {
    this.password = await bcrypt.hash(this.password, 12);
    console.log(this.password);
    this.confirmPassword = undefined;
});

userSchema.methods.checkPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('Users', userSchema);
module.exports = User;