"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SessionState {
  userBranchId: string | null;
  activeBranchId: string | null;
  initializeSession: (branchId: string | null) => void;
  setActiveBranchId: (branchId: string | null) => void;
  resetSession: () => void;
}

type SessionPersistedState = Pick<SessionState, "userBranchId" | "activeBranchId">;

const noopStorage: Storage = {
  length: 0,
  clear: () => undefined,
  getItem: () => null,
  key: () => null,
  removeItem: () => undefined,
  setItem: () => undefined,
};

const storage = createJSONStorage<SessionPersistedState>(() => {
  if (typeof window === "undefined") {
    return noopStorage;
  }
  return sessionStorage;
});

export const useSessionStore = create<SessionState>()(
  persist<SessionState, [], [], SessionPersistedState>(
    (set) => ({
      userBranchId: null,
      activeBranchId: null,
      initializeSession: (branchId) =>
        set((state) => ({
          userBranchId: branchId,
          activeBranchId: branchId ?? state.activeBranchId,
        })),
      setActiveBranchId: (branchId) => set({ activeBranchId: branchId }),
      resetSession: () => set({ userBranchId: null, activeBranchId: null }),
    }),
    {
      name: "session-store",
      storage,
      partialize: (state) => ({
        userBranchId: state.userBranchId,
        activeBranchId: state.activeBranchId,
      }),
    }
  )
);

export const getSessionState = () => useSessionStore.getState();

