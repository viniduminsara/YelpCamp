const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Campground = require('./models/campground');

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const port = 3000;
const db = mongoose.connection;

//connect with database
mongoose.connect('mongodb://localhost:27017/yelp_camp');
db.on('error', console.error.bind(console, 'DB connection error :('));
db.once('open', () => console.log('DB connected :)'));

app.listen(port, () => {
    console.log('Server up at port 3000');
});

//define routes
app.get('/', async(req, res) => {
    res.render('home');
});

app.get('/campgrounds', async(req, res) => {
    res.render('campgrounds/index');
});







