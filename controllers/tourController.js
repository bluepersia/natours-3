const Tour = require ('../models/tourModel');
const APIFeatures = require ('../utils/APIFeatures');
const asyncHandler = require ('express-async-handler');
const AppError = require ('../utils/AppError');

exports.top5Cheap = (req, res, next) => {

    req.query.sort = '-ratingsAverage price';
    req.query.fields ='name,price,ratingsAverage';
    req.query.limit = 5;
    next ();
}

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


exports.getTourStats = asyncHandler (async (req, res) => {

    const stats = await Tour.aggregate ([
        {
            $match: { ratingsAverage: { $gte: 4.5}}
        },
        {
            $group: {
                _id: '$difficulty',
                avgRating: {$avg: '$ratingsAverage'},
                avgPrice: { $avg: '$price'},
                maxPrice: { $max: '$price'},
                minPrice: {$min: '$price'},
                numRatings: {$sum: '$ratingsQuantity'},
                numTours: {$sum: 1}
            }
        },
        {
            $sort: { avgPrice: 1}
        }
    ])

    res.status (200).json ({
        status: 'success',
        data: {
            stats
        }
    })
})

exports.getMonthlyPlan = asyncHandler (async (req, res) => {

    const year = req.params.year;

    const plan = await Tour.aggregate ([
        {
            $unwind: 'startDates'
        },
        {
            $match: { startDates: {
                $gte: new Date (`${year}-01-01`),
                $lte: new Date(`${year}-12-31`)
            }}
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTours: {$sum: 1},
                tours: {$push: '$name'}
            }
        },
        {
            $addFields: { month: '$_id'}
        },
        {
            $project: { _id: 0}
        },
        {
            $sort: { numTours: -1}
        },
        {
            $limit: 12
        }
    ])
});