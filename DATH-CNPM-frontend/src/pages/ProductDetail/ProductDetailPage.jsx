import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Grid, Box, CircularProgress, Alert } from '@mui/material';
import { getProductById } from '../../api/productService';
import cartService from '../../api/cartService';

import ProductGallery from '../../components/ProductPage/ProductGallery';
import ProductDetails from '../../components/ProductPage/ProductDetails';
import ProductReviews from '../../components/ProductPage/ProductReviews';

function ProductDetailPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (variantId, quantity) => {
    try {
      await cartService.addToCart(variantId, quantity);
      setIsCartOpen(true); // Mở Popup lên khi thành công
    } catch (err) {
      console.error(err);
      alert("Lỗi khi thêm vào giỏ hàng!");
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      try {
        setLoading(true);
        const data = await getProductById(productId);
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Không thể tải thông tin sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Container sx={{ py: 5 }}>
      <Alert severity="error">{error}</Alert>
    </Container>
  );

  if (!product) return (
    <Container sx={{ py: 5 }}>
      <Alert severity="warning">Sản phẩm không tồn tại</Alert>
    </Container>
  );

  return (
    <Box sx={{ bgcolor: '#f4f4f4', minHeight: '100vh', pb: 8 }}>
      <Box sx={{ height: 20 }} />

      <Container maxWidth="lg">
        {/* --- KHỐI 1: ẢNH VÀ THÔNG TIN (Duy nhất) --- */}
        <Box sx={{ bgcolor: '#fff', p: 3, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', mb: 3 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={5}>
              <ProductGallery images={product.images} />
            </Grid>
            <Grid item xs={12} md={7}>
              <ProductDetails product={product} onAddToCart={handleAddToCart} />
            </Grid>
          </Grid>
        </Box>

        {/* --- KHỐI 2: ĐÁNH GIÁ --- */}
        <Box sx={{ bgcolor: '#fff', p: 3, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
           <ProductReviews product={product} />
        </Box>
      </Container>
    </Box>
  );
}

export default ProductDetailPage;