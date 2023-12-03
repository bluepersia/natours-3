const Tour = require ('../models/tourModel');
const APIFeatures = require ('../utils/APIFeatures');
const asyncHandler = require ('express-async-handler');
const AppError = require ('../utils/AppError');

exports.getAllTours = asyncHandler (async (req, res) =>
{
    const query = Tour.find ();
    const apiFeatures = new APIFeatures (req.query, query);
    apiFeatures.all ();

    const tours = await query;

    res.status (200).json ({
        status: 'success',
        result: tours.length,
        data: {
            tours
        }
    })
});

exports.createTour = asyncHandler (async (req, res) => {

    const tour = await Tour.create (req.body);

    res.status (201).json ({
        status: 'success',
        data: {
            tour
        }
    })
})

exports.getTour = asyncHandler (async (req, res) => {

    const tour = await Tour.findById (req.params.id);

    if (!tour)
        throw new AppError ('No tour with that ID', 404);

    res.status (200).json ({
        status: 'success',
        data: {
            tour
        }
    })
});


exports.updateTour = asyncHandler (async (req, res) => {
    
    const tour = await Tour.findByIdAndUpdate (req.params.id, req.body, {new: true, runValidators: true});

    if (!tour)
        throw new AppError ('No tour with that ID', 404);

    res.status (200).json ({
        status: 'success',
        data: {
            tour
        }
    })
});


exports.deleteTour = asyncHandler (async (req, res) => {
    
    const tour = await Tour.findByIdAndDelete (req.params.id);

    if (!tour)
        throw new AppError ('No tour with that ID', 404);

    res.status (204).json ({
        status: 'success',
        data: {
            tour
        }
    })
});