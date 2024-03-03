'use strict'

import {Router} from 'express'
import {addCompany, updateCompany, getCompanies, getCompaniesByFilters, exportCompaniesToExcel} from './company.controller.js'
import {validateJwt, isAdmin} from '../middlewares/validate-jwt.js'
const api = Router()

api.post('/addCompany', [validateJwt, isAdmin], addCompany)
api.put('/updateCompany/:id', [validateJwt, isAdmin], updateCompany)
api.get('/getCompanies', [validateJwt, isAdmin], getCompanies)
api.get('/getCompaniesByFilters', [validateJwt, isAdmin], getCompaniesByFilters)
api.get('/exportCompaniesToExcel', [validateJwt, isAdmin], exportCompaniesToExcel) // Nueva ruta para exportar a Excel

export default api