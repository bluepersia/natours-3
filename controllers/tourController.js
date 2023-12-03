const Tour = require ('../models/tourModel');
const asyncHandler = require ('express-async-handler');

exports.getAllTours = asyncHandler (async (req, res) =>
{
    const tours = await Tour.find ();

    res.status (200).json ({
        status: 'success',
        data: {
            tours
        }
    })
});