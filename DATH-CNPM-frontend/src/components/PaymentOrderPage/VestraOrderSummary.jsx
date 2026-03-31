// src/components/VestraOrderSummary.jsx

import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';

// Hàm format tiền VND
const formatCurrency = (value) => {
  const formatted = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
  return formatted.replace('₫', 'đ');
};

function VestraOrderSummary({ items, subtotal, shippingFee, tax, total }) {
  
  return (
    <Paper 
      sx={{ 
        p: 3, 
        borderRadius: 2, 
        bgcolor: '#f9f9f9', 
        
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
        Thông tin đơn hàng
      </Typography>
      
      {items.map((item, index) => (
        <Box key={index}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Box>
              <Typography sx={{ fontWeight: 'bold' }}>{item.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                SL: {item.quantity}
              </Typography>
            </Box>
            <Typography sx={{ fontWeight: 'bold' }}>
              {formatCurrency(item.price)}
            </Typography>
          </Box>
          <Divider sx={{ mb: 1.5 }} />
        </Box>
      ))}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body1">Tổng cộng</Typography>
        <Typography variant="body1">{formatCurrency(subtotal)}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body1">Phí giao hàng</Typography>
        <Typography variant="body1">{formatCurrency(shippingFee)}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="body1">Thuế</Typography>
        <Typography variant="body1">{formatCurrency(tax)}</Typography>
      </Box>
      
      <Divider sx={{ mb: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Thành tiền</Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {formatCurrency(total)}
        </Typography>
      </Box>
      
    </Paper>
  );
}

export default VestraOrderSummary;