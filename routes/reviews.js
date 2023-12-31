const express = require('express');
const Campground = require('../models/campground');
const Review = require('../models/review');
const catchAsync = require('../utils/catchAsync');
const {validateReview} = require('../middleware');

const router = express.Router({ mergeParams: true });

router.post('/', validateReview, catchAsync(async(req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully Posted Your Review!');
    res.redirect(`/campgrounds/${campground.id}`);
}));

router.delete('/:reviewId', catchAsync(async(req, res, next) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: { reviews: reviewId }});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully Deleted The Review!');
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;