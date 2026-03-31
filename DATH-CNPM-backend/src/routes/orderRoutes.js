import express from 'express';
import {
    checkoutAndCreatePaymentUrl,
    vnpayIpnHandler,
    vnpayReturn,
    getAllOrders,
    getOrderById
} from '../controllers/orderController.js'; 

import { isAuth, isRole } from '../middlewares/authMiddleware.js';

const orderRoutes = express.Router();

orderRoutes.get('/vnpay_ipn', vnpayIpnHandler);
orderRoutes.get('/vnpay_return', vnpayReturn);


orderRoutes.post('/checkout', isAuth, isRole(['USER']), checkoutAndCreatePaymentUrl);
orderRoutes.get('/my-orders', isAuth, isRole(['USER']), getAllOrders);
orderRoutes.get('/:id', isAuth, isRole(['USER']), getOrderById);

export default orderRoutes;