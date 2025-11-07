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

export interface Branch {
  id: string;
  code: string;
  name: string;
  address: string;
  "phone-number": string;
  "is-franchise": boolean;
  "owner-name": string | null;
  status: string;
  "user-count": number;
  "warehouse-count": number;
}

export interface BranchCreateRequest {
  name: string;
  code: string;
  address: string;
  "phone-number": string;
  "is-franchise": boolean;
  "owner-name": string;
  status: string;
}

export interface BranchQueryParams {
  pageIndex?: number;
  pageSize?: number;
  search?: string;
}

export interface BranchApiResponse<T> {
  "status-code": number;
  message: string;
  data: T;
}
export type BranchDebtTransactionType =
  | 'TransferIn'
  | 'TransferOut'
  | 'Return'
  | 'Custom';

export interface BranchDebtHistory {
  id?: string;
  transactionType?: BranchDebtTransactionType | string;
  transactionDate?: string;
  amount?: number;
  balanceBefore?: number;
  balanceAfter?: number;
  note?: string;
  createdAt?: string;
}

export interface BranchDebtSummary {
  id: string;
  name: string;
  email?: string | null;
  totalDebt?: number;
  paidAmount?: number;
  returnAmount?: number;
  remainingDebt?: number;
  lastTransactionDate?: string;
  lastUpdated?: string;
  debtHistories?: BranchDebtHistory[];
}

export type BranchDebtListItem = BranchDebtSummary;
