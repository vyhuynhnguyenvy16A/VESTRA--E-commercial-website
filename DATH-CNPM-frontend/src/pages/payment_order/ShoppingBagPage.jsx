import React, { useEffect, useState, useRef } from 'react';
import { 
  Container, Grid, Typography, Divider, Box, Button, CircularProgress 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

import ShoppingBagItem from '../../components/PaymentOrderPage/ShoppingPageItem';
import VestraOrderSummary from '../../components/PaymentOrderPage/VestraOrderSummary';
import cartService from '../../api/cartService'; 

function ShoppingBagPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const debounceTimeouts = useRef({});

  const fetchCart = async () => {
    try {
      const res = await cartService.getCart(); 
      const backendCart = res.data;

      if (backendCart && backendCart.cartItems) {
        const mappedItems = backendCart.cartItems.map(item => ({
          id: item.id, 
          variantId: item.variantId, 
          name: item.variant.product.name,
          
          price: item.variant.price,
          priceRaw: Number(item.variant.price) || 0, 
          
          quantity: Number(item.quantity),
          
          image: item.variant.product.images.find(img => img.isDefault)?.url || item.variant.product.images[0]?.url,
          variantName: item.variant.values?.map(v => v.value.value).join(' / ') || 'Tiêu chuẩn',
          sku: item.variant.sku || 'N/A'
        }));
        
        setCartItems(mappedItems);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemoveItem = async (cartItemId) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?")) return;

    try {
      setCartItems(prev => prev.filter(item => item.id !== cartItemId));
      
      await cartService.removeItem(cartItemId); 
    } catch (error) {
      console.error(error);
      fetchCart(); 
    }
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    setCartItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));

    if (debounceTimeouts.current[itemId]) {
      clearTimeout(debounceTimeouts.current[itemId]);
    }

    debounceTimeouts.current[itemId] = setTimeout(async () => {
      try {
        await cartService.updateItemQuantity(itemId, newQuantity);
      } catch (error) {
        console.error("Lỗi cập nhật API:", error);
        fetchCart(); 
      }
    }, 500); 
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.priceRaw * item.quantity), 0);
  const shippingFee = 0;
  const tax = 0;
  const total = subtotal + shippingFee + tax;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (

    
    <Container maxWidth="xl" sx={{ py: 4 }}>

      {/* --- NÚT QUAY LẠI TRANG CHỦ --- */}
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate('/')}
        sx={{ mb: 3, color: 'text.secondary', textTransform: 'none', fontWeight: 500 }}
      >
        Tiếp tục mua sắm
      </Button>
      <Grid container spacing={4}>
        
        <Grid item xs={12} lg={8}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', textTransform: 'uppercase', mb: 2 }}>
            GIỎ HÀNG CỦA BẠN ({cartItems.length} SẢN PHẨM)
          </Typography>
          
          <Box sx={{ borderTop: '1px solid #eee' }}>
            {cartItems.length === 0 ? (
              <Typography sx={{ mt: 2, color: 'text.secondary', fontStyle: 'italic' }}>
                Giỏ hàng của bạn đang trống.
              </Typography>
            ) : (
              cartItems.map((item) => (
                <ShoppingBagItem 
                  key={item.id}
                  item={item} 
                  onRemove={() => handleRemoveItem(item.id)} 
                  onUpdateQuantity={handleUpdateQuantity}
                />
              ))
            )}
          </Box>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Box sx={{ position: 'sticky', top: 24 }}>
            <VestraOrderSummary 
              items={cartItems}
              subtotal={subtotal}
              shippingFee={shippingFee}
              tax={tax}
              total={total}
            />

            <Button
              fullWidth
              variant="contained"
              disabled={cartItems.length === 0}
              onClick={() => navigate('/checkout')}
              sx={{
                bgcolor: 'black', color: 'white', borderRadius: 0, py: 1.5,
                fontSize: '0.9rem', fontWeight: 'bold',
                '&:hover': { bgcolor: '#333' },
                mt: 2
              }}
            >
              TIẾP TỤC THANH TOÁN
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ShoppingBagPage;