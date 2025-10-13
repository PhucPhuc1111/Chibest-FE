import request, { baseURL }  from "@/services/apiClient";
import { Feedback } from "./types";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ApiResponse } from ".";


export async function getAllFeedback(pageIndex: number, pageSize: number): Promise<ApiResponse<Feedback[]>> {
    return await request.get(`${baseURL}/api/meal-plan/feedback?pageIndex=${pageIndex}&pageSize=${pageSize}`);
  }

  
export const useGetAllFeedback = (
    pageIndex: number,
    pageSize: number,
    search: string,
    config?: UseQueryOptions<Feedback[]>
  ) => {
    return useQuery<Feedback[]>({
       queryKey: ["feedbacks", pageIndex, pageSize],
       queryFn: async () => {
         const response = await getAllFeedback(pageIndex, pageSize);
         return response.data;
       },
       ...config,
     });
   };