'use strict'

import jwt from 'jsonwebtoken'
import User from '../user/user.model.js'

export const validateJwt = async (req, res, next)=>{
    try {
        let secretKey = process.env.SECRET_KEY
        let {token} = req.headers
        if (!token) return res.status(401).send({message: 'Unauthorized'})
        let {uid} = jwt.verify(token, secretKey)
        let user = await User.findOne({_id: uid})
        if (!user) return res.status(401).send({message: 'User not found - Unauthorized'})
        req.user = user
        next()
    } catch (error) {
        console.error(error)
        res.status(500).send({message: 'Invalid jwt token or expired'})
    }
}

export const isAdmin = async (req, res, next) => {
    try {
        let { email, username } = req.user;
        
        // Verifica si el correo no contiene "@adInterfer"
        if (!email || !email.includes('@adinterfer')) {
            return res.status(403).send({ message: `No tienes acceso | Usuario: ${username}` });
        }

        // Si el usuario es un administrador, llama a next() para permitir que la solicitud continúe
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).send({ message: 'Error al verificar el rol' });
    }
};