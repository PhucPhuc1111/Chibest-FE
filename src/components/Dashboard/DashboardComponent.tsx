"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import ChartOne from "../Charts/ChartOne";
import ChartTwo from "../Charts/ChartTwo";
import Cookies from "js-cookie";
import CardDataStats from "../CardDataStats";
import Loader from "../common/Loader";
import { Dashboard, getAllDashboard, getAllRevenue } from "@/app/data";
import { Select } from "antd";

const ChartThree = dynamic(() => import("@/components/Charts/ChartThree"), {
  ssr: false,
});

const DashboardComponent: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<Dashboard | null>(null);
  const [revenueData, setRevenueData] = useState<any | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("Today");
  const [isLoading, setIsLoading] = useState(true);


  const fetchRevenueData = async (filter: string) => {
    try {
      setIsLoading(true);
      const response = await getAllRevenue(); // Lấy dữ liệu Revenue từ API
  
      let filteredData = { totalRevenue: 0, packageSold: 0 };
  
      // Hàm để chuyển đổi định dạng ngày (YYYY-MM-DD)
      const formatDate = (date: string) => date.split('T')[0]; 
  
      // Lấy ngày Today và tuần hiện tại
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1; // Tháng hiện tại (1-12)
  
      // Tính số tuần trong tháng
      const getWeekOfMonth = (date: Date) => {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const dayOfMonth = date.getDate();
        return Math.ceil((dayOfMonth + firstDay.getDay()) / 7);
      };
  
      const currentWeek = getWeekOfMonth(today);
  
      switch (filter) {
        case "Today":
          const todayDate = today.toISOString().split('T')[0];
          const todayData = response.data.revenue.daily.find((day: any) => formatDate(day.date) === todayDate);
          if (todayData) {
            filteredData.totalRevenue = todayData.totalRevenue;
            filteredData.packageSold = todayData.packageSold;
          }
          break;
  
        case "Yesterday":
          const yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 1);
          const yesterdayData = response.data.revenue.daily.find((day: any) => formatDate(day.date) === formatDate(yesterday.toISOString()));
          if (yesterdayData) {
            filteredData.totalRevenue = yesterdayData.totalRevenue;
            filteredData.packageSold = yesterdayData.packageSold;
          }
          break;
  
        case "This week":
          const currentWeekData = response.data.revenue.weekly.find(
            (week: any) => week.year === currentYear && week.month === currentMonth && week.week === currentWeek
          );
          if (currentWeekData) {
            filteredData.totalRevenue = currentWeekData.totalRevenue;
            filteredData.packageSold = currentWeekData.packageSold;
          }
          break;
  
        case "Last week":
          const lastWeek = currentWeek - 1;
          const lastWeekData = response.data.revenue.weekly.find(
            (week: any) => week.year === currentYear && week.month === currentMonth && week.week === lastWeek
          );
          if (lastWeekData) {
            filteredData.totalRevenue = lastWeekData.totalRevenue;
            filteredData.packageSold = lastWeekData.packageSold;
          }
          break;
  
        default:
          break;
      }
  
      setRevenueData(filteredData); // Cập nhật dữ liệu Revenue vào state
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      setIsLoading(false);
    }
  };
  
  
  // Lấy dữ liệu tổng quan chỉ một lần khi component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getAllDashboard(); // Gọi API lấy thông tin tổng quan
        setDashboardData(response.data); // Lưu vào state
        setIsLoading(false); // Đánh dấu hoàn thành tải dữ liệu
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setIsLoading(false);
      }
    };

    fetchDashboardData(); 
  }, []); // Chạy chỉ một lần khi component mount

  // Cập nhật dữ liệu Revenue khi thay đổi filter
  useEffect(() => {
    fetchRevenueData(selectedFilter); // Gọi lại hàm fetch chỉ khi filter thay đổi
  }, [selectedFilter]); // Chạy lại chỉ khi selectedFilter thay đổi

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value); // Cập nhật filter khi Accounts thay đổi
  };

  const userRole = Cookies.get("userRole");
  return (
    <>
     
<div className="flex justify-between w-full">


      <div className="w-1/4 " >
      <div className=" mt-4  h-[170px] w-[262px]  bg-white ">
        <div className="flex justify-between p-4">
<div className="text-lg text-green-800 font-bold">Revenue</div>
         
         
          <div className="">
            {" "}
            <Select
                  value={selectedFilter} // Sử dụng value thay v6ì defaultValue
                  onChange={handleFilterChange} // Cập nhật khi chọn filter mới
                  style={{ width: "100%" }}
                >
                  <Select.Option value="Today">Today</Select.Option>
                  <Select.Option value="Yesterday">Yesterday</Select.Option>
                  <Select.Option value="This week">This week</Select.Option>
                  <Select.Option value="Last week">Last week</Select.Option>
                </Select>
          </div>
        </div>
         <div className="text-2xl font-bold pl-7 pt-8 text-green-800">
              {revenueData ? `${revenueData.totalRevenue} VNĐ` : "0 VNĐ"}
            </div>
            <div className=" pl-7 text-md   ">
            <span>Package sold:</span> <span> {revenueData ? `${revenueData.packageSold} Package` : "0 Package"}</span>
            </div>
      </div>
      <div className=" mt-4  h-[170px] w-[262px]  ">
      <CardDataStats title="Allergies" total={dashboardData?.totalAllergy?.toString() || "0"} rate="" >
     
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className=" stroke-white lucide lucide-bean-off-icon lucide-bean-off"><path d="M9 9c-.64.64-1.521.954-2.402 1.165A6 6 0 0 0 8 22a13.96 13.96 0 0 0 9.9-4.1"/><path d="M10.75 5.093A6 6 0 0 1 22 8c0 2.411-.61 4.68-1.683 6.66"/><path d="M5.341 10.62a4 4 0 0 0 6.487 1.208M10.62 5.341a4.015 4.015 0 0 1 2.039 2.04"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
     
     
             </CardDataStats>
             </div>
             <div className=" mt-4  h-[170px] w-[262px] ">
             <CardDataStats title="Diseases" total={dashboardData?.totalDisease?.toString() || "0"} rate="">
          
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 stroke-white">
    <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>
  
  
          </CardDataStats>
          </div>
        
     <div className=" mt-4  h-[170px] w-[262px] ">
      <CardDataStats title="Ingredients" total={dashboardData?.totalIngredient?.toString() || "0"} rate="">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="stroke-white lucide lucide-banana-icon lucide-banana"><path d="M4 13c3.5-2 8-2 10 2a5.5 5.5 0 0 1 8 5"/><path d="M5.15 17.89c5.52-1.52 8.65-6.89 7-12C11.55 4 11.5 2 13 2c3.22 0 5 5.5 5 8 0 6.5-4.2 12-10.49 12C5.11 22 2 22 2 20c0-1.5 1.14-1.55 3.15-2.11Z"/></svg>      </CardDataStats>
      </div>
      </div>
    
      <div className="mt-4 w-3/4">
      {/* {dashboardData && userRole !== "Nutritionist" ? <ChartOne /> :<></>} */}
      {dashboardData ? <ChartOne />: <p>Loading chart</p> }
      </div>
      <ChartTwo />
      </div>
      <div className=" mt-3 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
     

       
       
        <CardDataStats
          title="Foods"
          total={dashboardData?.totalFood?.toString() || "0"}
          rate=""
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            className=" lucide lucide-pizza-icon lucide-pizza stroke-white"
          >
            <path d="m12 14-1 1" />
            <path d="m13.75 18.25-1.25 1.42" />
            <path d="M17.775 5.654a15.68 15.68 0 0 0-12.121 12.12" />
            <path d="M18.8 9.3a1 1 0 0 0 2.1 7.7" />
            <path d="M21.964 20.732a1 1 0 0 1-1.232 1.232l-18-5a1 1 0 0 1-.695-1.232A19.68 19.68 0 0 1 15.732 2.037a1 1 0 0 1 1.232.695z" />
          </svg>{" "}
        </CardDataStats>
        <CardDataStats title="Meal plans" total={dashboardData?.totalMealPlan?.toString() || "0"} rate="">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 stroke-white">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
</svg>

        </CardDataStats>
    
        <CardDataStats
          title="Accounts"
          total={dashboardData?.totalUser?.toString() || "0"}
          rate=""
        >
          <svg
            className="fill-white dark:fill-white"
            width="22"
            height="18"
            viewBox="0 0 22 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751ZM7.18418 2.05626C8.45605 2.05626 9.52168 3.05313 9.52168 4.29063C9.52168 5.52813 8.49043 6.52501 7.18418 6.52501C5.87793 6.52501 4.84668 5.52813 4.84668 4.29063C4.84668 3.05313 5.9123 2.05626 7.18418 2.05626Z"
              fill=""
            />
            <path
              d="M15.8124 9.6875C17.6687 9.6875 19.1468 8.24375 19.1468 6.42188C19.1468 4.6 17.6343 3.15625 15.8124 3.15625C13.9905 3.15625 12.478 4.6 12.478 6.42188C12.478 8.24375 13.9905 9.6875 15.8124 9.6875ZM15.8124 4.7375C16.8093 4.7375 17.5999 5.49375 17.5999 6.45625C17.5999 7.41875 16.8093 8.175 15.8124 8.175C14.8155 8.175 14.0249 7.41875 14.0249 6.45625C14.0249 5.49375 14.8155 4.7375 15.8124 4.7375Z"
              fill=""
            />
            <path
              d="M15.9843 10.0313H15.6749C14.6437 10.0313 13.6468 10.3406 12.7874 10.8563C11.8593 9.61876 10.3812 8.79376 8.73115 8.79376H5.67178C2.85303 8.82814 0.618652 11.0625 0.618652 13.8469V16.3219C0.618652 16.975 1.13428 17.4906 1.7874 17.4906H20.2468C20.8999 17.4906 21.4499 16.9406 21.4499 16.2875V15.4625C21.4155 12.4719 18.9749 10.0313 15.9843 10.0313ZM2.16553 15.9438V13.8469C2.16553 11.9219 3.74678 10.3406 5.67178 10.3406H8.73115C10.6562 10.3406 12.2374 11.9219 12.2374 13.8469V15.9438H2.16553V15.9438ZM19.8687 15.9438H13.7499V13.8469C13.7499 13.2969 13.6468 12.7469 13.4749 12.2313C14.0937 11.7844 14.8499 11.5781 15.6405 11.5781H15.9499C18.0812 11.5781 19.8343 13.3313 19.8343 15.4625V15.9438H19.8687Z"
              fill=""
            />
          </svg>
        </CardDataStats>
        <CardDataStats
          title="Premium accounts"
          total={dashboardData?.totalPremiumUser?.toString() || "0"}
          rate=""
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="stroke-prima size-6 stroke-white"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
            />
          </svg>
        </CardDataStats>
        <CardDataStats
          title="Package"
          total={dashboardData?.totalPackage?.toString() || "0"}
          rate=""
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-gem-icon lucide-gem stroke-white"
          >
            <path d="M6 3h12l4 6-10 13L2 9Z" />
            <path d="M11 3 8 9l4 13 4-13-3-6" />
            <path d="M2 9h20" />
          </svg>
        </CardDataStats>
      </div>
    </>
  );
};

export default DashboardComponent;
