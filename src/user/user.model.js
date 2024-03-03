'use strict'
import {Schema, model} from 'mongoose'

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    surname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        minLength: [8, 'Password must be at least 8 characters']
    },
    username:{
        type:String,
        required:true,
        unique: true
    }
}, {
    versionKey: false,
})

export default model('User', userSchema)