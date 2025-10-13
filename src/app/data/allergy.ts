
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import request, { baseURL } from "@/services/apiClient";
import { Allergy } from "./types";
import { ApiResponse } from ".";

export async function getAllAllergies(
  pageIndex: number,
  pageSize: number
): Promise<ApiResponse<Allergy[]>> {
  return await request.get(`${baseURL}/api/allergy?pageIndex=${pageIndex}&pageSize=${pageSize}`);
}

export async function getAllergyById(allergyId: number): Promise<ApiResponse<Allergy>> {
  return await request.get(`${baseURL}/api/allergy/${allergyId}`);
}

// export async function createAllergy(formData: { allergyName: string; notes: string }): Promise<Allergy> {
//   const form = new FormData();
//   form.append("allergyName", formData.allergyName);
//   form.append("notes", formData.notes);

//   return await request.postMultiPart(`${baseURL}/api/allergy`, form);
// }

// export async function updateAllergy(
//   allergyId: number,
//   formData: { allergyName: string; notes: string }
// ): Promise<Allergy> {
//   try {
//     const response = await request.put(
//       `${baseURL}/api/allergy?allergyId=${allergyId}`,
//       formData
//     );
//     return response;
//   } catch (error) {
//     console.error("Lỗi khi cập nhật dị ứng:", error);
//     throw error;
//   }
// }
export async function createAllergy(
  formData: {
    AllergyName: string;
    Notes: string;
    
    ingredientIds: string [];
  }
): Promise<Allergy> {
  const form = new FormData();
  form.append("AllergyName", formData.AllergyName);
  form.append("Notes", formData.Notes);
  formData.ingredientIds.forEach((id) => form.append("ingredientIds", id));
  return await request.postMultiPart(`${baseURL}/api/allergy`, form);
}

export async function updateAllergy( 
 formData: {
  AllergyId: number;
  AllergyName?: string;
  Notes?: string;
  ingredientIds?: string[];

}): Promise<Allergy> {
 if (!formData.AllergyId) {
     throw new Error("allergyId không hợp lệ!");
   }
 
   const oldDataResponse = await getAllergyById(formData.AllergyId);
   const oldData = oldDataResponse.data;
   const form = new FormData();
   form.append("AllergyId", formData.AllergyId.toString());
   form.append("AllergyName", formData.AllergyName ?? oldData.allergyName);
   form.append("Notes", formData.Notes ?? oldData.notes);
  if (formData.ingredientIds) {
    formData.ingredientIds.forEach((id) => form.append("ingredientIds", id));
  } else {
    oldData.ingredientIds.forEach((id) => form.append("ingredientIds", id.toString()));
  }  

  return await request.putMultiPart(`${baseURL}/api/allergy?allergyId=${formData.AllergyId}`, form);
}
;

export async function deleteAllergyById(allergyId: string): Promise<void> {
  await request.delete(`${baseURL}/api/allergy/${allergyId}`);
}

export const useGetAllAllergies = (
  pageIndex: number,
  pageSize: number,
  allergyName: string,
  config?: UseQueryOptions<Allergy[]>
) => {
  return useQuery<Allergy[]>({
    queryKey: ["allergies", pageIndex, pageSize],
    queryFn: async () => {
      const response = await getAllAllergies(pageIndex, pageSize);
      return response.data;
    },
    ...config,
  });
};
export const useGetAllergyById = (allergyId: number, config?: UseQueryOptions<Allergy>) => {
  return useQuery<Allergy>({
    queryKey: ["allergy", allergyId],
    queryFn: async () => {
      const response = await getAllergyById(allergyId);
      return response.data;
    },
    enabled: !!allergyId, // Chỉ gọi API khi có foodId
    ...config,
  });
};