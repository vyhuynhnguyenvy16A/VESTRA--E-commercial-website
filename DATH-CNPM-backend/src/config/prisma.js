import { PrismaClient } from "@prisma/client";

// Define logging configuration for better debugging
const prismaClientOptions = {
    log: [
        { emit: 'stdout', level: 'query' },
        { emit: 'stdout', level: 'error' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
    ],
};

// Prevent multiple instances during development hot reloading
let prisma;

// Handle global type in Node.js environment
if (typeof window === 'undefined') {
    if (process.env.NODE_ENV === 'production') {
        prisma = new PrismaClient(prismaClientOptions);
    } else {
        if (!global.prisma) {
            global.prisma = new PrismaClient(prismaClientOptions);
        }
        prisma = global.prisma;
    }
}

// Cleanup function for graceful shutdown
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});

export default prisma;