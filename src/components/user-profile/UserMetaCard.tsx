"use client";

import React from "react";
import Avatar from "../ui/avatar/Avatar";
import {
  DEFAULT_AVATAR_SRC,
  useUserInfo,
} from "@/hooks/useUserInfo";
import { useSessionStore } from "@/stores/useSessionStore";

export default function UserMetaCard() {
  const { userInfo } = useUserInfo();
  const activeBranchId = useSessionStore((state) => state.activeBranchId);

  const displayName = userInfo?.userName?.trim() || "Người dùng";
  const displayRole = userInfo?.role?.trim() || "Chưa cập nhật vai trò";
  const displayEmail = userInfo?.email?.trim() || "—";
  const avatarSrc = userInfo?.avatarUrl ?? DEFAULT_AVATAR_SRC;

  return (
    <div className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800 lg:p-6">
      <div className="flex flex-col items-center gap-5 text-center md:flex-row md:items-center md:justify-between md:text-left">
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <Avatar src={avatarSrc} alt={displayName} size="xxlarge" />
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              {displayName}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{displayRole}</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {displayEmail}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 md:items-end">
          <span className="rounded-full bg-brand-50 px-4 py-1 text-xs font-medium text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
            Chi nhánh hiện tại
          </span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {activeBranchId || "Chưa gán chi nhánh"}
          </span>
        </div>
      </div>
    </div>
  );
}

