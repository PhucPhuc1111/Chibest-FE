import request, { baseURL } from "@/services/apiClient";
import { ApiResponse, Package } from ".";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";



export async function getAllPackages(pageIndex: number, pageSize: number): Promise<ApiResponse<Package[]>> {
    return await request.get(`${baseURL}/api/package?pageIndex=${pageIndex}&pageSize=${pageSize}`);
  }


  export async function getPackageById(packageId: number): Promise<ApiResponse<Package>> {
    return await request.get(`${baseURL}/api/package/${packageId}`);
  }
  
  export async function createPackage(
    formData: { 
      packageName: string;
       price: number;
       duration: number;
         description: string;
       }
  ): Promise<Package> {
   
      const data = {
        packageName: formData.packageName,
        price: formData.price,
        duration: formData.duration,
        description: formData.description,
        
      };
  
      const response = await request.post(`${baseURL}/api/package`, data, {
        headers: {
       
          'Content-Type': 'application/json',
        },
      });
  
      return response;
  
  }
  
  export async function updatePackage(
    packageId: number,
    formData: { 
      packageName: string;
      price: number; 
      duration: number; 
      description: number; 
      
    }
  ): Promise<Package> {
    const data = {
      packageName: formData.packageName,
      duration: formData.duration,
      price: formData.price,

      description: formData.description,
     
    };
  
    const response = await request.put(`${baseURL}/api/package/${packageId}`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    return response;
  }
  

  export async function deletePackageById(packageId: number): Promise<void> {


    await request.deleteWithOptions(`${baseURL}/api/package/${packageId}`, {
      
    });
  
}

export const useGetAllPackages = (
  pageIndex: number,
  pageSize: number,
  packageName: string,
  config?: UseQueryOptions<Package[]>
) => {
  return useQuery<Package[]>({
    queryKey: ["packages", pageIndex, pageSize],
    queryFn: async () => {
      const response = await getAllPackages(pageIndex, pageSize);
      return response.data;
    },
    ...config,
  });
};
export const useGetPackageById = (packageId: number, config?: UseQueryOptions<Package>) => {
  return useQuery<Package>({
    queryKey: ["package", packageId],
    queryFn: async () => {
      const response = await getPackageById(packageId);
      return response.data;
    },
    enabled: !!packageId, // Chỉ gọi API khi có foodId
    ...config,
  });
};