const express = require('express');
const {campgroundSchema} = require('../schemas');
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {isLoggedIn} = require('../middleware');


const router = express.Router();

const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
} 

router.get('/', isLoggedIn, catchAsync(async(req, res, next) => {
    const campgrounds = await Campground.find();
    res.render('campgrounds/index', {campgrounds, currentPage: 'Campgrounds'});
}));

router.post('/', isLoggedIn, validateCampground, catchAsync(async(req, res, next) => {
    const new_camp = new Campground(req.body.campground);
    await new_camp.save(); 
    req.flash('success', 'Successfully Created a New Campground!');
    res.redirect(`/campgrounds/${new_camp.id}`);
}));

router.get('/new', isLoggedIn, async(req, res) => {
    res.render('campgrounds/new', {currentPage: 'New Campground'});
});

router.get('/:id', catchAsync(async(req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    if(!campground){
        req.flash('error', 'Cannot Find The Campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground, currentPage: campground.title});
}));

router.put('/:id', isLoggedIn, validateCampground, catchAsync(async(req, res, next) => {
    const {id} = req.params;
    const campground = req.body.campground;
    const updated_campground = await Campground.findByIdAndUpdate(id, campground,{ runValidators: true, new:true });
    req.flash('success', 'Successfully Updated the Campground!');
    res.redirect(`/campgrounds/${updated_campground.id}`);
}));

router.delete('/:id', isLoggedIn, catchAsync(async(req, res, next) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted the Campground!');
    res.redirect('/campgrounds');
}));

router.get('/:id/edit', isLoggedIn, catchAsync(async(req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Cannot Find The Campground');
        return res.redirect('/campgrounds');
    } 
    res.render('campgrounds/edit', {campground, currentPage: `Edit ${campground.title}`});
}));

module.exports = router;