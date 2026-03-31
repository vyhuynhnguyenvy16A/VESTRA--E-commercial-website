import prisma from '../config/prisma.js';
import qs from 'qs';
import crypto from 'crypto';
import moment from 'moment';

// ==========================================
// INTERNAL HELPER FUNCTIONS
// ==========================================
const getUserCart = async (userId) => {
    const cart = await prisma.cart.findUnique({
        where: { ownerId: userId },
        include: { 
            cartItems: { 
                include: { 
                    variant: { 
                        include: 
                        {   product: 
                            {
                                include: { images : true }
                            },
                            values: {
                                include: {value: true}
                            }
                        }
                    }
                } 
            } 
        }
    });

    if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
        throw new Error("Empty cart!");
    }
    return cart;
};

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj){
        if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}


export const checkoutAndCreatePaymentUrl = async (req, res) => {
    try {
        const userId = req.user.id;
        const { 
            shippingAddress, shippingCity, shippingPhone, recipientName, paymentMethod 
        } = req.body;

        // 1. Basic Validation
        if (!shippingAddress || !shippingPhone || !recipientName || !paymentMethod) {
            return res.status(400).json({ message: "Please fill in all the order information!!!" });
        }

        // 2. Get Cart
        const cart = await getUserCart(userId);
        
        // Calculate Total
        const totalAmount = cart.cartItems.reduce((total, item) => {
            return total + (item.variant.price * item.quantity);
        }, 0);

        const estimatedDeliveryDate = new Date();
        estimatedDeliveryDate.setDate(new Date().getDate() + 7); // Default 7 days

        // ==================================================================
        // START TRANSACTION
        // ==================================================================
        const resultOrder = await prisma.$transaction(async (tx) => {
            
            // A. Prepare Order Items Data (MAPPING MISSING FIELDS HERE)
            const orderItemsData = cart.cartItems.map(item => {
                // Create variant name string (e.g., "Black / L")
                const variantNameStr = item.variant.values && item.variant.values.length > 0
                    ? item.variant.values.map(v => v.value.value).join(' / ')
                    : 'Standard';
                
                // Get thumbnail (default image or first image)
                const thumbnailImg = item.variant.product.images.find(img => img.isDefault)?.url 
                                     || item.variant.product.images[0]?.url 
                                     || null;

                return {
                    variantId: item.variantId,
                    quantity: item.quantity,
                    price: item.variant.price,
                    productName: item.variant.product.name,
                    variantName: variantNameStr,
                    thumbnail: thumbnailImg
                };
            });

            // B. Check Stock & Deduct Inventory
            for (const item of cart.cartItems) {
                const variant = await tx.productVariant.findUnique({ where: { id: item.variantId } });
                
                if (!variant) {
                    throw new Error(`Product variant ID ${item.variantId} does not exist.`);
                }
                if (variant.stock < item.quantity) {
                    throw new Error(`Product "${item.variant.product.name}" is out of stock.`);
                }

                // Decrement stock
                await tx.productVariant.update({
                    where: { id: item.variantId },
                    data: { stock: { decrement: item.quantity } }
                });
            }

            // C. Create Order Code
            const createDate = moment(new Date()).format('YYYYMMDDHHmmss');
            const orderCode = `ORD_${createDate}_${userId}_${Math.floor(Math.random() * 1000)}`;
            const status = paymentMethod === 'VNPAY' ? 'AWAITING_PAYMENT' : 'PENDING';

            // D. Create Order & OrderItems
            const newOrder = await tx.order.create({
                data: {
                    userId,
                    totalAmount,
                    status,
                    shippingAddress,
                    shippingCity: shippingCity || '',
                    shippingPhone,
                    recipientName,
                    paymentMethod, 
                    estimatedDeliveryDate,
                    orderCode,
                    items: {
                        create: orderItemsData 
                    }
                },
                include: { items: true }
            });

            // E. Clear Cart
            await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

            return newOrder;
        });

        // ==================================================================
        // HANDLE RESPONSE (CASH vs VNPAY)
        // ==================================================================
        if (paymentMethod === 'CASH') {
            return res.status(201).json({ message: 'Order successful', order: resultOrder });
        } 
        else if (paymentMethod === 'VNPAY') {
            // VNPAY Logic
            const tmnCode = process.env.VNP_TMNCODE;
            const secretKey = process.env.VNP_HASHSECRET;
            let vnpUrl = process.env.VNP_URL;
            const returnUrl = process.env.VNP_RETURN_URL;
            
            const ipAddr = req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;

            let vnp_Params = {};
            vnp_Params['vnp_Version'] = '2.1.0';
            vnp_Params['vnp_Command'] = 'pay';
            vnp_Params['vnp_TmnCode'] = tmnCode;
            vnp_Params['vnp_Locale'] = 'vn';
            vnp_Params['vnp_CurrCode'] = 'VND';
            vnp_Params['vnp_TxnRef'] = resultOrder.orderCode;
            vnp_Params['vnp_OrderInfo'] = `Pay for order: ${resultOrder.orderCode}`;
            vnp_Params['vnp_OrderType'] = 'other';
            vnp_Params['vnp_Amount'] = totalAmount * 100;
            vnp_Params['vnp_ReturnUrl'] = returnUrl;
            vnp_Params['vnp_IpAddr'] = ipAddr;
            vnp_Params['vnp_CreateDate'] = moment(new Date()).format('YYYYMMDDHHmmss');

            vnp_Params = sortObject(vnp_Params);
            const signData = qs.stringify(vnp_Params, { encode: false });
            const hmac = crypto.createHmac("sha512", secretKey);
            const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
            vnp_Params['vnp_SecureHash'] = signed;
            vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false });
            return res.status(200).json(vnpUrl);
        }

    } catch (error) {
        console.error("Checkout Error:", error);
        if (error.message.includes("out of stock") || error.message.includes("Empty cart")) {
             return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Server error when checkout", error: error.message });
    }
};

/**
 * 2. VNPAY IPN HANDLER
 * Logic: 
 * - Success: Update status (Không cần trừ kho vì đã trừ lúc checkout).
 * - Fail: Update status Cancel + HOÀN KHO (Cộng lại stock).
 */
export const vnpayIpnHandler = async (req, res) => {
    try {
        let vnp_Params = {};
        for (let key in req.query) {
            vnp_Params[key] = req.query[key];
        }
        const secureHash = vnp_Params['vnp_SecureHash'];
        
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);
        const secretKey = process.env.VNP_HASHSECRET;
        const signData = qs.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

        if (secureHash === signed) {
            const vnp_TxnRef = vnp_Params['vnp_TxnRef'];
            const responseCode = vnp_Params['vnp_ResponseCode'];

            const orderToUpdate = await prisma.order.findUnique({
                where: { orderCode: vnp_TxnRef }
            });

            if (!orderToUpdate) {
                 return res.status(200).json({ RspCode: '01', Message: 'Order not found' });
            }

            // Kiểm tra trạng thái để tránh xử lý trùng lặp
            if (orderToUpdate.status !== 'AWAITING_PAYMENT') {
                 return res.status(200).json({ RspCode: '02', Message: 'Order already confirmed' });
            }

            if (responseCode === '00') {
                // ===============================================
                // CASE 1: THANH TOÁN THÀNH CÔNG
                // ===============================================
                // Kho đã bị trừ lúc checkout -> Không cần làm gì với kho -> Chỉ update Status
                
                await prisma.order.update({
                    where: { id: orderToUpdate.id },
                    data: { status: 'PENDING' }
                });

                const cart = await prisma.cart.findUnique({ where: { ownerId: orderToUpdate.userId } });
                if (cart) {
                    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
                }
                
                res.status(200).json({ RspCode: '00', Message: 'Success' });

            } else {
                // ===============================================
                // CASE 2: THANH TOÁN THẤT BẠI / HỦY
                // ===============================================
                // Kho đã bị trừ lúc checkout -> Cần hoàn lại kho (RESTOCK)
                
                await prisma.$transaction(async (tx) => {
                    // 1. Cập nhật trạng thái hủy
                    const updatedOrder = await tx.order.update({
                        where: { id: orderToUpdate.id },
                        data: { status: 'CANCELLED'}
                    });

                    // 2. Lấy danh sách sản phẩm trong đơn
                    const orderItems = await tx.orderItem.findMany({
                        where: { orderId: updatedOrder.id }
                    });

                    // 3. Cộng lại số lượng vào kho (Increment)
                    for (const item of orderItems) {
                        if (item.variantId) {
                        await tx.productVariant.update({
                            where: { id: item.variantId },
                            data: { stock: { increment: item.quantity } }
                        }).catch(() => {
                            console.log(`Cannot restock variant ${item.variantId}, it might be deleted.`);
                        })
                        }
                    }
                });

                res.status(200).json({ RspCode: '01', Message: 'Payment Failed - Stock Restored' });
            }
        } else {
            res.status(200).json({ RspCode: '97', Message: 'Invalid Checksum' });
        }
    } catch (error) {
        console.error("IPN Error:", error);
        res.status(500).json({ message: "Server error IPN", error: error.message });
    }
};

export const vnpayReturn = async (req, res) => {
    try {
        let vnp_Params = req.query;
        const secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);
        const secretKey = process.env.VNP_HASHSECRET;
        const signData = qs.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

        const frontendUrl = 'http://localhost:5173/order-success';

        if (secureHash === signed) {
            if (vnp_Params['vnp_ResponseCode'] === '00') {
                return res.redirect(`${frontendUrl}?status=success&code=${vnp_Params['vnp_TxnRef']}`);
            } else {
                return res.redirect(`${frontendUrl}?status=failed`);
            }
        } else {
            return res.redirect(`${frontendUrl}?status=failed&reason=invalid_checksum`);
        }
    } catch (error) {
        console.error("VNPAY Return Error:", error);
        return res.redirect('http://localhost:5173/order-success?status=failed&reason=server_error');
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        const orders = await prisma.order.findMany({
            where : { userId : userId },
            include: {
                items: true
            },
            orderBy: { createdAt: 'desc' }
        });

        if(!orders || orders.length === 0){
            return res.status(200).json([]);
        }

        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({message: 'Server error when get orders!!!', error : err.message});
    }
}

export const getOrderById = async (req, res) => {
    try {
        const userId = req.user.id;
        const orderIdString = req.params.id;
        const orderId = parseInt(orderIdString);

        if(isNaN(orderId)){
            return res.status(400).json({message: 'Invalid order ID!!!'});
        }

        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
                userId: userId
            },
            include: {
                items: true
            },
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found or you do not have permission to view it." });
        }

        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({message : 'Server error when get order by ID!!!', error : err.message});
    }
}