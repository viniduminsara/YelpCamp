const express = require('express');
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware');

const router = express.Router();

router.get('/', catchAsync(async(req, res, next) => {
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
    const campground = await Campground.findById(id).populate('reviews').populate('author');
    if(!campground){
        req.flash('error', 'Cannot Find The Campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground, currentPage: campground.title});
}));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async(req, res, next) => {
    const {id} = req.params;
    const updated_campground = await Campground.findByIdAndUpdate(id, req.body.campground,{ runValidators: true, new:true });
    req.flash('success', 'Successfully Updated the Campground!');
    res.redirect(`/campgrounds/${updated_campground.id}`);
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async(req, res, next) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted the Campground!');
    res.redirect('/campgrounds');
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async(req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Cannot Find The Campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground, currentPage: `Edit ${campground.title}`});
}));

module.exports = router;