'use strict'
import jwt from 'jsonwebtoken'
const secretKey = '@keySuperSecretOfThisProgramManagerBusiness@'
export const generateJwt = async (payload)=>{
    try {
        return jwt.sign(payload, secretKey,{
            expiresIn: '4h',
            algorithm: 'HS256'
        })        
    } catch (error) {
        console.log(error)
        return error
    }
}