const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');

router.get('/signup', (req, res) => {
    res.render('users/signup', {currentPage: 'Register'});
});

router.post('/signup', catchAsync(async(req, res, next) => {
    try{
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Signup successful! Welcome to Yelpcamp.');
            res.redirect('/campgrounds');
        });
    }catch(e){
        req.flash('error', e.message);
        res.redirect('/signup');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login', {currentPage: 'Login'});
});

router.post('/login',
    storeReturnTo, 
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), 
    (req, res) => {

        req.flash('success', 'Welcome back!');
        const redirectUrl = res.locals.returnTo || '/campgrounds';
        res.redirect(redirectUrl);

});

router.get('/logout', storeReturnTo, (req, res) => {
    req.logOut(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('info', 'You are logged out!');
        res.redirect('/campgrounds');
    });
});

module.exports = router;