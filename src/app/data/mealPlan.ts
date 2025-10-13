import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import request, { baseURL } from "@/services/apiClient";
import Cookies from "js-cookie";
import { MealPlan } from "./types";
import { ApiResponse } from ".";
import { CreateMealPlanParams } from "./types";

export async function getAllMealPlans(
  pageIndex: number,
  pageSize: number,
): Promise<ApiResponse<MealPlan[]>> {
  return await request.get(
    `${baseURL}/api/meal-plan/sample-mealplan?pageIndex=${pageIndex}&pageSize=${pageSize}`,
  );
}

export async function getMealPlanById(
  mealplanId: number,
): Promise<ApiResponse<MealPlan>> {
  return await request.get(`${baseURL}/api/meal-plan/${mealplanId}`);
}

export const createMealPlan = async (params: CreateMealPlanParams) => {
  const token = Cookies.get("accessToken");

  if (!token) {
    throw new Error("Bạn chưa đăng nhập!");
  }

  try {
    const response = await request.post(`${baseURL}/api/meal-plan`, params, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error("Lỗi khi tạo thực đơn:", error);
    throw error;
  }
};

export const updateMealPlan = async (mealPlan: MealPlan): Promise<void> => {
  const token = Cookies.get("accessToken");

  if (!token) {
    throw new Error("Bạn chưa đăng nhập!");
  }

  if (!mealPlan.mealPlanId) {
    throw new Error("Thiếu mealPlanId để cập nhật.");
  }

  const endpoint = `${baseURL}/api/meal-plan?mealPlanId=${mealPlan.mealPlanId}`;
  const body = {
    planName: mealPlan.planName,
    healthGoal: mealPlan.healthGoal,
    mealPlanDetails: mealPlan.mealPlanDetails,
  };

  try {
    const response = await request.put(endpoint, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật meal plan:", error);
    throw error;
  }
};

// Cập nhật chi tiết bữa ăn
export const updateMealPlanDetail = async (
  mealPlanDetailId: number,
  params: any,
) => {
  try {
    const response = await request.put("/api/meal-plan-detail", {
      data: {
        mealPlanDetailId,
        foodId: params.foodId,
        quantity: params.quantity,
        mealType: params.mealType,
        dayNumber: params.dayNumber,
      },
    });

    return response;
  } catch (error) {
    console.error("Error updating meal plan detail:", error);
    throw error;
  }
};

export async function deleteMealPlanById(mealPlanId: number): Promise<void> {
  await request.delete(`${baseURL}/api/meal-plan/${mealPlanId}`);
}

export const useGetAllMealPlans = (
  pageIndex: number,
  pageSize: number,
  search: string,
  config?: UseQueryOptions<MealPlan[]>,
) => {
  return useQuery<MealPlan[]>({
    queryKey: ["mealplans", pageIndex, pageSize],
    queryFn: async () => {
      const response = await getAllMealPlans(pageIndex, pageSize);
      return response.data;
    },
    ...config,
  });
};
export const useGetMealPlanById = (
  mealPlanId: number,
  config?: UseQueryOptions<MealPlan>,
) => {
  return useQuery<MealPlan>({
    queryKey: ["mealPlan", mealPlanId],
    queryFn: async () => {
      const response = await getMealPlanById(mealPlanId);
      console.log("Meal Plan by ID:", response);
      return response.data;
    },
    enabled: !!mealPlanId,
    ...config,
  });
};
