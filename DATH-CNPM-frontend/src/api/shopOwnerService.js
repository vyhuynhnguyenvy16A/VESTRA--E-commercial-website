import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3000/api' });

API.interceptors.request.use((req) => {
  // Sửa 'accessToken' thành tên key bạn thực sự dùng trong localStorage
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token'); 
  
  if (token) {
    // Backend thường yêu cầu format "Bearer <token>"
    req.headers.Authorization = `Bearer ${token}`; 
  }
  return req;
}, (error) => {
  return Promise.reject(error);
});

const shopOwnerService = {
  // --- Dashboard ---
  getDashboardStats: () => API.get('/shop/stats'),
  getRevenueChart: (days = 7) => API.get(`/shop/revenue-chart?days=${days}`),
  
  // --- Dashboard ---
  getCategories: () => API.get('/categories'),

  // --- Products ---
  getProducts: (page = 1, limit = 10, search = '', category = '', status = '') => 
    API.get(`/shop/products?page=${page}&limit=${limit}&search=${search}&category=${category}&status=${status}`),

  getProductById: (id) => API.get(`/products/${id}`),
  createProduct: (productData) => API.post('/products', productData),
  updateProduct: (id, productData) => API.put(`/products/${id}`, productData),
  deleteProduct: (id) => API.delete(`/products/${id}`),
  
  // --- Orders ---
  getOrders: (page = 1, limit = 10, status = '') => API.get(`/shop/orders?page=${page}&limit=${limit}&status=${status}`),
  updateOrderStatus: (id, status) => API.put(`/shop/orders/${id}/status`, { status }),
};

export default shopOwnerService;