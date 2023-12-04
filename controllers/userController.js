const asyncHandler = require ('express-async-handler');
const AppError = require ('../utils/AppError');
const User = require ('../models/userModel');

exports.updateMe = asyncHandler (async (req, res) => {

    if (req.body.password || req.body.passwordConfirm)
        throw new AppError ('This route is not for passwords. Use /updateMyPassword instead', 400);

    function filter (obj)
    {
        const include = ['name', 'email'];
        const newObj = {}
        include.forEach (el => {
            if (obj.hasOwnProperty (el))
                newObj[el] = obj[el];
        })
        return newObj;
    }

    const user = await User.findByIdAndUpdate (req.user.id, filter (req.body), {new: true, runValidators: true});

    res.status (200).json ({
        status: 'success',
        data: {
            user
        }
    })

});

module.exports.deleteMe = asyncHandler (async (req, res) => {

    await User.findByIdAndUpdate (req.user.id, {active: false});

    res.status (204).json ({
        status: 'success',
        data: null
    })
});