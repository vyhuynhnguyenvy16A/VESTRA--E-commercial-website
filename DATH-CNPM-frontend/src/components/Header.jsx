import React, { useState, useRef } from 'react';
import { 
  AppBar, Toolbar, Typography, Button, Box, 
  IconButton, Container, Menu, MenuItem, InputBase, Badge,
  Drawer, List, ListItem, ListItemText, Divider
} from '@mui/material';
import { useAuth } from '../context/AuthContext.jsx';
import MenuIcon from '@mui/icons-material/Menu'; 
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import Logo from '../assets/vestra_logo.png';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ReportDialog from '../components/Report/ReportDialog.jsx';
import CartSidePopup from '../components/PopupCart.jsx'; 

const navLinks = [
  { title: 'Nữ', path: '/category/Thời trang Nữ' },
  { title: 'Nam', path: '/category/Thời trang Nam' },
  { title: 'Trẻ em', path: '/category/Trẻ em' },
  { title: 'Phụ kiện', path: '/category/Phụ kiện' },
];

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountAnchorEl, setAccountAnchorEl] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  
  const [isCartOpen, setIsCartOpen] = useState(false); 
  const [isReportOpen, setIsReportOpen] = useState(false);

  const accountButtonRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAccountPopoverOpen = Boolean(accountAnchorEl);


  const MENU_CONFIG = {
    guest: [
      { label: 'Đăng nhập', path: '/login' },
      { label: 'Đăng ký', path: '/register' },
    ],
    user: [
      { label: 'Đơn hàng của tôi', path: '/my-orders' },
      { label: 'Giỏ hàng của tôi', path: '/shopping-bag' },
      { label: 'Khiếu nại', action: 'report', icon: <ReportProblemOutlinedIcon fontSize="small" /> },
      { label: 'Đăng xuất', action: 'logout' },
    ],
    admin: [
      { label: 'Đăng xuất', action: 'logout' },
    ],
    shop: [
      { label: 'Dashboard Shop', path: '/shop/dashboard' },
      { label: 'Đăng xuất', action: 'logout' },
    ]
  };

  const currentRole = user ? (user.role ? user.role.toLowerCase() : 'user') : 'guest';
  const menuItems = MENU_CONFIG[currentRole] || MENU_CONFIG.user;

  const closeTimeoutRef = useRef(null);
  
  const handleAccountPopoverOpen = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setAccountAnchorEl(accountButtonRef.current);
  };

  const handleAccountPopoverClose = () => {
   closeTimeoutRef.current = setTimeout(() => {
      setAccountAnchorEl(null);
    }, 300);
  };

  const handleLogout = () => {
    handleAccountPopoverClose();
    logout();
    navigate('/');
  };

  const handleOpenReport = () => {
    setAccountAnchorEl(null);
    setIsReportOpen(true);
  };

  const handleSearch = (e) => {
    if (e && e.key) {
      if (e.key === 'Enter') {
        if (typeof e.preventDefault === 'function') e.preventDefault();
        
        if (searchValue.trim()) {
           navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
           setSearchValue(''); // Xóa ô tìm kiếm
           setSearchOpen(false); // Đóng trên mobile
        }
      }
    } 
    else {
       if (searchValue.trim()) {
          navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
          setSearchValue('');
          setSearchOpen(false);
       }
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // --- TOP BAR ---
  const TopBar = (
    <Box sx={{ bgcolor: '#fff', borderBottom: '1px solid #f0f0f0' }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ 
          py: 1.5, 
          px: { xs: 1, sm: 2 },
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: { xs: 56, sm: 64 }
        }}>
          
          {/* Logo & Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 120 }}>
            <RouterLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: 'inherit' }}>
                <img 
                  src={Logo} 
                  alt="Vestra Logo" 
                  style={{ height: '40px', width: 'auto', objectFit: 'contain' }} 
                />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 800, 
                    fontSize: { xs: '1rem', sm: '1.2rem' },
                    letterSpacing: '0.05em',
                    color: '#000'
                  }}
                >
                  VESTRA
                </Typography>
            </RouterLink>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' },
            gap: 3,
            flex: 1,
            justifyContent: 'center',
            ml: 4
          }}>
            {navLinks.map((link) => (
              <Button
                key={link.title}
                component={RouterLink}
                to={link.path}
                color="inherit"
                sx={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  position: 'relative',
                  '&:hover': {
                    color: '#d32f2f'
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    width: 0,
                    height: 2,
                    bottom: -4,
                    left: '50%',
                    bgcolor: '#d32f2f',
                    transition: 'all 0.3s ease',
                    transform: 'translateX(-50%)'
                  },
                  '&:hover::after': {
                    width: '100%'
                  }
                }}
              >
                {link.title}
              </Button>
            ))}
          </Box>

          {/* Right Icons Section */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 0.5, sm: 1.5 },
            minWidth: 200,
            justifyContent: 'flex-end'
          }}>
            
            {/* Search Bar Desktop */}
            <Box sx={{ 
              display: { xs: 'none', lg: 'flex' },
              alignItems: 'center',
              bgcolor: '#f5f5f5',
              borderRadius: '4px',
              px: 1.5,
              py: 0.8,
              width: '200px',
              transition: 'all 0.3s'
            }}>
              <InputBase
                placeholder="Tìm kiếm sản phẩm..."
                sx={{ 
                  flex: 1, 
                  fontSize: '0.85rem',
                  '& input::placeholder': {
                    opacity: 0.6
                  }
                }}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleSearch}
              />
              <IconButton 
                size="small" 
                sx={{ p: 0.5 }}
                onClick={() => handleSearch()}
              >
                <SearchIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>

            {/* Search Mobile */}
            <IconButton 
              sx={{ display: { xs: 'flex', lg: 'none' } }}
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <SearchIcon sx={{ fontSize: 20 }} />
            </IconButton>

            {/* Account Menu */}
            <Box sx={{ display: { xs: 'flex', sm: 'flex' } }}>
              
              <IconButton
                ref={accountButtonRef}
                size="small"
                onClick={handleAccountPopoverOpen}
                onMouseEnter={handleAccountPopoverOpen}
                onMouseLeave={handleAccountPopoverClose}
                sx={{ p: 0.5 }}
              >
                <AccountCircleIcon sx={{ fontSize: 24 }} />
              </IconButton>
              
              <Menu
                open={isAccountPopoverOpen}
                anchorEl={accountButtonRef.current}
                onClose={handleAccountPopoverClose}          
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                disableAutoFocusItem
                PaperProps={{
                  onMouseEnter: handleAccountPopoverOpen, 
                  onMouseLeave: handleAccountPopoverClose,
                  elevation: 0,
                  sx: {
                    mt: 1.5, 
                    minWidth: '200px',
                    boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
                    border: '1px solid #f0f0f0',
                    pointerEvents: 'auto',
                    overflow: 'visible',
                    
                    
                    '&::before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: '-20px',
                      left: 0,
                      right: 0,
                      height: '20px',
                      bgcolor: 'transparent',
                    }
                  }
                }}
              >
                {user && (
                  <Box>
                    <MenuItem disabled sx={{ fontWeight: 600, color: '#000', opacity: '1 !important' }}>
                      {user.name || user.fullName || `User #${user.id}` || "Khách hàng"}
                    </MenuItem>
                    <Divider />
                  </Box>
                )}

                {menuItems.map((item, index) => {
                  if (item.label === 'divider') return <Divider key={index} />;
                  return (
                    <MenuItem 
                      key={index}
                      onClick={() => {
                         if (item.action === 'logout') handleLogout();
                         else if (item.action === 'report') handleOpenReport();
                         else setAccountAnchorEl(null);
                      }}
                      component={item.path ? RouterLink : 'li'}
                      to={item.path || undefined}
                      sx={{ 
                        color: item.action === 'logout' ? '#d32f2f' : 
                               item.action === 'report' ? '#ff6f00' : 'inherit',
                        gap: 1
                      }}
                    >
                      {item.icon}
                      {item.label}
                    </MenuItem>
                  );
                })}
              </Menu>
           </Box>

            <Button
              onClick={() => setIsCartOpen(true)} 
              startIcon={
                <Badge badgeContent={0} color="error">
                  <ShoppingCartOutlinedIcon />
                </Badge>
              }
              sx={{
                color: '#000',
                fontSize: '0.8rem',
                fontWeight: 600,
                textTransform: 'none',
                display: { xs: 'none', sm: 'inline-flex' },
                '&:hover': {
                  color: '#d32f2f'
                }
              }}
            >
              Giỏ hàng
            </Button>

            <IconButton 
              sx={{ display: { xs: 'flex', sm: 'none' } }}
              onClick={() => setIsCartOpen(true)} // Thay đổi sự kiện
            >
              <Badge badgeContent={0} color="error">
                <ShoppingCartOutlinedIcon />
              </Badge>
            </IconButton>

            {/* Mobile Menu Toggle */}
            <IconButton
              sx={{ display: { xs: 'flex', md: 'none' }, ml: 1 }}
              onClick={toggleMobileMenu}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Search Bar */}
      {searchOpen && (
        <Box sx={{ 
          display: { xs: 'flex', lg: 'none' },
          px: 2,
          py: 1.5,
          bgcolor: '#f9f9f9',
          borderTop: '1px solid #f0f0f0'
        }}>
          <InputBase
            fullWidth
            placeholder="Tìm kiếm sản phẩm..."
            sx={{ 
              bgcolor: '#fff',
              px: 1.5,
              py: 0.8,
              borderRadius: '4px',
              fontSize: '0.85rem',
              border: '1px solid #e0e0e0'
            }}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearch}
            autoFocus
            endAdornment={
              <IconButton 
                size="small" 
                sx={{ p: 0.5 }}
                onClick={() => handleSearch()}
              >
                <SearchIcon sx={{ fontSize: 18 }} />
              </IconButton>
            }
          />
        </Box>
      )}
    </Box>
  );

  // --- MOBILE DRAWER MENU ---
  const MobileDrawer = (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={toggleMobileMenu}
    >
      <Box sx={{ width: 280, pt: 2 }}>
        <List>
          {navLinks.map((link) => (
            <ListItem
              key={link.title}
              button
              component={RouterLink}
              to={link.path}
              onClick={toggleMobileMenu}
              sx={{
                px: 2,
                py: 1.5,
                '&:hover': {
                  bgcolor: '#f5f5f5',
                  color: '#d32f2f'
                }
              }}
            >
              <ListItemText 
                primary={link.title}
                primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500 }}
              />
            </ListItem>
          ))}
          <Divider sx={{ my: 1 }} />
          {user && (
            <>
              <ListItem
                button
                component={RouterLink}
                to="/profile"
                onClick={toggleMobileMenu}
                sx={{ px: 2, py: 1.5 }}
              >
                <ListItemText primary="Tài khoản của tôi" />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  handleLogout();
                  toggleMobileMenu();
                }}
                sx={{ px: 2, py: 1.5, color: '#d32f2f' }}
              >
                <ListItemText primary="Đăng xuất" />
              </ListItem>
            </>
          )}
          {!user && (
            <>
              <ListItem
                button
                component={RouterLink}
                to="/login"
                onClick={toggleMobileMenu}
                sx={{ px: 2, py: 1.5 }}
              >
                <ListItemText primary="Đăng nhập" />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/register"
                onClick={toggleMobileMenu}
                sx={{ px: 2, py: 1.5 }}
              >
                <ListItemText primary="Đăng ký" />
              </ListItem>
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <AppBar 
      position="sticky" 
      color="default" 
      elevation={0} 
      sx={{ bgcolor: '#fff', color: '#000' }}
    >
      {TopBar}
      {MobileDrawer}

      <CartSidePopup 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
      
      <ReportDialog 
        open={isReportOpen} 
        onClose={() => setIsReportOpen(false)} 
      />
    </AppBar>
  );
}

export default Header;