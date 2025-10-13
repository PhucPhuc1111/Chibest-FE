import { message } from 'antd';

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import request, { baseURL } from "@/services/apiClient";
import { Food } from "./types";
import { ApiResponse } from ".";



export async function getAllFoods(pageIndex: number, pageSize: number): Promise<ApiResponse<Food[]>> {
  return await request.get(`${baseURL}/api/food?pageIndex=${pageIndex}&pageSize=${pageSize}`);
}


export async function getFoodById(foodId: number): Promise<ApiResponse<Food>> {
  return await request.get(`${baseURL}/api/food/${foodId}`);
}
// export async function createFoodIngredient(
//   foodId: number, // Add foodId parameter
//   formData: { 
//     ingredientId: number;
//     quantity: number;
//     unit: string; // Change `unit` type to string
//   }
// ): Promise<Food> {
//   const data = {
//     ingredientId: formData.ingredientId,
//     quantity: formData.quantity,
//     unit: formData.unit, // Ensure unit is a string
//   };

//   const response = await request.post(`${baseURL}/api/food-ingredient/${foodId}`, data, {
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

//   return response;
// }

// POST request to upload an Excel file
// export async function importFoodExcelFile(formData: FormData): Promise<{ message: string }> {
//   try {
//     // Make the request to the backend and return the response data
//     const response = await request.postMultiPart(`${baseURL}/api/food/excel`, formData);
//     console.log("Response Data:", response.data);
//     // Assuming the response contains a message like { message: 'Import successful' }
//     return response.data; // Assuming the response structure is { data: { message: string } }

//   } 
//   catch (error) {
//     // Handle errors if any
//     throw new Error('Error importing Excel file');
//   }
// }
// export async function importFoodExcelFile(formData: FormData): Promise<{ message: string }> {
//   try {
//     // Make the request to the backend and get the response
//     const response = await request.postMultiPart(`${baseURL}/api/food/excel`, formData);

//     // Log the full response to inspect its structure
//     console.log("Full Response:", response);

//     // Access the message directly from the response (it's at the top level)
//     const message = response?.message;

//     // Log the message to the console
//     console.log("Response Message:", message);

//     // Return the message from the API response
//     return { message };
//   } catch (error) {
//     // Handle errors if any
//     console.error("Error importing Excel file:", error);
//     throw new Error('Error importing Excel file');
//   }
// }
export async function importFoodExcelAnalyzeFile(formData: FormData): Promise<{ message: string ,data:any}> {
  try {
    const response = await request.postMultiPart(`${baseURL}/api/food/excel-analyze`, formData);
    console.log("Full Response:", response);
    const message = response?.message;
    const data = response?.data;
    console.log("Response Message:", message);
    return { message,data  };
  } catch (error) {
    console.error("Error importing Excel file:", error);
    throw new Error('Error importing Excel file');
  }
}
export async function importFoodExcelFile(formData: FormData): Promise<{ message: string }> {
  try {
    const response = await request.postMultiPart(`${baseURL}/api/food/excel`, formData);
    const message = response?.message;
    console.log("Response ,ess:", response.message);
    return { message };
  } catch (error) {
    console.error("Error importing Excel file:", error);
    throw new Error('Error importing Excel file');
  }
}
// Function to add new items and overwrite duplicates
export async function importFoodExcelDuplicateFile(formData: FormData): Promise<{ message: string }> {
  try {
    const response = await request.postMultiPart(`${baseURL}/api/food/excel-duplicate`, formData);
    const message = response?.message;
    console.log("Response Data:", response.data);
    return { message };
  } catch (error) {
    console.error("Error importing Excel file:", error);
    throw new Error('Error importing Excel file');
  }
}
export async function createFood(
  formData: {
    FoodName: string;
    MealType: string;
    FoodImageUrl: string | File;
    FoodType: string;
    Description: string;
    ServingSize: string;
    Calories: number;
    Protein: number;
    Carbs: number;
    Fat: number;
    Glucid: number;
    Fiber: number;
    // Others: string;
    AllergyId: string[];
    DiseaseId: string[];
    Ingredients: string [];
  }
): Promise<Food> {
  const form = new FormData();
  form.append("FoodName", formData.FoodName);
  form.append("MealType", formData.MealType);
  form.append("FoodType", formData.FoodType);
  form.append("Description", formData.Description);
  form.append("ServingSize", formData.ServingSize);
  form.append("Calories", formData.Calories.toString());
  form.append("Protein", formData.Protein.toString());
  form.append("Carbs", formData.Carbs.toString());
  form.append("Fat", formData.Fat.toString());
  form.append("Glucid", formData.Glucid.toString());
  form.append("Fiber", formData.Fiber.toString());
  // form.append("Others", formData.Others);

  // Handle image upload: If it's a File, upload it.
  if (formData.FoodImageUrl instanceof File) {
    form.append("FoodImageUrl", formData.FoodImageUrl);
  } else if (formData.FoodImageUrl) {
    form.append("FoodImageUrl", formData.FoodImageUrl); // If it's already a URL, use it directly
  }
  
  formData.Ingredients.forEach((id) => form.append("Ingredients", id));
  return await request.postMultiPart(`${baseURL}/api/food`, form);
}

// ✅ Cập nhật thực phẩm (multipart/form-data)
export async function updateFood(formData: {
  FoodId: number;
  FoodName?: string;
  MealType?: string;
  FoodImageUrl?: string | File;
  FoodType?: string;
  Description?: string;
  ServingSize?: string;
  Calories?: number;
  Protein?: number;
  Carbs?: number;
  Fat?: number;
  Glucid?: number;
  Fiber?: number;
  // Others?: string;
  Ingredients?: string [];


}): Promise<Food> {
  if (!formData.FoodId) {
    throw new Error("FoodId không hợp lệ!");
  }

  const oldDataResponse = await getFoodById(formData.FoodId);
  const oldData = oldDataResponse.data;

  const form = new FormData();
  form.append("FoodId", formData.FoodId.toString());
  form.append("FoodName", formData.FoodName ?? oldData.foodName);
  form.append("MealType", formData.MealType ?? oldData.mealType);
  form.append("FoodType", formData.FoodType ?? oldData.foodType);
  form.append("Description", formData.Description ?? oldData.description);
  form.append("ServingSize", formData.ServingSize ?? oldData.servingSize);
  form.append("Calories", formData.Calories?.toString() ?? oldData.calories.toString());
  form.append("Protein", formData.Protein?.toString() ?? oldData.protein.toString());
  form.append("Carbs", formData.Carbs?.toString() ?? oldData.carbs.toString());
  form.append("Fat", formData.Fat?.toString() ?? oldData.fat.toString());
  form.append("Glucid", formData.Glucid?.toString() ?? oldData.glucid.toString());
  form.append("Fiber", formData.Fiber?.toString() ?? oldData.fiber.toString());
  // form.append("Others", formData.Others ?? oldData.others);

  // Handle image upload (File or URL)
  if (formData.FoodImageUrl instanceof File) {
    form.append("FoodImageUrl", formData.FoodImageUrl);
  } else if (formData.FoodImageUrl === "") {
    form.append("FoodImageUrl", ""); // If the image is removed
  } else {
    form.append("FoodImageUrl", formData.FoodImageUrl ?? oldData.imageUrl);
  }
    if (formData.Ingredients) {
    formData.Ingredients.forEach((id) => form.append("Ingredients", id));
  } else {
    oldData.allergies.forEach((id) => form.append("Ingredients", id.toString()));
  }
  return await request.putMultiPart(`${baseURL}/api/food/${formData.FoodId}`, form);
}
;

export async function deleteFoodById(foodId: number): Promise<void> {
  await request.delete(`${baseURL}/api/food/${foodId}`);
}


export const useGetAllFoods = (
  pageIndex: number,
  pageSize: number,
  foodName: string,
  config?: UseQueryOptions<Food[]>
) => {
  return useQuery<Food[]>({
    queryKey: ["foods", pageIndex, pageSize],
    queryFn: async () => {
      const response = await getAllFoods(pageIndex, pageSize);
      return response.data;
    },
    ...config,
  });
};

// 🔎 Hook lấy thực phẩm theo ID
export const useGetFoodById = (foodId: number, config?: UseQueryOptions<Food>) => {
  return useQuery<Food>({
    queryKey: ["food", foodId],
    queryFn: async () => {
      const response = await getFoodById(foodId);
      return response.data;
    },
    enabled: !!foodId, // Chỉ gọi API khi có foodId
    ...config,
  });
};