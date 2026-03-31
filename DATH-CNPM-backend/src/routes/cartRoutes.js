import express  from 'express';
const cartRoutes = express.Router();

import { isAuth } from '../middlewares/authMiddleware.js'
import { getCartByUser, addItemToCart, updateCartItem, deleteCartItem } from '../controllers/cartController.js';

cartRoutes.get('/', isAuth, getCartByUser);
cartRoutes.post('/items', isAuth, addItemToCart);
cartRoutes.put('/items/:itemId', isAuth, updateCartItem);
cartRoutes.delete('/items/:itemId', isAuth, deleteCartItem);

export default cartRoutes;