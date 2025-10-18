
import axios from 'axios';

const api = axios.create({

  // baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api', 
baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',

  timeout: 15000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Add Interceptor (Bộ chặn) cho Request ---
api.interceptors.request.use(
  (config) => {
    
   if (typeof window !== "undefined") {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
}
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Add Interceptor cho Response (Xử lý lỗi chung) ---
api.interceptors.response.use(
    (response) => response, 
    (error) => {
       
        if (error.response && error.response.status === 401) {
            console.error("Phiên làm việc hết hạn. Vui lòng đăng nhập lại.");
           
            // router.push('/login'); 
        }
        return Promise.reject(error);
    }
);


export default api;