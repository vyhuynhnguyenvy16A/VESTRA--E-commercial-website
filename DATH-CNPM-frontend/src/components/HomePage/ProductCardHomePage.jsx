// src/components/ProductCard.jsx
import React from 'react';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Box, 
  IconButton, 
  Stack 
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; 
import { useNavigate } from 'react-router-dom';

function ProductCard({ product }) {
  const navigate = useNavigate();
  const imageSrc = product.defaultImage || 'https://via.placeholder.com/300';

  const goToDetail = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <Card 
      elevation={3} 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 4, 
        overflow: 'hidden', 
        position: 'relative',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)', 
          boxShadow: 6,
        }
      }}
    >
      {/* 1. Phần Ảnh */}
      <Box sx={{ position: 'relative', width: '100%', aspectRatio: '3/4', bgcolor: '#f5f5f5' }}>
        <CardMedia
          component="img"
          image={imageSrc}
          alt={product.name}
          sx={{ 
            width: '100%',
            height: '400px',
            objectFit: 'cover', 
            objectPosition: 'top center'
          }}
        />
      </Box>

      {/* 2. Phần Nội dung */}
      <CardContent sx={{ flexGrow: 1, pt: 2, pb: '16px !important', px: 2 }}>
        {/* Tên sản phẩm */}
        <Typography 
          variant="subtitle1" 
          component="h3" 
          sx={{ fontWeight: 'bold', mb: 0.5, lineHeight: 1.2 }}
        >
          {product.name || "Tên sản phẩm"}
        </Typography>

        {/* Mô tả */}
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 2, 
            fontSize: '0.85rem',
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
          }}
        >
          {product.description || "Mô tả sản phẩm ngắn gọn tại đây."}
        </Typography>

        {/* Hàng cuối: Giá và Nút giỏ hàng */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mt="auto">
          {/* Giá tiền màu đỏ cam */}
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 'bold', 
              color: '#FF5252' 
            }}
          >
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(product.price || 0)}
          </Typography>

          {/* Nút giỏ hàng màu đen */}
          <IconButton 
            onClick={goToDetail}
            sx={{ 
              bgcolor: 'black', 
              color: 'white',
              width: 40,
              height: 40,
              borderRadius: 2, 
              '&:hover': {
                bgcolor: '#333',
              }
            }}
            aria-label="add to cart"
          >
            <ShoppingCartIcon fontSize="small" />
          </IconButton>
        </Stack>

      </CardContent>
    </Card>
  );
}

export default ProductCard;