import prisma from '../config/prisma.js';

// GET /category
export const getAllCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ message: 'Server error when get categories', error: err.message});
    }
}

// Get /category/:id
export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await prisma.category.findUnique({
            where : { id : parseInt(id) },
            include : {
                products: true
            }
        });

        if(!category) {
            res.status(404).json({message: 'Cannot find category!!!'});
        }
        res.status(200).json(category);
    } catch (err) {
        res.status(500).json({message: 'Server error when get category by id', error : err.message});
    }
};

// POST /category
export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Name is required!!!" });
        }

        const newCategory = await prisma.category.create({
            data: { name }
        });
        res.status(201).json(newCategory);
    } catch (error) {
        // Lỗi nếu tên đã tồn tại (do @unique trong schema)
        if (error.code === 'P2002') {
            return res.status(409).json({ message: "Category name existed!!!" });
        }
        res.status(500).json({ message: "Server error when create category", error: error.message });
    }
};

// PUT /category/:id
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Name is required!!!" });
        }

        const updatedCategory = await prisma.category.update({
            where: { id: parseInt(id) },
            data: { name }
        });
        res.status(200).json(updatedCategory);
    } catch (error) {
        if (error.code === 'P2002') { // Lỗi tên trùng
            return res.status(409).json({ message: "Category name is existed!!!" });
        }
        if (error.code === 'P2025') { // Lỗi không tìm thấy
             return res.status(404).json({ message: "Cannot find category name" });
        }
        res.status(500).json({ message: "Server error when update category", error: error.message });
    }
};

// DELETE /category/:id
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        
        await prisma.category.delete({
            where: { id: parseInt(id) }
        });
        res.status(200).json({ message: "Successful deletion." });
    } catch (error) {
         if (error.code === 'P2003') {
            return res.status(400).json({ message: "Cannot delete: Still have products of this category." });
        }
        if (error.code === 'P2025') { // Lỗi không tìm thấy
             return res.status(404).json({ message: "Cannot find category name." });
        }
        res.status(500).json({ message: "Server error when update category", error: error.message });
    }
};
