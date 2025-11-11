"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export const USER_INFO_STORAGE_KEY = "userInfo";
export const DEFAULT_AVATAR_SRC = "/images/user/user-01.jpg";

export interface StoredUserInfo {
  accountId: string | null;
  userName: string;
  email: string;
  role: string;
  avatarPath: string | null;
}

export interface UserInfo extends StoredUserInfo {
  avatarUrl: string | null;
}

const normalizeBaseUrl = (baseUrl?: string | null) => {
  if (!baseUrl) {
    return "";
  }

  let normalized = baseUrl.trim();
  if (!normalized) {
    return "";
  }

  normalized = normalized.replace(/\/+$/, "");

  if (normalized.toLowerCase().endsWith("/api")) {
    normalized = normalized.slice(0, -4);
  }

  return normalized;
};

export const buildAvatarUrl = (avatarPath?: string | null): string | null => {
  if (!avatarPath) {
    return null;
  }

  const normalizedPath = avatarPath.replace(/\\/g, "/").replace(/\/+/g, "/");
  const encodedPath = encodeURIComponent(normalizedPath);

  const baseUrl = normalizeBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL);

  if (!baseUrl) {
    return `/api/file/image?urlPath=${encodedPath}`;
  }

  return `${baseUrl}/api/file/image?urlPath=${encodedPath}`;
};

const parseStoredUserInfo = (value: string | null): StoredUserInfo | null => {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as Partial<StoredUserInfo>;

    return {
      accountId:
        typeof parsed?.accountId === "string" && parsed.accountId
          ? parsed.accountId
          : null,
      userName:
        typeof parsed?.userName === "string" && parsed.userName
          ? parsed.userName
          : "",
      email:
        typeof parsed?.email === "string" && parsed.email ? parsed.email : "",
      role:
        typeof parsed?.role === "string" && parsed.role ? parsed.role : "",
      avatarPath:
        typeof parsed?.avatarPath === "string" && parsed.avatarPath
          ? parsed.avatarPath
          : null,
    };
  } catch (error) {
    console.error("Failed to parse stored user info:", error);
    return null;
  }
};

export const getStoredUserInfo = (): StoredUserInfo | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(USER_INFO_STORAGE_KEY);
  return parseStoredUserInfo(rawValue);
};

export const useUserInfo = () => {
  const [storedInfo, setStoredInfo] = useState<StoredUserInfo | null>(null);

  const refreshUserInfo = useCallback(() => {
    setStoredInfo(getStoredUserInfo());
  }, []);

  useEffect(() => {
    refreshUserInfo();
  }, [refreshUserInfo]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === USER_INFO_STORAGE_KEY) {
        refreshUserInfo();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [refreshUserInfo]);

  const userInfo = useMemo<UserInfo | null>(() => {
    if (!storedInfo) {
      return null;
    }

    return {
      ...storedInfo,
      avatarUrl: buildAvatarUrl(storedInfo.avatarPath),
    };
  }, [storedInfo]);

  return { userInfo, refreshUserInfo };
};


