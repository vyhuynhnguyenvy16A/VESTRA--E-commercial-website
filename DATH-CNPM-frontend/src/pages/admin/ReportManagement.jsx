import React, { useState, useMemo, useEffect } from 'react';
import AdminLayout from '../../components/Layout/AdminLayout';
import { 
  Paper, Box, Typography, Grid, Chip, Select, MenuItem, Table, 
  TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Avatar, Pagination, IconButton, CircularProgress, Alert, 
  Stack, TextField, InputAdornment, OutlinedInput, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Divider, FormControl, InputLabel
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FlagIcon from '@mui/icons-material/Flag'; 
import SearchIcon from '@mui/icons-material/Search';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SaveIcon from '@mui/icons-material/Save';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllReports, updateReportStatus } from '../../api/adminService'; 

// --- 1. COMPONENT: STAT CARD (BOX THỐNG KÊ) ---
const StatCard = ({ title, value, icon, color, subtext, subtextColor }) => (
  <Paper 
    elevation={0} 
    sx={{ 
      p: 3, 
      borderRadius: 3, 
      height: '100%', 
      width: '100%', 
      border: '1px solid #E0E0E0', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'space-between', 
      minHeight: '160px', 
      boxSizing: 'border-box', 
      transition: 'all 0.2s', 
      '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.1)' } 
    }}
  >
     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
           <Typography variant="subtitle1" color="text.secondary" fontWeight={600} sx={{ mb: 0.5 }}>{title}</Typography>
           <Typography variant="h3" fontWeight="bold" sx={{ color: '#1A1C1E' }}>{value}</Typography>
        </Box>
        <Box sx={{ width: 56, height: 56, borderRadius: 3, bgcolor: `${color}15`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {React.cloneElement(icon, { style: { fontSize: '2rem' } })} 
        </Box>
     </Box>
     <Box sx={{ mt: 'auto' }}>
        <Typography variant="body2" sx={{ color: subtextColor || 'text.secondary', fontWeight: 500 }}>{subtext}</Typography>
     </Box>
  </Paper>
);

// --- 2. COMPONENT: REPORT DETAIL DIALOG (POPUP CHI TIẾT & UPDATE) ---
const ReportDetailDialog = ({ open, report, onClose, onUpdateStatus, isUpdating }) => {
    const [currentStatus, setCurrentStatus] = useState('');

    // Reset status khi mở dialog mới
    useEffect(() => {
        if (report) {
            setCurrentStatus(report.status);
        }
    }, [report]);

    if (!report) return null;

    const handleSaveStatus = () => {
        if (currentStatus !== report.status) {
            onUpdateStatus(report.id, currentStatus);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ bgcolor: '#F9FAFB', borderBottom: '1px solid #eee', pb: 2 }}>
                <Typography variant="h6" fontWeight="bold">Chi tiết báo cáo #{report.id}</Typography>
            </DialogTitle>
            
            <DialogContent sx={{ pt: 3 }}>
                {/* Thông tin người gửi */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar src={report.reporter?.avatar} sx={{ width: 56, height: 56, mr: 2 }}>{report.reporter?.name?.charAt(0)}</Avatar>
                    <Box>
                        <Typography variant="subtitle1" fontWeight="bold">{report.reporter?.name || 'Ẩn danh'}</Typography>
                        <Typography variant="body2" color="text.secondary">{report.reporter?.email}</Typography>
                    </Box>
                    <Chip 
                        label={report.priority} 
                        size="small" 
                        sx={{ ml: 'auto', bgcolor: report.priority === 'HIGH' ? '#FFEBEE' : '#E3F2FD', color: report.priority === 'HIGH' ? '#D32F2F' : '#1976D2', fontWeight: 'bold' }} 
                    />
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Nội dung báo cáo */}
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>TIÊU ĐỀ</Typography>
                <Typography variant="body1" fontWeight={500} gutterBottom>{report.title}</Typography>
                
                <Box sx={{ mt: 2, mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>NỘI DUNG CHI TIẾT</Typography>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: '#FAFAFA', minHeight: '100px' }}>
                        <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }}>{report.message || "Không có nội dung mô tả."}</Typography>
                    </Paper>
                </Box>

                {/* --- KHU VỰC CẬP NHẬT TRẠNG THÁI --- */}
                <Paper variant="outlined" sx={{ p: 2, bgcolor: '#F0F7FF', borderColor: '#BAE6FD' }}>
                    <Typography variant="subtitle2" color="primary" gutterBottom fontWeight="bold">CẬP NHẬT TRẠNG THÁI</Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <FormControl fullWidth size="small">
                            <InputLabel>Trạng thái xử lý</InputLabel>
                            <Select
                                value={currentStatus}
                                label="Trạng thái xử lý"
                                onChange={(e) => setCurrentStatus(e.target.value)}
                                sx={{ bgcolor: 'white' }}
                            >
                                <MenuItem value="PENDING">⏳ Đang chờ (Pending)</MenuItem>
                                <MenuItem value="PROCESSING">⚙️ Đang xử lý (Processing)</MenuItem>
                                <MenuItem value="RESOLVED">✅ Đã giải quyết (Resolved)</MenuItem>
                            </Select>
                        </FormControl>
                        <Button 
                            variant="contained" 
                            startIcon={<SaveIcon />}
                            onClick={handleSaveStatus}
                            disabled={isUpdating || currentStatus === report.status}
                            sx={{ minWidth: '120px' }}
                        >
                            Lưu
                        </Button>
                    </Stack>
                </Paper>

                {/* Meta info */}
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', color: 'text.secondary', fontSize: '0.85rem' }}>
                    <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
                    Ngày tạo: {new Date(report.createdAt).toLocaleDateString('vi-VN')}
                </Box>

            </DialogContent>

            <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
                <Button onClick={onClose} color="inherit">Đóng</Button>
            </DialogActions>
        </Dialog>
    );
};


// --- 3. MAIN SCREEN ---
function ReportManagement() {
  const queryClient = useQueryClient();
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); 
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);

  // API Query
  const { data: reports = [], isLoading, isError, error } = useQuery({
    queryKey: ['admin-reports'],
    queryFn: getAllReports,
  });

  // API Mutation
  const statusMutation = useMutation({
    mutationFn: ({ reportId, status }) => updateReportStatus(reportId, status),
    onSuccess: () => {
        queryClient.invalidateQueries(['admin-reports']);
        setSelectedReport(null); 
    },
    onError: (err) => alert(`Lỗi: ${err.message}`)
  });

  // Handlers
  const handleOpenDetail = (report) => setSelectedReport(report);
  const handleCloseDetail = () => setSelectedReport(null);

  const handleUpdateStatus = (id, status) => {
      statusMutation.mutate({ reportId: id, status });
  };

  const handleQuickResolve = (id) => {
      if(window.confirm('Xác nhận đánh dấu báo cáo này là ĐÃ XONG?')) {
        statusMutation.mutate({ reportId: id, status: 'RESOLVED' });
      }
  };

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
        case 'RESOLVED': return 'success';
        case 'PROCESSING': return 'info';
        case 'PENDING': return 'warning';
        default: return 'default';
    }
  };

  // Stats Calculation
  const stats = useMemo(() => {
    if (!reports) return { total: 0, pending: 0, resolved: 0, highPriority: 0 };
    return {
        total: reports.length,
        pending: reports.filter(r => r.status === 'PENDING').length,
        resolved: reports.filter(r => r.status === 'RESOLVED').length,
        highPriority: reports.filter(r => r.priority === 'HIGH').length,
    };
  }, [reports]);

  const filteredReports = useMemo(() => {
    if (!reports) return [];
    
    return reports.filter(r => {
        // 1. Tìm kiếm (Tiêu đề, Tên, Email)
        const searchLower = searchTerm.toLowerCase();
        const matchSearch = 
            (r.title?.toLowerCase().includes(searchLower)) || 
            (r.reporter?.name?.toLowerCase().includes(searchLower)) ||
            (r.reporter?.email?.toLowerCase().includes(searchLower));
        
        // 2. Lọc theo Status (Đã fix)
        const matchStatus = statusFilter === 'all' || r.status === statusFilter;

        // 3. Lọc theo Priority (Đã thêm mới)
        const matchPriority = priorityFilter === 'all' || r.priority === priorityFilter;
        
        return matchSearch && matchStatus && matchPriority;
    });
  }, [reports, searchTerm, statusFilter, priorityFilter]);

  return (
    <AdminLayout title="Quản lý báo cáo" subtitle="Quản lý các báo cáo từ người dùng">
      
      {/* --- STATS BOX (FULL WIDTH) --- */}
      <Box sx={{ width: '100%', mb: 4 }}>
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Tổng số" value={stats.total} icon={<FlagIcon />} color="#1976D2" subtext="Tổng hợp toàn thời gian" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Chờ xử lý" value={stats.pending} icon={<HourglassEmptyIcon />} color="#ED6C02" subtext="Cần được xem xét" subtextColor="warning.main" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Đã xong" value={stats.resolved} icon={<CheckCircleIcon />} color="#2E7D32" subtext="Đã xử lý xong" subtextColor="success.main" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Ưu tiên cao" value={stats.highPriority} icon={<WarningIcon />} color="#D32F2F" subtext="Cần xử lý ngay" subtextColor="error.main" />
            </Grid>
        </Grid>
      </Box>

      {/* --- MAIN TABLE --- */}
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}>
        
        {/* Toolbar Filters */}
        <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
           {/* Search */}
           <TextField 
                size="small" 
                placeholder="Tìm kiếm báo cáo..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
                sx={{ minWidth: 300 }} 
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary' }} /></InputAdornment> }} 
           />
           
           {/* Filter Status */}
           <Select 
                size="small" 
                value={statusFilter} 
                onChange={e => setStatusFilter(e.target.value)} 
                displayEmpty
                sx={{ minWidth: 200 }}
                renderValue={(selected) => {
                    if (selected === 'all') return <Typography variant="body2">Trạng thái: <b>Tất cả</b></Typography>;
                    const label = selected === 'PENDING' ? 'Chờ xử lý' : selected === 'PROCESSING' ? 'Đang xử lý' : 'Đã xong';
                    return <Typography variant="body2">Trạng thái: <b>{label}</b></Typography>;
                }}
           >
                <MenuItem value="all">Tất cả trạng thái</MenuItem>
                <MenuItem value="PENDING">⏳ Chờ xử lý</MenuItem>
                <MenuItem value="PROCESSING">⚙️ Đang xử lý</MenuItem>
                <MenuItem value="RESOLVED">✅ Đã xong</MenuItem>
           </Select>

           {/* Filter Priority */}
           <Select 
                size="small" 
                value={priorityFilter} 
                onChange={e => setPriorityFilter(e.target.value)} 
                displayEmpty
                sx={{ minWidth: 200 }}
                renderValue={(selected) => {
                    if (selected === 'all') return <Typography variant="body2">Ưu tiên: <b>Tất cả</b></Typography>;
                    const label = selected === 'HIGH' ? 'Cao' : selected === 'MEDIUM' ? 'Trung bình' : 'Thấp';
                    return <Typography variant="body2">Ưu tiên: <b>{label}</b></Typography>;
                }}
           >
                <MenuItem value="all">Tất cả mức độ</MenuItem>
                <MenuItem value="HIGH">Cao</MenuItem>
                <MenuItem value="MEDIUM">Trung bình</MenuItem>
                <MenuItem value="LOW">Thấp</MenuItem>
           </Select>
        </Stack>

        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Danh sách báo cáo</Typography>

        {isLoading && <Box sx={{textAlign: 'center', py: 5}}><CircularProgress /></Box>}
        {isError && <Alert severity="error">Lỗi: {error.message}</Alert>}

        {!isLoading && !isError && (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#F9FAFB' }}>
                <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Người báo cáo</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Tiêu đề</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Ưu tiên</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Ngày tạo</TableCell>
                    <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReports.length > 0 ? (
                    filteredReports.map((row) => (
                        <TableRow key={row.id} hover>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Avatar>{row.reporter?.name?.charAt(0)}</Avatar>
                                    <Box>
                                        <Typography variant="body2" fontWeight={600}>{row.reporter?.name || 'Ẩn danh'}</Typography>
                                        <Typography variant="caption" color="text.secondary">{row.reporter?.email}</Typography>
                                    </Box>
                                </Box>
                            </TableCell>
                            <TableCell><Typography variant="body2">{row.title}</Typography></TableCell>
                            <TableCell>
                                <Chip label={row.priority} size="small" sx={{ fontSize: '0.7rem', height: 24, fontWeight: 'bold', bgcolor: row.priority === 'HIGH' ? '#FFEBEE' : row.priority === 'MEDIUM' ? '#FFF3E0' : '#E3F2FD', color: row.priority === 'HIGH' ? '#D32F2F' : row.priority === 'MEDIUM' ? '#ED6C02' : '#1976D2' }} />
                            </TableCell>
                            <TableCell>
                                <Chip label={row.status} size="small" color={getStatusColor(row.status)} variant={row.status === 'PENDING' ? 'outlined' : 'filled'} />
                            </TableCell>
                            <TableCell sx={{ color: 'text.secondary' }}>
                                {new Date(row.createdAt).toLocaleDateString('vi-VN')}
                            </TableCell>
                            
                            <TableCell align="right">
                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                    {/* Nút Xử lý nhanh */}
                                    {row.status !== 'RESOLVED' && (
                                        <Tooltip title="Đánh dấu nhanh là Đã xong">
                                            <IconButton 
                                                size="small" 
                                                sx={{ color: 'success.main', bgcolor: '#E8F5E9', '&:hover': { bgcolor: '#C8E6C9' } }}
                                                onClick={() => handleQuickResolve(row.id)}
                                                disabled={statusMutation.isPending}
                                            >
                                                <CheckIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    )}

                                    {/* Nút Xem Chi Tiết */}
                                    <Tooltip title="Xem chi tiết & Cập nhật">
                                        <IconButton 
                                            size="small" 
                                            color="primary"
                                            onClick={() => handleOpenDetail(row)}
                                            sx={{ bgcolor: '#E3F2FD', '&:hover': { bgcolor: '#BBDEFB' } }}
                                        >
                                            <VisibilityIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                            <Typography color="text.secondary">Không tìm thấy báo cáo nào phù hợp</Typography>
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* --- 3. POPUP CHI TIẾT (Dialog) --- */}
        <ReportDetailDialog 
            open={!!selectedReport} 
            report={selectedReport} 
            onClose={handleCloseDetail}
            onUpdateStatus={handleUpdateStatus}
            isUpdating={statusMutation.isPending}
        />

      </Paper>
    </AdminLayout>
  );
}

export default ReportManagement;