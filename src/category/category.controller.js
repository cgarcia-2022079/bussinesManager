'use strict'

import Category from './category.model.js'
import Company from '../company/company.model.js'
import {validateParamsEmpty} from '../utils/validator.js'

export const addCategory = async (req, res)=>{
    try {
        let data = req.body
        let category = new Category(data)
        if (!validateParamsEmpty(data)) return res.status(404).send({message: 'You cannot leave empty fields, check the information you are providing.'})
        if (!category) return res.status(401).send({message: 'Error adding category'})
        await category.save()
        return res.status(201).send({message: 'Category created successfully', category})
    } catch (error) {
        console.log(error)
        return res.status(500).send({message: 'Error in function add Category', error})
    }
}

export const updateCategory = async (req, res)=>{
    try {
        let idCategory = req.params.id
        let data = req.body
        let category = await Category.findByIdAndUpdate(idCategory, data, {new: true})
        if (!category) return res.status(401).send({message: 'Category not found'})
        return res.status(200).send({message: 'Category updated successfully', category})
    } catch (error) {
        console.log(error)
        return res.status(500).send({message: 'Error updating category', error})
    }
}

export const deleteCategory = async (req, res)=>{
    try {
        let idCategory = req.params.id
        let categoryToDelete = await Category.findById(idCategory)
        if (!categoryToDelete) return res.status(401).send({message: 'Category not found'})
        let defaultCategory = await Category.findOne({title: 'Categoria Eliminada'})
        if (!defaultCategory) return res.status(401).send({message: 'Default category not found'})
        await Company.updateMany({
            category: categoryToDelete._id},
            {category: defaultCategory._id},
            {multi: true})
        await categoryToDelete.deleteOne()
        return res.status(200).send({message: 'Category deleted successfully'})
    } catch (error) {
        console.log(error)
        return res.status(500).send({message: 'Error deleting category', error})
    }
}

export const getCategories = async (req, res)=>{
    try {
        let categories = await Category.find().select('title description -_id')
        if (!categories) return res.status(401).send({message: 'Categories not found'})
        return res.status(200).send({message: 'Categories retrieved successfully', categories})
    } catch (error) {
        console.log(error)
        return res.status(500).send({message: 'Error getting categories', error})
    }
}