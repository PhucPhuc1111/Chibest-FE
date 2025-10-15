export interface AccountType {
  Id: string; // UNIQUEIDENTIFIER (GUID)
  fcmToken?: string | null;
  RefreshToken?: string | null;
  RefreshTokenExpiryTime?: string | null; // DATETIME -> dùng string ISO format trong JS
  AvartarURL?: string | null;
  Code: string;
  Email: string;
  Password: string;
  Name: string;
  PhoneNumber?: string | null;
  CCCD?: string | null;
  CreatedAt: string; // DATETIME -> ISO string
  UpdatedAt: string; // DATETIME -> ISO string
  Role: string;
  Status: string
}
