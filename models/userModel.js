const mongoose = require ('mongoose');
const bcrypt = require ('bcryptjs');
const crypto = require ('crypto');

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
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpiry: String
})

userSchema.pre ('save', async function (next)
{
    if (this.isModified ('password'))
        this.password = await bcrypt.hash (this.password,  12);

    this.passwordConfirm = undefined;

    next ();
})

userSchema.methods.comparePassword = async function (raw, encrypted)
{
    return await bcrypt.compare (raw, encrypted);
};


userSchema.methods.hasPasswordChangedAfter = function (iat)
{
    if (this.passwordChangedAt)
        return this.passwordChangedAt.getTime() / 1000 > iat;

    return false;
};

userSchema.methods.createPasswordResetToken = function ()
{
    const resetToken = crypto.randomBytes (32).toString ('hex');
    
    this.passwordResetToken = crypto.createHash ('sha256').update(resetToken).digest ('hex';
    this.passwordResetExpiry = Date.now () + (7 * 24 * 60 * 60 * 1000);
    
    return resetToken;
};

const User = mongoose.model ('User', userSchema);

module.exports = User;