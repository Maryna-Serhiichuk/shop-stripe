import mongoose from 'mongoose'
const Schema = mongoose.Schema

const roleSchema = new Schema({
    value: {type: String, unique: true, default: 'CUSTOMER'}

}, { timestamps: true })

export const Role = mongoose.model('Role', roleSchema)