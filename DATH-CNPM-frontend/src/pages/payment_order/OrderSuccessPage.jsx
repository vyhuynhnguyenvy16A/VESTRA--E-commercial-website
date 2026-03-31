// src/pages/user_homepage/OrderSuccessPage.jsx

import React from 'react';
import { Container, Paper, Typography, Button, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; 
import ErrorIcon from '@mui/icons-material/Error';          
import { useNavigate, useSearchParams } from 'react-router-dom';

function OrderSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 1. Lấy trạng thái từ URL
  const status = searchParams.get('status');
  const orderCode = searchParams.get('code');
  const isSuccess = status === 'success';

  return (
    <Container maxWidth="sm" sx={{ py: 8, minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 5, 
          width: '100%',
          textAlign: 'center', 
          borderRadius: 4,
          bgcolor: isSuccess ? '#f0fff4' : '#fff5f5' 
        }}
      >
        {/* ICON */}
        {isSuccess ? (
            <CheckCircleIcon sx={{ fontSize: 80, color: '#2e7d32', mb: 2 }} />
        ) : (
            <ErrorIcon sx={{ fontSize: 80, color: '#c62828', mb: 2 }} />
        )}

        {/* TIÊU ĐỀ */}
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: isSuccess ? '#1b5e20' : '#b71c1c' }}>
          {isSuccess ? 'THANH TOÁN THÀNH CÔNG!' : 'THANH TOÁN THẤT BẠI'}
        </Typography>

        {/* MÔ TẢ */}
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          {isSuccess 
            ? 'Cảm ơn bạn đã mua hàng. Hệ thống đã ghi nhận đơn hàng của bạn.' 
            : 'Giao dịch đã bị hủy hoặc xảy ra lỗi trong quá trình thanh toán.'}
        </Typography>
        
        {isSuccess && orderCode && (
           <Typography variant="body2" sx={{ mb: 4, fontWeight: 'bold' }}>
             Mã đơn hàng: {orderCode}
           </Typography>
        )}

        {/* NÚT ĐIỀU HƯỚNG */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/')} 
            sx={{ bgcolor: 'black', '&:hover': { bgcolor: '#333' }, py: 1.5 }}
          >
            TIẾP TỤC MUA SẮM
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={() => navigate('/my-orders')}
            sx={{ py: 1.5 }}
          >
            XEM ĐƠN HÀNG CỦA TÔI
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default OrderSuccessPage;