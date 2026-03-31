import React, { useState } from 'react';
import { 
  Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, 
  Typography, Avatar, Badge, IconButton, Menu, MenuItem, Divider 
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import FlagIcon from '@mui/icons-material/Flag';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import LogoV from '../../assets/vestra_logo.png'; 

const SIDEBAR_WIDTH = 260;

const menuItems = [
  { text: 'Quản lý tài khoản', icon: <PeopleIcon />, path: '/admin/accounts' },
  { text: 'Quản lý báo cáo', icon: <FlagIcon />, path: '/admin/reports' },
];

function AdminLayout({ children, title, subtitle }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { user, logout } = useAuth(); 

  // State Menu Popup
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    logout(); 
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F4F6F8' }}>
      
      {/* SIDEBAR */}
      <Box sx={{ width: SIDEBAR_WIDTH, bgcolor: 'white', borderRight: '1px solid #eee', position: 'fixed', height: '100%', left: 0, top: 0, zIndex: 1200 }}>
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box component="img" src={LogoV} alt="Vestra" sx={{ width: 40, height: 40, objectFit: 'contain' }} />
            <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1 }}>VESTRA</Typography>
                <Typography variant="caption" color="text.secondary">Quản trị hệ thống</Typography>
            </Box>
        </Box>
        <List sx={{ px: 2 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton 
                  onClick={() => navigate(item.path)}
                  sx={{ borderRadius: 2, bgcolor: isActive ? '#E3F2FD' : 'transparent', color: isActive ? '#1976D2' : 'text.primary', '&:hover': { bgcolor: isActive ? '#E3F2FD' : '#f5f5f5' } }}
                >
                  <ListItemIcon sx={{ color: isActive ? '#1976D2' : 'text.secondary', minWidth: 40 }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive ? 600 : 400 }} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* MAIN CONTENT */}
      <Box sx={{ flexGrow: 1, ml: `${SIDEBAR_WIDTH}px`, p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h5" fontWeight="bold">{title}</Typography>
            <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton><Badge badgeContent={2} color="error"><NotificationsIcon color="action" /></Badge></IconButton>
            
            {/* User Profile */}
            <Box onClick={handleMenuOpen} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', p: 0.5, pr: 1.5, borderRadius: 2, transition: '0.2s', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}>
                <Avatar src={user?.avatar || ""} sx={{ width: 36, height: 36, bgcolor: '#1976D2' }}>
                    {user?.name?.charAt(0) || "A"}
                </Avatar>
                <Typography variant="subtitle2" fontWeight="bold">{user?.name || "Admin"}</Typography>
            </Box>

            {/* Menu */}
            <Menu
                anchorEl={anchorEl} open={open} onClose={handleMenuClose} onClick={handleMenuClose}
                PaperProps={{ elevation: 0, sx: { overflow: 'visible', filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))', mt: 1.5, minWidth: 200, '&:before': { content: '""', display: 'block', position: 'absolute', top: 0, right: 14, width: 10, height: 10, bgcolor: 'background.paper', transform: 'translateY(-50%) rotate(45deg)', zIndex: 0 } } }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle2" noWrap>{user?.name}</Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>{user?.email}</Typography>
                </Box>
                <Divider />
                <MenuItem onClick={handleMenuClose}><ListItemIcon><AccountCircleIcon fontSize="small" /></ListItemIcon>Hồ sơ cá nhân</MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}><ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>Đăng xuất</MenuItem>
            </Menu>
          </Box>
        </Box>
        {children}
      </Box>
    </Box>
  );
}

export default AdminLayout;