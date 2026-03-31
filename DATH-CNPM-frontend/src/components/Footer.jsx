// src/components/Footer.jsx

import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Link, 
  Stack, 
  IconButton, 
  Divider 
} from '@mui/material';

import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter'; 

import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaymentIcon from '@mui/icons-material/Payment';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

function FooterHomePage() {
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: '#0B1120', 
        color: '#E5E7EB',   
        py: 8,
        mt: 'auto',
        textAlign: 'left' 
      }}
    >
      <Container maxWidth="lg">
        
        {/* --- PHẦN NỘI DUNG CHÍNH --- */}
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: 'repeat(2, 1fr)', 
              md: '2fr 1fr 1fr 1fr' 
            },
            gap: 4 
          }}
        >

          {/* Cột 1: Thương hiệu */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white', mb: 2, textTransform: 'uppercase' }}>
              VESTRA
            </Typography>
            <Typography variant="body2" sx={{ color: '#9CA3AF', mb: 3, maxWidth: '300px', lineHeight: 1.6 }}>
              Hãy tạo nên phong cách riêng của bạn từ sản phẩm của chúng tôi
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton size="small" sx={{ color: '#9CA3AF', pl: 0, '&:hover': { color: 'white' } }}>
                <FacebookIcon />
              </IconButton>
              <IconButton size="small" sx={{ color: '#9CA3AF', '&:hover': { color: 'white' } }}>
                <InstagramIcon />
              </IconButton>
              <IconButton size="small" sx={{ color: '#9CA3AF', '&:hover': { color: 'white' } }}>
                <TwitterIcon />
              </IconButton>
            </Stack>
          </Box>

          {/* Cột 2: Cửa hàng */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'white', mb: 2 }}>
              Cửa hàng
            </Typography>
            <Stack spacing={1.5} alignItems="flex-start">
              {['Nữ', 'Nam', 'Trẻ em', 'Phụ kiện'].map((item) => (
                <Link key={item} href="#" underline="hover" sx={{ color: '#9CA3AF', fontSize: '0.9rem', '&:hover': { color: 'white' } }}>
                  {item}
                </Link>
              ))}
            </Stack>
          </Box>

          {/* Cột 3: Hỗ trợ */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'white', mb: 2 }}>
              Hỗ trợ
            </Typography>
            <Stack spacing={1.5} alignItems="flex-start">
              {['Liên lạc', 'Hướng dẫn chọn size', 'Thông tin giao hàng', 'Hoàn lại sản phẩm'].map((item) => (
                <Link key={item} href="#" underline="hover" sx={{ color: '#9CA3AF', fontSize: '0.9rem', '&:hover': { color: 'white' } }}>
                  {item}
                </Link>
              ))}
            </Stack>
          </Box>

          {/* Cột 4: Công ty */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'white', mb: 2 }}>
              Công ty
            </Typography>
            <Stack spacing={1.5} alignItems="flex-start">
              {['Về chúng tôi', 'Privacy Policy', 'Terms of Service'].map((item) => (
                <Link key={item} href="#" underline="hover" sx={{ color: '#9CA3AF', fontSize: '0.9rem', '&:hover': { color: 'white' } }}>
                  {item}
                </Link>
              ))}
            </Stack>
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255, 0.1)', my: 6 }} />

        {/* --- PHẦN BOTTOM --- */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between', 
            alignItems: 'center', // Giữ center dọc, nhưng ngang thì space-between đã lo
            gap: 2
          }}
        >
          <Typography variant="caption" sx={{ color: '#6B7280' }}>
            © 2024 VESTRA. All rights reserved.
          </Typography>

          <Stack direction="row" spacing={2}>
             {[1, 2, 3, 4].map((i) => (
               <Box 
                key={i} 
                sx={{ 
                  width: 36, height: 24, 
                  bgcolor: '#E5E7EB', borderRadius: 0.5, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#333'
                }}
              >
                {i === 1 ? <CreditCardIcon sx={{ fontSize: 16 }} /> : 
                 i === 2 ? <AccountBalanceWalletIcon sx={{ fontSize: 16 }} /> : 
                 <PaymentIcon sx={{ fontSize: 16 }} />}
               </Box>
             ))}
          </Stack>
        </Box>

      </Container>
    </Box>
  );
}

export default FooterHomePage;