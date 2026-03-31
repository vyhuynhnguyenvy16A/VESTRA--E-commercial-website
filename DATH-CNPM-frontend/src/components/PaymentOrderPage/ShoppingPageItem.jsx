import React from 'react';
import { Box, Typography, IconButton, Grid } from '@mui/material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const formatCurrency = (value) => {
  if (!value) return '0 đ';
  const formatted = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
  return formatted.replace('₫', 'đ');
};

function ShoppingBagItem({ item, onRemove, onUpdateQuantity }) {

  const handleQtyChange = (amount) => {
    const newQuantity = item.quantity + amount;
    if (newQuantity >= 1) {
      if (onUpdateQuantity) {
        onUpdateQuantity(item.id, newQuantity);
      }
    }
  };

  return (
    <Box sx={{ py: 3, borderBottom: '1px solid #f0f0f0' }}>
      <Grid container spacing={2} alignItems="center">
        
        <Grid item xs={3} sm={2}>
          <Box 
            component="img"
            src={item.image}
            alt={item.name}
            sx={{ 
              width: '100%',
              height: '120px', 
              objectFit: 'cover',
              borderRadius: '8px',
              bgcolor: '#f5f5f5'
            }}
          />
        </Grid>

        <Grid item xs={9} sm={6}>
          <Box sx={{ pr: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', lineHeight: 1.3, mb: 0.5 }}>
              {item.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Phân loại: {item.variantName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
              SKU: {item.sku}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'row', sm: 'column' }, 
            justifyContent: { xs: 'space-between', sm: 'center' }, 
            alignItems: { xs: 'center', sm: 'flex-end' },
            gap: 1
          }}>
            
            <IconButton onClick={onRemove} size="small" sx={{ color: '#d32f2f', order: { xs: 2, sm: 1 } }}>
               <DeleteOutlineOutlinedIcon />
            </IconButton>

            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'black', mb: { sm: 1 }, order: { xs: 1, sm: 2 } }}>
              {formatCurrency(item.priceRaw * item.quantity)}
            </Typography>

            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              border: '1px solid #e0e0e0', 
              borderRadius: '4px',
              bgcolor: '#fff',
              order: { xs: 3, sm: 3 }
            }}>
              <IconButton size="small" onClick={() => handleQtyChange(-1)} disabled={item.quantity <= 1}>
                <RemoveIcon fontSize="small" sx={{ fontSize: '14px' }}/>
              </IconButton>
              
              <Typography sx={{ px: 1, minWidth: 24, textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>
                  {item.quantity}
              </Typography>

              <IconButton size="small" onClick={() => handleQtyChange(1)}>
                <AddIcon fontSize="small" sx={{ fontSize: '14px' }}/>
              </IconButton>
            </Box>

          </Box>
        </Grid>

      </Grid>
    </Box>
  );
}

export default ShoppingBagItem;