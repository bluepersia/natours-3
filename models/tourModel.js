const mongoose = require ('mongoose');

const tourSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: [true, 'Tour must have a name']
    },
    duration: {
        type:Number,
        required: [true, 'Tour must have a duration']
    },
    maxGroupSize: {
        type:Number,
        required: [true, 'Tour must have a max group size']
    },
    difficulty: {
        type: String,
        required: [true, 'Tour must have a difficulty']
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number
    },
    summary: {
        type: String,
        required: [true, 'A tour must have a summary']
    },
    description: String,
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now ()
    },
    startDates: [Date]
})

const Tour = mongoose.model ('Tour', tourSchema);

module.exports = Tour;