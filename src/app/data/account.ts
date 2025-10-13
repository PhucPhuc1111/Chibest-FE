
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import request, { baseURL } from "@/services/apiClient";

import { Account, Activity, Allergy, Dashboard, DietStyle, Goal, Nutrition, Revenue, TopFood, Transaction } from "./types";
import { ApiResponse } from ".";

import Cookies from "js-cookie";
import { Select } from "antd";


export async function getAllAccounts(
  pageIndex: number,
  pageSize: number
): Promise<ApiResponse<Account[]>> {
  return await request.get(`${baseURL}/api/user?pageIndex=${pageIndex}&pageSize=${pageSize}`);
}
export async function updateStatus(userId: number, status: string): Promise<ApiResponse<any>> {
  try {
    // Gọi API để cập nhật trạng thái người dùng
    const response = await request.put(`${baseURL}/api/user/status/${userId}/${status}`);
    return response.data;
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
}
export async function updateChangeRole(userId: number, role: string): Promise<ApiResponse<any>> {
  try {
    // Gọi API để cập nhật trạng thái người dùng
    const response = await request.put(`${baseURL}/api/user/role/${userId}/${role}`);
    return response.data;
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
}

export async function getAllDashboard(

): Promise<ApiResponse<Dashboard>> {
  return await request.get(`${baseURL}/api/dashboard`);
}
export async function getAllTransactions(
  pageIndex: number,
  pageSize: number
): Promise<ApiResponse<Transaction[]>> {
  return await request.get(`${baseURL}/api/dashboard/transaction?pageIndex=${pageIndex}&pageSize=${pageSize}`);
}

export async function getAccountById(
  token: string,
  accountId: number
): Promise<Account> {
  return await request.get(`${baseURL}/api/user/${accountId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
export const useGetAllTransactions = (
  pageIndex: number,
  pageSize: number,
  fullName: string,
  config?: UseQueryOptions<Transaction[]>
) => {
  return useQuery<Transaction[]>({
    queryKey: ["transactions", pageIndex, pageSize],
    queryFn: async (): Promise<Transaction[]> => {
      const response = await getAllTransactions(pageIndex, pageSize); // Không cần truyền token
      return response.data;
    },
    ...config,
  });
};
export const useGetAllAccounts = (
  pageIndex: number,
  pageSize: number,
  fullName: string,
  config?: UseQueryOptions<Account[]>
) => {
  return useQuery<Account[]>({
    queryKey: ["accounts", pageIndex, pageSize],
    queryFn: async () => {
      const response = await getAllAccounts(pageIndex, pageSize); // Không cần truyền token
      return response.data;
    },
    ...config,
  });
};
export async function getAllRevenue(): Promise<ApiResponse<Revenue>> {
  return await request.get(`${baseURL}/api/dashboard/revenue`); // Không cần pageIndex và pageSize
}
export async function getAllGoal(): Promise<ApiResponse<Goal>> {
  return await request.get(`${baseURL}/api/dashboard/goal`); // Không cần pageIndex và pageSize
}
export async function getAllTopFood(top:Number): Promise<ApiResponse<TopFood>> {
  return await request.get(`${baseURL}/api/dashboard/top-food?top=${top}`); // Không cần pageIndex và pageSize
}
export async function getAllActivity(): Promise<ApiResponse<Activity>> {
  return await request.get(`${baseURL}/api/dashboard/activity-level`); // Không cần pageIndex và pageSize
}
export async function getAllDietStyle(): Promise<ApiResponse<DietStyle>> {
  return await request.get(`${baseURL}/api/dashboard/diet-style`); // Không cần pageIndex và pageSize
}
export async function getAllNutrition(selectedDate:String): Promise<ApiResponse<Nutrition>> {
  return await request.get(`${baseURL}/api/dashboard/nutrition-summary?date=${selectedDate}`); // Không cần pageIndex và pageSize
}
export const useGetAllGoal = (
  config?: UseQueryOptions<Goal>
) => {
  return useQuery<Goal>({
    queryKey: ["goal"],
    queryFn: async (): Promise<Goal> => {
      try {
        const response = await getAllGoal(); // Call API to get goal data
        console.log("API Response:", response); // Log the response to check the data

        if (!response) {
          throw new Error("No data returned from API");
        }
        return response; // Return the response directly as the Goal type
      } catch (error) {
        console.error("Error fetching goal data:", error);
        return { labels: [], achieved: [], notAchieved: [], progressPercentages: [] }; // Fallback empty data
      }
    },
    ...config,
  });
};


export const useGetAllRevenue = (
  config?: UseQueryOptions<Revenue>
) => {
  return useQuery<Revenue>({
    queryKey: ["revenue"], // Không cần pageIndex và pageSize
    queryFn: async (): Promise<Revenue> => {
      const response = await getAllRevenue(); // Gọi API không cần truyền tham số phân trang
      return response.data;
    },
    ...config,
  });
};
