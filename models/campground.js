const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;
const options = { toJSON: { virtuals: true } };

const ImageSchema = new Schema({
    url: String,
    filename: String
});

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, options);

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/c_thumb,g_auto,h_150,w_200');
});

ImageSchema.virtual('preview').get(function() {
    return this.url.replace('/upload', '/upload/c_thumb,g_auto,h_300,w_500');
});

CampgroundSchema.virtual('properties.popupMarkup').get(function() {
    return `<h6><a href="/campgrounds/${this.id}">${this.title}</a></h6><p>${this.location}</p>`
});

CampgroundSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in: doc.reviews
            }
        })
    }
})

CampgroundSchema.indexes({ title: 'text', location: 'text' });

module.exports = mongoose.model('Campground', CampgroundSchema);