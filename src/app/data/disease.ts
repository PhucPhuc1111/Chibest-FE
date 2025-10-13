import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import request, { baseURL } from "@/services/apiClient";
import { Disease } from "./types";
import { ApiResponse } from ".";

export async function getAllDiseases(
  pageIndex: number,
  pageSize: number
): Promise<ApiResponse<Disease[]>> {
  return await request.get(`${baseURL}/api/disease?pageIndex=${pageIndex}&pageSize=${pageSize}`);
}

export async function getDiseaseById(diseaseId: number): Promise<ApiResponse<Disease>> {
  return await request.get(`${baseURL}/api/disease/${diseaseId}`);
}

// ✅ createDisease: multipart/form-data (cho nhiều dữ liệu)
export async function createDisease(
  formData: { 
    DiseaseName: string; 
    Description: string 
  
    ingredientIds: string [];
  }): Promise<Disease> {
  const form = new FormData();
  form.append("DiseaseName", formData.DiseaseName);
  form.append("Description", formData.Description);
  formData.ingredientIds.forEach((id) => form.append("ingredientIds", id));
  return await request.postMultiPart(`${baseURL}/api/disease`, form);
}

// ✅ updateDisease: application/json (dữ liệu dạng JSON)
// export async function updateDisease(
//   diseaseId: number,
//   formData: { diseaseName: string; description: string }
// ): Promise<Disease> {
//   try {
//     const response = await request.put(
//       `${baseURL}/api/disease?diseaseId=${diseaseId}`,
//       formData
//     );
//     return response;
//   } catch (error) {
//     console.error("Lỗi khi cập nhật dị ứng:", error);
//     throw error;
//   }
// }
export async function updateDisease( 
 formData: {
  DiseaseId: number;
  DiseaseName?: string;
  Description?: string;
  ingredientIds?: string[];

}): Promise<Disease> {
 if (!formData.DiseaseId) {
     throw new Error("DiseaseId không hợp lệ!");
   }
 
   const oldDataResponse = await getDiseaseById(formData.DiseaseId);
   const oldData = oldDataResponse.data;
   const form = new FormData();
   form.append("DiseaseId", formData.DiseaseId.toString());
   form.append("DiseaseName", formData.DiseaseName ?? oldData.diseaseName);
   form.append("Description", formData.Description ?? oldData.description);
  if (formData.ingredientIds) {
    formData.ingredientIds.forEach((id) => form.append("ingredientIds", id));
  } else {
    oldData.ingredientIds.forEach((id) => form.append("ingredientIds", id.toString()));
  }  

  return await request.putMultiPart(`${baseURL}/api/disease?diseaseId=${formData.DiseaseId}`, form);
}
;
export async function deleteDiseaseById(diseaseId: number): Promise<void> {
  await request.delete(`${baseURL}/api/disease/${diseaseId}`);
}

export const useGetAllDiseases = (
  pageIndex: number,
  pageSize: number,
  diseaseName: string,
  config?: UseQueryOptions<Disease[]>
) => {
  return useQuery<Disease[]>({
    queryKey: ["diseases", pageIndex, pageSize],
    queryFn: async () => {
      const response = await getAllDiseases(pageIndex, pageSize);
      return response.data;
    },
    ...config,
  });
};
export const useGetDiseaseById = (diseaseId: number, config?: UseQueryOptions<Disease>) => {
  return useQuery<Disease>({
    queryKey: ["disease", diseaseId],
    queryFn: async () => {
      const response = await getDiseaseById(diseaseId);
      return response.data;
    },
    enabled: !!diseaseId, // Chỉ gọi API khi có foodId
    ...config,
  });
};