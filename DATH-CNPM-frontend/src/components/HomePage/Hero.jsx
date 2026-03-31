// src/components/Hero.jsx
import React from 'react';
import { Box, Typography, Container, Button, Stack } from '@mui/material';

const heroImage = 'https://i.pinimg.com/736x/db/a1/47/dba1472e846cb00f396449a9b52eb8c1.jpg'; 

function Hero() {
  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        my: { xs: 4, md: 8 }, 
        px: { xs: 2, sm: 3, md: 4 } 
      }}
    >
      
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          alignItems: { xs: 'flex-start', md: 'center' }, 
          gap: 6, 
          justifyContent: 'flex-start',
          width: '100%' 
        }}
      >
        
        {/* Cột 1: Nội dung Text */}
        <Box 
          sx={{ 
            flex: 1, 
            width: '100%',
            textAlign: 'left' 
          }}
        >
          <Typography 
            variant="h4" 
            component="p" 
            sx={{ 
              color: 'black', 
              mb: 1, // Khoảng cách dưới
              fontWeight: 'bold', 
              fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' } 
            }}
          >
            Tỏa sáng mỗi ngày với
          </Typography>

          <Typography 
            variant="h2"
            component="h1" 
            sx={{ 
              fontWeight: 'bold',
              mb: 3, // Khoảng cách dưới
              color: '#FF7D00', // Màu cam/vàng giống ảnh
              '& span': { color: 'black' }, 
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '5rem' }, 
              lineHeight: 1.1 
            }}
          >
            Phong cách riêng của bạn
          </Typography>

          <Typography 
            variant="h6"
            sx={{ 
              color: 'text.secondary', 
              mb: 4, // Khoảng cách dưới
              maxWidth: '550px', // Giới hạn chiều rộng để text không quá dài
              lineHeight: 1.6,
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } 
            }}
          >
            Khám phá các sản phẩm thời trang chất lượng và đa dạng từ
            các nhà cung cấp uy tín !
          </Typography>
          
          {/* Stack cho 2 nút, căn trái (alignItems: 'flex-start' là mặc định cho row Stack) */}
          <Stack 
            direction="row" 
            spacing={2} 
            sx={{ 
              flexWrap: 'wrap', 
              gap: { xs: 1, sm: 2 } 
            }}
          >
          </Stack>
        </Box>

        <Box 
          sx={{ 
            flex: 1, 
            width: '100%', 
            position: 'relative',
            display: { xs: 'none', md: 'block' } 
          }}
        >
          {heroImage && ( 
            <Box
              component="img"
              src={heroImage}
              alt="Hero collection"
              sx={{
                width: '100%',
                height: { xs: 400, md: 550 },
                objectFit: 'cover',
                borderRadius: 2,
                display: 'block',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
              }}
            />
          )}
          
          <Box 
            sx={{ 
              position: 'absolute', 
              bottom: -20, left: -40, 
              bgcolor: 'rgba(255, 255, 255, 1)',
              p: 2, borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Bộ sưu tập mới</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Mùa hè 2024</Typography>
          </Box>
          
        </Box>
        
      </Box>
    </Container>
  );
}

export default Hero;