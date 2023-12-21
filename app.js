const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static('public'));

const port = 3000;
const db = mongoose.connection;

//connect with database
mongoose.connect('mongodb://localhost:27017/yelp_camp');
db.on('error', console.error.bind(console, 'Database connection error :('));
db.once('open', () => console.log('Database connected :)'));

app.listen(port, () => {
    console.log('Server up at port 3000');
});

//routers
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

//error handling
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { status = 500, message = 'Somethig went wrong'} = err;
    res.status(status).render('error', {err, currentPage: `${status} Error`});
});








