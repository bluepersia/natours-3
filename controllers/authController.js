const User = require ('../models/userModel');
const asyncHandler = require ('express-async-handler');
const jwt = require ('jsonwebtoken');
const AppError = require ('../utils/AppError');
const util = require ('util');
const sendEmail = require ('../utils/email');
const crypto = require ('crypto');

function signToken (id)
{
    return jwt.sign ({id}, process.env.JWT_SECRET, { expiresIn: process.JWT_EXPIRY});
}

function signSend (user, res, statusCode = 200)
{
    const token = signToken (user.id);

    res.cookie ('jwt', token, {
        expires: new Date (Date.now() + (process.env.JWT_COOKIE_EXPIRY * 24 * 60 * 60 * 1000)),
        secure: process.env.NODE_ENV == 'production',
        httpOnly: true
    })

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


exports.restrictTo = function (...roles)
{
    return (req, res, next) => {
        
        if (!roles.includes (req.user.role))
            throw new AppError ('You do not have permission', 403);
        
        next ();
    }
}

exports.forgotPassword = asyncHandler (async (req, res) =>
{
    const user = await User.findOne ({email: req.body.email});

    if (!user)
        throw new AppError ('There is no user with this email', 404);

    const resetToken = user.createPasswordResetToken ();
    await user.save ({validateBeforeSave: false});

    const resetUrl = `${req.protocol}://${req.get ('host')}/api/v1/users/resetPassword/${token}`;
    
    try{
        sendEmail (user.email, 'Reset password', `Reset password at ${resetUrl}`);
    } 
    catch (err)
    {
        throw new AppError ('Something went wrong sending the email. Try again later.', 500)
    }
    res.status (200).json ({
        status: 'success',
        message: 'Token was sent!'
    })
});

exports.resetPassword = asyncHandler (async (req, res) => {

    const token = crypto.createHash ('sha256').update (req.params.token).digest ('hex');

    const user = await User.findOne ({passwordResetToken: token, passwordResetExpiry: { $gt: Date.now ()}});

    if (!user)
        throw new AppError ('Invalid token or has expired.', 400);

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpiry = undefined;

    await user.save ();

    signSend (user, res, 200);
});


exports.updateMyPassword = asyncHandler (async (req, res) =>{

    const user = await User.findById (req.user.id).select ('+password');

    if (!await user.comparePassword(req.body.passwordCurrent, user.password))
        throw new AppError ('Invalid password.', 401);

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save ();

    signSend (user, res, 200);
});






