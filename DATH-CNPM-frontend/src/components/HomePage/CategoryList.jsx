// src/components/CategoryList.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCategory } from '../../api/categoryService'; 
import { Container, Typography, CircularProgress, Alert, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const CategoryData = [
  { id: 1, name: 'Nam', image: 'https://img.freepik.com/free-photo/smiley-man-posing-grey-wall_23-2148448892.jpg?semt=ais_hybrid&w=740&q=80', path: 'Thời trang nam' },
  { id: 2, name: 'Nữ', image: 'https://media.istockphoto.com/id/1367180724/photo/stylish-young-women-in-pastel-outfits-standing-together-fashion-concept-stock-photo.jpg?s=612x612&w=0&k=20&c=o-uxyttHDkuR9nLopGp2rdGirgCRtRLHTY-4sf0AKWM=', path: 'Thời trang nữ' },
  { id: 3, name: 'Trẻ em', image: 'https://img.freepik.com/free-photo/full-shot-kids-posing-together_23-2149853383.jpg?semt=ais_hybrid&w=740&q=80', path: 'Trẻ em' },
  { id: 4, name: 'Phụ kiện', image: 'https://image.made-in-china.com/202f0j00wrAkhMCsyopL/Ru-Women-s-Purses-and-Handbags-Luxury-Designers-PU-Leather-Shoulder-Bags-Sac-Large-Capacity-High-Quality-Handbag-Female-Tote-Bag.webp', path: 'Phụ kiện' }
];

function CategoryList() {
  const { isLoading, isError, error } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategory, 
    refetchOnWindowFocus: false,
    retry: 1,
  });

  if (isLoading) return <Container sx={{ textAlign: 'center', py: 5 }}><CircularProgress /></Container>;
  if (isError) return <Container sx={{ py: 5 }}><Alert severity="error">{error.message}</Alert></Container>;

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
          Mua sắm theo phân loại
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Phù hợp với mọi lứa tuổi và nhu cầu sử dụng
        </Typography>
      </Box>
      
      {/* --- LAYOUT GRID KHÔNG DÙNG MUI GRID --- */}
      <Box 
        sx={{
          display: 'grid',
          // Mobile: 2 cột, Tablet: 3 cột, Desktop: 4 cột
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(4, 1fr)' 
          },
          gap: 3 
        }}
      >
        {CategoryData.map((category) => (
          <Box 
            key={category.id}
            component={Link}
            to={`/category/${category.path}`} 
            sx={{ 
              textDecoration: 'none',
              color: 'inherit',      
              cursor: 'pointer', 
              textAlign: 'center',
              display: 'block',       
              '&:hover .cat-img': { transform: 'scale(1.05)' }
            }}
          >
            <Box 
              sx={{ 
                overflow: 'hidden', 
                borderRadius: 2, 
                mb: 2, 
                aspectRatio: '3/4', 
                bgcolor: '#f5f5f5' 
              }}
            >
              <Box
                className="cat-img"
                component="img"
                src={category.image}
                alt={category.name}
                sx={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  transition: 'transform 0.5s ease',
                }}
              />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{category.name}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              {category.id === 1 ? 'Cổ điển và hiện đại' : category.id === 2 ? 'Trang trọng và sành điệu' : category.id === 3 ? 'Mẫu mã đa dạng' : 'Phong cách và tiện dụng'}
            </Typography>
          </Box>
        ))}
      </Box>
    </Container>
  );
}

export default CategoryList;