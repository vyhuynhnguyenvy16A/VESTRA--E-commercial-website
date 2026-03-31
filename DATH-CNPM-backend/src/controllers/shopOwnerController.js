import prisma from '../config/prisma.js';

// ===========================================
// SHOP OWNER APIs
// ===========================================

/**
 * GET /api/shop/products
 * Retrieves a paginated list of products belonging ONLY to the current Shop Owner.
 */
export const getShopOwnerProducts = async (req, res) => {
    try {
        const shopOwnerId = req.user.id;
        const { page = 1, limit = 10, search = '', category, status } = req.query; 

        const whereClause = {
            ownerId: shopOwnerId, 
            name: { contains: search, mode: 'insensitive' },
        };

        if (category && category !== 'Tất cả' && !category.includes('Tất cả')) {
            whereClause.category = { name: category };
        }

        const rawProducts = await prisma.product.findMany({
            where: whereClause,
            include: {
                category: true, 
                variants: true, 
                images: true    
            },
            orderBy: { createdAt: 'desc' }
        });

        let processedProducts = rawProducts.map(p => {
            const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);

            let statusStr = "Hết"; 
            if (totalStock > 10) statusStr = "Tồn kho";
            else if (totalStock > 0) statusStr = "Sắp hết";

            const priceRange = p.variants.length > 0 
                ? `${Number(p.variants[0].price).toLocaleString()} VND` 
                : "0 VND";

            return {
                id: p.id,
                name: p.name,
                sku: p.variants[0]?.sku || `PROD-${p.id}`, 
                category: p.category?.name || "Chưa phân loại",
                price: priceRange,
                stock: totalStock,
                status: statusStr, 
                icon: p.images.length > 0 ? p.images[0].url : "" 
            };
        });

        if (status && status !== 'Tất cả' && !status.includes('Tất cả')) {
            const filterKey = status === "Hết hàng" ? "Hết" : status;
            
            processedProducts = processedProducts.filter(p => p.status === filterKey);
        }

        let inStock = 0, lowStock = 0, outOfStock = 0;
        processedProducts.forEach(p => {
            if (p.status === "Tồn kho") inStock++;
            else if (p.status === "Sắp hết") lowStock++;
            else outOfStock++;
        });

        const totalItems = processedProducts.length;
        const totalPages = Math.ceil(totalItems / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);
        
        const paginatedProducts = processedProducts.slice(startIndex, endIndex);

        res.status(200).json({
            success: true,
            products: paginatedProducts,
            stats: {
                totalProducts: totalItems,
                inStock,
                lowStock,
                outOfStock
            },
            pagination: {
                currentPage: Number(page),
                totalPages: totalPages,
                totalItems,
                itemsPerPage: Number(limit),
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Lỗi lấy danh sách sản phẩm" });
    }
};

/**
 * POST /api/shop/products/import
 * Imports multiple new products.
 */
export const importShopOwnerProducts = async (req, res) => {
    try {
        const shopOwnerId = req.user.id;
        const { products } = req.body; 

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Invalid input data." });
        }

        const productsCreated = await prisma.$transaction(
            products.map(product =>
                prisma.product.create({
                    data: {
                        name: product.name,
                        description: product.description,
                        categoryId: product.categoryId,
                        ownerId: shopOwnerId,
                        images: { create: product.images },
                        variants: { create: product.variants }
                    }
                })
            )
        );

        res.status(201).json({
            message: `Successfully imported ${productsCreated.length} product(s).`,
            data: productsCreated
        });

    } catch (error) {
        console.error("Error in importShopOwnerProducts:", error);
        res.status(500).json({ message: "Server error during product import", error: error.message });
    }
};

/**
 * GET /api/shop/products/list
 * Non-paginated list for dropdowns.
 */
export const getShopOwnerProductList = async (req, res) => {
    try {
        const shopOwnerId = req.user.id;
        const products = await prisma.product.findMany({
            where: { ownerId: shopOwnerId },
            include: { images: true, variants: true },
            orderBy: { name: 'asc' }
        });
        res.status(200).json(products);
    } catch (error) {
        console.error("Error in getShopOwnerProductList:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ===========================================
// REPORT & STATS APIs
// ===========================================

/**
 * GET /api/shop/stats
 * Retrieves Dashboard statistics.
 */
export const getShopOwnerStats = async (req, res) => {
    try {
        const shopOwnerId = req.user.id;
        const now = new Date();
        
        // CHUẨN BỊ MỐC THỜI GIAN
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0); 

        // HELPER FUNCTION: Tính số liệu trong khoảng thời gian
        const getStatsByDateRange = async (from, to) => {
            // Lấy các đơn hàng trong khoảng thời gian này
            const orders = await prisma.order.findMany({
                where: {
                    createdAt: { gte: from, lte: to || now },
                    items: { some: { variant: { product: { ownerId: shopOwnerId } } } }
                },
                include: {
                    items: {
                        include: { variant: { include: { product: true } } }
                    }
                }
            });

            let revenue = 0;
            let orderCount = orders.length;
            const customerSet = new Set();

            orders.forEach(order => {
                // Đếm khách hàng unique
                if (order.userId) customerSet.add(order.userId);

                // Tính doanh thu (chỉ tính item của shop mình và đơn đã giao)
                if (order.status === 'DELIVERED') {
                    const shopItems = order.items.filter(item => item.variant.product.ownerId === shopOwnerId);
                    const orderRevenue = shopItems.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);
                    revenue += orderRevenue;
                }
            });

            return {
                revenue,
                orders: orderCount,
                customers: customerSet.size
            };
        };

        // LẤY SỐ LIỆU THÁNG NAY VS THÁNG TRƯỚC
        const [thisMonthStats, lastMonthStats] = await Promise.all([
            getStatsByDateRange(thisMonthStart),               // Từ đầu tháng này đến nay
            getStatsByDateRange(lastMonthStart, lastMonthEnd)  // Trọn vẹn tháng trước
        ]);

        // TÍNH TỔNG LŨY KẾ (ALL TIME)
        // Để hiển thị con số to nhất (Tổng doanh thu, Tổng đơn hàng từ trước tới nay)
        const allTimeItems = await prisma.orderItem.findMany({
            where: { variant: { product: { ownerId: shopOwnerId } } },
            include: { order: true }
        });

        let totalRevenueAllTime = 0;
        const totalOrdersSet = new Set();

        allTimeItems.forEach(item => {
            if (item.order) {
                totalOrdersSet.add(item.orderId);
                if (item.order.status === 'DELIVERED') {
                    totalRevenueAllTime += (Number(item.price) * Number(item.quantity));
                }
            }
        });

        // TÍNH PHẦN TRĂM TĂNG TRƯỞNG
        const calculateGrowth = (current, previous) => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return ((current - previous) / previous) * 100;
        };

        const revenueGrowth = calculateGrowth(thisMonthStats.revenue, lastMonthStats.revenue);
        const ordersGrowth = calculateGrowth(thisMonthStats.orders, lastMonthStats.orders);
        const customersGrowth = calculateGrowth(thisMonthStats.customers, lastMonthStats.customers);

        const formatGrowth = (val) => `${val >= 0 ? '+' : ''}${val.toFixed(1)}%`;

        // ĐẾM SẢN PHẨM ĐANG BÁN
        const activeProducts = await prisma.product.count({ where: { ownerId: shopOwnerId } });
        const newProducts = await prisma.product.count({
            where: {
                ownerId: shopOwnerId,
                createdAt: { gte: thisMonthStart }
            }
        });

        // Logic Top Selling 
        const topSellingRaw = await prisma.orderItem.groupBy({
            by: ['variantId'],
            where: { variant: { product: { ownerId: shopOwnerId } } },
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: 'desc' } },
            take: 4
        });

        const topSelling = await Promise.all(topSellingRaw.map(async (item) => {
            const variant = await prisma.productVariant.findUnique({
                where: { id: item.variantId },
                include: { product: { include: { images: true } } }
            });
            if (!variant) return null;
            return {
                id: variant.product.id,
                title: variant.product.name,
                price: `${Number(variant.price).toLocaleString()} VND`,
                sold: item._sum.quantity,
                image: variant.product.images[0]?.url || ""
            };
        }));

        // Logic Recent Orders 
        const recentOrdersData = await prisma.order.findMany({
            where: { id: { in: Array.from(totalOrdersSet) } },
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: { user: true }
        });

        const recentOrders = recentOrdersData.map(o => ({
            id: o.id,
            name: o.user ? (o.user.fullName || o.user.name) : "Khách lẻ",
            orderNumber: `ORD-${o.id}`,
            total: `${Number(o.totalAmount).toLocaleString()} VND`,
            status: o.status
        }));


        res.status(200).json({
            success: true,
            stats: {
                totalRevenue: `${totalRevenueAllTime.toLocaleString()} VND`,
                revenueChange: formatGrowth(revenueGrowth), 
                
                totalOrders: totalOrdersSet.size,
                ordersChange: formatGrowth(ordersGrowth),

                activeProducts: activeProducts,
                newProducts: newProducts,
                
                newCustomers: thisMonthStats.customers,  
                customersChange: formatGrowth(customersGrowth)
            },
            topSelling: topSelling.filter(item => item !== null),
            recentOrders
        });

    } catch (error) {
        console.error("Error in getShopOwnerStats:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

/**
 * GET /api/shop/revenue-chart
 */
export const getShopRevenueChartData = async (req, res) => {
    try {
        const shopOwnerId = req.user.id;
        const days = parseInt(req.query.days) || 7;
        
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);

        // Lấy orders đã giao
        const orders = await prisma.order.findMany({
            where: {
                status: 'DELIVERED',
                createdAt: { gte: startDate, lte: endDate },
                items: { some: { variant: { product: { ownerId: shopOwnerId } } } }
            },
            select: { totalAmount: true, createdAt: true }
        });

        // Group by Date
        const revenueByDate = {};
        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (days - 1 - i));
            const dateString = date.toISOString().split('T')[0];
            revenueByDate[dateString] = 0;
        }

        orders.forEach(order => {
            const dateString = order.createdAt.toISOString().split('T')[0];
            if (revenueByDate[dateString] !== undefined) {
                revenueByDate[dateString] += Number(order.totalAmount);
            }
        });

        const chartData = Object.keys(revenueByDate).map(date => ({
            date: date,
            revenue: revenueByDate[date]
        }));

        res.status(200).json({ success: true, data: chartData }); // Trả về dạng {data: []} cho đồng nhất
    } catch (error) {
        console.error("Error in getShopRevenueChartData:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ===========================================
// ORDER APIs
// ===========================================

/**
 * GET /api/shop/orders
 */
export const getShopOwnerOrders = async (req, res) => {
    try {
        const shopOwnerId = req.user.id;
        const { page = 1, limit = 10, status } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        // 1. Tìm tất cả Order liên quan đến Shop
        const relevantOrderItems = await prisma.orderItem.findMany({
            where: { variant: { product: { ownerId: shopOwnerId } } },
            select: { orderId: true }
        });
        const relevantOrderIds = [...new Set(relevantOrderItems.map(item => item.orderId))];

        // Filter condition
        const whereCondition = {
            id: { in: relevantOrderIds },
            ...(status && status !== 'Tất cả' && { status: status })
        };

        // 2. Query Orders & Count Total
        const [orders, totalCount] = await prisma.$transaction([
            prisma.order.findMany({
                where: whereCondition,
                skip,
                take,
                include: {
                    user: true, 
                    items: {
                        include: { variant: { include: { product: true } } }
                    }
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.order.count({ where: whereCondition })
        ]);

        const statusCounts = await prisma.order.groupBy({
            by: ['status'],
            where: { id: { in: relevantOrderIds } },
            _count: { status: true }
        });
        
        // Convert array stats thành object map
        const statsMap = statusCounts.reduce((acc, curr) => {
            acc[curr.status] = curr._count.status;
            return acc;
        }, {});

        // 3. Format dữ liệu trả về Frontend
        const formattedOrders = orders.map(order => {
             // Chỉ giữ lại items của shop mình
             const myItems = order.items.filter(item => item.variant.product.ownerId === shopOwnerId);
             
             return {
                 id: `ORD-${order.id}`,
                 originalId: order.id,
                 customer: {
                     name: order.user ? (order.user.fullName || order.user.name) : "Khách lẻ",
                     email: order.user ? order.user.email : "",
                     avatar: order.user?.avatar || "https://via.placeholder.com/150"
                 },
                 products: myItems.map(i => `${i.variant.product.name} (x${i.quantity})`),
                 price: `${Number(order.totalAmount).toLocaleString()} VND`,
                 status: order.status,
                 date: new Date(order.createdAt).toLocaleDateString('vi-VN')
             };
        });

        res.status(200).json({
            success: true,
            data: formattedOrders,
            stats: {
                total: relevantOrderIds.length,
                pending: statsMap['PENDING'] || 0,
                processing: statsMap['PROCESSING'] || 0,
                shipping: statsMap['SHIPPING'] || 0,
                completed: statsMap['DELIVERED'] || 0,
            },
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(totalCount / take),
                totalItems: totalCount,
                itemsPerPage: take
            }
        });
    } catch (error) {
        console.error("Error in getShopOwnerOrders:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

/**
 * PUT /api/orders/:id/status
 */
export const updateOrderStatus = async (req, res) => {
    try {
        const shopOwnerId = req.user.id;
        const orderId = parseInt(req.params.id); // Params là ID số
        
        
        const { status } = req.body;

        const existingOrder = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: { include: { variant: { include: { product: true } } } }
            }
        });

        if (!existingOrder) return res.status(404).json({ message: "Order not found." });

        const isShopOwnerRelevant = existingOrder.items.some(item =>
            item.variant.product.ownerId === shopOwnerId
        );

        if (!isShopOwnerRelevant) {
            return res.status(403).json({ message: "Không có quyền cập nhật đơn này." });
        }

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status: status }
        });

        res.status(200).json({ success: true, message: "Cập nhật thành công", data: updatedOrder });
    } catch (error) {
        console.error("Error in updateOrderStatus:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

/**
 * GET /api/shop/revenue-report
 * Retrieves detailed revenue report for a date range.
 */
export const getRevenueReport = async (req, res) => {
    try {
        const shopOwnerId = req.user.id;
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: "startDate and endDate must be provided." });
        }

        const orders = await prisma.order.findMany({
            where: {
                status: 'DELIVERED',
                createdAt: {
                    gte: new Date(startDate),
                    lte: new Date(endDate)
                },
                items: {
                    some: {
                        variant: {
                            product: {
                                ownerId: shopOwnerId
                            }
                        }
                    }
                }
            },
            select: {
                totalAmount: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        });

        const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);

        res.status(200).json({
            totalRevenue: totalRevenue,
            reportDetails: orders
        });
    } catch (error) {
        console.error("Error in getRevenueReport:", error);
        res.status(500).json({ message: "Server error when fetching revenue report", error: error.message });
    }
};

/**
 * GET /api/shop/products/summary
 * Retrieves product summary for quick view.
 */
export const getShopOwnerProductSummary = async (req, res) => {
    try {
        const shopOwnerId = req.user.id;
        const products = await prisma.product.findMany({
            where: { ownerId: shopOwnerId },
            select: {
                id: true,
                name: true,
                variants: {
                    select: {
                        price: true,
                        stock: true
                    }
                }
            },
            orderBy: { name: 'asc' }
        });
        res.status(200).json(products);
    } catch (error) {
        console.error("Error in getShopOwnerProductSummary:", error);
        res.status(500).json({ message: "Server error when fetching product summary", error: error.message });
    }
};