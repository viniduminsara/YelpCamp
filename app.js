if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const User = require('./models/user');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoDBStore = require('connect-mongo');
const urls = require('./public/scripts/CSPUrls');
// const dbUrl = process.env.DB_URL; //production database
const dbUrl = 'mongodb://localhost:27017/yelp_camp'; // development database

//configurations
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(mongoSanitize());
app.use(helmet());

const store = new MongoDBStore({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thissecretshouldbebetter'
    }
})

const sessionConfig = {
    name: 'YelpCampSession',
    secret: 'thissecretshouldbebetter',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        // secure: true,
        expires: Date.now() + ( 1000 * 60 * 60 * 24 * 7 ),
        maxAge: ( 1000 * 60 * 60 * 24 * 7 )
    },
    store
}
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//handle the content security policy
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...urls.connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...urls.scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...urls.styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/di22m4v3n/",
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...urls.fontSrcUrls],
        },
    })
);

const port = 3000;
const db = mongoose.connection;

//connect with database
//'mongodb://localhost:27017/yelp_camp'
mongoose.connect(dbUrl);
db.on('error', console.error.bind(console, 'Database connection error :('));
db.once('open', () => console.log('Database connected :)'));

app.listen(port, () => {
    console.log('Server up at port 3000');
});

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.info = req.flash('info');
    next();
});

//routers
app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.get('/home', (req, res) => {
    res.render('home');
});

//error handling
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { status = 500, message = 'Something went wrong'} = err;
    res.status(status).render('error', {err, currentPage: `${status} Error`});
});








