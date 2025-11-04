// types/warehouse.ts
export interface Warehouse {
  id: string;
  code: string;
  name: string;
  address: string;
  phoneNumber: string | null;
  branchName: string;
  isMainWarehouse: boolean;
  status: string;
}

export interface WarehouseFormData {
    id: string;
  name: string;
  code: string;
  address: string;
  'phone-number': string;
  'branch-id': string;
  'is-main-warehouse': boolean;
  status: 'Hoạt động' | 'Ngưng hoạt động';
}

export interface Branch {
  id: string;
  name: string;
}