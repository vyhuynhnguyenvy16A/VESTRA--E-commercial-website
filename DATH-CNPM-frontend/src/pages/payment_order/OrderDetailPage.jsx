// src/pages/user_homepage/OrderDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, Grid, Typography, Box, Paper, 
  Stepper, Step, StepLabel, StepContent, CircularProgress, Button, Divider, Chip 
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Import Icons
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import { getOrderById } from '../../api/paymentOrderService';

const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value).replace('₫', 'đ');
};

// Styling cho Icon Stepper
const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: '#ccc', zIndex: 1, color: '#fff', width: 40, height: 40, display: 'flex', borderRadius: '50%', justifyContent: 'center', alignItems: 'center',
  ...(ownerState.active && { backgroundColor: '#1976d2', boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)' }),
  ...(ownerState.completed && { backgroundColor: '#2e7d32' }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className, icon } = props;
  const icons = { 1: <InventoryIcon />, 2: <LocalShippingIcon />, 3: <CheckCircleIcon /> };
  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(icon)]}
    </ColorlibStepIconRoot>
  );
}

function OrderDetailPage() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);

  // Định nghĩa các bước timeline
  const steps = [
    { label: 'Đơn hàng đã đặt', description: 'Đơn hàng đã được tiếp nhận và đang xử lý.' },
    { label: 'Đang vận chuyển', description: 'Đơn vị vận chuyển đang giao hàng đến bạn.' },
    { label: 'Giao thành công', description: 'Bạn đã nhận được hàng.' }
  ];

  useEffect(() => {
    const fetchOrderDetail = async () => {
        try {
            const data = await getOrderById(id); 
            setOrder(data);
            

            let stepIndex = 0;
            const s = data.status;
            
            if (s === 'PENDING' || s === 'PROCESSING' || s === 'AWAITING_PAYMENT') {
                stepIndex = 0;
            } else if (s === 'SHIPPING') {
                stepIndex = 1;
            } else if (s === 'DELIVERED') {
                stepIndex = 3; 
            } else if (s === 'CANCELLED') {
                stepIndex = -1; 
            }
            
            setActiveStep(stepIndex);
        } catch (error) {
            console.error("Lỗi tải chi tiết đơn hàng:", error);
        } finally {
            setLoading(false);
        }
    };
    if (id) fetchOrderDetail();
  }, [id]);

  if (loading) return <Box sx={{ display:'flex', justifyContent:'center', mt: 10 }}><CircularProgress /></Box>;
  if (!order) return <Container sx={{ mt: 5 }}><Typography variant="h6">Không tìm thấy đơn hàng</Typography></Container>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      
      {/* Nút quay lại */}
      <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate('/orders/my-orders')} sx={{ mb: 2, color: '#666' }}>
        Quay lại danh sách
      </Button>

      {/* PHẦN 1: HEADER & TRẠNG THÁI */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
        {/* Hàng 1: Mã đơn & Ngày đặt & Trạng thái */}
        <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap: 2 }}>
            <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                Mã đơn: #{order.orderCode}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                Ngày đặt: {new Date(order.createdAt).toLocaleString('vi-VN')}
                </Typography>
            </Box>
            
            <Chip 
                label={
                    order.status === 'PENDING' ? 'ĐANG XỬ LÝ' :
                    order.status === 'AWAITING_PAYMENT' ? 'CHỜ THANH TOÁN' :
                    order.status === 'SHIPPING' ? 'ĐANG GIAO HÀNG' :
                    order.status === 'DELIVERED' ? 'GIAO THÀNH CÔNG' :
                    order.status === 'CANCELLED' ? 'ĐÃ HỦY' : order.status
                }
                color={
                    order.status === 'DELIVERED' ? 'success' :
                    order.status === 'CANCELLED' ? 'error' :
                    order.status === 'SHIPPING' ? 'primary' : 'warning'
                }
                sx={{ fontWeight: 'bold', borderRadius: 1 }}
            />
        </Box>

        <Divider sx={{ my: 3 }} />



        <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: 3, 
            width: "100%", 
            mt: 2 
        }}>
        
            {/* Cột 1: Người nhận */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, color: 'text.secondary' }}>
                    <PersonIcon fontSize="small" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Người nhận</Typography>
                </Box>
                {/* Thêm pl: 4 để nội dung thẳng hàng với chữ "Người nhận" thay vì Icon */}
                <Box sx={{ pl: 4 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{order.recipientName}</Typography>
                    <Typography variant="body2" color="text.secondary">{order.shippingPhone}</Typography>
                </Box>
            </Box>

            {/* Cột 2: Địa chỉ */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, color: 'text.secondary' }}>
                    <LocationOnIcon fontSize="small" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Địa chỉ giao hàng</Typography>
                </Box>
                <Box sx={{ pl: 4 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, wordBreak: 'break-word', textAlign: 'left' }}>
                        {order.shippingAddress}<br />
                        {order.shippingCity}
                    </Typography>
                </Box>
            </Box>

            {/* Cột 3: Thanh toán */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, color: 'text.secondary' }}>
                    <CreditCardIcon fontSize="small" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Thanh toán</Typography>
                </Box>
                <Box sx={{ pl: 4 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'medium', textAlign: 'left' }}>
                        {order.paymentMethod === 'VNPAY' ? 'Qua VNPAY' : 'Khi nhận hàng (COD)'}
                    </Typography>
                </Box>
            </Box>

            {/* Cột 4: Dự kiến giao */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, color: 'text.secondary' }}>
                    <CalendarTodayIcon fontSize="small" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Dự kiến giao</Typography>
                </Box>
                <Box sx={{ pl: 4 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main', textAlign: 'left' }}>
                        {new Date(order.estimatedDeliveryDate).toLocaleDateString('vi-VN')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'left' }}>
                        (Dự kiến)
                    </Typography>
                </Box>
            </Box>

        </Box>




      </Paper>

      {/* PHẦN 2: DANH SÁCH SẢN PHẨM (CĂN TRÁI SÁT ẢNH) */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
         <Typography variant="h6" sx={{ mb: 3, fontWeight:'bold', textAlign: 'center' }}>Sản phẩm</Typography>
         
         {order.items && order.items.map((item, idx) => (
             <Box key={idx} sx={{ 
                 display:'flex', 
                 gap: 3, 
                 mb: 2, 
                 pb: 2, 
                 alignItems: 'center', // Căn giữa theo chiều dọc
                 borderBottom: idx !== order.items.length -1 ? '1px solid #f5f5f5' : 'none' 
             }}>
                 {/* Ảnh sản phẩm */}
                 <img 
                    src={item.thumbnail || 'https://placehold.co/100x100?text=No+Image'} 
                    alt={item.productName} 
                    style={{ width: 80, height: 80, objectFit:'cover', borderRadius: 8, border: '1px solid #eee' }} 
                 />
                 
                 {/* Thông tin sản phẩm */}
                 <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
                     <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5 }}>
                        {item.productName}
                     </Typography>
                     <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Phân loại: {item.variantName}
                     </Typography>
                     <Typography variant="body2">
                        x{item.quantity}
                     </Typography>
                 </Box>
                 
                 {/* Giá tiền */}
                 <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                        {formatCurrency(item.price)}
                    </Typography>
                 </Box>
             </Box>
         ))}

         <Divider sx={{ my: 2 }} />
         
         <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1">Tổng tiền thanh toán:</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                {formatCurrency(order.totalAmount)}
            </Typography>
         </Box>
      </Paper>

      {/* PHẦN 3: TIMELINE */}
      {order.status !== 'CANCELLED' && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
            Tiến độ vận chuyển
            </Typography>

            <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
                <Step key={index} expanded={true}> 
                <StepLabel StepIconComponent={ColorlibStepIcon}>
                    <Typography sx={{ fontWeight: 'bold' }}>{step.label}</Typography>
                </StepLabel>
                <StepContent>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left', display: 'block' }}>
                        {step.description}
                    </Typography>
                </StepContent>
                </Step>
            ))}
            </Stepper>
        </Paper>
      )}

      {/* PHẦN 4: THÔNG BÁO HỦY */}
      {order.status === 'CANCELLED' && (
         <Paper elevation={0} sx={{ p: 3, border: '1px solid #ffcdd2', bgcolor: '#ffebee', borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="error" sx={{ fontWeight: 'bold' }}>Đơn hàng này đã bị hủy</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
                Nếu bạn có thắc mắc, vui lòng liên hệ bộ phận chăm sóc khách hàng để được hỗ trợ.
            </Typography>
         </Paper>
      )}

    </Container>
  );
}

export default OrderDetailPage;