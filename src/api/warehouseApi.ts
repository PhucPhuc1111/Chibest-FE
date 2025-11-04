import api from './axiosInstance';
import { Warehouse } from '@/types/warehouse';

export const createWarehouse = async (data: Warehouse) => {
  const response = await api.post('/warehouse', data);
  return response.data;
};

export const getBranches = async () => {
  const response = await api.get('/branch');
  return response.data;
};

export const updateWarehouse = async (id: string, data: Warehouse) => {
  const response = await api.put(`/warehouse/${id}`, data);
  return response.data;
};

export const deleteWarehouse = async (id: string) => {
  const response = await api.delete(`/warehouse/${id}`);
  return response.data;
};