import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Rating, Divider, Stack, IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

function ProductDetails({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedAttrs, setSelectedAttrs] = useState({});
  const [displayPrice, setDisplayPrice] = useState(product.price || 0);

  // Helper tìm Attribute
  const findAttr = (keyword) => product.attributes?.find(a => a.name.toLowerCase().includes(keyword));
  const colorAttr = findAttr('màu') || findAttr('color');
  const sizeAttr = findAttr('size') || findAttr('kích') || findAttr('cỡ');

  const totalReviews = product.reviews ? product.reviews.length : 0;
  const averageRating = totalReviews > 0 
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
    : 0;

  useEffect(() => {
    if (product.attributes) {
      const defaults = {};
      product.attributes.forEach(attr => {
        if (attr.values.length > 0) defaults[attr.name] = attr.values[0].value;
      });
      setSelectedAttrs(defaults);
    }
  }, [product]);

  useEffect(() => {
      if(product.price && product.price > 0) {
          setDisplayPrice(product.price);
      } else if (product.variants && product.variants.length > 0) {
          setDisplayPrice(product.variants[0].price);
      }
  }, [product]);

  const handleAttrSelect = (name, value) => {
    setSelectedAttrs(prev => ({ ...prev, [name]: value }));
  };

  const handleQuantity = (type) => {
    if (type === 'inc') setQuantity(q => q + 1);
    if (type === 'dec' && quantity > 1) setQuantity(q => q - 1);
  };

  const handleAddClick = () => {
    // 1. Kiểm tra xem sản phẩm có variants không
    if (!product.variants || product.variants.length === 0) {
        alert("Sản phẩm này đang lỗi dữ liệu (không có biến thể).");
        return;
    }

    // 2. Tìm variant khớp với selectedAttrs
    const selectedVariant = product.variants.find(variant => {
        // Lấy danh sách giá trị của variant này (VD: [Xanh, L])
        const variantValues = variant.values?.map(v => v.value.value);
        
        return Object.values(selectedAttrs).every(selectedVal => 
            variantValues.includes(selectedVal)
        );
    });

    if (!selectedVariant) {
        alert("Phiên bản này hiện không khả dụng (Hết hàng hoặc không tồn tại).");
        return;
    }

    onAddToCart(selectedVariant.id, quantity);
  };

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

  return (
    <Box sx={{ textAlign: 'left' }}>
      
      {/* Tên sản phẩm */}
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, lineHeight: 1.3 }}>
        {product.name}
      </Typography>
      
      {/* Rating */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Rating value={averageRating} readOnly size="small" precision={0.5} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {totalReviews > 0 ? `(${totalReviews} đánh giá)` : '(Chưa có đánh giá)'}
        </Typography>
      </Box>

      {/* Giá tiền */}
      <Box sx={{ 
        bgcolor: '#fafafa', 
        p: 2, 
        borderRadius: 2, 
        mb: 3, 
        width: 'fit-content',
        minWidth: 200
      }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#d32f2f' }}>
          {formatPrice(displayPrice)}
        </Typography>
      </Box>

      {/* Chọn Màu sắc */}
      {colorAttr && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>{colorAttr.name}:</Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            {colorAttr.values.map(val => {
                const isSelected = selectedAttrs[colorAttr.name] === val.value;
                return (
                    <Button
                        key={val.id}
                        variant={isSelected ? "contained" : "outlined"}
                        onClick={() => handleAttrSelect(colorAttr.name, val.value)}
                        sx={{ 
                            minWidth: 40, 
                            borderColor: isSelected ? 'primary.main' : '#e0e0e0',
                            bgcolor: isSelected ? '#000' : 'transparent',
                            color: isSelected ? '#fff' : '#000',
                            textTransform: 'none',
                            '&:hover': { bgcolor: isSelected ? '#333' : '#f5f5f5' }
                        }}
                    >
                        {val.value}
                    </Button>
                )
            })}
          </Stack>
        </Box>
      )}

      {/* Chọn Size */}
      {sizeAttr && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>{sizeAttr.name}:</Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            {sizeAttr.values.map(val => {
                const isSelected = selectedAttrs[sizeAttr.name] === val.value;
                return (
                    <Button
                        key={val.id}
                        variant={isSelected ? "contained" : "outlined"}
                        onClick={() => handleAttrSelect(sizeAttr.name, val.value)}
                        sx={{ 
                             minWidth: 40,
                             borderColor: isSelected ? '#000' : '#e0e0e0',
                             color: isSelected ? '#fff' : '#000',
                             bgcolor: isSelected ? '#000' : 'transparent',
                             '&:hover': { bgcolor: isSelected ? '#333' : '#f5f5f5' }
                        }}
                    >
                        {val.value}
                    </Button>
                )
            })}
          </Stack>
        </Box>
      )}

      {/* Nút Mua hàng & Số lượng */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: 1 }}>
            <IconButton size="small" onClick={() => handleQuantity('dec')}><RemoveIcon fontSize="small"/></IconButton>
            <Typography sx={{ px: 2, fontWeight: 600, minWidth: 30, textAlign: 'center' }}>{quantity}</Typography>
            <IconButton size="small" onClick={() => handleQuantity('inc')}><AddIcon fontSize="small"/></IconButton>
        </Box>

        <Button 
            variant="contained" 
            size="large" 
            startIcon={<ShoppingBagIcon />}
            sx={{ 
              bgcolor: '#000', color: '#fff', px: 4, py: 1.5, fontWeight: 700,
              '&:hover': { bgcolor: '#333' } 
            }}
            onClick={handleAddClick}
        >
            Thêm vào giỏ hàng
        </Button>
        
        <IconButton sx={{ border: '1px solid #ddd', p: 1.5 }}><FavoriteBorderIcon /></IconButton>
      </Stack>

    </Box>
  );
}

export default ProductDetails;