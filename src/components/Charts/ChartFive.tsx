import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { getAllDietStyle } from "@/app/data"; // Điều chỉnh đường dẫn nếu khác

ChartJS.register(ArcElement, Tooltip, Legend);

const ChartFive: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllDietStyle();
        const data = response.data as unknown as { dietStyle: string; percentage: number; count: number; }[]; // Dữ liệu trả về từ API

        // const filteredData = data.filter((item) => item.percentage > 0);

        const labels = data.map((item) => item.dietStyle);
        const percentages = data.map((item) => item.percentage);
        const counts = data.map((item) => item.count); // Lấy giá trị count

        setChartData({
          labels,
          datasets: [
            {
              label: "Percentage (%)",
              data: percentages,
              backgroundColor: [
                "#FF9F40",
                "#4BC0C0",
                "#9966FF",
                "#FF6384",
                "#36A2EB"
              ],
              borderWidth: 1,
              count: counts, // Lưu giá trị count vào dataset
            }
          ]
        });
      } catch (error) {
        console.error("Lỗi khi gọi getAllDietStyle:", error);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const datasetIndex = context.datasetIndex;
            const index = context.dataIndex;
            // Kiểm tra nếu dataset và count không phải undefined
            const count = context.dataset.count ? context.dataset.count[index] : 0;
            const label = context.label || '';
            return `${label}: ${context.raw}% (Count: ${count})`; // Hiển thị count cùng với percentage
          },
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", maxWidth: "500px", margin: 10, padding: 10 }}>
      <h3 className="text-lg font-semibold text-center mb-4 mt-7">
        Diet Style Distribution Chart
      </h3>
      {chartData ? <Pie data={chartData} options={options} /> : <p>Đang tải biểu đồ...</p>}
    </div>
  );
};

export default ChartFive;
