import { create } from "zustand";
import type { SalesPlan, SalesPlanItem, SalesPlanResponse } from "@/types/salesPlan";

interface SalesPlanState {
  plans: SalesPlan[];
  currentPlan: SalesPlan | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchPlans: () => Promise<void>;
  getPlanById: (id: string) => Promise<void>;
  createPlan: (data: any) => Promise<boolean>;
  updatePlanStatus: (planId: string, status: string) => Promise<boolean>;
  updateItemStatus: (planId: string, itemId: string, status: string) => Promise<boolean>;
  deletePlan: (planId: string) => Promise<boolean>;
}

export const useSalesPlanStore = create<SalesPlanState>((set, get) => ({
  plans: [],
  currentPlan: null,
  loading: false,
  error: null,

  fetchPlans: async () => {
    set({ loading: true });
    try {
      // Fake API call - replace với real API sau
      const response = await fetch("/data/salesPlanData.json");
      const data: SalesPlanResponse = await response.json();
      set({ plans: data.data["data-list"], error: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  getPlanById: async (id: string) => {
    set({ loading: true });
    try {
      const response = await fetch("/data/salesPlanData.json");
      const data: SalesPlanResponse = await response.json();
      const plan = data.data["data-list"].find((p) => p.id === id);
      set({ currentPlan: plan || null, error: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  createPlan: async (formData: any) => {
    try {
      set({ loading: true });
      // TODO: Call real API POST /api/sales-plans
      console.log("Creating plan:", formData);
      
      // Fake success
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Refresh plans
      await get().fetchPlans();
      return true;
    } catch (error) {
      set({ error: (error as Error).message });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  updatePlanStatus: async (planId: string, status: string) => {
    try {
      set({ loading: true });
      // TODO: Call real API PUT /api/sales-plans/{planId}/status
      console.log(`Updating plan ${planId} status to ${status}`);
      
      // Fake success - update local state
      set((state) => ({
        plans: state.plans.map((p) =>
          p.id === planId ? { ...p, status } : p
        ),
      }));
      
      return true;
    } catch (error) {
      set({ error: (error as Error).message });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  updateItemStatus: async (planId: string, itemId: string, status: string) => {
    try {
      set({ loading: true });
      // TODO: Call real API PUT /api/sales-plans/{planId}/items/{itemId}/status
      console.log(`Updating item ${itemId} status to ${status}`);
      
      // Fake success - update local state
      set((state) => ({
        plans: state.plans.map((plan) =>
          plan.id === planId
            ? {
                ...plan,
                items: plan.items.map((item) =>
                  item.id === itemId ? { ...item, status } : item
                ),
              }
            : plan
        ),
      }));
      
      return true;
    } catch (error) {
      set({ error: (error as Error).message });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  deletePlan: async (planId: string) => {
    try {
      set({ loading: true });
      // TODO: Call real API DELETE /api/sales-plans/{planId}
      console.log(`Deleting plan ${planId}`);
      
      // Fake success
      set((state) => ({
        plans: state.plans.filter((p) => p.id !== planId),
      }));
      
      return true;
    } catch (error) {
      set({ error: (error as Error).message });
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));