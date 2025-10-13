import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useGetAllGoal } from "@/app/data"; // Adjust the import path to your file

// Registering the components of Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartTwo: React.FC = () => {
  // Fetching goal data using the custom hook
  const { data, isLoading, error } = useGetAllGoal();

  // Ensure data is loaded and valid before rendering the chart
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !data) {
    return <div>Error loading data or data is empty.</div>;
  }

  // Prepare data for the chart
  const chartData = {
    labels: data.labels, // X-axis: Tăng cân, Giảm cân
    datasets: [
      {
        label: "Achieved",
        data: data.progressPercentages.map((percentage) => percentage), // Directly use the progress percentage for completed
        backgroundColor: "rgba(130, 202, 157, 0.6)", // Light Green for completed
        barThickness: 100, 
      },
      {
        label: "Not Achieved",
        data: data.progressPercentages.map((percentage) => 100 - percentage), // 100% - progressPercentage for not completed
        backgroundColor: "rgba(255, 115, 0, 0.6)", // Orange for not completed
        barThickness: 100, 
      },
    ],
  };

  // Options for stacked bar chart
  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Goal Achievement Status",
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        callbacks: {
          label: function (tooltipItem: any) {
            const label = tooltipItem.label; // Get the label (Tăng cân / Giảm cân)
            const dataset = tooltipItem.dataset;
            const value = dataset.data[tooltipItem.dataIndex];

            // Display the corresponding value for Achieved or Not Achieved
            if (dataset.label === "Achieved") {
              const achievedValue = data.achieved[tooltipItem.dataIndex];
              
              return `Achieved: ${achievedValue} goal`;
            } else {
              const notAchievedValue = data.notAchieved[tooltipItem.dataIndex];
           
              return `Not Achieved: ${notAchievedValue} goal`;
            }
          },
        },
      },
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Goals",
        },
        stacked: true, 
    
      },
      y: {
        title: {
          display: true,
          text: 'Percentage (%)',
        },
        stacked: true, // Stack the values for Achieved and Not Achieved on the Y-axis
        ticks: {
          beginAtZero: true,
          max: 100, // Ensure the Y-axis shows percentages (0% to 100%)
          callback: function (value: any) {
            return value + "%"; // Display percentage symbols on the Y-axis
          },
        },
      },
    },
    
  };

  return (
    <div className="col-span-12 h-[540px]  rounded-sm border border-stroke bg-white px-5 mt-6 pt-15   shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
    <div className="rounded-3xl ">
      <Bar data={chartData} options={chartOptions} />
    </div>
    </div>
  );
};

export default ChartTwo;
