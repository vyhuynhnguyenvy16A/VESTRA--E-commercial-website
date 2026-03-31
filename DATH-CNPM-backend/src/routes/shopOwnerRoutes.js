import express from 'express';
import { isAuth, isRole } from '../middlewares/authMiddleware.js';

import {
    getShopOwnerProducts,         // GET /api/shop/products (có phân trang)
    importShopOwnerProducts,      // POST /api/shop/products/import
    getShopOwnerProductList,      // GET /api/shop/products/list
    getShopOwnerProductSummary,   // GET /api/shop/products/summary
    getShopOwnerStats,            // GET /api/shop/stats
    getShopRevenueChartData,      // GET /api/shop/revenue-chart
    getRevenueReport,             // GET /api/shop/revenue-report
    getShopOwnerOrders,           // GET /api/shop/orders
    updateOrderStatus             // PUT /api/orders/:id/status
} from '../controllers/shopOwnerController.js'; // Giả sử đã đổi tên file controller

const shopOwnerRoutes = express.Router();

// Tất cả các route dưới đây đều được bảo vệ
// Chỉ cho phép người dùng đã xác thực (isAuth) và có role là SHOP hoặc ADMIN
shopOwnerRoutes.use(isAuth, isRole(['SHOP', 'ADMIN']));

// ===========================================
// PRODUCT MANAGEMENT ROUTES (/api/shop/...)
// ===========================================

// GET /api/shop/products - Lấy danh sách sản phẩm có phân trang
shopOwnerRoutes.get('/products', getShopOwnerProducts);

// GET /api/shop/products/list - Lấy danh sách sản phẩm đầy đủ (không phân trang, dùng cho dropdown)
shopOwnerRoutes.get('/products/list', getShopOwnerProductList);

// POST /api/shop/products/import - Nhập nhiều sản phẩm
shopOwnerRoutes.post('/products/import', importShopOwnerProducts); // Thêm import route

// GET /api/shop/products/summary - Lấy tóm tắt (tên, giá, tồn kho)
shopOwnerRoutes.get('/products/summary', getShopOwnerProductSummary);

// ===========================================
// ORDER & REPORT ROUTES (/api/shop/...)
// ===========================================

// GET /api/shop/stats - Thống kê Dashboard
shopOwnerRoutes.get('/stats', getShopOwnerStats);

// GET /api/shop/revenue-chart - Dữ liệu biểu đồ doanh thu
shopOwnerRoutes.get('/revenue-chart', getShopRevenueChartData);

// GET /api/shop/revenue-report - Báo cáo doanh thu chi tiết theo ngày
shopOwnerRoutes.get('/revenue-report', getRevenueReport);

// GET /api/shop/orders - Danh sách đơn hàng liên quan đến shop
shopOwnerRoutes.get('/orders', getShopOwnerOrders);

// PUT /api/orders/:id/status - Cập nhật trạng thái đơn hàng
shopOwnerRoutes.put('/orders/:id/status', updateOrderStatus);


export default shopOwnerRoutes;