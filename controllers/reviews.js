const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.create = async(req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user.id;
    review.date = new Date();
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully Posted Your Review!');
    res.redirect(`/campgrounds/${campground.id}`);
}

module.exports.delete = async(req, res, next) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: { reviews: reviewId }});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully Deleted The Review!');
    res.redirect(`/campgrounds/${id}`);
}