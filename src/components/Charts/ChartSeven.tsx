import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2"; // Thay đổi từ Pie sang Bar
import { Chart as ChartJS, BarElement, CategoryScale, Tooltip, Legend } from "chart.js"; // Import thêm BarElement và CategoryScale cho Bar Chart
import { DatePicker } from "antd"; // Import DatePicker từ Ant Design
import { getAllNutrition } from "@/app/data"; // Đảm bảo đường dẫn đúng đến hàm getAllNutrition
import dayjs from "dayjs"; // Sử dụng dayjs thay vì moment.js

ChartJS.register(BarElement, CategoryScale, Tooltip, Legend); // Đăng ký các element cần thiết cho Bar Chart

const ChartSeven: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>(dayjs().format("YYYY-MM-DD")); // Ngày mặc định là hôm nay

  // Hàm xử lý sự kiện khi chọn ngày từ DatePicker
  const handleDateChange = (date: any) => {
    if (date) {
      const formattedDate = date.format("YYYY-MM-DD"); // Chuyển đổi ngày thành định dạng YYYY-MM-DD
      setSelectedDate(formattedDate); // Cập nhật ngày đã chọn
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Bắt đầu loading
      try {
        // Gọi hàm getAllNutrition để lấy dữ liệu dinh dưỡng cho ngày đã chọn
        const nutritionData = await getAllNutrition(selectedDate);

        // Kiểm tra xem có dữ liệu trả về không
        if (nutritionData) {
          const {  totalCarbs, totalFat, totalProtein } = nutritionData;

          // Cập nhật dữ liệu cho Bar Chart
          setChartData({
            labels: ["Carbs",  "Fat","Protein"], // Label cho các cột
            datasets: [
              {
                label: "Nutrition Distribution (g)", // Tiêu đề cho Bar Chart
                data: [ totalCarbs, totalFat, totalProtein ], // Dữ liệu phần trăm
                backgroundColor: [
             
                 "#FFCE56",
                "#4BC0C0",
                "#9966FF" // Fat
                ], // Màu sắc cho từng cột
                borderWidth: 1, // Độ dày của viền cột
              },
            ],
          });
        } else {
          console.error("Không có dữ liệu dinh dưỡng");
        }
      } catch (error) {
        console.error("Lỗi khi gọi getAllNutrition:", error);
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };

    fetchData();
  }, [selectedDate]); // Chạy lại mỗi khi ngày thay đổi

  return (
    <div style={{ width: "100%", maxWidth: "500px", margin: 10, padding: 10 }}>
      <h3 className="text-lg font-semibold text-center mb-4 mt-7">
        Nutrition Distribution on {selectedDate}
      </h3>

      {/* Ant Design DatePicker để chọn ngày */}
      <div className="mb-4 text-center">
        <DatePicker
          value={dayjs(selectedDate, "YYYY-MM-DD")} // Hiển thị ngày đã chọn
          onChange={handleDateChange}
          format="YYYY-MM-DD" // Định dạng ngày theo chuẩn YYYY-MM-DD
          disabledDate={(current) => current && current > dayjs()} // Không cho phép chọn ngày trong tương lai
        />
      </div>

      {/* Bar Chart */}
      {loading ? (
        <p>Đang tải biểu đồ...</p>
      ) : (
        chartData && (
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function (tooltipItem) {
                      return `${tooltipItem.label}: ${tooltipItem.raw}g`; // Hiển thị tên và tỷ lệ phần trăm trong tooltip
                    },
                  },
                },
                legend: {
                  position: "top", // Đặt vị trí của legend (tên label)
                  display: true,
                },
              },
              scales: {
                y: {
                  beginAtZero: true, // Đảm bảo trục y bắt đầu từ 0
                },
              },
            }}
          />
        )
      )}
    </div>
  );
};

export default ChartSeven;
