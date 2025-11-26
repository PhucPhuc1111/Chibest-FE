import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import api from "@/api/axiosInstance";

export interface Supplier {
  id: string;
  code: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  address: string | null;
  status: string;
}

interface RawSupplier {
  id: string;
  "fcm-token": string | null;
  "refresh-token": string | null;
  "refresh-token-expiry-time": string | null;
  "avartar-url": string | null;
  code: string;
  email: string;
  name: string;
  "phone-number": string;          
  address: string;
  cccd: string | null;
  "fax-number": string | null;
  "created-at": string;
  "updated-at": string;
  status: string;
}

interface AccountState {
  suppliers: Supplier[];
   isLoading: boolean;
  error: string | null;
}

interface AccountActions {
  getSuppliers: () => Promise<{ success: boolean; message?: string }>;
  clearError: () => void;
}

export const useAccountStore = create<AccountState & AccountActions>()(
  immer((set) => ({
    // INITIAL STATE
    suppliers: [],
    isLoading: false,
    error: null,

    // ACTIONS
    getSuppliers: async () => {
      set((s) => {
        s.isLoading = true;
        s.error = null;
      });

      try {
        const res = await api.get("/api/account/supplier");
        
        if (res.data["status-code"] === 200) {
       
          const suppliers: Supplier[] = res.data.data.map((item: RawSupplier) => ({
            id: item.id,
            code: item.code,
            name: item.name,
            email: item.email,
            phoneNumber: item["phone-number"], 
            status: item.status,
          }));

          set((s) => {
            s.suppliers = suppliers;
            s.isLoading = false;
          });
          return { success: true, message: res.data.message };
        } else {
          set((s) => { s.isLoading = false; });
          return { success: false, message: res.data.message || "Không có dữ liệu nhà cung cấp" };
        }
      } catch (err: unknown) {
        set((s) => {
          s.isLoading = false;
          s.error = err instanceof Error ? err.message : "Fetch error";
        });
        return { success: false, message: "Không thể tải danh sách nhà cung cấp" };
      }
    },

    

    clearError: () => {
      set((s) => {
        s.error = null;
      });
    },
  }))
);

export default useAccountStore;