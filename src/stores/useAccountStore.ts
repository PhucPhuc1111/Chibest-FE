// // stores/useAccountStore.ts
// import { create } from "zustand";
// import { immer } from "zustand/middleware/immer";
// import api from "@/api/axiosInstance";

// interface Supplier {
//   id: string;
//   code: string;
//   name: string;
//   email: string;
//   phoneNumber: string | null;
//   address: string | null;
//   status: string;
// }

// interface Warehouse {
//   id: string;
//   code: string;
//   name: string;
//   address: string;
//   phoneNumber: string | null;
//   branchName: string;
//   isMainWarehouse: boolean;
//   status: string;
// }

// interface AccountState {
//   suppliers: Supplier[];
//   warehouses: Warehouse[];
//   isLoading: boolean;
//   error: string | null;
// }

// interface AccountActions {
//   getSuppliers: () => Promise<{ success: boolean; message?: string }>;
//   getWarehouses: () => Promise<{ success: boolean; message?: string }>;
//   clearError: () => void;
// }

// export const useAccountStore = create<AccountState & AccountActions>()(
//   immer((set) => ({
//     // INITIAL STATE
//     suppliers: [],
//     warehouses: [],
//     isLoading: false,
//     error: null,

//     // ACTIONS
//     getSuppliers: async () => {
//       set((s) => {
//         s.isLoading = true;
//         s.error = null;
//       });

//       try {
//         const res = await api.get("/api/account/supplier");
        
//         if (res.data["status-code"] === 200) {
//           const suppliers: Supplier[] = res.data.data.map((item: any) => ({
//             id: item.id,
//             code: item.code,
//             name: item.name,
//             email: item.email,
//             phoneNumber: item["phone-number"],
//             address: item.address,
//             status: item.status,
//           }));

//           set((s) => {
//             s.suppliers = suppliers;
//             s.isLoading = false;
//           });
//           return { success: true, message: res.data.message };
//         } else {
//           set((s) => { s.isLoading = false; });
//           return { success: false, message: res.data.message || "Không có dữ liệu nhà cung cấp" };
//         }
//       } catch (err: any) {
//         set((s) => {
//           s.isLoading = false;
//           s.error = err instanceof Error ? err.message : "Fetch error";
//         });
//         return { success: false, message: "Không thể tải danh sách nhà cung cấp" };
//       }
//     },

//     getWarehouses: async () => {
//       set((s) => {
//         s.isLoading = true;
//         s.error = null;
//       });

//       try {
//         const res = await api.get("/api/warehouse", {
//           params: {
//             pageIndex: 1,
//             pageSize: 100,
//           },
//         });

//         if (res.data["status-code"] === 200) {
//           const warehouses: Warehouse[] = res.data.data.map((item: any) => ({
//             id: item.id,
//             code: item.code,
//             name: item.name,
//             address: item.address,
//             phoneNumber: item["phone-number"],
//             branchName: item["branch-name"],
//             isMainWarehouse: item["is-main-warehouse"],
//             status: item.status,
//           }));

//           set((s) => {
//             s.warehouses = warehouses;
//             s.isLoading = false;
//           });
//           return { success: true, message: res.data.message };
//         } else {
//           set((s) => { s.isLoading = false; });
//           return { success: false, message: res.data.message || "Không có dữ liệu kho" };
//         }
//       } catch (err: any) {
//         set((s) => {
//           s.isLoading = false;
//           s.error = err instanceof Error ? err.message : "Fetch error";
//         });
//         return { success: false, message: "Không thể tải danh sách kho" };
//       }
//     },

//     clearError: () => {
//       set((s) => {
//         s.error = null;
//       });
//     },
//   }))
// );

// stores/useProductStore.ts
// stores/useAccountStore.ts
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

interface AccountState {
  suppliers: Supplier[];
  warehouses: Warehouse[];
  isLoading: boolean;
  error: string | null;
}

interface AccountActions {
  getSuppliers: () => Promise<{ success: boolean; message?: string }>;
  getWarehouses: () => Promise<{ success: boolean; message?: string }>;
  clearError: () => void;
}

export const useAccountStore = create<AccountState & AccountActions>()(
  immer((set) => ({
    // INITIAL STATE
    suppliers: [],
    warehouses: [],
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
          const suppliers: Supplier[] = res.data.data.map((item: any) => ({
            id: item.id,
            code: item.code,
            name: item.name,
            email: item.email,
            phoneNumber: item["phone-number"],
            address: item.address,
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
      } catch (err: any) {
        set((s) => {
          s.isLoading = false;
          s.error = err instanceof Error ? err.message : "Fetch error";
        });
        return { success: false, message: "Không thể tải danh sách nhà cung cấp" };
      }
    },

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
          const warehouses: Warehouse[] = res.data.data.map((item: any) => ({
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
      } catch (err: any) {
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

// Export default để tránh lỗi
export default useAccountStore;