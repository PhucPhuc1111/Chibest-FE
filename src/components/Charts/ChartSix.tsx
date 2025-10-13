import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { DatePicker } from "antd"; // Import DatePicker từ Ant Design
import { getAllNutrition } from "@/app/data"; // Đảm bảo đường dẫn đúng đến hàm getAllNutrition
import dayjs from "dayjs"; // Sử dụng dayjs thay vì moment.js
 // Đảm bảo import CSS của Ant Design

ChartJS.register(ArcElement, Tooltip, Legend);

const ChartSix: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>(dayjs().format("YYYY-MM-DD")); // Ngày mặc định

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
          const { carbsPercentage, proteinPercentage, fatPercentage } = nutritionData;

          // Cập nhật dữ liệu cho Pie Chart
          setChartData({
            labels: ["Carbs", "Protein", "Fat"],
            datasets: [
              {
                label: "Nutrition Distribution (%)",
                data: [carbsPercentage, proteinPercentage, fatPercentage],
                backgroundColor: [
                 "#FFCE56",
                "#4BC0C0",
                "#9966FF"
                ],
                borderWidth: 1,
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
    <div style={{ width: "100%", maxWidth: "500px", margin: 10, padding: 30 }}>
      <h3 className="text-lg font-semibold text-center mb-4 mt-7">
        Nutrition Distribution on {selectedDate}
      </h3>

      {/* Ant Design DatePicker để chọn ngày */}
      <div className="mb-4 text-center">
        <DatePicker
          value={selectedDate ? dayjs(selectedDate, "YYYY-MM-DD") : null} // Chuyển selectedDate thành dayjs object
          onChange={handleDateChange}
          format="YYYY-MM-DD" // Định dạng ngày theo chuẩn YYYY-MM-DD
          disabledDate={(current) => current && current > dayjs()} // Không cho phép chọn ngày trong tương lai
        />
      </div>

      {/* Pie Chart */}
      {loading ? (
        <p>Đang tải biểu đồ...</p>
      ) : (
        chartData && <Pie data={chartData}  />
      )}
    </div>
  );
};

export default ChartSix;
