import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams, useParams } from 'react-router-dom';
import {
  Container, Grid, Box, Typography, MenuItem, Select, FormControl,
  CircularProgress, Alert, Pagination, Stack, IconButton, useMediaQuery, useTheme
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ProductCard from '../../components/ProductPage/ProductCard.jsx';
import ProductFilter from '../../components/ProductPage/ProductFilter.jsx';
import { getProducts } from '../../api/productService.js';

function ProductPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { categoryName } = useParams(); 
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState({
    sizes: [],
    colors: [],
    priceRange: 'all',
    location: null
  });

  const itemsPerPage = 12;


  const categoryFromUrl = categoryName ? decodeURIComponent(categoryName) : null;

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          page: currentPage,
          limit: itemsPerPage,
          search: searchQuery || undefined, // Nếu có search query thì gửi đi
          category: categoryFromUrl || undefined, // Nếu có category thì gửi đi
          sort: sortBy,
          
          priceRange: filters.priceRange !== 'all' ? filters.priceRange : undefined,
          sizes: filters.sizes.length > 0 ? filters.sizes.join(',') : undefined,
          colors: filters.colors.length > 0 ? filters.colors.join(',') : undefined,
        };

        const response = await getProducts(params);
        
        setProducts(response.data || []);
        setTotalPages(response.totalPages || 1);
        setTotalProducts(response.total || 0);

      } catch (err) {
        setError(err.message || 'Lỗi khi tải sản phẩm');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    
  }, [currentPage, categoryName, searchQuery, filters, sortBy]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Logic hiển thị Title động
  const getPageTitle = () => {
    if (searchQuery) return `Kết quả tìm kiếm: "${searchQuery}"`;
    if (categoryFromUrl) return categoryFromUrl;
    return 'Tất cả sản phẩm';
  };

  return (
    <Box sx={{ bgcolor: '#f9f9f9', minHeight: '100vh', py: { xs: 2, sm: 4 } }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, textTransform: 'capitalize' }}>
                {getPageTitle()}
              </Typography>
              {!loading && (
                <Typography variant="body2" color="text.secondary">
                  Hiển thị {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalProducts)} trên {totalProducts} kết quả
                </Typography>
              )}
            </Box>

            {isMobile && (
              <IconButton onClick={() => setMobileFilterOpen(true)}>
                <FilterListIcon />
              </IconButton>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <FormControl sx={{ minWidth: 200 }} size="small">
              <Select
                value={sortBy}
                onChange={handleSortChange}
                sx={{ bgcolor: '#fff', fontWeight: 600, fontSize: '0.9rem' }}
              >
                <MenuItem value="newest">Mới nhất</MenuItem>
                <MenuItem value="price_asc">Giá: Thấp đến Cao</MenuItem>
                <MenuItem value="price_desc">Giá: Cao đến Thấp</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {!isMobile && (
            <Grid item xs={12} md={3} sx={{minWidth: 0}}>
              <ProductFilter onFilterChange={handleFilterChange} />
            </Grid>
          )}

          <Grid item xs={12} md={isMobile ? 12 : 9}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : products.length === 0 ? (
              <Alert severity="info">Không tìm thấy sản phẩm nào phù hợp.</Alert>
            ) : (
              <>
                <Grid container spacing={2} alignItems="stretch"  >
                  {products.map(product => (
                    <Grid item xs={6} sm={6} md={4} lg={3} key={product.id}>
                      <ProductCard product={product} />
                    </Grid>
                  ))}
                </Grid>

                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                    <Stack spacing={2}>
                      <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        size={isMobile ? 'small' : 'medium'}
                        sx={{
                          '& .Mui-selected': { bgcolor: '#0066CC !important', color: '#fff' }
                        }}
                      />
                    </Stack>
                  </Box>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Container>

      {isMobile && (
        <ProductFilter
          onFilterChange={handleFilterChange}
          mobileOpen={mobileFilterOpen}
          onClose={() => setMobileFilterOpen(false)}
        />
      )}
    </Box>
  );
}

export default ProductPage;