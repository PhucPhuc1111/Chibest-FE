"use client";

import React, { useEffect, useMemo, useState } from "react";
import api from "@/api/axiosInstance";
import { useSessionStore } from "@/stores/useSessionStore";
import toast from "react-hot-toast";

type BranchOption = {
  value: string | null;
  label: string;
};

const BranchSelect: React.FC = () => {
  const userBranchId = useSessionStore((state) => state.userBranchId);
  const activeBranchId = useSessionStore((state) => state.activeBranchId);
  const setActiveBranchId = useSessionStore((state) => state.setActiveBranchId);
  const [options, setOptions] = useState<BranchOption[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const fetchBranches = async () => {
      setIsFetching(true);
      try {
        if (userBranchId) {
          const response = await api.get(`/api/branch/${userBranchId}`);
          if (!isCancelled && response.data["status-code"] === 200) {
            const branch = response.data.data;
            setOptions([
              {
                value: branch.id,
                label: branch.name,
              },
            ]);
            setActiveBranchId(branch.id);
          }
        } else {
          const response = await api.get("/api/branch");
          if (!isCancelled && response.data["status-code"] === 200) {
            const branches = Array.isArray(response.data.data) ? response.data.data : [];
            const mappedOptions: BranchOption[] = branches.map((branch: { id: string; name: string; code: string }) => ({
              value: branch.id,
              label: branch.name + " (" + branch.code + ")",
            }));
            setOptions([{ value: null, label: "Toàn hệ thống" }, ...mappedOptions]);
          }
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Failed to load branches", error);
          toast.error("Không thể tải danh sách chi nhánh");
        }
      } finally {
        if (!isCancelled) {
          setIsFetching(false);
        }
      }
    };

    fetchBranches();

    return () => {
      isCancelled = true;
    };
  }, [userBranchId, setActiveBranchId]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setActiveBranchId(value === "" ? null : value);
  };

  const selectValue = useMemo(() => {
    if (userBranchId) {
      return userBranchId;
    }
    return activeBranchId ?? "";
  }, [activeBranchId, userBranchId]);

  const isDisabled = userBranchId !== null || isFetching || options.length === 0;

  return (
    <div className="min-w-[180px]">
      <select
        className="h-11 w-full appearance-none rounded-lg border border-gray-200 px-4 pr-10 text-sm text-gray-700 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-2 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
        value={selectValue}
        onChange={handleChange}
        disabled={isDisabled}
      >
        {options.map((option) => (
          <option
            key={option.value ?? "null"}
            value={option.value ?? ""}
            className="text-gray-700 dark:bg-gray-900 dark:text-gray-300"
          >
            {option.label}
          </option>
        ))}
        {options.length === 0 && (
          <option value="" className="text-gray-700 dark:bg-gray-900 dark:text-gray-300">
            {isFetching ? "Đang tải..." : "Không có dữ liệu"}
          </option>
        )}
      </select>
    </div>
  );
};

export default BranchSelect;

