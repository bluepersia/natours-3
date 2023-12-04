const User = require ('../models/userModel');
const asyncHandler = require ('express-async-handler');
const jwt = require ('jsonwebtoken');

function signToken (id)
{
    return jwt.sign ({id}, process.env.JWT_SECRET, { expiresIn: process.JWT_EXPIRY});
}

function signSend (user, res, statusCode = 200)
{
    const token = signToken (user.id);

    res.statusCode (statusCode).json ({
        status: 'success',
        token,
        data: {
            user
        }
    })
}
exports.signup = asyncHandler (async (req, res) => {

    const { email, password, passwordConfirm} = req.body;
    const user = await User.create ({email, password, passwordConfirm});

    signSend (user, res, 201);

});