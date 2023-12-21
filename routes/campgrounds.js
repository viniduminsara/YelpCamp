const express = require('express');
const {campgroundSchema} = require('../schemas');
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

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

router.get('/', catchAsync(async(req, res, next) => {
    const campgrounds = await Campground.find();
    res.render('campgrounds/index', {campgrounds, currentPage: 'Campgrounds'});
}));

router.post('/', validateCampground, catchAsync(async(req, res, next) => {
    const new_camp = new Campground(req.body.campground);
    await new_camp.save(); 
    res.redirect(`/campgrounds/${new_camp.id}`);
}));

router.get('/new', async(req, res) => {
    res.render('campgrounds/new', {currentPage: 'New Campground'});
});

router.get('/:id', catchAsync(async(req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    res.render('campgrounds/show', {campground, currentPage: campground.title});
}));

router.put('/:id', validateCampground, catchAsync(async(req, res, next) => {
    const {id} = req.params;
    const campground = req.body.campground;
    const updated_campground = await Campground.findByIdAndUpdate(id, campground,{ runValidators: true, new:true });
    res.redirect(`/campgrounds/${updated_campground.id}`);
}));

router.delete('/:id', catchAsync(async(req, res, next) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

router.get('/:id/edit', catchAsync(async(req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);  
    res.render('campgrounds/edit', {campground, currentPage: `Edit ${campground.title}`});
}));

module.exports = router;