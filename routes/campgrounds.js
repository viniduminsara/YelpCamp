const express = require('express');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const router = express.Router();

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.create));

router.get('/new', isLoggedIn, campgrounds.newForm);
router.get('/search', catchAsync(campgrounds.search));

router.route('/:id')
    .get(catchAsync(campgrounds.show))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.update))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.delete));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editForm));
router.delete('/:id/image', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteImg));
router.get('/:id/reviews/:page', catchAsync(campgrounds.loadReview));

module.exports = router;