import api from './axiosInstance';

export interface CreateAccountPayload {
  code: string;
  email: string;
  password: string;
  name: string;
  'phone-number'?: string | null;
  address?: string | null;
  status: string;
  'role-id': string;
}

export interface RoleItem {
  id: string;
  name: string;
}

const normalizeRoleItem = (rawRole: Record<string, unknown>): RoleItem | null => {
  const id = (rawRole?.['id'] ?? rawRole?.['role-id']) as string | undefined;
  const name = (rawRole?.['name'] ?? rawRole?.['role-name']) as string | undefined;

  if (!id || !name) {
    return null;
  }

  return { id, name };
};

export const createAccount = (payload: CreateAccountPayload) => {
  return api.post('/account', payload, {
    headers: {
      'Content-Type': 'application/json-patch+json',
    },
  });
};

export const deleteAccount = (accountId: string) => {
  return api.delete(`/account/${accountId}`);
};

export const getRoles = async (): Promise<RoleItem[]> => {
  const response = await api.get('/api/role/all');
  const rawData = response.data?.data ?? response.data;

  if (!Array.isArray(rawData)) {
    return [];
  }

  return rawData
    .map((role) => normalizeRoleItem(role as Record<string, unknown>))
    .filter((item): item is RoleItem => Boolean(item));
};

