// src/components/FeaturedProductList.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFeaturedProducts } from '../../api/productService'; 
import ProductCard from './ProductCardHomePage'; 
import { Container, Typography, CircularProgress, Alert, Box } from '@mui/material';

function FeaturedProductList() { 
  const { data: products, isLoading, isError, error } = useQuery({
    queryKey: ['featuredProducts'], 
    queryFn: getFeaturedProducts, 
  });

  if (isLoading) return <Container sx={{ textAlign: 'center', py: 5 }}><CircularProgress /></Container>;
  if (isError) return <Container sx={{ py: 5 }}><Alert severity="error">{error.message}</Alert></Container>;
  
  return (
    <Box sx={{ bgcolor: '#f9f9f9', py: 8 }}> 
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
            Top 4 sản phẩm bán chạy nhất
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Khám phá top 4 sản phẩm thời trang được quan tâm nhất
          </Typography>
        </Box>

        {/* --- CSS GRID LAYOUT --- */}
        <Box
          sx={{
            display: 'grid',
            // Mobile: 1 cột, Tablet: 2 cột, Desktop: 4 cột
            gridTemplateColumns: {
              xs: '1fr', 
              sm: 'repeat(2, 1fr)', 
              md: 'repeat(4, 1fr)' 
            },
            gap: 3
          }}
        >
          {products && products.slice(0, 4).map((product) => (
             <ProductCard key={product.id} product={product} />
          ))}
        </Box>
      </Container>
    </Box>
  );
}

export default FeaturedProductList;