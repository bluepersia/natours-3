const mongoose = require ('mongoose');
const bcrypt = require ('bcryptjs');

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
        minlength: 8,
        select: false
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
        },
        select: false
    }
})

userSchema.pre ('save', async function (next)
{
    if (this.isModified ('password'))
        this.password = await bcrypt.hash (this.password,  12);

    this.passwordConfirm = undefined;

    next ();
})

userSchema.methods.comparePassword (function (raw, encrypted)
{
   
});

const User = mongoose.model ('User', userSchema);

module.exports = User;