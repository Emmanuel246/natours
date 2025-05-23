const mongoose  = require("mongoose");

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, "Review cannot be empty"],
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 4.5,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Review must belong to a user"],
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: "Tour",
        required: [true, "Review must belong to a tour"],
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Prevent duplicate reviews
reviewSchema.index({ tour: 1}, { unique: true });

reviewSchema.pre(/^find/, function (next) {
    // this.populate({
    //     path: "tour",
    //     select: "name",
    // }).populate({
    //     path: "user",
    //     select: "name photo",
    // });

    this.populate({
        path: "user",
        select: "name photo",
    });
    next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId },
        },
        {
            $group: {
                _id: "$tour",
                nRating: { $sum: 1 },
                avgRating: { $avg: "$rating" },
            },
        },
    ]);
    console.log(stats);
};

reviewSchema.post('save', function() {
    // this points to the current review
    this.constructor.calcAverageRatings(this.tour);
})


const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;