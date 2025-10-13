import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Select } from "antd";
import { getAllTopFood } from "@/app/data";
// import your API function

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartThree = () => {
  const [top, setTop] = useState(10); // Default to 10 items
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Meal Plan Count",
        data: [],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Meal Log Count",
        data: [],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
      // {
      //   label: "Total Count",
      //   data: [],
      //   backgroundColor: "rgba(75, 192, 192, 0.6)",
      // },
    ],
  });

  // Fetch data when top value changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllTopFood(top);
        const data = response.data;

        setChartData({
          labels: data.map((item) => item.foodName),
          datasets: [
            {
              label: "Meal Plan Count",
              data: data.map((item) => item.mealPlanCount),
              backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
            {
              label: "Meal Log Count",
              data: data.map((item) => item.mealLogCount),
              backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
            // {
            //   label: "Total Count",
            //   data: data.map((item) => item.totalCount),
            //   backgroundColor: "rgba(75, 192, 192, 0.6)",
            // },
          ],
        });
      } catch (error) {
        console.error("Error fetching top food data:", error);
      }
    };

    fetchData();
  }, [top]);

  const handleSelectChange = (value: number) => {
    setTop(value);
  };

  return (
    <div className="col-span-12 h-[550px] rounded-sm border border-stroke bg-white px-5 mt-6 pt-3 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="rounded-3xl">
    <div className="">
      <div className="flex justify-end">
      <Select
        value={top}
        onChange={handleSelectChange}
        style={{ width: 200, marginBottom: "20px" }}
        options={[
          { value: 5, label: "Top 5" },
          { value: 10, label: "Top 10" },
          { value: 20, label: "Top 20" },
          { value: 30, label: "Top 30" },
        ]}
      />
      </div>
    
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            title: {
              display: true,
              
              text: `Top ${top} most chosen foods`,
            },
            legend: {
              position: "top",
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text:" Food Name",
              },
              stacked: true,
            },
            y: {
              title: {
                display: true,
                text: "Count",
              },
              stacked: true,
            },
          },
        }}
      />
    </div>
    </div>
    </div>
  );
};

export default ChartThree;
