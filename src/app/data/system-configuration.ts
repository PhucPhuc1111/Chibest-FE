import { config } from './../../middleware';
import request, { baseURL } from "@/services/apiClient";
import { ApiResponse, SystemConfiguration } from ".";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";



export async function getAllSystemConfigurations(pageIndex: number, pageSize: number): Promise<ApiResponse<SystemConfiguration[]>> {
    return await request.get(`${baseURL}/api/system-configuration?pageIndex=${pageIndex}&pageSize=${pageSize}`);
  }


  export async function getSystemConfigurationById(configId: number): Promise<ApiResponse<SystemConfiguration>> {
    return await request.get(`${baseURL}/api/system-configuration/${configId}`);
  }
  
  export async function createSystemConfiguration(
    formData: { 
      name: string;
      minValue: number;
      maxValue: number;
      unit: string;
      
      description: string;
       }
  ): Promise<SystemConfiguration> {
   
      const data = {
        name: formData.name,
        minValue: formData.minValue,
        maxValue: formData.maxValue,
        unit: formData.unit,
     
        description: formData.description,
        
      };
  
      const response = await request.post(`${baseURL}/api/system-configuration`, data, {
        headers: {
       
          'Content-Type': 'application/json',
        },
      });
  
      return response;
  
  }
  
  export async function updateSystemConfiguration(
    configId: number,
    formData: { 
      name: string;
      minValue: number;
      maxValue: number;
      unit: string;
      description: string;
      
    }
  ): Promise<SystemConfiguration> {
    const data = {
      name: formData.name,
      minValue: formData.minValue,
      maxValue: formData.maxValue,
      unit: formData.unit,
      description: formData.description,
      
    };
  
    const response = await request.put(`${baseURL}/api/system-configuration/${configId}`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    return response;
  }
  

  export async function deleteSystemConfigurationId(configId: number): Promise<void> {


    await request.deleteWithOptions(`${baseURL}/api/system-configuration/${configId}`, {
      
    });
  
}

export const useGetAllSystemConfigurations = (
  pageIndex: number,
  pageSize: number,
  name: string,
  config?: UseQueryOptions<SystemConfiguration[]>
) => {
  return useQuery<SystemConfiguration[]>({
    queryKey: ["systemConfigurations", pageIndex, pageSize],
    queryFn: async () => {
      const response = await getAllSystemConfigurations(pageIndex, pageSize);
      return response.data;
    },
    ...config,
  });
};
export const useGetSystemConfigurationById = (configId: number, config?: UseQueryOptions<SystemConfiguration>) => {
  return useQuery<SystemConfiguration>({
    queryKey: ["systemConfiguration", configId],
    queryFn: async () => {
      const response = await getSystemConfigurationById(configId);
      return response.data;
    },
    enabled: !!configId, // Chỉ gọi API khi có foodId
    ...config,
  });
};