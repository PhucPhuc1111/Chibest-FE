import api from './axiosInstance';
import { WarehouseFormData  } from '@/types/warehouse';

export const createWarehouse = async (data: WarehouseFormData ) => {
  const response = await api.post('/api/warehouse', data);
  return response.data;
};

export const getBranches = async () => {
  const response = await api.get('/api/branch');
  return response.data;
};

export const updateWarehouse = async (id: string, data: WarehouseFormData ) => {
  const response = await api.put(`/api/warehouse/${id}`, data);
  return response.data;
};

export const deleteWarehouse = async (id: string) => {
  const response = await api.delete(`/api/warehouse/${id}`);
  return response.data;
};