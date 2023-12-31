const express = require('express');
const router = express.Router();
const User = require('../models/user');
const users = require('../controllers/users');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');

router.get('/signup', users.renderSignup);

router.post('/signup', catchAsync(users.signup));

router.get('/login', users.renderLogin);

router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), users.login);

router.get('/logout', storeReturnTo, users.logout);

module.exports = router;