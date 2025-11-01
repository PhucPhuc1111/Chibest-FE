
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import api from "@/api/axiosInstance";
import type { 
  PurchaseOrderSummary, 
  PurchaseOrderStatus, 
  PurchaseOrder, 
  CreatePurchaseOrderPayload 
} from "@/types/purchaseOrder"; 

// --- DEFINITIONS & HELPERS ---

interface RawPurchaseOrderDetail {
  id: string;
  "invoice-code": string;
  "order-date": string;
  "created-at": string;
  "updated-at": string;
  "sub-total": number;
  "discount-amount": number;
  paid: number;
  note: string | null;
  status: PurchaseOrderStatus;
  "warehouse-name": string;
  "employee-name": string;
  "supplier-name": string;
  "purchase-order-details": Array<{
    id: string;
    quantity: number;
    "actual-quantity": number;
    "unit-price": number;
    discount: number;
    "re-fee": number;
    note: string | null;
    "product-name": string;
    sku: string;
  }>;
}

interface RawPurchaseOrderSummary {
  id: string;
  "invoice-code": string;
  "order-date": string;
  "supplier-name": string;
  "sub-total": number;
  status: PurchaseOrderStatus;
}

type Filters = {
  pageIndex: number;
  pageSize: number;
  search?: string;
  fromDate?: string | null;
  toDate?: string | null;
  status?: PurchaseOrderStatus | null;
};

type State = {
  list: PurchaseOrderSummary[];
  detail: PurchaseOrder | null;
  isLoading: boolean;
  error: string | null;
  filters: Filters;
  totalRecords: number;
};

type Actions = {
  setFilters: (p: Partial<Filters>) => void;
  resetFilters: () => void;
  getAll: () => Promise<{success: boolean; message?: string}>;
  getById: (id: string) => Promise<{success: boolean; message?: string}>;
  createOrder: (payload: CreatePurchaseOrderPayload) => Promise<{success: boolean; message?: string}>;
};

export const usePurchaseOrderStore = create<State & Actions>()(
  immer((set, get) => ({
    // INITIAL STATE
    list: [],
    detail: null,
    isLoading: false,
    error: null,
    totalRecords: 0,
    filters: { pageIndex: 1, pageSize: 15 },

    // --- ACTIONS ---

    setFilters: (p) =>
      set((s) => {
        s.filters = { ...s.filters, ...p };
      }),

    resetFilters: () =>
      set((s) => {
        s.filters = { pageIndex: 1, pageSize: 15 };
      }),

    getAll: async () => {
      set((s) => {
        s.isLoading = true;
        s.error = null;
      });

      const { filters } = get();
      try {
        const res = await api.get("/api/purchase-order", {
          params: {
            pageIndex: filters.pageIndex,
            pageSize: filters.pageSize,
            search: filters.search ?? "",
            fromDate: filters.fromDate ?? "", 
            toDate: filters.toDate ?? "",
            status: filters.status ?? "",
          },
        });

        if (res.data["status-code"] === 200) {
          const list: PurchaseOrderSummary[] = res.data.data.map((x: RawPurchaseOrderSummary) => ({
            id: x.id,
            code: x["invoice-code"],
            time: x["order-date"],
            supplierName: x["supplier-name"],
            subTotal: x["sub-total"],
            status: x.status,
          }));

          set((s) => {
            s.list = list;
            s.isLoading = false;
            s.totalRecords = list.length;
          });
          return { success: true, message: res.data.message };
        } else {
          set((s) => { s.isLoading = false; });
          return { success: false, message: res.data.message || "Không có dữ liệu" };
        }
      } catch (err: any) {
        set((s) => {
          s.isLoading = false;
          s.error = err instanceof Error ? err.message : "Fetch error";
        });
        return { success: false, message: "Không thể tải dữ liệu phiếu nhập" };
      }
    },

    getById: async (id: string) => {
      set((s) => {
        s.isLoading = true;
        s.error = null;
      });

      try {
        const res = await api.get(`/api/purchase-order/${id}`);
        
        if (res.data["status-code"] === 200) {
          const rawData: RawPurchaseOrderDetail = res.data.data;
          const items = rawData["purchase-order-details"].map(item => ({
            id: item.id,
            quantity: item.quantity,
            actualQuantity: item["actual-quantity"],
            unitPrice: item["unit-price"],
            discount: item.discount,
            reFee: item["re-fee"],
            note: item.note,
            productName: item["product-name"],
            sku: item.sku,
          }));

          const detail: PurchaseOrder = {
            id: rawData.id,
            code: rawData["invoice-code"],
            time: rawData["order-date"],
            createdAt: rawData["created-at"],
            updatedAt: rawData["updated-at"],
            subTotal: rawData["sub-total"],
            discountAmount: rawData["discount-amount"],
            paid: rawData.paid,
            note: rawData.note,
            status: rawData.status,
            warehouseName: rawData["warehouse-name"],
            employeeName: rawData["employee-name"],
            supplierName: rawData["supplier-name"],
            items: items,
          };

          set((s) => {
            s.detail = detail;
            s.isLoading = false;
          });
          return { success: true, message: res.data.message };
        } else {
          set((s) => { s.isLoading = false; });
          return { success: false, message: res.data.message || "Không tìm thấy dữ liệu" };
        }
      } catch (err: any) {
        set((s) => {
          s.isLoading = false;
          s.error = err instanceof Error ? err.message : "Fetch error";
        });
        return { success: false, message: "Không thể tải chi tiết phiếu nhập" };
      }
    },

    createOrder: async (payload: CreatePurchaseOrderPayload) => {
      set((s) => {
        s.isLoading = true;
        s.error = null;
      });

      try {
        // const res = await api.post("/api/purchase-order", payload);
         const res = await api.post("/api/purchase-order", payload, {
      headers: {
        "Content-Type": "application/json-patch+json", 
      },
    });
        
        if (res.data["status-code"] === 200) {
          set((s) => {
            s.isLoading = false;
          });
          return { success: true, message: res.data.message || "Tạo phiếu nhập thành công!" };
        } else {
          set((s) => {
            s.isLoading = false;
          });
          return { success: false, message: res.data.message || "Tạo phiếu nhập thất bại" };
        }
      } catch (err: any) {
        set((s) => {
          s.isLoading = false;
          s.error = err instanceof Error ? err.message : "Creation error";
        });
        return { success: false, message: "Tạo phiếu nhập thất bại. Vui lòng kiểm tra lại dữ liệu." };
      }
    },
    // Thêm vào usePurchaseOrderStore.ts
importFile: async (file: File) => {
  set((s) => {
    s.isLoading = true;
    s.error = null;
  });

  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post("/api/purchase-order/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data["status-code"] === 200) {
      set((s) => {
        s.isLoading = false;
      });
      return { 
        success: true, 
        message: res.data.message || "Import file thành công!",
        data: res.data.data 
      };
    } else {
      set((s) => { s.isLoading = false; });
      return { success: false, message: res.data.message || "Import file thất bại" };
    }
  } catch (err: any) {
    set((s) => {
      s.isLoading = false;
      s.error = err instanceof Error ? err.message : "Import error";
    });
    return { success: false, message: "Import file thất bại. Vui lòng kiểm tra lại file." };
  }
},
  }))
);