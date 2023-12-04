const User = require ('../models/userModel');
const asyncHandler = require ('express-async-handler');
const jwt = require ('jsonwebtoken');
const AppError = require ('../utils/AppError');
const util = require ('util');

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


exports.protect = asyncHandler (async (req, res, next) => {

    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith ('Bearer'))
        token = req.headers.authorization.split (' ')[1];

    if (!token)
        throw new AppError ('You are not logged in. Please log in to get access.', 401);

    
    const decoded = await util.promisify (jwt.verify)(token, process.env.JWT_SECRET);

    const user = await User.findById (decoded.id);

    if (!user)
        throw new AppError ('The user who this token belongs to no longer exists.', 401);

    if (user.hasPasswordChangedAfter (decoded.iat))
        throw new AppError ('The password has changed since the token was issued.', 401);

    req.user = user;
    next ();
});



