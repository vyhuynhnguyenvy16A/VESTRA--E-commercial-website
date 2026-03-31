// src/pages/user_homepage/PaymentPage.jsx

import React, { useEffect , useState } from 'react';
import { 
  Container, Grid, Box, Typography, 
  Radio, RadioGroup, FormControlLabel, Paper,
  Stepper, Step, StepLabel, Divider, Button
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import VestraOrderSummary from '../../components/PaymentOrderPage/VestraOrderSummary';
import { createOrder } from '../../api/paymentOrderService';
import cartService from '../../api/cartService';

const paymentOptions = [
  { id: 'VNPAY', name: 'Thanh toán qua VNPAY / Ngân hàng' },
  { id: 'CASH', name: 'Thanh toán khi nhận hàng (COD)' },
];


function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { shippingInfo } = location.state || {}; 

  const [paymentMethod, setPaymentMethod] = useState('CASH'); // Mặc định
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [activeStep] = useState(1);

  useEffect(() => {
    if (!shippingInfo) {
      alert("Vui lòng nhập thông tin giao hàng trước!");
      navigate('/checkout');
      return;
    }
    fetchCart();
  }, [shippingInfo, navigate]);

  const fetchCart = async () => {
    try {
        const res = await cartService.getCart(); 
        const backendCart = res.data;
        console.log("Dữ liệu giỏ hàng nhận được:", backendCart);
        if (backendCart && backendCart.cartItems) {
            setCartItems(backendCart.cartItems.map(item => ({
                id: item.id,
                name: item.variant.product.name,
                price: item.variant.price,
                priceRaw: item.variant.price,
                quantity: item.quantity,
                image: item.variant.product.images[0]?.url
            })));
        }
    } catch (err) { console.error(err); }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.priceRaw * item.quantity), 0);
  const shippingFee = 0; 
  const tax = 0; 
  const total = subtotal + shippingFee + tax;

  const handlePayment = async () => {
    setLoading(true);
    try {

        const payload = {
            ...shippingInfo, 
            paymentMethod: paymentMethod 
        };
        const data = await createOrder(payload);

        // Xử lý phản hồi dựa trên method
        if (paymentMethod === 'VNPAY') {
            window.location.href = data; 
        } else {
            alert("Đặt hàng thành công!");
            const orderCode = data.order?.orderCode || '';
            navigate(`/order-success?status=success&code=${orderCode}`);
        }
    } catch (error) {
        console.error("Lỗi thanh toán:", error);
        const mess = error.message || "Có lỗi xảy ra khi thanh toán.";
        
        if (mess.includes("không đủ hàng")) {
            alert("Sản phẩm đã hết hàng, vui lòng kiểm tra lại giỏ hàng.");
            navigate('/shopping-bag');
        } else {
            alert(mess);
        }
    } finally {
        setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, bgcolor: '#fff' }}>
      <Grid container spacing={5}>
        
        {/* CỘT TRÁI: FORM THANH TOÁN */}
        <Grid item xs={12} md={7}>
          
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            <Step>
              <StepLabel>Thông tin giao hàng</StepLabel>
            </Step>
            <Step>
              <StepLabel>Thanh toán</StepLabel>
            </Step>
          </Stepper>

          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Phương thức thanh toán
          </Typography>
          <RadioGroup
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            {paymentOptions.map((opt) => (
              <Paper 
                key={opt.id}
                variant="outlined" 
                sx={{ 
                  p: 1.5, mb: 1.5,
                  borderColor: paymentMethod === opt.id ? 'primary.main' : '#eee',
                  borderWidth: paymentMethod === opt.id ? '2px' : '1px'
                }}
              >
                <FormControlLabel value={opt.id} control={<Radio />} label={opt.name} />
              </Paper>
            ))}
          </RadioGroup>

          {/* Nút Trở lại */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mt: 4, 
            borderTop: '1px solid #eee', 
            pt: 3 
          }}>
            <Button 
              variant="outlined" 
              startIcon={<ArrowBackIcon />} 
              onClick={() => navigate('/checkout')} // Quay về trang Giao hàng
              sx={{ color: 'text.primary', borderColor: '#ccc' }}
            >
              Trở lại
            </Button>
          </Box>
        </Grid>

        {/* CỘT PHẢI: HÓA ĐƠN */}
        <Grid item xs={12} md={5}>
          <VestraOrderSummary 
            items={cartItems}
            subtotal={subtotal}
            shippingFee={shippingFee}
            tax={tax}
            total={total}
          />

          {/* Nút "Thanh toán" cuối cùng */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handlePayment} 
            sx={{
              borderRadius: 1,
              py: 1.5,
              fontSize: '1rem', 
              fontWeight: 'bold',
              mt: 2, // Thêm khoảng cách
              bgcolor: '#3B82F6' // Màu xanh
            }}
          >
            Thanh toán
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default PaymentPage;