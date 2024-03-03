'use strict'
import {Schema, model} from 'mongoose'

const categorySchema = new Schema({
    title:{
        type: String,
        required: true,
        unique: true
    },
    description:{
        type: String,
        required: true
    }
}, {
    versionKey: false,
})

export default model('Category', categorySchema)