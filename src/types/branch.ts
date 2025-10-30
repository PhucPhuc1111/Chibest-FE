export interface BranchFormData {
  name: string;
  code: string;
  address: string;
  'phone-number': string;
  'is-franchise': boolean;
  'owner-name': string;
  status: 'Hoạt động' | 'Ngưng hoạt động';
}

export interface CreateBranchResponse {
  'status-code': number;
  message: string;
  data: null;
}