import prisma from '../config/prisma.js';
// Helper function 
const getOrCreateCart = async (userId) => {
    let cart = await prisma.cart.findUnique({
        where: { ownerId: userId }
    });
    if (!cart) {
        cart = await prisma.cart.create({
            data: { ownerId: userId }
        });
    }
    return cart;
};
// GET /cart
export const getCartByUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await getOrCreateCart(userId);
        const fullCart = await prisma.cart.findUnique({
            where: { id: cart.id },
            include: {
                cartItems: { 
                    include: {
                        variant: {
                            include: {
                                product: {
                                    include: {
                                        images: true,                                    
                                    }
                                }, 
                                values: { 
                                    include: {
                                        value: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        res.json(fullCart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
// POST cart/items
export const addItemToCart = async (req, res) => {
    try {
        const userID = req.user.id;
        const cart = await getOrCreateCart(userID);
        const { variantId, quantity } = req.body;
        
        if(!variantId || !quantity || quantity <= 0){
            return res.status(401).json({message: 'Invalid variant id or quantity!!!'})
        }
        const existingCartItem = await prisma.cartItem.findFirst({
            where: {
                cartId : cart.id,
                variantId : variantId
            }
        })
        let updateOrNewItem; 
        if(existingCartItem){
            updateOrNewItem = await prisma.cartItem.update({
                where: { id: existingCartItem.id},
                data: {
                    quantity : existingCartItem.quantity + quantity
                }
            });
        } else {
            updateOrNewItem = await prisma.cartItem.create({
                data: {
                    cartId : cart.id,
                    variantId : variantId,
                    quantity : quantity
                }
            })
        }
        return res.status(200).json(updateOrNewItem);
    } catch (err) {
        if(err.code === 'P2003'){
            return res.status(404).json({message : 'Not existing product variant!!!'})
        }
        res.status(500).json({message : 'Server Error when add to cart.'})
    }
}
// PUT cart/items/:itemId
export const updateCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await getOrCreateCart(userId);
        const { itemId } = req.params;
        const { newQuantity } = req.body;
        if (newQuantity <= 0) {
            return res.status(400).json({ message: 'Invalid quantity' });
        }
        const cartItem = await prisma.cartItem.findFirst({
            where : {
                cartId : cart.id,
                id : parseInt(itemId)
            }
        })
        if(!cartItem) {
            return res.status(404).json({message : 'Invalid item!!!'})
        }
        const updatedItem = await prisma.cartItem.update({
            where : { id : cartItem.id },
            data : {
                quantity : newQuantity
            }
        })
        res.json(updatedItem);
    } catch (err) {
    res.status(500).json({message : 'Server Error when update.', error : err.message})
    }
}
// DELETE cart/items/:itemId
export const deleteCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await getOrCreateCart(userId);
        const { itemId } = req.params;
        const cartItem = await prisma.cartItem.findFirst({
            where : {
                cartId : cart.id,
                id : parseInt(itemId)
            }
        })
        if(!cartItem) {
            return res.status(404).json({message : 'Invalid item!!!'})
        }
        let deleteItem = await prisma.cartItem.delete({
            where : { id : cartItem.id }
        })
        res.json(deleteItem)
    } catch (err) {
        res.status(500).json({message : 'Server Error when delete.', error : err.message})
    }
}