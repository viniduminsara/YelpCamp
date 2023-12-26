const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

router.get('/signup', (req, res) => {
    res.render('users/signup', {currentPage: 'Register'});
});

router.post('/signup', catchAsync(async(req, res) => {
    try{
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.flash('success', 'Signup successful! Welcome to Yelpcamp.');
        res.redirect('/campgrounds');
    }catch(e){
        req.flash('error', e.message);
        res.redirect('/signup');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login', {currentPage: 'Login'});
});

module.exports = router;