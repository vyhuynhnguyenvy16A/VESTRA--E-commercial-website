import axios from 'axios';

// Đảm bảo baseURL đúng với server của bạn (ví dụ: http://localhost:5000/api)
const API = axios.create({ baseURL: 'http://localhost:3000/api' });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token'); 
  if (token) req.headers.Authorization = `Bearer ${token}`; 
  return req;
}, (error) => Promise.reject(error));

const cartService = {
  // GET /cart
  getCart: () => API.get('/cart'),

  // POST /cart/items - Body: { variantId, quantity }
  addToCart: (variantId, quantity) => API.post('/cart/items', { variantId, quantity }),

  // PUT /cart/items/:itemId - Body: { newQuantity }
  updateItemQuantity: (itemId, newQuantity) => API.put(`/cart/items/${itemId}`, { newQuantity }),

  // DELETE /cart/items/:itemId
  removeItem: (itemId) => API.delete(`/cart/items/${itemId}`),
};

export default cartService;