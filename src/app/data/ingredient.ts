import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import request, { baseURL }  from "@/services/apiClient";
import Cookies from 'js-cookie';
import { Ingredient } from "./types";
import { ApiResponse } from ".";


export async function getAllIngredients(
  pageIndex: number, 
  pageSize: number): 
  Promise<ApiResponse<Ingredient[]>> {
  return await request.get(`${baseURL}/api/ingredient?pageIndex=${pageIndex}&pageSize=${pageSize}`);
}


export async function getIngredientById(ingredientId: number): Promise<ApiResponse<Ingredient>> {
  return await request.get(`${baseURL}/api/ingredient/${ingredientId}`);
}
// export async function importIngredientExcelFile(formData: FormData): Promise<void> {
//   await request.postMultiPart(`${baseURL}/api/ingredient/excel`, formData);
// }

// export async function importIngredientExcelFile(formData: FormData): Promise<{ message: string }> {
//   try {
//     // Make the request to the backend and get the response
//     const response = await request.postMultiPart(`${baseURL}/api/ingredient/excel`, formData);

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
export async function importIngredientExcelAnalyzeFile(formData: FormData): Promise<{ message: string ,data:any}> {
  try {
    const response = await request.postMultiPart(`${baseURL}/api/ingredient/excel-analyze`, formData);
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
export async function importIngredientExcelFile(formData: FormData): Promise<{ message: string }> {
  try {
    const response = await request.postMultiPart(`${baseURL}/api/ingredient/excel`, formData);
    const message = response?.message;
    console.log("Response ,ess:", response.message);
    return { message };
  } catch (error) {
    console.error("Error importing Excel file:", error);
    throw new Error('Error importing Excel file');
  }
}
// Function to add new items and overwrite duplicates
export async function importIngredientExcelDuplicateFile(formData: FormData): Promise<{ message: string }> {
  try {
    const response = await request.postMultiPart(`${baseURL}/api/ingredient/excel-duplicate`, formData);
    const message = response?.message;
    console.log("Response Data:", response.data);
    return { message };
  } catch (error) {
    console.error("Error importing Excel file:", error);
    throw new Error('Error importing Excel file');
  }
}
export async function createIngredient(
  formData: { 
    ingredientName: string;
     carbs: number; 
     fat: number; 
     protein: number;
      calories: number }
): Promise<Ingredient> {
 
    const data = {
      ingredientName: formData.ingredientName,
      carbs: formData.carbs,
      fat: formData.fat,
      protein: formData.protein,
      calories: formData.calories,
    };

    const response = await request.post(`${baseURL}/api/ingredient`, data, {
      headers: {
     
        'Content-Type': 'application/json',
      },
    });

    return response;

}

export async function updateIngredient(
  ingredientId: number,
  formData: { 
    ingredientName: string;
    carbs: number; 
    fat: number; 
    protein: number; 
    calories: number;
  }
): Promise<Ingredient> {
  const data = {
    ingredientName: formData.ingredientName,
    carbs: formData.carbs,
    fat: formData.fat,
    protein: formData.protein,
    calories: formData.calories,
  };

  const response = await request.put(`${baseURL}/api/ingredient/${ingredientId}`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response;
}


export async function deleteIngredientById(ingredientId: number): Promise<void> {


    await request.deleteWithOptions(`${baseURL}/api/ingredient/${ingredientId}`, {
      
    });
  
}

export const useGetAllIngredients = (
  pageIndex: number,
  pageSize: number,
  ingredientName: string,
  config?: UseQueryOptions<Ingredient[]>
) => {
  return useQuery<Ingredient[]>({
    queryKey: ["ingredients", pageIndex, pageSize],
    queryFn: async () => {
      const response = await getAllIngredients(pageIndex, pageSize);
      return response.data;
    },
    ...config,
  });
};
export const useGetIngredientById = (ingredientId: number, config?: UseQueryOptions<Ingredient>) => {
  return useQuery<Ingredient>({
    queryKey: ["ingredient", ingredientId],
    queryFn: async () => {
      const response = await getIngredientById(ingredientId);
      return response.data;
    },
    enabled: !!ingredientId, // Chỉ gọi API khi có foodId
    ...config,
  });
};