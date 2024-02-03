const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    body:{
        type: String,
        required: true
    },
    rating:{
        type: Number,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date:{
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Review', reviewSchema);