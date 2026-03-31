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

export const createOrder = async (orderData) => {
    try {
        const response = await API.post('/orders/checkout', orderData);
        return response.data; 
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

// 2. Lấy danh sách đơn hàng của tôi (Gọi API /orders/my-orders)
export const getMyOrders = async () => {
    try {
        const response = await API.get('/orders/my-orders');
        return response.data; // Trả về mảng orders
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

// 3. Lấy chi tiết đơn hàng (Gọi API /orders/:id)
export const getOrderById = async (orderId) => {
    try {
        const response = await API.get(`/orders/${orderId}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};