'use strict'

import Company from './company.model.js'
import {validateParamsEmpty} from '../utils/validator.js'
import ExcelJS from 'exceljs'

export const addCompany = async (req, res) => {
    try {
        let data = req.body
        if (!validateParamsEmpty(data)) return res.status(401).send({message: 'You cannot leave empty fields, check the information you are providing.'})
        let empresa = new Company(data)
        await empresa.save()
        if (!empresa) return res.status(404).send({message: 'Error saving company'})
        return res.status(201).send({message: 'Company created successfully', empresa})
    } catch (error) {
        console.log(error)
        return res.status(500).send({message: 'Error in function add Company', error})
    }
}

export const updateCompany = async (req, res) => {
    try {
        let idCompany = req.params.id
        let data = req.body
        if ('impactLevel yearsOfTrajectory' in data) {
            delete data.impactLevel,
            delete data.yearsOfTrajectory
        }
        let company = await Company.findByIdAndUpdate(idCompany, data, {new: true})
        if (!company) return res.status(401).send({message: 'Company not found'})
        return res.status(200).send({message: 'Company is updated successfully', company})
    } catch (error) {
        console.log(error)
        return res.status(500).send({message: 'Error updating company', error})
    }
}

export const getCompanies = async (req, res) => {
    try {
        let company = await Company.find().select('-_id').populate({path: 'category', select: 'title -_id'})
        if (!company) return res.status(401).send({message: 'Companies not found'})
        return res.status(200).send({message: 'Companies retrieved successfully', company})
    } catch (error) {
        console.log(error)
        return res.status(500).send({message: 'Error getting companies', error})
    }
}

export const getCompaniesByFilters = async (req, res) => {
    try {
        // Recuperar los parámetros de consulta
        const { minYears, maxYears, category, sortBy } = req.query

        // Construir el objeto de filtro
        const filter = {}
        if (minYears) {
            filter.yearsOfTrajectory = { $gte: parseInt(minYears) } // $gte para "mayor o igual que"
        }
        if (maxYears) {
            filter.yearsOfTrajectory = { ...filter.yearsOfTrajectory, $lte: parseInt(maxYears) } // $lte para "menor o igual que"
        }
        if (category) {
            filter.category = category
        }

        // Construir el objeto de ordenamiento
        const sort = {}
        if (sortBy === 'asc') {
            sort.nameCompany = 1 // 1 para orden ascendente (A-Z)
        } else if (sortBy === 'desc') {
            sort.nameCompany = -1 // -1 para orden descendente (Z-A)
        }

        // Buscar empresas aplicando el filtro y ordenamiento si se proporciona sortBy
        let companies
        if (sortBy) {
            companies = await Company.find(filter).sort(sort).populate({path: 'category', select: 'title -_id'})
        } else if (Object.keys(req.query).length === 1 && req.query.sortBy) {
            // Si solo se proporciona sortBy en la consulta, aplicar solo el ordenamiento
            companies = await Company.find().sort(sort).populate({path: 'category', select: 'title -_id'})
        } else {
            // Si no se proporciona sortBy, buscar empresas aplicando solo los filtros
            companies = await Company.find(filter).populate({path: 'category', select: 'title -_id'})
        }

        // Verificar si se encontraron empresas
        if (!companies || companies.length === 0) {
            return res.status(404).send({ message: 'No se encontraron empresas que coincidan con los criterios de búsqueda.' })
        }

        // Enviar las empresas encontradas como respuesta
        return res.status(200).send({ message: 'Empresas recuperadas exitosamente', companies })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Error al obtener empresas', error })
    }
}

export const exportCompaniesToExcel = async (req, res) => {
    try {
        const companies = await Company.find().populate({path: 'category', select: 'title description -_id'})
        
        if (!companies || companies.length === 0) {
            return res.status(404).send({ message: 'No se encontraron empresas.' })
        }

        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('Companies')

        // Añade las filas al archivo Excel
        worksheet.addRow(['Nombre Empresa', 'Dirección',
            'Teléfono', 'Nivel de Impacto', 'Años de Trayectoria', 'Categoria', 'Descripción de Categoria']) // Agrega las columnas necesarias

        companies.forEach(company => {
            worksheet.addRow([company.nameCompany,company.address, company.phone,
                company.impactLevel, company.yearsOfTrajectory,company.category.title, company.category.description]) // Agrega los datos de cada compañía
        })

        // Guarda el archivo Excel
        const filePath = 'companies.xlsx'
        await workbook.xlsx.writeFile(filePath)

        return res.status(200).download(filePath) // Envía el archivo Excel como respuesta
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Error al exportar empresas a Excel', error })
    }
}