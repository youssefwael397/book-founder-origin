const mongoose = require('mongoose')
const Schema = mongoose.Schema

const EnglishBooksSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    overview: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    numberOfPages: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        default: 'Unknown'
    }
})

module.exports = mongoose.model("english-books", EnglishBooksSchema)