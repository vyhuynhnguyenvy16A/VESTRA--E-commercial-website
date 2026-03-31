import prisma from '../config/prisma.js';

// ===========================================
// PUBLIC/USER APIs
// ===========================================

/**
 * GET /api/products/featured
 * Lấy các sản phẩm nổi bật (ví dụ: 8 sản phẩm mới nhất)
 */
export const getFeaturedProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            take: 4, 
            orderBy: {
                createdAt: 'desc' 
            },
            include: {
                images: {
                    where: { isDefault: true },
                    take: 1
                },
                variants: { 
                    take: 1,
                    select: { price: true }
                }
            }
        });

        const featuredProducts = products.map(p => ({
            ...p,
            defaultImage: p.images.length > 0 ? p.images[0].url : null,
            price: p.variants.length > 0 ? p.variants[0].price : 0,
            images: undefined, 
            variants: undefined
        }));

        res.status(200).json(featuredProducts);
    } catch (err) {
        res.status(500).json({ message: "Server error when fetching featured products", error: err.message });
    }
}

/**
 * GET /api/products
 * Lấy tất cả sản phẩm, hỗ trợ phân trang, tìm kiếm, lọc theo danh mục
 * Query params: ?page=1&limit=10&search=ao&category=ao-thun
 */
export const getAllProducts = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            search, 
            category,       // Ví dụ: "Nam", "Trẻ em"
            sort,           // "price_asc", "price_desc", "newest"
            priceRange,     // "under-200", "200-500", "above-500"
            sizes,          // "S,M,L"
            colors          // "Đỏ,Xanh"
        } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        // 1. Xây dựng điều kiện WHERE cơ bản
        const where = {};

        // --- Lọc theo Tên (Search) ---
        if (search) {
            where.name = {
                contains: search,
                mode: 'insensitive'
            };
        }

        if (category) {
            where.category = {
                name: {
                    contains: category,
                    mode: 'insensitive' 
                }
            };
        }

        // 2. Xây dựng điều kiện lọc Nâng cao (Variant: Size, Color, Price)
        
        const variantConditions = [];

        // --- Lọc theo Attribute Values (Size & Color) ---
        if (sizes || colors) {
            const valuesToFind = [];
            if (sizes) valuesToFind.push(...sizes.split(','));
            if (colors) valuesToFind.push(...colors.split(','));

            if (valuesToFind.length > 0) {
                variantConditions.push({
                    values: {
                        some: {
                            value: {
                                value: { in: valuesToFind } // Tìm value khớp: "M", "Đỏ"...
                            }
                        }
                    }
                });
            }
        }

        // --- Lọc theo Khoảng giá (Price Range) ---
        if (priceRange && priceRange !== 'all') {
            let min = 0;
            let max = 9999999999;

            if (priceRange === 'under-200') max = 200000;
            else if (priceRange === '200-500') { min = 200000; max = 500000; }
            else if (priceRange === 'above-500') min = 500000;

            variantConditions.push({
                price: { gte: min, lte: max }
            });
        }

        // Gộp các điều kiện Variant vào query chính
        if (variantConditions.length > 0) {
            where.variants = {
                some: {
                    AND: variantConditions 
                }
            };
        }

        // 3. Xử lý Sắp xếp (Sorting)
        let orderBy = { createdAt: 'desc' }; // Mặc định: Mới nhất
        
        if (sort === 'price_asc') {
            // Sort giá tăng dần (dựa trên variant giá thấp nhất)
            orderBy = { 
                variants: { 
                    _count: 'desc' // Hack nhẹ: Prisma chưa support sort deep relation tốt, tạm fallback
                } 
            };
            orderBy = { createdAt: 'desc' }; 
        } else if (sort === 'price_desc') {
             orderBy = { createdAt: 'desc' };
        }
        

        // 4. Thực hiện Query Database
        const [products, totalCount] = await prisma.$transaction([
            prisma.product.findMany({
                where: where,
                skip: skip,
                take: take,
                include: {
                    // Lấy ảnh đại diện
                    images: { 
                        where: { isDefault: true }, 
                        take: 1 
                    },
                    // Lấy giá (ưu tiên giá thấp nhất để hiển thị "Từ ... đ")
                    variants: {
                        take: 1,
                        orderBy: { price: 'asc' }, 
                        select: { price: true }
                    },
                    // Lấy tên danh mục
                    category: { 
                        select: { name: true } 
                    }
                },
                orderBy: { createdAt: 'desc' } // Sort mặc định
            }),
            prisma.product.count({ where: where })
        ]);

        // 5. Format dữ liệu trả về cho Frontend
        const formattedProducts = products.map(p => ({
            ...p,
            defaultImage: p.images.length > 0 ? p.images[0].url : null,
            price: p.variants.length > 0 ? p.variants[0].price : 0,
            categoryName: p.category?.name,
            // Xóa bớt dữ liệu thừa cho nhẹ JSON
            images: undefined,
            variants: undefined,
            category: undefined
        }));

        res.status(200).json({
            data: formattedProducts,
            total: totalCount,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(totalCount / parseInt(limit))
        });

    } catch (err) {
        console.error("Error in getAllProducts:", err);
        res.status(500).json({ message: "Lỗi server khi lấy danh sách sản phẩm", error: err.message });
    }
};
/**
 * GET /api/products/:id
 * Lấy chi tiết 1 sản phẩm
 */
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ message: "ID sản phẩm không hợp lệ" });
        }

        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
            include: {
                images: true,     // Lấy tất cả ảnh
                category: true,   // Lấy thông tin danh mục
                owner: {          // Lấy thông tin shop
                    select: { id: true, name: true }
                },
                attributes: {     // Lấy các thuộc tính (VD: Size, Màu)
                    include: {
                        values: true // Lấy các giá trị (VD: S, M, L)
                    }
                },
                variants: {       // Lấy các biến thể (VD: Áo S, Đen)
                    include: {
                        values: { // Lấy các liên kết giá trị
                            include: {
                                value: true // Lấy chi tiết AttributeValue
                            }
                        }
                    }
                },
                reviews: {        // Lấy các đánh giá
                    include: {
                        user: {   // Lấy thông tin người đánh giá
                            select: { id: true, name: true }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: "Server error when fetching product detail", error: err.message });
    }
}

/**
 * POST /api/products/:id/reviews
 * Thêm (hoặc cập nhật) một đánh giá cho sản phẩm
 * Yêu cầu: isAuth (đã có ở route)
 */
export const addReviewToProduct = async (req, res) => {
    try {
        const userId = req.user.id; // Lấy từ middleware isAuth
        const productId = parseInt(req.params.id);
        const { rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating (from 1 to 5) is required." });
        }


        const hasPurchasedProduct = await prisma.order.findFirst({
             where: {
                userId: userId,
                status: 'DELIVERED', // Chỉ cho phép đánh giá khi đã giao hàng
                items: {
                    some: {
                        variant: { // Từ OrderItem -> ProductVariant
                            productId: productId // Từ ProductVariant -> Product
                        }
                    }
                }
            }
        });

        if (!hasPurchasedProduct) {
            return res.status(403).json({ message: "You can only review products that you have purchased and received." });
        }

        const review = await prisma.review.upsert({
            where: {
                // Tạo một unique key ảo để check
                userId_productId: {
                    userId: userId,
                    productId: productId
                }
            },
            // Dữ liệu để cập nhật (nếu tìm thấy)
            update: {
                rating: rating,
                comment: comment
            },
            // Dữ liệu để tạo mới (nếu không tìm thấy)
            create: {
                userId: userId,
                productId: productId,
                rating: rating,
                comment: comment
            }
        });
        
        res.status(201).json(review);
    } catch (err) {
        if (err.code === 'P2002') {
            return res.status(409).json({ message: "You have already reviewed this product."});
        }
        res.status(500).json({ message: "Server error when adding review", error: err.message });
    }
}


// ===========================================
// SHOP OWNER / ADMIN APIs 
// ===========================================
export const createProduct = async (req, res) => {
    try {
        const shopOwnerId = req.user.id;
        const {
            name,
            description,
            categoryId,
            images = [],     // [{ url: "..." }]
            attributes = [], // [{ name: "Màu sắc", values: ["Đỏ", "Xanh"] }, { name: "Size", values: ["S", "M"] }]
            variants = []    // [{ price: 100, stock: 10, options: { "Màu sắc": "Đỏ", "Size": "S" } }]
        } = req.body;

        const newProduct = await prisma.$transaction(async (prisma) => {
            // 1. Tạo Product chính
            const product = await prisma.product.create({
                data: {
                    name,
                    description,
                    categoryId: parseInt(categoryId),
                    ownerId: shopOwnerId,
                }
            });

            // 2. Tạo Images
            if (images.length > 0) {
                await prisma.productImage.createMany({
                    data: images.map(img => ({
                        url: img.url,
                        isDefault: img.isDefault || false,
                        productId: product.id
                    }))
                });
            }

            // 3. Tạo Attributes & Values VÀ Lưu lại ID mapping
            const valueMap = {}; 

            for (const attr of attributes) {
                // Tạo Attribute cha (Ví dụ: Màu sắc)
                const newAttr = await prisma.attribute.create({
                    data: {
                        name: attr.name,
                        productId: product.id
                    }
                });

                // Tạo các AttributeValue con (Ví dụ: Đỏ, Xanh)
                for (const valString of attr.values) {
                    const newValue = await prisma.attributeValue.create({
                        data: {
                            value: valString, 
                            attributeId: newAttr.id
                        }
                    });
                    const key = `${attr.name}:${valString}`;
                    valueMap[key] = newValue.id;
                }
            }

            // 4. Tạo ProductVariants và liên kết
            for (const variant of variants) {
                // Tìm các valueId tương ứng cho variant này
                // variant.options ví dụ: { "Màu sắc": "Đỏ", "Size": "S" }
                const valueIdsToConnect = [];
                
                if (variant.options) {
                    Object.entries(variant.options).forEach(([attrName, valString]) => {
                        const key = `${attrName}:${valString}`;
                        const foundId = valueMap[key];
                        if (foundId) {
                            valueIdsToConnect.push(foundId);
                        }
                    });
                }

                await prisma.productVariant.create({
                    data: {
                        productId: product.id,
                        price: parseFloat(variant.price),
                        stock: parseInt(variant.stock),
                        sku: variant.sku,
                        // Tạo liên kết trong bảng trung gian VariantValue
                        values: {
                            create: valueIdsToConnect.map(vid => ({
                                valueId: vid 
                            }))
                        }
                    }
                });
            }

            // 5. Trả về kết quả đầy đủ
            return prisma.product.findUnique({
                where: { id: product.id },
                include: {
                    images: true,
                    attributes: { include: { values: true } },
                    variants: {
                        include: {
                            values: {
                                include: { value: true } // Lấy chi tiết value để hiển thị
                            }
                        }
                    }
                }
            });
        });

        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Lỗi tại createProduct:", error);
        res.status(500).json({ message: "Lỗi server khi tạo sản phẩm", error: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const shopOwnerId = req.user.id;
        const productId = parseInt(req.params.id);
        const {
            name,
            description,
            categoryId,
            images = [],
            attributes = [],
            variants = []
        } = req.body;

        const updatedProduct = await prisma.$transaction(async (prisma) => {
            // 1. Check Ownership
            const existingProduct = await prisma.product.findUnique({ where: { id: productId } });
            if (!existingProduct || existingProduct.ownerId !== shopOwnerId) {
                throw new Error("Product not found or access denied.");
            }

            // 2. Cập nhật thông tin Product chính
            await prisma.product.update({
                where: { id: productId },
                data: { name, description, categoryId: parseInt(categoryId) }
            });

            // 3. Xóa và tạo lại ProductImages
            await prisma.productImage.deleteMany({ where: { productId: productId } });
            if (images.length > 0) {
                await prisma.productImage.createMany({
                    data: images.map(img => ({
                        url: img.url,
                        isDefault: img.isDefault || false,
                        productId: productId
                    }))
                });
            }

            // 4. Xóa sạch dữ liệu cũ (Attributes, Variants, Values)
            // Xóa bảng nối trước
            await prisma.variantValue.deleteMany({ where: { variant: { productId: productId } } });
            // Xóa Variant
            await prisma.productVariant.deleteMany({ where: { productId: productId } });
            // Xóa Attribute Value
            await prisma.attributeValue.deleteMany({ where: { attribute: { productId: productId } } });
            // Xóa Attribute
            await prisma.attribute.deleteMany({ where: { productId: productId } });


            // 5. Tạo lại Attributes và AttributeValues mới
            const valueMap = {}; 

            for (const attr of attributes) {
                const newAttr = await prisma.attribute.create({
                    data: {
                        name: attr.name,
                        productId: productId
                    }
                });

                for (const valString of attr.values) {
                    const newValue = await prisma.attributeValue.create({
                        data: {
                            value: valString, 
                            attributeId: newAttr.id
                        }
                    });
                    
                    const key = `${attr.name}:${valString}`;
                    valueMap[key] = newValue.id;
                }
            }

            // 6. Tạo lại ProductVariants mới
            for (const variant of variants) {
                const valueIdsToConnect = [];
                
                if (variant.options) {
                    Object.entries(variant.options).forEach(([attrName, valString]) => {
                        const key = `${attrName}:${valString}`;
                        const foundId = valueMap[key];
                        if (foundId) {
                            valueIdsToConnect.push(foundId);
                        }
                    });
                }

                await prisma.productVariant.create({
                    data: {
                        productId: productId,
                        price: parseFloat(variant.price),
                        stock: parseInt(variant.stock),
                        sku: variant.sku, // Nhớ lưu SKU
                        values: {
                            create: valueIdsToConnect.map(vid => ({
                                valueId: vid
                            }))
                        }
                    }
                });
            }

            // 7. Trả về kết quả
            return prisma.product.findUnique({
                where: { id: productId },
                include: { images: true, attributes: { include: { values: true } }, variants: { include: { values: true } } }
            });
        });

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("Lỗi tại updateProduct:", error);
        res.status(500).json({ message: "Lỗi server khi cập nhật sản phẩm", error: error.message });
    }
};

/**
 * DELETE /api/products/:id
 * Xóa sản phẩm (Product, Images, Attributes, Variants)
 */
export const deleteProduct = async (req, res) => {
    try {
        const user = req.user;
        const productId = parseInt(req.params.id);

        await prisma.$transaction(async (prisma) => {
            // 1. Check Ownership
            const existingProduct = await prisma.product.findUnique({ where: { id: productId } });
            if (!existingProduct) throw new Error("Product not found.");
            
            if (user.role === 'SHOP' && existingProduct.ownerId !== user.id) { 
                throw new Error("Access denied."); 
            }

            // 2. Lấy Variants
            const variants = await prisma.productVariant.findMany({
                where: { productId: productId },
                select: { id: true }
            });
            const variantIds = variants.map(v => v.id);

            if (variantIds.length > 0) {
                await prisma.cartItem.deleteMany({
                    where: { variantId: { in: variantIds } }
                });

                await prisma.orderItem.deleteMany({
                    where: { variantId: { in: variantIds } }
                });

                await prisma.variantValue.deleteMany({
                    where: { variantId: { in: variantIds } }
                });
            }

            await prisma.productVariant.deleteMany({ 
                where: { productId: productId } 
            });

            await prisma.attributeValue.deleteMany({
                where: { attribute: { productId: productId } }
            });

            await prisma.attribute.deleteMany({ 
                where: { productId: productId } 
            });

            await prisma.productImage.deleteMany({ 
                where: { productId: productId } 
            });

            await prisma.review.deleteMany({ 
                where: { productId: productId } 
            });

            await prisma.product.delete({ 
                where: { id: productId } 
            });
        });

        res.status(200).json({ message: "Xóa sản phẩm thành công" });

    } catch (error) {
        console.error("!!! LỖI KHI XÓA !!!", error);
        
        if (error.code === 'P2003') {
             return res.status(400).json({ 
                 message: "Không thể xóa: Dữ liệu đang bị ràng buộc (Khóa ngoại).",
                 detail: error.meta?.field_name
             });
        }
        
        res.status(500).json({ 
            message: "Lỗi server (Xem terminal để biết chi tiết)", 
            error: error.message 
        });
    }
};