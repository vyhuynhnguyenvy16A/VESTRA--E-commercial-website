import { Card, CardMedia, CardContent, Typography, Button, Box, Rating } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import cartService from '../../api/cartService';  
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

function ProductCard({ product }) {
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    
    const defaultVariant = product.variants?.[0];

    if (!defaultVariant) {
        navigate(`/product/${product.id}`);
        return;
    }

    try {
        setIsAdding(true);
        await cartService.addToCart(defaultVariant.id, 1);
        
        alert("Đã thêm vào giỏ hàng!"); 

        
    } catch (error) {
        console.error(error);
        alert("Lỗi khi thêm vào giỏ.");
    } finally {
        setIsAdding(false);
    }
  };
  

  // API trả về defaultImage hoặc null
  const imageUrl = product.defaultImage || 'https://via.placeholder.com/300x300?text=No+Image';

  const totalReviews = product.reviews ? product.reviews.length : 0;
  const averageRating = totalReviews > 0 
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
    : 5;

  return (
    <Card
      component={RouterLink}
      to={`/product/${product.id}`}
      sx={{
        height: '100%', display: 'flex', flexDirection: 'column',
        textDecoration: 'none', color: 'inherit',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 }
      }}
    >
      <Box sx={{ position: 'relative', pt: '100%' /* 1:1 Aspect Ratio */ }}>
        <CardMedia
          component="img"
          image={imageUrl}
          alt={product.name}
          sx={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover'
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
          {product.category?.name || 'Sản phẩm'}
        </Typography>
        
        <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2, height: '2.4em', overflow: 'hidden', mb: 1 }}>
          {product.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
           <Rating value={averageRating} readOnly size="small" precision={0.5} sx={{ fontSize: '1rem' }} />
           <Typography variant="caption" sx={{ ml: 0.5 }}>({totalReviews})</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
          <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 700 }}>
            {formatPrice(product.price || 0)}
          </Typography>
          <Button 
            size="small" 
            variant="contained" 
            sx={{ minWidth: 0, p: 1, bgcolor: '#000', color: '#fff' }}
            onClick={handleQuickAdd}
          >
            <ShoppingBagIcon fontSize="small" />
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default ProductCard;