export interface PayrollType {
  Id: string;
  PeriodStart: string;
  PeriodEnd: string;
  BaseSalary: number;
  Bonus: number;
  Deductions: number;
  NetPay: number;
  PayDate?: string | null;
  Note?: string | null;
  EmployeeId: string;
}