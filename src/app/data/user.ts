import  request from "@/services/apiClient";
import  baseURL from "@/services/apiClient";
import { useQuery } from "react-query";
import { Profile, User } from "./types";
export function getMe(token: string): Promise<User> {
    return request.get(`${baseURL}/api/user/whoami`, {
      headers: {
        'Content-Type': 'application/json' ,
        'Authorization': `Bearer ${token}`,
      },
    });
  }
export function getProfile(): Promise<{ user?: Profile, detail: User }> {
    return request.get(`/api/user/whoami`);
  }
  
  export const useGetProfile = () => {
    return useQuery({
      queryKey: ['profile'],
      queryFn: getProfile,
    })
  }