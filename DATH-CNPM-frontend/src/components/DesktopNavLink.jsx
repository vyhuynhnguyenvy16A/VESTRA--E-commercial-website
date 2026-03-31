// src/components/DesktopNavLink.jsx

import React, { useState, useRef } from 'react';
import { Button, Popover, Box, Link, Fade } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const DesktopNavLink = ({ link }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const timerRef = useRef(null);
  const buttonRef = useRef(null); // Tham chiếu đến Button

  const hasChildren = link.children && link.children.length > 0;

  const handlePopoverOpen = (event) => {
    clearTimeout(timerRef.current);
    
    if (hasChildren) {
      // Luôn neo vào buttonRef.current ---
      setAnchorEl(buttonRef.current); 
    }
  };

  const handlePopoverClose = () => {
    timerRef.current = setTimeout(() => {
      setAnchorEl(null);
    }, 200); 
  };

  const open = Boolean(anchorEl);

  return (
    <Box
      onMouseEnter={handlePopoverOpen}
      onMouseLeave={handlePopoverClose}
      sx={{ position: 'relative' }} 
    >
      {/* Gắn ref vào Button */}
      <Button 
        ref={buttonRef} 
        color="inherit"
        endIcon={link.hasDropdown ? <ArrowDropDownIcon /> : null}
        sx={{ 
          py: 1.5, 
          px: 3, 
          borderRadius: 0, 
          fontWeight: 'bold', 
          fontSize: '0.9rem',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)'
          }
        }}
        aria-owns={open ? `mouse-over-popover-${link.title}` : undefined}
        aria-haspopup="true"
      >
        {link.title}
      </Button>

      {hasChildren && (
        <Popover
          id={`mouse-over-popover-${link.title}`}
          open={open}
          // Luôn neo vào buttonRef.current 
          anchorEl={buttonRef.current} 
          
          // Điều chỉnh vị trí neo
          anchorOrigin={{
            vertical: 'bottom', // Neo vào cạnh dưới của nút
            horizontal: 'left', // Thẳng hàng với cạnh trái của nút
          }}
          transformOrigin={{
            vertical: 'top',    // Popover xuất hiện từ trên xuống
            horizontal: 'left', // Thẳng hàng với cạnh trái của Popover
          }}

          onClose={handlePopoverClose}
          disableRestoreFocus
          TransitionComponent={Fade}
          transitionDuration={150} 
          PaperProps={{
            onMouseEnter: handlePopoverOpen,
            onMouseLeave: handlePopoverClose,
            sx: {
              pointerEvents: 'auto',
              mt: 0, // Đảm bảo Popover dính liền với nút cha
              boxShadow: '0px 5px 15px rgba(0,0,0,0.1)',
              borderRadius: 0,
            }
          }}
          sx={{
            pointerEvents: 'none',
          }}
        >
          {/* Nội dung bên trong */}
          <Box sx={{ pt: 1, pb: 1, minWidth: '240px' }}>
            {link.children.map((childLink) => (
              <Link
                href="#" 
                key={childLink}
                display="block"
                underline="none"
                color="text.primary"
                sx={{
                  p: '12px 24px',
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.04)'
                  }
                }}
              >
                {childLink}
              </Link>
            ))}
          </Box>
        </Popover>
      )}
    </Box>
  );
};

export default DesktopNavLink;