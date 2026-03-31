import express from 'express';

import { 
    getUsers, 
    updateUserStatus, 
    updateUserRole,
    getAllReports,  
    updateReport     
} from '../controllers/adminController.js';

import { isAuth, isRole } from '../middlewares/authMiddleware.js';

const adminRoutes = express.Router();

// Bảo vệ tất cả các route dưới đây
adminRoutes.use(isAuth, isRole(['ADMIN'])); 

// === User Routes ===
adminRoutes.get('/users', getUsers);
adminRoutes.put('/users/:id/status', updateUserStatus);
adminRoutes.put('/users/:id/role', updateUserRole);

// === Report Routes ===
// GET /api/admin/reports
adminRoutes.get('/reports', getAllReports); 

// PUT /api/admin/reports/:id
adminRoutes.put('/reports/:id', updateReport); 

export default adminRoutes;