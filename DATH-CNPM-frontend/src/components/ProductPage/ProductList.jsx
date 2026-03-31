import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFeaturedProducts } from '../api/productService';
import ProductCard from './ProductCard';
import { Grid, Container, CircularProgress, Alert, Box, Typography } from '@mui/material';

function ProductList() { 
  const { data: products, isLoading, isError, error } = useQuery({
    queryKey: ['featuredProducts'], 
    queryFn: getFeaturedProducts, 
  });

  if (isLoading) {
    return (
      <Container sx={{ textAlign: 'center', py: 5 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container sx={{ py: 5 }}>
        <Alert severity="error">Lỗi khi tải sản phẩm: {error.message}</Alert>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Sản phẩm nổi bật
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Những sản phẩm mới nhất từ cửa hàng
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {products && products.length > 0 ? (
          products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
              <ProductCard product={product} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Alert severity="info">Không có sản phẩm nào</Alert>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default ProductList;