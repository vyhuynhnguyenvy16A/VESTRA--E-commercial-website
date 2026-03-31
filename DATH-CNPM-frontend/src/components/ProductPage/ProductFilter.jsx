import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, FormGroup, FormControlLabel, Checkbox, Radio, RadioGroup, 
  Button, Divider, Accordion, AccordionSummary, AccordionDetails, 
  useMediaQuery, useTheme, Drawer, IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';

function ProductFilter({ onFilterChange, mobileOpen = false, onClose = null }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));


  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  
  const colorOptions = [
    { name: 'Đen', code: '#000000' },
    { name: 'Trắng', code: '#FFFFFF' },
    { name: 'Đỏ', code: '#FF0000' },
    { name: 'Xanh', code: '#0066CC' }, 
    { name: 'Vàng', code: '#FFFF00' },
    { name: 'Be', code: '#F5F5DC' }
  ];

  const [filters, setFilters] = useState({
    sizes: [],
    colors: [],
    priceRange: 'all',
  });

  const handleSizeChange = (size) => {
    setFilters(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size) ? prev.sizes.filter(s => s !== size) : [...prev.sizes, size]
    }));
  };

  const handleColorChange = (colorName) => {
    setFilters(prev => ({
      ...prev,
      colors: prev.colors.includes(colorName) ? prev.colors.filter(c => c !== colorName) : [...prev.colors, colorName]
    }));
  };

  const handlePriceChange = (e) => {
    setFilters(prev => ({ ...prev, priceRange: e.target.value }));
  };

  const handleApplyFilter = () => {
    onFilterChange(filters);
    if (isMobile && onClose) onClose();
  };

  const handleReset = () => {
    const reset = { sizes: [], colors: [], priceRange: 'all' };
    setFilters(reset);
    onFilterChange(reset);
  };

  const FilterContent = (
    <Box sx={{ p: 2 }}>
      {isMobile && mobileOpen && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" fontWeight={700}>Bộ lọc</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>
      )}


      {/* Price */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography fontWeight={700}>Giá tiền</Typography></AccordionSummary>
        <AccordionDetails>
          <RadioGroup value={filters.priceRange} onChange={handlePriceChange}>
            <FormControlLabel value="all" control={<Radio size="small" />} label="Tất cả" />
            <FormControlLabel value="under-200" control={<Radio size="small" />} label="Dưới 200k" />
            <FormControlLabel value="200-500" control={<Radio size="small" />} label="200k - 500k" />
            <FormControlLabel value="above-500" control={<Radio size="small" />} label="Trên 500k" />
          </RadioGroup>
        </AccordionDetails>
      </Accordion>
      <Divider sx={{ my: 1 }} />

      {/* Sizes */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography fontWeight={700}>Kích cỡ</Typography></AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
            {sizeOptions.map(size => (
              <Button
                key={size}
                variant={filters.sizes.includes(size) ? 'contained' : 'outlined'}
                size="small"
                onClick={() => handleSizeChange(size)}
                sx={{ 
                   bgcolor: filters.sizes.includes(size) ? '#000' : 'transparent',
                   color: filters.sizes.includes(size) ? '#fff' : '#000',
                   borderColor: '#ddd',
                   minWidth: 0 
                }}
              >
                {size}
              </Button>
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>
      <Divider sx={{ my: 1 }} />

      {/* Colors */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography fontWeight={700}>Màu sắc</Typography></AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {colorOptions.map(color => {
              const isSelected = filters.colors.includes(color.name);
              return (
                <Box
                  key={color.name}
                  onClick={() => handleColorChange(color.name)}
                  sx={{
                    width: 30, height: 30, borderRadius: '50%',
                    bgcolor: color.code,
                    border: isSelected ? '3px solid #000' : '1px solid #ddd',
                    cursor: 'pointer',
                    boxShadow: isSelected ? 3 : 0
                  }}
                  title={color.name}
                />
              )
            })}
          </Box>
        </AccordionDetails>
      </Accordion>

      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
        <Button fullWidth variant="outlined" onClick={handleReset}>Xóa</Button>
        <Button fullWidth variant="contained" onClick={handleApplyFilter} sx={{ bgcolor: '#000', color: '#fff' }}>Áp dụng</Button>
      </Box>
    </Box>
  );

  if (isMobile) return <Drawer open={mobileOpen} onClose={onClose}><Box sx={{ width: 280 }}>{FilterContent}</Box></Drawer>;
  return <Paper sx={{ position: 'sticky', top: 80 }}>{FilterContent}</Paper>;
}

export default ProductFilter;