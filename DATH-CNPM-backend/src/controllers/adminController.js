import prisma from '../config/prisma.js';

// Support filter by ?search=, ?role=, ?status= 
export const getUsers = async (req, res) => {
    try {
        const { search, roleName, status } = req.query;

        const where = {};

        if(search){
            where.OR = [
                { email : { contains : search, mode : 'insensitive' } },
                { name : { contains : search, mode : 'insensitive' } }
            ];
        }

        if(roleName) {
            where.role = roleName.toUpperCase();
        }

        if(status == 'active') {
            where.isActive = true;
        } else if (status == 'locked') {
            where.isActive = false;
        }

        const users = await prisma.user.findMany({
            where : where,
            select : {
                id : true,
                email : true,
                name : true,
                isActive : true,
                createdAt : true,
                role : true
            },
            orderBy : { createdAt : 'desc'}
        });

        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({message : 'Server error when get users list!!!', error : err.message});
    }
}

export const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if(typeof status !== 'boolean') {
            res.status(400).json({message : 'Status is required!!!'});
        }

        const updatedUser = await prisma.user.update({
            where : { id : parseInt(id) },
            data : { isActive : status}
        });

        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({message : 'Server error when update user status!!!', error : err.message});
    }
}

export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!role) {
            return res.status(400).json({ message: 'Role is required!' });
        }

        const validRoles = ['USER', 'SHOP', 'ADMIN'];
        const roleUpper = role.toUpperCase();

        if (!validRoles.includes(roleUpper)) {
            return res.status(400).json({ message: 'Invalid role provided (Must be USER, SHOP, or ADMIN)!' });
        }

        const updatedUser = await prisma.user.update({
             where : { id : parseInt(id) },
            data : { role : roleUpper }
        });

        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({message : 'Server error when update user role!!!', error : err.message});
    }
}

export const getAllReports = async (req, res) => {
    try {
        const { title, status, priority } = req.query;

        const where = {}

        if(title) {
            where.title = { contains : title, mode : 'insensitive' };
        }

        if(status) {
            where.status = status.toUpperCase();
        }

        if(priority) {
            where.priority = priority.toUpperCase();
        }

        const reports = await prisma.report.findMany({
            where : where,
            include : {
                reporter : {
                    select : { id : true, name : true, email : true}
                },
                reportedUser: { 
                    select: { id: true, name: true, email: true }
                }
            },
            orderBy : { createdAt : 'desc'}
        });

        res.status(200).json(reports);
    } catch (err) {
        res.status(500).json({message : 'Server error when get reports!!!', error : err.message});
    }
}

export const updateReport = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, priority } = req.body;

        const updatedReport = await prisma.report.update({
            where: { id: parseInt(id) },
            data: { 
                status: status ? status.toUpperCase() : undefined,
                priority: priority ? priority.toUpperCase() : undefined
            }
        });

        res.status(200).json(updatedReport);
    } catch (err) {
        res.status(500).json({message : 'Server error when update report!!!', error : err.message}); 
    }
}