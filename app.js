const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate');
const Campground = require('./models/campground');

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'))

const port = 3000;
const db = mongoose.connection;

//connect with database
mongoose.connect('mongodb://localhost:27017/yelp_camp');
db.on('error', console.error.bind(console, 'Database connection error :('));
db.once('open', () => console.log('Database connected :)'));

app.listen(port, () => {
    console.log('Server up at port 3000');
});

//define routes
app.get('/', async(req, res) => {
    res.redirect('/campgrounds');
});

app.get('/home', async(req, res) => {
    res.render('home', {currentPage: 'Home'});
});

app.get('/campgrounds', async(req, res) => {
    const campgrounds = await Campground.find();
    res.render('campgrounds/index', {campgrounds, currentPage: 'Campgrounds'});
});

app.post('/campgrounds', async(req, res) => {
    const new_camp = new Campground(req.body.campground);
    await new_camp.save();
    res.redirect(`/campgrounds/${new_camp.id}`);
});

app.get('/campgrounds/new', async(req, res) => {
    res.render('campgrounds/new', {currentPage: 'New Campground'});
});

app.get('/campgrounds/:id', async(req,res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', {campground, currentPage: campground.title});
});

app.put('/campgrounds/:id', async(req, res) => {
    const {id} = req.params;
    const campground = req.body.campground;
    const updated_campground = await Campground.findByIdAndUpdate(id, campground,{ runValidators: true, new:true });
    res.redirect(`/campgrounds/${updated_campground.id}`);
});

app.delete('/campgrounds/:id', async(req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
});

app.get('/campgrounds/:id/edit', async(req,res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);  
    res.render('campgrounds/edit', {campground, currentPage: `Edit ${campground.title}`});
});








