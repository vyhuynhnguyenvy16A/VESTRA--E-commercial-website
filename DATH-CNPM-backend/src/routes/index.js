import express from 'express';
import productRoutes from './productRoutes.js';
import authRoutes from './authRoutes.js';
import cartRoutes from './cartRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import reportRoutes from './reportRoutes.js';
import adminRoutes from './adminRoutes.js';
import orderRoutes from './orderRoutes.js';
import shopOwnerRoutes from './shopOwnerRoutes.js';

const router = express.Router();

// Gắn các router con
router.use('/products', productRoutes); 
router.use('/cart', cartRoutes);
router.use('/auth', authRoutes);    
router.use('/categories', categoryRoutes);
router.use('/reports', reportRoutes);
router.use('/admin', adminRoutes);
router.use('/orders', orderRoutes)
router.use('/shop', shopOwnerRoutes)

export default router;