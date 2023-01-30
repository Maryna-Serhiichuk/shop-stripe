import mongoose from 'mongoose'
const Schema = mongoose.Schema

const bookSchema = new Schema({
    name: {type: String, required: true},
    author: {type: String, required: true},
    year: {type: String, required: true},
    price: {type: String, required: true},
    description: {type: String, required: true},
    genres: {type: String, required: true},
    stripeId: {type: String, required: true}
}, { timestamps: true })

export const Book = mongoose.model('Book', bookSchema)