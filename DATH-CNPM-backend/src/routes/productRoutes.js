import express from 'express';
const productRoutes = express.Router();

import {
    getFeaturedProducts,
    getProductById,
    addReviewToProduct,
    getAllProducts,

    // APIs cho SHOP OWNER
    createProduct,          // POST /api/products
    updateProduct,          // PUT /api/products/:id
    deleteProduct           // DELETE /api/products/:id
} from '../controllers/productController.js';

import { isAuth, isRole } from '../middlewares/authMiddleware.js';

// PUBLIC ROUTE

productRoutes.get('/featured', getFeaturedProducts);
productRoutes.get('/', getAllProducts);
productRoutes.get('/:id', getProductById);

// PROTECTED ROUTE

productRoutes.post('/:id/reviews', isAuth, addReviewToProduct);

productRoutes.post('/',isAuth, isRole(['SHOP', 'ADMIN']), createProduct);

productRoutes.put('/:id',isAuth, isRole(['SHOP', 'ADMIN']), updateProduct);

productRoutes.delete('/:id',isAuth, isRole(['SHOP', 'ADMIN']), deleteProduct);

export default productRoutes;

