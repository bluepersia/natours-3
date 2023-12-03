const mongoose = require ('mongoose');

const userSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: [true, 'Please provide your name']
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, 'Please provide your email']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function (val)
            {
                return val == this.password;
            },
            message: 'Passwords do not match!'
        }
    }
})

const User = mongoose.model ('User', userSchema);

module.exports = User;