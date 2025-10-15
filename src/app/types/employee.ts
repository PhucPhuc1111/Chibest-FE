export interface EmployyeeType {
  Id: string; // UNIQUEIDENTIFIER (GUID)
  Position?: string | null; // NVARCHAR(100)
  StartDate: string; // DATE -> ISO string
  EndDate?: string | null; // DATE -> ISO string
  AccountId: string; // Khóa ngoại đến bảng Account
  BranchId?: string | null; // Khóa ngoại đến bảng Warehouse (chi nhánh)
}