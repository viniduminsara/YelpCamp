const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxToken });
const ITEMS_PER_PAGE = 9;

module.exports.index = async(req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * ITEMS_PER_PAGE;

    // Fetch campgrounds for the current page
    const campgrounds = await Campground.find()
        .skip(skip)
        .limit(ITEMS_PER_PAGE);

    const totalCampgrounds = await Campground.countDocuments();
    const totalPages = Math.ceil(totalCampgrounds / ITEMS_PER_PAGE);

    res.render('campgrounds/index', {
        campgrounds,
        currentPage: 'Campgrounds',
        totalPages,
        currentPageNumber: page
    });
}

module.exports.newForm = async(req, res) => {
    res.render('campgrounds/new', {currentPage: 'New Campground'});
}

module.exports.create = async(req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    const new_camp = new Campground(req.body.campground);
    new_camp.geometry = geoData.body.features[0].geometry;
    new_camp.images = req.files.map(file => ({ url: file.path, filename: file.filename }));
    new_camp.author = req.user.id;
    await new_camp.save();
    console.log(new_camp)
    req.flash('success', 'Successfully Created a New Campground!');
    res.redirect(`/campgrounds/${new_camp.id}`);
}

module.exports.show = async(req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!campground){
        req.flash('error', 'Cannot Find The Campground');
        return res.redirect('/campgrounds');
    }

    const displayedReviews = campground.reviews.slice(0, 3);

    const total = campground.reviews.reduce((sum, review) => sum + review.rating, 0);
    const reviewsCount = campground.reviews.length;
    const average = reviewsCount ? (total / reviewsCount).toFixed(1) : 0.0;

    const ratingStats = { total: total, reviewsCount:reviewsCount, average: average }

    res.render('campgrounds/show', {
        campground,
        ratingStats,
        displayedReviews,
        currentPage: campground.title
    });
}

module.exports.editForm = async(req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Cannot Find The Campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground, currentPage: `Edit ${campground.title}`});
}

module.exports.update = async(req, res, next) => {
    const {id} = req.params;
    const updated_campground = await Campground.findByIdAndUpdate(id, req.body.campground,{ runValidators: true, new:true });
    const imgs = req.files.map(file => ({ url: file.path, filename: file.filename }));
    updated_campground.images.push(...imgs);
    await updated_campground.save();
    req.flash('success', 'Successfully Updated the Campground!');
    res.redirect(`/campgrounds/${updated_campground.id}`);
}

module.exports.delete = async(req, res, next) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted the Campground!');
    res.redirect('/campgrounds');
}

module.exports.deleteImg = async(req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(campground){
        if(req.body.deleteImages){
            for(let filename of req.body.deleteImages){
                await cloudinary.uploader.destroy(filename);
            }
            await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
        }
    }
    req.flash('success', 'Successfully Deleted the images!');
    res.redirect(`/campgrounds/${campground.id}`);
}

module.exports.loadReview = async(req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');

    const reviewsPerPage = 3;
    let page = parseInt(req.params.page) || 1;

    const startIdx = (page - 1) * reviewsPerPage;
    const endIdx = startIdx + reviewsPerPage;

    const nextReviews = campground.reviews.slice(startIdx, endIdx);
    res.json({ nextReviews });
}