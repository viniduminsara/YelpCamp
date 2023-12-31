const express = require('express');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware');
const campgrounds = require('../controllers/campgrounds');

const router = express.Router();

router.get('/', catchAsync(campgrounds.index));

router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.create));

router.get('/new', isLoggedIn, campgrounds.newForm);

router.get('/:id', catchAsync(campgrounds.show));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.update));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.delete));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editForm));

module.exports = router;