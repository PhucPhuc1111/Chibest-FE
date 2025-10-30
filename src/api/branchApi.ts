import api from './axiosInstance';
import { BranchFormData, CreateBranchResponse } from '@/types/branch';

export const createBranch = async (data: BranchFormData) => {
  const response = await api.post<CreateBranchResponse>('/branch', data);
  return response.data;
};

export const updateBranch = async (id: string, data: BranchFormData) => {
  const response = await api.put<CreateBranchResponse>(`/branch/${id}`, data);
  return response.data;
};

export const deleteBranch = async (id: string) => {
  const response = await api.delete<{
    'status-code': number;
    message: string;
    data: null;
  }>(`/branch/${id}`);
  return response.data;
};