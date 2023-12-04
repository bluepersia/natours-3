const User = require ('../models/userModel');
const asyncHandler = require ('express-async-handler');
const jwt = require ('jsonwebtoken');
const AppError = require ('../utils/AppError');

function signToken (id)
{
    return jwt.sign ({id}, process.env.JWT_SECRET, { expiresIn: process.JWT_EXPIRY});
}

function signSend (user, res, statusCode = 200)
{
    const token = signToken (user.id);

    user.password = undefined;

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

exports.login = asyncHandler (async (req, res)=> {

    const {email, password} = req.body;

    if (!email || !password)
        throw new AppError ('Please provide an email and password', 400);

    const user = await User.findOne({email}).select ('+password');

    if (!await user.comparePassword (password, user.password))
        throw new AppError ('Incorrect password', 401);

    signSend (user, res, 200);
});





