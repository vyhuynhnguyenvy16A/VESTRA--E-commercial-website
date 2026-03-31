// src/pages/user_homepage/OrderHistoryPage.jsx

import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Typography, Box, Button, Paper, Chip, Divider, CircularProgress, Stack, Pagination 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import { getMyOrders } from '../../api/paymentOrderService';

// Mapping màu sắc cho trạng thái
const getStatusColor = (status) => {
  switch(status) {
    case 'DELIVERED': return 'success';       // Đã giao
    case 'SHIPPING': return 'primary';        // Đang giao
    case 'PENDING': return 'warning';         // Chờ xử lý
    case 'PROCESSING': return 'info';         // Đang xử lý
    case 'AWAITING_PAYMENT': return 'warning';// Chờ thanh toán
    case 'CANCELLED': return 'error';         // Đã hủy
    default: return 'default';
  }
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value).replace('₫', 'đ');
};

const translateStatus = (status) => {
    const map = {
        'PENDING': 'Chờ xử lý',
        'PROCESSING': 'Đang chuẩn bị hàng',
        'AWAITING_PAYMENT': 'Chờ thanh toán',
        'SHIPPING': 'Đang giao hàng',
        'DELIVERED': 'Giao thành công',
        'CANCELLED': 'Đã hủy'
    };
    return map[status] || status;
};

function OrderHistoryPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const itemsPerPage = 5

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders(); 
        setOrders(data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const visibleOrders = orders.filter(order => order.status !== 'AWAITING_PAYMENT');

  const handleChangePage = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const indexOfLastItem = page * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const handleImageError = (e) => {
    e.target.src = 'https://placehold.co/150x150?text=No+Image'; // Ảnh thay thế an toàn
  };

  if (loading) {
    return (
        <Container sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
        </Container>
    );
  }

 return (
    <Container maxWidth="lg" sx={{ py: 4, minHeight: '80vh' }}>
      <Box sx={{ mb: 2, position: 'absolute', top: {xs: 16, sm: 32}, left: {xs: 16, sm: 'auto'}, right: {sm: 'auto'} }}>
            <IconButton 
                aria-label="back to home" 
                onClick={() => navigate('/')} 
                color="primary"
            >
                <ArrowBackIcon />
            </IconButton>
      </Box>

      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, textTransform: 'uppercase', textAlign: 'center' }}>
        Đơn hàng của tôi ({visibleOrders.length})
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={11} lg={10}>
          {visibleOrders.length === 0 ? (
             <Paper sx={{ p: 4, textAlign: 'center' }}>
                 <Typography gutterBottom>Bạn chưa có đơn hàng nào.</Typography>
                 <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/')}>
                     Mua sắm ngay
                 </Button>
             </Paper>
          ) : (
             <>
             {currentOrders.map((order) => {
                const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;
                const displayImage = firstItem?.thumbnail || 'https://placehold.co/150x150?text=No+Image'; 

                return (
                    <Paper 
                        key={order.id} 
                        elevation={0}
                        variant="outlined"
                        sx={{ p: 2, mb: 3, display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, 
                        gap: 2, alignItems: 'center', borderRadius: 2, border: '1px solid #e0e0e0', transition: 'box-shadow 0.3s',
                        '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.05)' } 
                      }}
                    >
                    {/* Phần Ảnh */}
                    <Box sx={{ width: 100, height: 100, flexShrink: 0 }}>
                        <img 
                            src={displayImage} 
                            alt={`Order ${order.orderCode}`} 
                            onError={handleImageError} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '1px solid #eee' }} 
                        />
                    </Box>

                    {/* Phần Thông tin */}
                    <Box sx={{ flexGrow: 1, width: '100%', textAlign: 'left' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                #{order.orderCode}
                            </Typography>
                            <Chip 
                                label={translateStatus(order.status)} 
                                color={getStatusColor(order.status)} 
                                size="small" 
                                variant="outlined" 
                            />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Số lượng: {order.items ? order.items.length : 0} sản phẩm
                        </Typography>
                        
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1, color: 'text.primary' }}>
                            {formatCurrency(order.totalAmount)}
                        </Typography>
                    </Box>

                    {/* Phần Nút bấm */}
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: {xs: 'row', sm: 'column'}, 
                        gap: 1, 
                        minWidth: '140px',
                        justifyContent: 'center'
                    }}>
                        <Button 
                            variant="outlined" 
                            color="inherit" 
                            size="small"
                            onClick={() => navigate(`/order-detail/${order.id}`)} 
                            sx={{ borderColor: '#ccc' }}
                        >
                            CHI TIẾT
                        </Button>
                        
                    </Box>
                    </Paper>
                );
             })}

             {/* THANH PHÂN TRANG */}
             {totalPages > 1 && (
                <Stack spacing={2} alignItems="center" sx={{ mt: 4 }}>
                    <Pagination 
                        count={totalPages} 
                        page={page} 
                        onChange={handleChangePage} 
                        color="primary" 
                        shape="rounded"
                    />
                </Stack>
             )}
             </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default OrderHistoryPage;