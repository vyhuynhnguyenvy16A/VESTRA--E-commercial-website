// src/pages/admin/AccountManagement.jsx
import React, { useState, useMemo } from 'react';
import AdminLayout from '../../components/Layout/AdminLayout';
import { 
  Paper, Box, TextField, Select, MenuItem, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, Button, Avatar, Typography, 
  Pagination, InputAdornment, Stack, OutlinedInput, CircularProgress, Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

// Import API & React Query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllUsers, updateUserStatus, updateUserRole } from '../../api/adminService'; 

function AccountManagement() {
  const queryClient = useQueryClient();

  // State cho bộ lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // 1. Fetch dữ liệu Users từ API
  const { data: users = [], isLoading, isError, error } = useQuery({
    queryKey: ['admin-users'],
    queryFn: getAllUsers,
  });

  // 2. Mutation: Khóa/Mở khóa
  const statusMutation = useMutation({
    mutationFn: ({ userId, status }) => updateUserStatus(userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users']);
    },
    onError: (err) => alert(`Lỗi: ${err.message}`)
  });

  // 3. Mutation: Đổi quyền
  const roleMutation = useMutation({
    mutationFn: ({ userId, role }) => updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users']);
    },
    onError: (err) => alert(`Lỗi: ${err.message}`)
  });

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    
    return users.filter(user => {
      // Lọc theo tên/email
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = user.name?.toLowerCase().includes(searchLower);
      const emailMatch = user.email?.toLowerCase().includes(searchLower);
      const matchesSearch = nameMatch || emailMatch;
      
      // Lọc theo Role (Prisma trả về user.role.name)
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;

      // Lọc theo Status (user.isActive là boolean)
      let matchesStatus = true;
      if (statusFilter === 'active') matchesStatus = user.isActive === true;
      if (statusFilter === 'locked') matchesStatus = user.isActive === false;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  // Xử lý hành động
  const handleToggleStatus = (user) => {
    const newStatus = !user.isActive; 
    if(window.confirm(`Bạn có chắc muốn ${newStatus ? 'MỞ KHÓA' : 'KHÓA'} tài khoản này?`)) {
       statusMutation.mutate({ userId: user.id, status: newStatus });
    }
  };

  const handleChangeRole = (userId, newRole) => {
     roleMutation.mutate({ userId, role: newRole });
  };

  return (
    <AdminLayout title="Quản lý tài khoản" subtitle="Quản lý tài khoản người dùng">
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}>
        
        {/* --- THANH TÌM KIẾM & BỘ LỌC --- */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 4 }}>
          {/* Search */}
          <TextField 
            size="small" 
            placeholder="Tìm kiếm tài khoản" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: '300px' }}
            InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary' }} /></InputAdornment>) }}
          />
          
          {/* Filter Role */}
          <Select
            size="small"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            displayEmpty
            input={<OutlinedInput />}
            renderValue={(selected) => {
                if (selected === 'all') return <Typography variant="body2">Vai trò: <b>Tất cả</b></Typography>;
                const label = selected === 'USER' ? 'Khách hàng' : selected === 'SHOP' ? 'Chủ Shop' : 'Admin';
                return <Typography variant="body2">Vai trò: <b>{label}</b></Typography>;
            }}
            sx={{ minWidth: '180px' }}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="USER">Khách hàng</MenuItem>
            <MenuItem value="SHOP">Chủ Shop</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
          </Select>

          {/* Filter Status */}
          <Select
            size="small"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            displayEmpty
            input={<OutlinedInput />}
            renderValue={(selected) => {
                if (selected === 'all') return <Typography variant="body2">Trạng thái: <b>Tất cả</b></Typography>;
                const label = selected === 'active' ? 'Hoạt động' : 'Đã khóa';
                return <Typography variant="body2">Trạng thái: <b>{label}</b></Typography>;
            }}
            sx={{ minWidth: '180px' }}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="active">Hoạt động</MenuItem>
            <MenuItem value="locked">Đã khóa</MenuItem>
          </Select>
        </Stack>

        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Danh sách người dùng</Typography>
        
        {isLoading && <Box sx={{textAlign: 'center', py: 5}}><CircularProgress /></Box>}
        {isError && <Alert severity="error">Lỗi: {error.message}</Alert>}

        {!isLoading && !isError && (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#F9FAFB' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Người dùng</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Vai trò</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                  <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.length > 0 ? (
                   filteredUsers.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar>{user.name?.charAt(0)}</Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">{user.name || 'No Name'}</Typography>
                            <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Select 
                            size="small" 
                            value={user.role || 'USER'} 
                            onChange={(e) => handleChangeRole(user.id, e.target.value)}
                            disabled={roleMutation.isPending}
                            sx={{ fontSize: '0.875rem', height: 32 }}
                        >
                            <MenuItem value="USER">Khách hàng</MenuItem>
                            <MenuItem value="SHOP">Chủ CH</MenuItem>
                            <MenuItem value="ADMIN">Admin</MenuItem>
                        </Select>
                      </TableCell>

                      <TableCell>
                        <Chip 
                          label={user.isActive ? 'Hoạt động' : 'Đã khóa'} 
                          size="small" 
                          sx={{ 
                            bgcolor: user.isActive ? '#E6F4EA' : '#FCE8E6',
                            color: user.isActive ? '#1E8E3E' : '#D93025',
                            fontWeight: 'bold'
                          }} 
                        />
                      </TableCell>

                      <TableCell align="right">
                        <Button 
                          variant="outlined" 
                          color={user.isActive ? "error" : "success"}
                          size="small" 
                          startIcon={user.isActive ? <LockIcon /> : <LockOpenIcon />} 
                          onClick={() => handleToggleStatus(user)}
                          disabled={statusMutation.isPending}
                          sx={{ textTransform: 'none' }}
                        >
                          {user.isActive ? 'Khóa' : 'Mở khóa'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                        <Typography color="text.secondary">Không tìm thấy kết quả phù hợp</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">Hiển thị {filteredUsers.length} kết quả</Typography>
            <Pagination count={Math.ceil(filteredUsers.length / 5)} shape="rounded" color="primary" />
        </Box>

      </Paper>
    </AdminLayout>
  );
}

export default AccountManagement;