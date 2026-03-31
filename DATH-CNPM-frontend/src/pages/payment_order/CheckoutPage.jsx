// src/pages/user_homepage/CheckoutPage.jsx

import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Box, Typography, TextField, 
  Radio, RadioGroup, FormControlLabel, FormControl, 
  InputLabel, Select, MenuItem, Checkbox, Link, Paper,
  Stepper, Step, StepLabel, Divider, Button, CircularProgress
} from '@mui/material';

import cartService from '../../api/cartService';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// STATIC DATA CHO HÌNH THỨC GIAO HÀNG
const shippingOptions = [
  { id: 'standard', name: 'Tiêu chuẩn', time: '5-7 ngày', price: 0 },
  { id: 'express', name: 'Nhanh', time: '2-3 ngày', price: 50000 }
];

// Hàm format tiền VND
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
};


function CheckoutPage() {
  const navigate = useNavigate(); 
  const [activeStep] = useState(0); 
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);

  const [shippingMethod, setShippingMethod] = useState('standard'); 

  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    note: '',
    shippingMethod: 'standard' // Mặc định
  });

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await cartService.getCart();
        const backendCart = res.data;

        if (backendCart && backendCart.cartItems) {
          // Map dữ liệu từ Prisma sang cấu trúc hiển thị
          const mappedItems = backendCart.cartItems.map(item => ({
            id: item.id,
            name: item.variant.product.name,
            quantity: item.quantity,
            price: item.variant.price,
            // Lấy ảnh default hoặc ảnh đầu tiên
            image: item.variant.product.images.find(img => img.isDefault)?.url || item.variant.product.images[0]?.url,
            // Variant info (Size/Color)
            variantName: item.variant.values?.map(v => v.value.value).join(' - ')
          }));
          setCartItems(mappedItems);
        }
      } catch (error) {
        console.error("Lỗi tải giỏ hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const selectedShipping = shippingOptions.find(opt => opt.id === formData.shippingMethod);
  const shippingFee = selectedShipping ? selectedShipping.price : 0;
  const tax = 30000; 
  const total = subtotal + shippingFee + tax;

  const handleContinue = () => {
    // Validate cơ bản
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.address || !formData.city) {
      alert("Vui lòng điền đầy đủ các trường bắt buộc (*)");
      return;
    }

    const shippingInfo = {
      recipientName: `${formData.lastName} ${formData.firstName}`.trim(),
      shippingPhone: formData.phone,
      shippingCity: formData.city,
      shippingAddress: formData.district ? `${formData.address}, ${formData.district}` : formData.address,
      
      email: formData.email,
      note: formData.note,
      shippingMethod: formData.shippingMethod,
      shippingFee: shippingFee
    };

    navigate('/payment', { state: { shippingInfo } });
  };

  if (loading) return <Box sx={{ display:'flex', justifyContent:'center', py: 10 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="lg" sx={{ py: 4, bgcolor: '#fff' }}>
      <Grid container spacing={5}>
        
        {/* CỘT TRÁI: FORM NHẬP LIỆU */}
        <Grid item xs={12} md={7}>
          
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            <Step><StepLabel>Thông tin giao hàng</StepLabel></Step>
            <Step><StepLabel>Thanh toán</StepLabel></Step>
          </Stepper>

          {/* Form thông tin liên lạc */}
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Thông tin liên lạc
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth label="Họ và tên đệm *" variant="outlined" 
                name="lastName" value={formData.lastName} onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth label="Tên *" variant="outlined" 
                name="firstName" value={formData.firstName} onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth label="Địa chỉ Email" variant="outlined" 
                name="email" value={formData.email} onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth label="Số điện thoại *" variant="outlined" 
                name="phone" value={formData.phone} onChange={handleChange}
              />
            </Grid>
          </Grid>

          {/* Form địa chỉ nhận hàng */}
          <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2 }}>
            Địa chỉ nhận hàng
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField 
                fullWidth label="Số nhà/Tên đường *" variant="outlined" 
                name="address" value={formData.address} onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth label="Tỉnh/Thành phố *" variant="outlined" 
                name="city" value={formData.city} onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth label="Quận/Huyện" variant="outlined"
                name="district" value={formData.district} onChange={handleChange}
              />
            </Grid>
          </Grid>

          {/* Form hình thức giao hàng */}
          <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2 }}>
            Hình thức giao hàng
          </Typography>
          <RadioGroup
            name="shippingMethod"
            value={formData.shippingMethod}
            onChange={handleChange}
          >
            {shippingOptions.map((opt) => (
              <Paper 
                key={opt.id}
                variant="outlined" 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  p: 1.5, 
                  mb: 1.5,
                  borderColor: formData.shippingMethod === opt.id ? 'primary.main' : '#eee',
                  borderWidth: formData.shippingMethod === opt.id ? '2px' : '1px',
                  cursor: 'pointer'
                }}
                onClick={() => setFormData({...formData, shippingMethod: opt.id})}
              >
                <FormControlLabel 
                  value={opt.id} 
                  control={<Radio />} 
                  label={opt.name + ` (${opt.time})`} 
                  sx={{ pointerEvents: 'none' }}
                />
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(opt.price)}
                </Typography>
              </Paper>
            ))}
          </RadioGroup>

          {/* Form lời nhắn */}
          <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2 }}>
            Lời nhắn
          </Typography>
          <TextField
            fullWidth multiline rows={4}
            placeholder="Ghi chú cho shipper..."
            variant="outlined"
            name="note" value={formData.note} onChange={handleChange}
          />

          {/* NÚT ĐIỀU HƯỚNG */}
         <Box sx={{ display: 'flex', gap: 2, mt: 4, borderTop: '1px solid #eee', pt: 3 }}>
            <Button 
              variant="outlined" 
              startIcon={<ArrowBackIcon />} 
              onClick={() => navigate('/shopping-bag')}
              sx={{ flex: 1, py: 1.2 }}
            >
              Trở lại giỏ hàng
            </Button>

            <Button 
              variant="contained" 
              endIcon={<ArrowForwardIcon />} 
              onClick={handleContinue} 
              sx={{ bgcolor: '#3B82F6', flex: 1, py: 1.2 }}
            >
              Tiếp tục thanh toán
            </Button>
          </Box>
        </Grid>

        {/* CỘT PHẢI: HÓA ĐƠN */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, borderRadius: 2, bgcolor: '#f9f9f9', position: 'sticky', top: 20 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Thông tin đơn hàng ({cartItems.length} sản phẩm)
            </Typography>
            
            {cartItems.map((item, index) => (
              <Box key={index}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {/* Ảnh nhỏ */}
                    <Box component="img" src={item.image} sx={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 1 }} />
                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{item.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                        {item.variantName} x {item.quantity}
                        </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(item.price * item.quantity)}
                  </Typography>
                </Box>
                <Divider sx={{ mb: 1.5 }} />
              </Box>
            ))}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">Tạm tính</Typography>
              <Typography variant="body1">{formatCurrency(subtotal)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">Phí giao hàng</Typography>
              <Typography variant="body1">{formatCurrency(shippingFee)}</Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Tổng cộng</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                {formatCurrency(total)}
              </Typography>
            </Box>

            <Button
              fullWidth variant="contained" disabled 
              sx={{ bgcolor: '#e0e0e0', color: '#a0a0a0', py: 1.5 }}
            >
              Vui lòng hoàn tất thông tin
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CheckoutPage;