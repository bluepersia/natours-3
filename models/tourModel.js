const mongoose = require ('mongoose');
const slugify = require ('slugify');

const tourSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: [true, 'Tour must have a name'],
        maxlength: [40, 'Tour name must not exceed 40 in length'],
        minlength: [10, 'Tour name must be at least 10 characters long']
    },
    slug: String,
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
        required: [true, 'Tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty must be either easy, medium or difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must be at least 5']
    },
    ratingsQuantity: {
        type: Number
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val)
            {
                return val < this.price;
            },
            message: 'Discount must be lower than the price'
        }
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
    startDates: [Date],
    secret: {
        type: Boolean,
        default: false
    }
})

tourSchema.virtual ('durationWeeks').get (function ()
{
    return this.duration / 7;
});

tourSchema.pre ('save', function (next)
{
    if (this.isNew)
        this.slug = slugify (this.name,  { lower: true});

    next ();
});

tourSchema.post ('save', function (doc, next)
{
    //console.log (doc);
})

tourSchema.pre (/(find|findOne)/, function (next)
{
    this.find ({secret: {$ne: true}});
    this.time = Date.now ();
    next ();
});

tourSchema.post (/(find|findOne)/, function (next)
{
    //console.log (Date.now () - this.time);
});

tourSchema.pre ('aggregate', function (next)
{
    this._pipeline.unshift ({
        $match: { secret: {$ne: true}}
    })
    next ();
});

const Tour = mongoose.model ('Tour', tourSchema);

module.exports = Tour;