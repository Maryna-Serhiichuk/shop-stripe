import mongoose from 'mongoose'
const Schema = mongoose.Schema

const customerSchema = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    role: {type: String, ref: 'Role'},

    name: {type: String, required: true},
    surname: {type: String, required: true},
    phone: { type: String },
    wishList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
    }],
    purchasesList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
    }],
    delivery: {
        city: { type: String },
        number: { type: String }
    },
    customerStripeId: {type: String},
}, { timestamps: true })

export const Customer = mongoose.model('Customer', customerSchema)