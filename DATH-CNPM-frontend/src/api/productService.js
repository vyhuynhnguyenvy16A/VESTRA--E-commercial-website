import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.data.message === 'Expired Token!!!')) {
      
      console.warn("Phiên đăng nhập hết hạn. Đang đăng xuất...");
      
      localStorage.removeItem('token');
      localStorage.removeItem('user'); 

      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export const getFeaturedProducts = async () => {
  const response = await api.get('/products/featured');
  return response.data;
};

// Lấy tất cả sản phẩm với filter, search, phân trang
export const getProducts = async (params) => {
  const response = await api.get('/products', { params });
  return response.data;
};

// Lấy chi tiết sản phẩm
export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// Lấy danh sách categories
export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

// Thêm review cho sản phẩm
export const addReview = async (productId, reviewData) => {
  const response = await api.post(`/products/${productId}/reviews`, reviewData);
  return response.data;
};

export default api;