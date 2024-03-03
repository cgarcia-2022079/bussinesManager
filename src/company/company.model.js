'use strict'

import {Schema, model} from 'mongoose'

const companySchema = new Schema({
    nameCompany:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    impactLevel:{
        type: String,
        required: true
    },
    yearsOfTrajectory:{
        type: String,
        required: true
    },
    category:{
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
},{
    versionKey: false,
})

export default model('Company', companySchema)