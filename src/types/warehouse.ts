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