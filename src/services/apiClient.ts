import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

export const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

// ✅ Hàm lấy Access Token và tự động refresh nếu cần
export async function getAccessToken(): Promise<string | null> {
  let token = Cookies.get("accessToken");
  const refreshToken = Cookies.get("refreshToken");

  if (token) return token;
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${baseURL}/api/user/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      return null;
    }

    const data = await response.json();
    Cookies.set("accessToken", data.accessToken, { expires: 7 });

    return data.accessToken;
  } catch (error) {
    console.error("Lỗi khi refresh token:", error);
    return null;
  }
}

// ✅ Tạo Axios instance
const apiClient = axios.create({
  baseURL,
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

// ✅ Thêm Interceptor để tự động gán Access Token vào request
apiClient.interceptors.request.use(
  async (config) => {
    let token = Cookies.get("accessToken");

    if (!token) {
      const newToken = await getAccessToken();
      if (newToken) {
        token = newToken;
        Cookies.set("accessToken", token, { expires: 7 });
      }
    }

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Xử lý lỗi 401 (Hết hạn token, chuyển hướng login)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      window.location.href = "/auth/signin";
    }
    return Promise.reject(error);
  }
);

// ✅ Các hàm gọi API (Sửa để dùng `apiClient`)
async function _get<T>(url: string, options?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.get(url, options);
  return response.data;
}

async function _post(url: string, data?: any, options?: any) {
  const response = await apiClient.post(url, JSON.stringify(data), options);
  return response.data;
}

async function _postMultiPart(url: string, formData: FormData, options?: AxiosRequestConfig) {
  const response = await apiClient.post(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    ...options,
  });
  return response.data;
}

async function _putMultiPart(url: string, formData: FormData, options?: AxiosRequestConfig) {
  const response = await apiClient.put(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    ...options,
  });
  return response.data;
}
async function _put(url: string, data?: any, options?:AxiosRequestConfig ) {
  

  const response = await apiClient.put(url, JSON.stringify(data),);
  return response.data;
}


async function _delete<T>(url: string): Promise<T> {
  const response = await apiClient.delete(url);
  return response.data;
}

async function _deleteWithOptions<T>(url: string, options?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.delete(url, options);
  return response.data;
}

async function _patch(url: string, data?: any, options?: any) {
  const response = await apiClient.patch(url, JSON.stringify(data), options);
  return response.data;
}

const request = {
  get: _get,
  post: _post,
  postMultiPart: _postMultiPart,
  putMultiPart: _putMultiPart,
  put: _put,
  delete: _delete,
  deleteWithOptions: _deleteWithOptions,
  patch: _patch,
};

export default request;
