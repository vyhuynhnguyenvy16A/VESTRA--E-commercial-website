import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  Alert
} from '@mui/material';

import { createReport } from '../../api/reportService.js';

function ReportDialog({ open, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    priority: 'MEDIUM',
    reportedId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    setError(null);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.message.trim()) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
        const payload = {
            title: formData.title,
            message: formData.message,
            priority: formData.priority,
            reportedId: formData.reportedId ? parseInt(formData.reportedId) : null
        };

        await createReport(payload);
        setSuccess(true);
        setTimeout(() => {
          handleClose();
        }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi gửi khiếu nại');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ title: '', message: '', priority: 'MEDIUM', reportedId: '' });
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
        Gửi khiếu nại
      </DialogTitle>
      
      <DialogContent dividers>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>Gửi khiếu nại thành công!</Alert>}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 1 }}>
          <TextField
            label="Tiêu đề"
            fullWidth
            required
            value={formData.title}
            onChange={handleChange('title')}
            placeholder="Vấn đề cần khiếu nại..."
          />

          <TextField
            label="Nội dung chi tiết"
            fullWidth
            required
            multiline
            rows={4}
            value={formData.message}
            onChange={handleChange('message')}
            placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
          />

          <TextField
            label="Mức độ ưu tiên"
            select
            fullWidth
            value={formData.priority}
            onChange={handleChange('priority')}
          >
            <MenuItem value="LOW">Thấp</MenuItem>
            <MenuItem value="MEDIUM">Trung bình</MenuItem>
            <MenuItem value="HIGH">Cao</MenuItem>
          </TextField>

          <TextField
            label="ID người bị báo cáo (tùy chọn)"
            fullWidth
            type="number"
            value={formData.reportedId}
            onChange={handleChange('reportedId')}
            placeholder="Nhập ID nếu báo cáo về người dùng cụ thể"
            helperText="Để trống nếu không báo cáo về người dùng cụ thể"
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={handleClose} color="inherit" disabled={isSubmitting}>
          Hủy bỏ
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting || success}
          sx={{ bgcolor: '#d32f2f', '&:hover': { bgcolor: '#b71c1c' } }}
        >
          {isSubmitting ? 'Đang gửi...' : 'Gửi khiếu nại'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ReportDialog;
