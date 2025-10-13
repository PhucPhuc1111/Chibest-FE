
// "use client";
// import { Bar } from "react-chartjs-2";
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
// import { useEffect, useState } from "react";
// import { useGetAllRevenue } from "@/app/data"; // Adjust the import path
// import { Button } from "antd";

// // Register the necessary components for Chart.js
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const ChartOne: React.FC = () => {
//   const [chartData, setChartData] = useState<any>(null);
//   const [view, setView] = useState<string>('month');
//   const [selectedYear, setSelectedYear] = useState<number>(2025); // Default year is 2025
//   const [selectedMonth, setSelectedMonth] = useState<number>(4); // Default month is April

//   // Using the useQuery hook to fetch the revenue data
//   const { data, isLoading, error } = useGetAllRevenue();

//   useEffect(() => {
//     if (data) {
//       let labels: string[] = [];
//       let revenueData: number[] = [];
//       let packageSoldData: number[] = [];

//       // Filter data by selected year and month
//       const weeklyData = data.revenue.weekly.filter((week: any) => {
//         return week.year === selectedYear && week.month === selectedMonth; // Filter by selected year and month
//       });
//       // Filter data by selected year and month
//       const dailyData = data.revenue.daily.filter((day: any) => {
//         const dayDate = new Date(day.date);
//         return dayDate.getFullYear() === selectedYear && dayDate.getMonth() + 1 === selectedMonth; // Filter by selected year and month
//       });

//       // Extract monthly data
//       const monthlyData = data.revenue.monthly.filter((month: any) => month.year === selectedYear);

//       // Based on the selected view (day, week, month), prepare the data accordingly
//       if (view === 'month') {
//         // Monthly data
//         labels = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
//         revenueData = new Array(12).fill(0);
//         packageSoldData = new Array(12).fill(0);

//         monthlyData.forEach((month: any) => {
//           revenueData[month.month - 1] = month.totalRevenue;
//           packageSoldData[month.month - 1] = month.packageSold;
//         });
//       } else if (view === 'week') {
//         // Weekly data
//         // Ensure proper labeling for the weeks (i.e. "Tuần 1", "Tuần 2" ...)
//         labels = weeklyData.map((week: any) => `Tuần ${week.week}`); // Using the actual week number from data
//         revenueData = new Array(weeklyData.length).fill(0);
//         packageSoldData = new Array(weeklyData.length).fill(0);

//         // Populate data based on the filtered weekly data
//         weeklyData.forEach((week: any, index: number) => {
//           revenueData[index] = week.totalRevenue;
//           packageSoldData[index] = week.packageSold;
//         });
//       } else   if (view === 'day') {
//         // Labels: Create 31 days for the X-axis (or for the number of days in the month)
//         const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate(); // Get the number of days in the selected month
//         labels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString()); // Create labels for each day

//         revenueData = new Array(daysInMonth).fill(0);
//         packageSoldData = new Array(daysInMonth).fill(0);

//         // Populate the data for the days from the filtered daily data
//         dailyData.forEach((day: any) => {
//           const dayIndex = new Date(day.date).getDate() - 1; // Get the day of the month (0-indexed)
//           revenueData[dayIndex] = day.totalRevenue;
//           packageSoldData[dayIndex] = day.packageSold;
//         });
//       }

//       setChartData({
//         labels,
//         datasets: [
//           {
//             label: "Doanh thu",
//             data: revenueData,
//             backgroundColor: '#3C50E0', // Bar color for revenue
//             borderColor: '#3056D3', // Border color for revenue
//             borderWidth: 1,
//             barPercentage: 0.8,
//           },
//           {
//             label: "Số lượng gói đã bán",
//             data: packageSoldData,
//             backgroundColor: '#FF5733', // Bar color for package sold
//             borderColor: '#C44029', // Border color for package sold
//             borderWidth: 1,
//             barPercentage: 0.8, // Adjust the width of bars
//           },
//         ],
//       });
//     }
//   }, [data, view, selectedYear, selectedMonth]); // Add selectedMonth to the dependency array

//   // Handle loading and error states
//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error loading data.</div>;
//   }

//   return (
//     <div className="col-span-12 h-[720px] rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
//       <div className="rounded-3xl">
        

     
        
   
//         <div>
//           {/* Dropdown for selecting year */}
//           <div className="flex justify-between mb-4">

          
//           <div>
//              {data?.revenue?.total && (
//         <div>
//           <div className="text-lg font-md">Tổng doanh thu: <span className="text-green-800 font-semibold"> {data.revenue.total.totalRevenue} VNĐ</span></div>
//           <div className="text-lg font-md">Tổng số lượng gói đã bán: <span className="text-green-800 font-semibold">{data.revenue.total.packageSold} Gói</span></div>
//         </div>
//       )}
//         </div>
//         <div>

       
//           <div className="mb-4">
//             <label className="mr-6">Chọn năm: </label>
//             <select 
//               value={selectedYear} 
//               onChange={(e) => setSelectedYear(parseInt(e.target.value))}
//               className="border p-2 rounded"
//             >
//               {/* Ensure only available years are shown */}
//               {data?.revenue?.annual.map((annual: any) => (
//                 <option key={annual.year} value={annual.year}>
//                   {annual.year}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Dropdown for selecting month */}
//           <div className="mb-4">
//             <label className="mr-2">Chọn tháng: </label>
//             <select 
//               value={selectedMonth} 
//               onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
//               className="border p-2 rounded"
//             >
//               {Array.from({ length: 12 }, (_, i) => (
//                 <option key={i + 1} value={i + 1}>
//                   Tháng {i + 1}
//                 </option>
//               ))}
//             </select>
//           </div>
//           </div>
//           </div>
//           {/* Buttons to switch between day, week, and month */}
//           <div className="flex justify-end space-x-4  mb-4">
//             <Button onClick={() => setView('day')} className="bg-green-800 text-white px-4 rounded">Ngày</Button>
//             <Button onClick={() => setView('week')} className="bg-green-800 text-white px-4 rounded">Tuần</Button>
//             <Button onClick={() => setView('month')} className="bg-green-800 text-white px-4 rounded">Tháng</Button>
//           </div>

//           <div id="chartOne" className="-ml-5">
//             {/* Chart.js Bar Chart */}
//             {chartData && (
//               <Bar
//                 data={chartData}
//                 options={{
//                   responsive: true,
//                   plugins: {
//                     title: {
//                       display: true,
//                       text: view === 'day' ? `Doanh thu theo ngày (${selectedMonth}-${selectedYear})` : 
//                             view === 'week' ? 'Doanh thu theo tuần' : 
//                             `Doanh thu hàng tháng ${selectedYear}`,
//                     },
//                     tooltip: {
//                       callbacks: {
//                         label: function (tooltipItem: any) {
//                           const label = tooltipItem.dataset.label;
//                           const value = tooltipItem.raw;
//                           if (label === "Doanh thu") {
//                             return `${label}: ${value} VND`;
//                           } else if (label === "Số lượng gói đã bán") {
//                             return `${label}: ${value} gói`;
//                           }
//                           return '';
//                         },
//                       },
//                     },
//                   },
//                   scales: {
//                     x: {
//                       title: {
//                         display: true,
//                         text: view === 'day' ? 'Ngày' : view === 'week' ? 'Tuần' : 'Tháng',
//                       },
//                     },
//                     y: {
//                       title: {
//                         display: true,
//                         text: 'Giá trị (VND)',
//                       },
//                       beginAtZero: true,
//                     },
//                   },
//                 }}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChartOne;
"use client";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useEffect, useState } from "react";
import { useGetAllRevenue } from "@/app/data"; // Adjust the import path
import { Button } from "antd";

// Register the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartOne: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);
  const [view, setView] = useState<string>('month');
  const [selectedYear, setSelectedYear] = useState<number>(2025); // Default year is 2025
  const [selectedMonth, setSelectedMonth] = useState<number>(4); // Default month is April

  // Month labels
  const monthLabels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Using the useQuery hook to fetch the revenue data
  const { data, isLoading, error } = useGetAllRevenue();

  useEffect(() => {
    if (data) {
      let labels: string[] = [];
      let revenueData: number[] = [];
      let packageSoldData: number[] = [];

      // Filter data by selected year and month
      const weeklyData = data.revenue.weekly.filter((week: any) => {
        return week.year === selectedYear && week.month === selectedMonth; // Filter by selected year and month
      });
      // Filter data by selected year and month
      const dailyData = data.revenue.daily.filter((day: any) => {
        const dayDate = new Date(day.date);
        return dayDate.getFullYear() === selectedYear && dayDate.getMonth() + 1 === selectedMonth; // Filter by selected year and month
      });

      // Extract monthly data
      const monthlyData = data.revenue.monthly.filter((month: any) => month.year === selectedYear);

      // Based on the selected view (day, week, month), prepare the data accordingly
      if (view === 'month') {
        // Monthly data
        labels = monthLabels;

        packageSoldData = new Array(12).fill(0);

        monthlyData.forEach((month: any) => {
          revenueData[month.month - 1] = month.totalRevenue;
          packageSoldData[month.month - 1] = month.packageSold;
        });
      } else if (view === 'week') {
        // Weekly data
        // Ensure proper labeling for the weeks (i.e. "Week 1", "Week 2" ...)
        labels = weeklyData.map((week: any) => `Week ${week.week}`); // Using the actual week number from data
        revenueData = new Array(weeklyData.length).fill(0);
        packageSoldData = new Array(weeklyData.length).fill(0);

        // Populate data based on the filtered weekly data
        weeklyData.forEach((week: any, index: number) => {
          revenueData[index] = week.totalRevenue;
          packageSoldData[index] = week.packageSold;
        });
      } else if (view === 'day') {
        // Labels: Create 31 days for the X-axis (or for the number of days in the month)
        const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate(); // Get the number of days in the selected month
        labels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString()); // Create labels for each day

        revenueData = new Array(daysInMonth).fill(0);
        packageSoldData = new Array(daysInMonth).fill(0);

        // Populate the data for the days from the filtered daily data
        dailyData.forEach((day: any) => {
          const dayIndex = new Date(day.date).getDate() - 1; // Get the day of the month (0-indexed)
          revenueData[dayIndex] = day.totalRevenue;
          packageSoldData[dayIndex] = day.packageSold;
        });
      }

      setChartData({
        labels,
        datasets: [
          {
            label: "Revenue",
            data: revenueData,
            backgroundColor: '#3C50E0', // Bar color for revenue
            borderColor: '#3056D3', // Border color for revenue
            borderWidth: 1,
            barPercentage: 0.8,
          },
          {
            label: "Package sold",
            data: packageSoldData,
            backgroundColor: '#FF5733', // Bar color for package sold
            borderColor: '#C44029', // Border color for package sold
            borderWidth: 1,
            barPercentage: 0.8, // Adjust the width of bars
          },
        ],
      });
    }
  }, [data, view, selectedYear, selectedMonth]); // Add selectedMonth to the dependency array

  // Handle loading and error states
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data.</div>;
  }

  return (
    <div className="col-span-12 h-[720px] rounded-sm border border-stroke bg-white px-5  pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="rounded-3xl">
        <div>
          {/* Dropdown for selecting year */}
          <div className="flex justify-between mb-4">
            <div>
              {data?.revenue?.total && (
                <div>
                  <div className="text-lg font-md">Total revenue: <span className="text-green-800 font-semibold"> 
                    
                  {
  data.revenue.total.totalRevenue 
    ? new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(data.revenue.total.totalRevenue)
    : "0 VND"
}
</span></div>
                  <div className="text-lg font-md">Total package sold: <span className="text-green-800 font-semibold">{data.revenue.total.packageSold} Packages</span></div>
                </div>
              )}
            </div>
            <div>
              <div className="mb-4">
                <label className="mr-6">Year: </label>
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="border p-2 rounded"
                >
                  {/* Ensure only available years are shown */}
                  {data?.revenue?.annual.map((annual: any) => (
                    <option key={annual.year} value={annual.year}>
                      {annual.year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dropdown for selecting month */}
              <div className="mb-4">
                <label className="mr-2">Month: </label>
                <select 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="border p-2 rounded"
                >
                  {monthLabels.map((month, index) => (
                    <option key={index + 1} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          {/* Buttons to switch between day, week, and month */}
          <div className="flex justify-end space-x-4 mb-4">
            <Button onClick={() => setView('day')} className="bg-green-800 text-white px-4 rounded">Day</Button>
            <Button onClick={() => setView('week')} className="bg-green-800 text-white px-4 rounded">Week</Button>
            <Button onClick={() => setView('month')} className="bg-green-800 text-white px-4 rounded">Month</Button>
          </div>

          <div id="chartOne" className="-ml-5">
            {/* Chart.js Bar Chart */}
            {chartData && (
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    title: {
                      display: true,
                      text: view === 'day' ? `Revenue by Day (${selectedMonth}-${selectedYear})` : 
                            view === 'week' ? 'Revenue by Week' : 
                            `Monthly Revenue ${selectedYear}`,
                    },
                    tooltip: {
                      callbacks: {
                        label: function (tooltipItem: any) {
                          const label = tooltipItem.dataset.label;
                          const value = tooltipItem.raw;
                          if (label === "Revenue") {
                            return `${label}: ${new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            }).format(value)}`;
                          } else if (label === "Package sold") {
                            return `${label}: ${value} packages`;
                          }
                          return '';
                        },
                      },
                    },
                  },
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: view === 'day' ? 'Day' : view === 'week' ? 'Week' : 'Month',
                      },
                    },
                    y: {
                      title: {
                        display: true,
                        text: 'Value (VND)',
                      },
                      beginAtZero: true,
                    },
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
