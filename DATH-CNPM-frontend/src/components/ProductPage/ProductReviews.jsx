import React, { useState } from 'react';
import { 
  Box, Typography, Rating, Avatar, Stack, Divider, Tabs, Tab, 
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert 
} from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import LoginIcon from '@mui/icons-material/Login';

import { addReview } from '../../api/productService';

import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function ProductReviews({ product, onReviewSubmit }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const reviews = product.reviews || [];
  const totalReviews = reviews.length;
  
  const averageRating = totalReviews > 0 
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews 
    : 0;

  const handleTabChange = (event, newValue) => setTabValue(newValue);

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setUserRating(5);
    setUserComment('');
    setSubmitError(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async () => {
    if (userComment.trim().length < 10) {
      setSubmitError('Vui lòng nhập bình luận ít nhất 10 ký tự.');
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await addReview(product.id, { rating: userRating, comment: userComment });
      alert("Cảm ơn bạn đã đánh giá!");
      handleCloseDialog();
      if (onReviewSubmit) {
        onReviewSubmit();
      }
      window.location.reload();
    } catch (error) {
      const messageTuBackend = error.response?.data?.message;
      const messageChung = "Có lỗi xảy ra, vui lòng thử lại sau.";
      setSubmitError(messageTuBackend || messageChung);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3, borderBottom: '1px solid #ddd' }}>
        <Tab label="Mô tả sản phẩm" sx={{ fontWeight: 700 }} />
        <Tab label={`Đánh giá (${totalReviews})`} sx={{ fontWeight: 700 }} />
      </Tabs>

      {tabValue === 0 && (
        <Box sx={{ py: 2 }}>
           <Typography variant="body2" sx={{ lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {product.description || "Đang cập nhật mô tả..."}
           </Typography>
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            bgcolor: '#f9f9f9', 
            p: 3, 
            borderRadius: 2,
            mb: 3
          }}>
             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box>
                  <Typography variant="h3" sx={{ color: '#d32f2f', fontWeight: 700, lineHeight: 1 }}>
                      {averageRating.toFixed(1)}<span style={{fontSize: '1rem', color: '#666'}}>/5</span>
                  </Typography>
                </Box>
                <Box>
                  <Rating value={averageRating} readOnly precision={0.5} />
                  <Typography variant="body2" color="text.secondary">{totalReviews} nhận xét</Typography>
                </Box>
             </Box>

             {user ? (
               <Button 
                  variant="contained" 
                  startIcon={<CreateIcon />}
                  onClick={handleOpenDialog}
                  sx={{ bgcolor: '#0066CC', fontWeight: 600 }}
               >
                  Viết đánh giá
               </Button>
             ) : (
               <Button 
                  variant="outlined" 
                  startIcon={<LoginIcon />}
                  onClick={() => navigate('/login')}
                  sx={{ fontWeight: 600, color: '#0066CC', borderColor: '#0066CC' }}
               >
                  Đăng nhập để đánh giá
               </Button>
             )}

          </Box>

          <Stack spacing={3}>
            {reviews.length === 0 ? (
                <Typography align="center" sx={{ py: 3, color: '#888' }}>Chưa có đánh giá nào. Hãy là người đầu tiên!</Typography>
            ) : (
                reviews.map((review, index) => (
                  <Box key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <Avatar sx={{ width: 40, height: 40 }}>{review.user?.name?.[0] || 'U'}</Avatar>
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography fontWeight={700} sx={{ lineHeight: 1.2, mt: 0.5 }}>{review.user?.name || 'Người dùng'}</Typography>
                        <Rating value={review.rating} size="small" readOnly />
                        <Typography variant="body2" sx={{ mt: 1 }}>{review.comment}</Typography>
                        <Typography variant="caption" color="text.secondary">
                            {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
                        </Typography>
                      </Box>
                    </Box>
                    <Divider sx={{ mt: 2 }} />
                  </Box>
                ))
            )}
          </Stack>
        </Box>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Viết đánh giá sản phẩm</DialogTitle>
        <DialogContent dividers>
          {submitError && <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>}
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', py: 1 }}>
            <Typography component="legend">Bạn chấm sản phẩm này bao nhiêu sao?</Typography>
            <Rating
              name="simple-controlled"
              value={userRating}
              size="large"
              onChange={(event, newValue) => {
                setUserRating(newValue);
              }}
            />
            
            <TextField
              autoFocus
              margin="dense"
              id="review-comment"
              label="Chia sẻ cảm nhận của bạn"
              type="text"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
              placeholder="Chất lượng sản phẩm tuyệt vời, đóng gói cẩn thận..."
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} color="inherit" disabled={isSubmitting}>
            Hủy bỏ
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ProductReviews;