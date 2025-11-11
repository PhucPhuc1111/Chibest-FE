"use client";

import React from "react";
import { useSessionStore } from "@/stores/useSessionStore";

export default function UserAddressCard() {
  const activeBranchId = useSessionStore((state) => state.activeBranchId);

  return (
    <div className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800 lg:p-6">
      <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
        Thông tin chi nhánh
      </h4>

      <div className="space-y-4">
        <div>
          <p className="mb-1 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Chi nhánh đang hoạt động
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {activeBranchId || "Chưa được gán"}
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600 dark:bg-white/[0.03] dark:text-gray-400">
          Nếu bạn cần thay đổi chi nhánh làm việc, vui lòng liên hệ quản trị hệ
          thống để được cấp quyền phù hợp.
        </div>
      </div>
    </div>
  );
}

