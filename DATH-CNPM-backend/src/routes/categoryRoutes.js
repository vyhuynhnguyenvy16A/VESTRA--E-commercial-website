import express from 'express';

import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} from '../controllers/categoryController.js';

import { isAuth, isRole } from '../middlewares/authMiddleware.js';

const categoryRoutes = express.Router();

// Public
categoryRoutes.get('/', getAllCategories);
categoryRoutes.get('/:id', getCategoryById);

// Protected
categoryRoutes.post('/', isAuth, isRole([ 'ADMIN' ]), createCategory);
categoryRoutes.put('/:id', isAuth, isRole([ 'ADMIN' ]), updateCategory);
categoryRoutes.delete('/:id', isAuth, isRole([ 'ADMIN' ]), deleteCategory);

export default categoryRoutes;