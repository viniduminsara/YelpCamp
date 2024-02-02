const User = require('../models/user');

module.exports.renderSignup = (req, res) => {
    res.render('users/signup', {currentPage: 'YelpCamp | Signup'});
}

module.exports.signup = async(req, res, next) => {
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
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login', {currentPage: 'YelpCamp | Login'});
}

module.exports.login = (req, res) => {

    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);

}

module.exports.logout = (req, res) => {
    req.logOut(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('info', 'You are logged out!');
        res.redirect('/campgrounds');
    });
}