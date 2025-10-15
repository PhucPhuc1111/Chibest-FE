export interface ExpenseType {
  Id: string;
  Category: string;
  Amount: number;
  ExpenseDate: string;
  Note?: string | null;
  BranchId?: string | null;
  EmployeeId?: string | null;
}