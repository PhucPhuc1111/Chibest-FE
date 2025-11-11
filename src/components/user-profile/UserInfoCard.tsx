"use client";

import React from "react";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useSessionStore } from "@/stores/useSessionStore";

export default function UserInfoCard() {
  const { userInfo } = useUserInfo();
  const activeBranchId = useSessionStore((state) => state.activeBranchId);

  const details = [
    {
      label: "Họ và tên",
      value: userInfo?.userName?.trim() || "—",
    },
    {
      label: "Email",
      value: userInfo?.email?.trim() || "—",
    },
    {
      label: "Vai trò",
      value: userInfo?.role?.trim() || "—",
    },
    {
      label: "Mã tài khoản",
      value: userInfo?.accountId || "—",
    },
    {
      label: "Chi nhánh đang hoạt động",
      value: activeBranchId || "Chưa được gán",
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800 lg:p-6">
      <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
        Thông tin tài khoản
      </h4>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
        {details.map(({ label, value }) => (
          <div key={label}>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              {label}
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
