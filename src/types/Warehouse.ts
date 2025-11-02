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
