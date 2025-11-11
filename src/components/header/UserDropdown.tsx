"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DEFAULT_AVATAR_SRC,
  USER_INFO_STORAGE_KEY,
  useUserInfo,
} from "@/hooks/useUserInfo";
import { useSessionStore } from "@/stores/useSessionStore";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import Avatar from "../ui/avatar/Avatar";

const DEFAULT_USER_NAME = "Người dùng";

export default function UserDropdown() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const resetSession = useSessionStore((state) => state.resetSession);
  const { userInfo, refreshUserInfo } = useUserInfo();

  const displayName = userInfo?.userName?.trim() || DEFAULT_USER_NAME;
  const displayEmail = userInfo?.email?.trim() || "—";
  const displayRole = userInfo?.role?.trim() || null;
  const avatarSrc = userInfo?.avatarUrl ?? DEFAULT_AVATAR_SRC;

  const toggleDropdown = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem(USER_INFO_STORAGE_KEY);
    resetSession();
    closeDropdown();
    refreshUserInfo();
    router.push("/signin");
  };

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={toggleDropdown}
        className="flex items-center gap-3 text-gray-700 transition-colors dropdown-toggle dark:text-gray-400"
      >
        <Avatar src={avatarSrc} alt={displayName} size="large" />

        <div className="hidden flex-col items-start sm:flex">
          <span className="font-medium text-theme-sm text-gray-700 dark:text-gray-200">
            {displayName}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {displayRole ?? displayEmail}
          </span>
        </div>

        <svg
          className={`stroke-gray-500 transition-transform duration-200 dark:stroke-gray-400 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div className="flex items-start gap-3 border-b border-gray-200 pb-4 dark:border-gray-800">
          <Avatar src={avatarSrc} alt={displayName} size="medium" />
          <div className="min-w-0">
            <span className="block truncate font-medium text-gray-700 text-theme-sm dark:text-gray-200">
              {displayName}
            </span>
            {displayRole ? (
              <span className="block text-theme-xs text-gray-500 dark:text-gray-400">
                {displayRole}
              </span>
            ) : null}
            <span className="block truncate text-theme-xs text-gray-500 dark:text-gray-400">
              {displayEmail}
            </span>
          </div>
        </div>

        <ul className="flex flex-col gap-1 py-3">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/profile"
              className="group flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-gray-700 text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <svg
                className="fill-gray-500 transition-colors group-hover:fill-gray-700 dark:fill-gray-400 dark:group-hover:fill-gray-300"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 6.625C12.4971 6.625 12.9 7.02794 12.9 7.525C12.9 8.02206 12.4971 8.425 12 8.425H11.999C11.502 8.425 11.099 8.02206 11.099 7.525C11.099 7.02794 11.502 6.625 11.999 6.625H12ZM12.0009 17.3714C11.5867 17.3714 11.2509 17.0356 11.2509 16.6214V10.9449C11.2509 10.5307 11.5867 10.1949 12.0009 10.1949C12.4151 10.1949 12.7509 10.5307 12.7509 10.9449V16.6214C12.7509 17.0356 12.4151 17.3714 12.0009 17.3714Z"
                  fill="currentColor"
                />
              </svg>
              Trang cá nhân
            </DropdownItem>
          </li>
        </ul>

        <button
          type="button"
          onClick={handleSignOut}
          className="group mt-1 flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-gray-700 text-theme-sm transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        >
          <svg
            className="fill-gray-500 transition-colors group-hover:fill-gray-700 dark:fill-gray-400 dark:group-hover:fill-gray-300"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.1007 19.247C14.6865 19.247 14.3507 18.9112 14.3507 18.497L14.3507 14.245H12.8507V18.497C12.8507 19.7396 13.8581 20.747 15.1007 20.747H18.5007C19.7434 20.747 20.7507 19.7396 20.7507 18.497L20.7507 5.49609C20.7507 4.25345 19.7433 3.24609 18.5007 3.24609H15.1007C13.8581 3.24609 12.8507 4.25345 12.8507 5.49609V9.74501L14.3507 9.74501V5.49609C14.3507 5.08188 14.6865 4.74609 15.1007 4.74609L18.5007 4.74609C18.9149 4.74609 19.2507 5.08188 19.2507 5.49609L19.2507 18.497C19.2507 18.9112 18.9149 19.247 18.5007 19.247H15.1007ZM3.25073 11.9984C3.25073 12.2144 3.34204 12.4091 3.48817 12.546L8.09483 17.1556C8.38763 17.4485 8.86251 17.4487 9.15549 17.1559C9.44848 16.8631 9.44863 16.3882 9.15583 16.0952L5.81116 12.7484L16.0007 12.7484C16.4149 12.7484 16.7507 12.4127 16.7507 11.9984C16.7507 11.5842 16.4149 11.2484 16.0007 11.2484L5.81528 11.2484L9.15585 7.90554C9.44864 7.61255 9.44847 7.13767 9.15547 6.84488C8.86248 6.55209 8.3876 6.55226 8.09481 6.84525L3.52309 11.4202C3.35673 11.5577 3.25073 11.7657 3.25073 11.9984Z"
              fill="currentColor"
            />
          </svg>
          Đăng xuất
        </button>
      </Dropdown>
    </div>
  );
}

