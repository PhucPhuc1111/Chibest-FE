export interface CustomerType {
  Id: string;
  AvartarURL?: string | null;
  Code: string;
  Name: string;
  Gender?: string | null;
  Address?: string | null;
  PhoneNumber?: string | null;
  DateOfBirth?: string | null;
  Type: string;
  Note?: string | null;
  CreatedDate: string;
  LastActive: string;
  Status: string;
  GroupId?: string | null;
}