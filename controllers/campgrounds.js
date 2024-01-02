const Campground = require('../models/campground');

module.exports.index = async(req, res, next) => {
    const campgrounds = await Campground.find();
    res.render('campgrounds/index', {campgrounds, currentPage: 'Campgrounds'});
}

module.exports.newForm = async(req, res) => {
    res.render('campgrounds/new', {currentPage: 'New Campground'});
}

module.exports.create = async(req, res, next) => {
    const new_camp = new Campground(req.body.campground);
    new_camp.images = req.files.map(file => ({ url: file.path, filename: file.filename }));
    new_camp.author = req.user.id;
    await new_camp.save();
    console.log(new_camp); 
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

    res.render('campgrounds/show', {campground, currentPage: campground.title});
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
    req.flash('success', 'Successfully Updated the Campground!');
    res.redirect(`/campgrounds/${updated_campground.id}`);
}

module.exports.delete = async(req, res, next) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted the Campground!');
    res.redirect('/campgrounds');
}