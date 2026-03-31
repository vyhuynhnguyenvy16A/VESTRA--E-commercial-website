// src/components/OrderCard.jsx

import React from 'react';
import { Box, Typography, Button, Grid, Paper, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Hàm định dạng tiền tệ
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value).replace('₫', 'VND'); 
};

// Hàm lấy màu và nhãn cho trạng thái
const getStatusChip = (status) => {
  let color = 'default';
  let label = status;

  switch (status) {
    case 'Đã giao':
      color = 'success'; // Xanh lá
      break;
    case 'Đang giao':
      color = 'primary'; // Xanh dương
      break;
    case 'Đang xử lý':
      color = 'warning'; // Vàng cam
      break;
    case 'Đã hủy':
      color = 'error'; // Đỏ
      break;
    default:
      color = 'default';
  }

  return (
    <Chip 
      label={label} 
      color={color} 
      size="small" 
      sx={{ 
        fontWeight: 'bold', 
        borderRadius: '6px', 
        height: '24px',
        fontSize: '0.75rem',
        ...(color === 'success' && { bgcolor: '#e6f4ea', color: '#1e7e34' }),
        ...(color === 'primary' && { bgcolor: '#e8f0fe', color: '#1967d2' }),
        ...(color === 'warning' && { bgcolor: '#fef7e0', color: '#f57c00' }),
      }} 
    />
  );
};

function OrderCard({ order }) {
  const navigate = useNavigate();

  const displayedProducts = order.products ? order.products.slice(0, 3) : [];
  const remainingCount = order.products ? order.products.length - 3 : 0;

  const handleDetailClick = () => {
    navigate(`/order-detail/${order.id}`);
  };

  return (
    <Paper 
      elevation={0}
      variant="outlined" // Viền mỏng
      sx={{ 
        p: 2, 
        mb: 2, 
        borderRadius: 2, 
        borderColor: '#eee',
        '&:hover': { borderColor: '#ccc' } // Hiệu ứng hover nhẹ
      }}
    >
      {/* --- Dòng 1: Header đơn hàng --- */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Đơn #{order.id}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Đặt vào {order.date}
          </Typography>
        </Box>
        {getStatusChip(order.status)}
      </Box>

      {/* --- Dòng 2: Nội dung chính --- */}
      <Grid container spacing={2} alignItems="center">
        
        {/* Cột Trái: Danh sách ảnh sản phẩm */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {displayedProducts.map((product, index) => (
              <Box 
                key={index}
                component="img"
                src={product.image}
                alt={product.name}
                sx={{ 
                  width: 60, 
                  height: 60, 
                  objectFit: 'cover', 
                  borderRadius: 1,
                  border: '1px solid #f0f0f0'
                }}
              />
            ))}
            {remainingCount > 0 && (
              <Box sx={{ 
                width: 60, height: 60, 
                borderRadius: 1, 
                bgcolor: '#f5f5f5', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'text.secondary',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}>
                +{remainingCount}
              </Box>
            )}
          </Box>
        </Grid>

        {/* Cột Phải: Giá tiền & Nút bấm */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', sm: 'flex-end' } }}>
            
            {/* Giá tiền */}
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              {formatCurrency(order.totalPrice)}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
              {order.products ? order.products.length : 0} sản phẩm
            </Typography>

            {/* Các nút bấm */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="outlined" 
                size="small" 
                color="inherit" 
                onClick={handleDetailClick}
                sx={{ textTransform: 'none', borderColor: '#ddd' }}
              >
                Chi tiết
              </Button>

              {order.status === 'Đã giao' || order.status === 'Đang giao' ? (
                <Button 
                  variant="contained" 
                  size="small" 
                  color="primary" // Màu xanh dương
                  sx={{ textTransform: 'none', boxShadow: 'none' }}
                >
                  Theo dõi
                </Button>
              ) : order.status === 'Đã hủy' ? (
                <Button 
                  variant="outlined" 
                  size="small" 
                  color="error" // Màu đỏ viền
                  sx={{ textTransform: 'none' }}
                >
                  Mua lại
                </Button>
              ) : (
                <Button 
                  variant="outlined" 
                  size="small" 
                  color="error" 
                  sx={{ textTransform: 'none' }}
                >
                  Hủy đơn
                </Button>
              )}
            </Box>

          </Box>
        </Grid>

      </Grid>
    </Paper>
  );
}

export default OrderCard;