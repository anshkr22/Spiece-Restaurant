import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add Token to request header if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('spice_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Menu & Categories
export const fetchMenuItems = (categoryId = 'all', search = '') => 
  api.get('/menu', { params: { category_id: categoryId, search } });

export const fetchCategories = () => 
  api.get('/categories');

export const createMenuItem = (data) => 
  api.post('/menu', data);

export const updateMenuItem = (id, data) => 
  api.put(`/menu/${id}`, data);

export const deleteMenuItem = (id) => 
  api.delete(`/menu/${id}`);

export const createCategory = (data) => 
  api.post('/categories', data);

export const updateCategory = (id, data) => 
  api.put(`/categories/${id}`, data);

export const deleteCategory = (id) => 
  api.delete(`/categories/${id}`);

// Orders
export const createOrder = (orderData) => 
  api.post('/orders', orderData);

export const fetchOrders = (status = 'all') => 
  api.get('/orders', { params: { status } });

export const fetchOrderById = (id) => 
  api.get(`/orders/${id}`);

export const updateOrderStatus = (id, order_status, payment_status) => 
  api.put(`/orders/${id}/status`, { order_status, payment_status });

export const createRazorpayOrder = (amount, order_id) => 
  api.post('/orders/create-razorpay-order', { amount, order_id });

export const verifyRazorpayPayment = (data) => 
  api.post('/orders/verify-razorpay-payment', data);

// Reservations
export const createReservation = (reservationData) => 
  api.post('/reservations', reservationData);

export const fetchReservations = (status = 'all') => 
  api.get('/reservations', { params: { status } });

export const updateReservationStatus = (id, status) => 
  api.put(`/reservations/${id}/status`, { status });

export const deleteReservation = (id) => 
  api.delete(`/reservations/${id}`);

// Reviews
export const fetchReviews = (status = 'approved', all = false) => 
  api.get('/reviews', { params: { status, all } });

export const createReview = (reviewData) => 
  api.post('/reviews', reviewData);

export const updateReviewStatus = (id, status) => 
  api.put(`/reviews/${id}`, { status });

export const deleteReview = (id) => 
  api.delete(`/reviews/${id}`);

// Contact
export const submitContact = (contactData) => 
  api.post('/contact', contactData);

export const fetchContactMessages = () => 
  api.get('/contact');

export const updateContactStatus = (id, status) => 
  api.put(`/contact/${id}/status`, { status });

// Customers
export const fetchCustomers = () => 
  api.get('/customers');

// Auth
export const loginAdmin = (email, password) => 
  api.post('/auth/login', { email, password });

export const fetchMe = () => 
  api.get('/auth/me');

// Analytics
export const fetchDashboardMetrics = () => 
  api.get('/analytics/dashboard');

export const fetchPopularItems = () => 
  api.get('/analytics/popular-items');

// Chatbot AI Assistant
export const askChatbotAI = (message, history = []) => 
  api.post('/chatbot/chat', { message, history });

export default api;

