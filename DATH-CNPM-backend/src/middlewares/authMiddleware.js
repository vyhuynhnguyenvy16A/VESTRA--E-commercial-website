import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

/* Middleware isAuth
Check valid token */

export const isAuth = async (req, res, next) => {
    try {
        // Get token from headers
        const authHeader = req.headers.authorization;


        console.log(">>> [MIDDLEWARE] Auth Header nhận được:", authHeader);
        if(!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({message: "Not found token or token is invalid!!!"});
        }

        const token = authHeader.split(' ')[1];
        console.log(">>> [MIDDLEWARE] Token trích xuất:", token);

        // Check token
        const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
        console.log(">>> [MIDDLEWARE] Decoded Payload:", decodedPayload);

        const user = await prisma.user.findUnique({
            where: { id: decodedPayload.id },
        });
        console.log(">>> [MIDDLEWARE] User tìm thấy trong DB:", user ? user.email : "KHÔNG TÌM THẤY");

        if (!user) {
            return res.status(401).json({ message: 'User verification failed (User not found)!' });
        }

        if (user.isActive === false) {
            return res.status(403).json({ message: 'Your account has been banned/locked!' });
        }

        req.user = user;

        next();
    } catch(err) {
        console.error(">>> [EXCEPTION] Lỗi Auth:", err.message);
        if(err.name === 'TokenExpiredError') {
            return res.status(401).json({message: 'Expired Token!!!'});
        }
        return res.status(401).json({message: 'Invalid Token!!!'});
    }
}

/* Middleware isRole
    This middleware take a role array as params, run after isAuth */

export const isRole = (allowedRoles) => {
    return (req, res, next) => {
        if(!req.user || !req.user.role) {
            return res.status(403).json({message: 'You do not have access!!!'});
        }

        const havePermission = allowedRoles.includes(req.user.role);
        if(!havePermission){
            return res.status(403).json({message: 'You do not have permission to perform this action!!!'});
        }
        next();
    }
}