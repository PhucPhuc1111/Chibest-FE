"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AddMealDaily from "@/components/MealPlan/AddMealDaily";
import { Button, Form, Input, Select, message } from "antd";
import Link from "next/link";
import React, { useState } from "react";
import { createMealPlan } from "@/app/data";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
// Interface dùng cho chi tiết bữa ăn khi gửi lên API
interface MealDetail {
  foodId: number;
  quantity: number;
  mealType: string;
  dayNumber: number;
}

// Sử dụng kiểu dữ liệu chung DayMeal
export interface DayMeal {
  dayNumber: number;
  foodDetails: {
    Breakfast: number[];
    Lunch: number[];
    Dinner: number[];
    Snacks: number[];
  };
  totalCalories: number;
  totalCarbs: number;
  totalFat: number;
  totalProtein: number;
  totalByMealType?: {
    Breakfast: {
      calories: number;
      carbs: number;
      fat: number;
      protein: number;
    };
    Lunch: { calories: number; carbs: number; fat: number; protein: number };
    Dinner: { calories: number; carbs: number; fat: number; protein: number };
    Snacks: { calories: number; carbs: number; fat: number; protein: number };
  };
}

interface FormValues {
  planName: string;
  healthGoal: string;
}

const CreateMealPlanPage: React.FC = () => {
  const router = useRouter();
  const [form] = Form.useForm<FormValues>();
  const [mealPlanDetails, setMealPlanDetails] = useState<DayMeal[]>([]);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: FormValues) => {
    const formattedMealPlanDetails: MealDetail[] = mealPlanDetails.flatMap(
      (day) =>
        Object.entries(day.foodDetails).flatMap(([mealType, foodIds]) =>
          foodIds.map((foodId) => ({
            foodId,
            quantity: 1,
            mealType,
            dayNumber: day.dayNumber,
          })),
        ),
    );

    const requestData = {
      planName: values.planName,
      healthGoal: values.healthGoal,
      mealPlanDetails: formattedMealPlanDetails,
    };

    console.log("Sending data:", requestData);

    setLoading(true);
    try {
      await createMealPlan(requestData);
      toast.success("Tạo thực đơn thành công");
      router.push("/admin/meal");
    } catch (error: unknown) {
      console.error("Error:", error);
      if (error instanceof Error) {
        message.error(error.message || "Có lỗi xảy ra");
      } else {
        message.error("Lỗi không xác định!");
      }
    } finally {
      setLoading(false);
    }
  };
  const userRole = Cookies.get("userRole");
  return (
    <DefaultLayout>
      <div className="flex justify-between">
        <Link href="/admin/meal">
          <div className="cursor-pointer p-3">Back</div>
        </Link>
        <div className="flex space-x-4">
          <Link href="/admin/meal">
            <Button className="h-10 w-20 p-3">Cancel</Button>
          </Link>

          <Button
            className="h-10 w-20 bg-green-800 p-3 text-white"
            form="mealPlanForm"
            htmlType="submit"
            loading={loading}
          >
            Add
          </Button>
        </div>
      </div>

      <div className="w-full rounded-lg border-2 border-green-800">
        <div className="px-10 py-5 text-lg font-bold">Meal plan detail</div>
        <div className="px-10">
          <Form
            form={form}
            name="mealPlanForm"
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              name="planName"
              label="Meal plan name"
              rules={[
                { required: true, message: "Meal plan name is required" },
                {
                  pattern:
                    /^[a-zA-Z0-9áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ\s]*$/,
                  message: "Meal plan name must not contain special characters",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="healthGoal"
              label="Health Goal"
              rules={[{ required: true, message: "Heal goal is required" }]}
            >
              <Select placeholder="Choose Health Goal" allowClear>
                <Select.Option value="Tăng cân">Tăng cân</Select.Option>
                <Select.Option value="Giảm cân">Giảm cân</Select.Option>
                <Select.Option value="Duy trì cân nặng">
                  Duy trì cân nặng
                </Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </div>
        <div className="space-y-5 p-10">
          <AddMealDaily onChange={setMealPlanDetails} />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CreateMealPlanPage;
