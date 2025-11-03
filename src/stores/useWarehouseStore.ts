import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import api from "@/api/axiosInstance";

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

interface RawWarehouse {
  id: string;
  code: string;
  name: string;
  address: string;
  "phone-number": string;        
  "branch-name": string;          
  "is-main-warehouse": boolean;     
  status: string;
  "created-at": string;
  "updated-at": string;
}

interface AccountState {
  warehouses: Warehouse[];
  isLoading: boolean;
  error: string | null;
}

interface AccountActions {
  getWarehouses: () => Promise<{ success: boolean; message?: string }>;
  clearError: () => void;
}

export const useWarehouseStore = create<AccountState & AccountActions>()(
  immer((set) => ({
    warehouses: [],
    isLoading: false,
    error: null,

    getWarehouses: async () => {
      set((s) => {
        s.isLoading = true;
        s.error = null;
      });

      try {
        const res = await api.get("/api/warehouse", {
          params: {
            pageIndex: 1,
            pageSize: 100,
          },
        });

        if (res.data["status-code"] === 200) {
          // ✅ Sửa: dùng RawWarehouse thay vì Warehouse
          const warehouses: Warehouse[] = res.data.data.map((item: RawWarehouse) => ({
            id: item.id,
            code: item.code,
            name: item.name,
            address: item.address,
            phoneNumber: item["phone-number"],           
            branchName: item["branch-name"],             
            isMainWarehouse: item["is-main-warehouse"],  
            status: item.status,
          }));

          set((s) => {
            s.warehouses = warehouses;
            s.isLoading = false;
          });
          return { success: true, message: res.data.message };
        } else {
          set((s) => { s.isLoading = false; });
          return { success: false, message: res.data.message || "Không có dữ liệu kho" };
        }
      } catch (err: unknown) {
        set((s) => {
          s.isLoading = false;
          s.error = err instanceof Error ? err.message : "Fetch error";
        });
        return { success: false, message: "Không thể tải danh sách kho" };
      }
    },

    clearError: () => {
      set((s) => {
        s.error = null;
      });
    },
  }))
);

export default useWarehouseStore;