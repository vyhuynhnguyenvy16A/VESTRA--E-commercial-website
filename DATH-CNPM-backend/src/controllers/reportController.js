import prisma from '../config/prisma.js';

export const createReport = async (req, res) => {
    try {
        const userId = req.user.id;

        const { title, message, priority, reportedId } = req.body;

        if(!title || !message){
            res.status(400).json({message : 'Title and message is required!!!'})
        }

        const newReport = await prisma.report.create({
            data: {
                title,
                message,
                priority : priority ? priority.toUpperCase() : 'MEDIUM',
                reporterId : userId,
                reportedUserId : reportedId
            }
        });

        res.status(201).json(newReport);
    } catch (err) {
        res.status(500).json({message : 'Server error when create report!!!', error : err.message});
    }
}