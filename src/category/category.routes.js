'use strict'

import {Router} from 'express'
import {addCategory, updateCategory, deleteCategory, getCategories} from './category.controller.js'
import { validateJwt, isAdmin } from '../middlewares/validate-jwt.js'
const api = Router()

api.post('/addCategory', [validateJwt, isAdmin], addCategory)
api.put('/updateCategory/:id', [validateJwt, isAdmin], updateCategory)
api.delete('/deleteCategory/:id', [validateJwt, isAdmin], deleteCategory)
api.get('/getCategories', [validateJwt, isAdmin], getCategories)
export default api