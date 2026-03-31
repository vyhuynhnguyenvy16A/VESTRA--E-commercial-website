import express from 'express';

import { createReport } from '../controllers/reportController.js';

import { isAuth } from '../middlewares/authMiddleware.js';

const reportRoutes = express.Router();

reportRoutes.post('/', isAuth, createReport);

export default reportRoutes