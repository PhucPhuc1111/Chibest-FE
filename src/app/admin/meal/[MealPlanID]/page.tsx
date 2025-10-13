"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Button, Form, Input, Select, InputNumber, Spin, message } from "antd";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { useGetMealPlanById, MealPlanDetail } from "@/app/data";
// Removed the import of Day as it is a value
// Define the Day type interface used for meal plan details
interface Day {
  dayNumber: string;
  foodDetails: {
    Breakfast: string[];
    Lunch: string[];
    Dinner: string[];
    Snacks: string[];
  };
  totalCalories: number;
  totalByMealType: Record<
    string,
    { calories: number; carbs: number; fat: number; protein: number }
  >;
  totalFat: number;
  totalCarbs: number;
  totalProtein: number;
}
import Day from "@/components/MealPlan/UpdateMealDaily";
import { updateMealPlan } from "@/app/data";
import UpdateMealDaily from "@/components/MealPlan/UpdateMealDaily";
import { toast } from "react-toastify";

const MealPlanDetailPage = () => {
  const userRole = Cookies.get("userRole");
  const { MealPlanID } = useParams();
  const mealPlanId = MealPlanID;
  const [isEditing, setIsEditing] = useState(false);
  const [mealPlan, setMealPlan] = useState<any>(null);
  const [isDisabled, setIsDisabled] = useState(true);

  const { data, isLoading, isError } = useGetMealPlanById(Number(mealPlanId));

  useEffect(() => {
    if (data) {
      setMealPlan(data);
    }
  }, [data]);

  const handleEdit = () => {
    setIsEditing(true);
    setIsDisabled(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsDisabled(true);
  };
  const router = useRouter();
  const saveChanges = async () => {
    const updatedData = {
      mealPlanId: mealPlan?.mealPlanId, // mealPlanId phải có
      planName: mealPlan?.planName || "", // Đảm bảo planName có giá trị
      healthGoal: mealPlan?.healthGoal || "", // Đảm bảo healthGoal có giá trị
      duration: mealPlan?.duration || 0, // Nếu không có duration thì mặc định là 0
      mealPlanDetails: mealPlan?.mealPlanDetails || [], // Đảm bảo mealPlanDetails không phải null hoặc undefined
    };
    if (
      !updatedData.planName ||
      !updatedData.healthGoal ||
      updatedData.mealPlanDetails.length === 0
    ) {
      message.error("Please fill in all meal plan information.");
      return; // Dừng lại nếu thiếu thông tin quan trọng
    }

    try {
      console.log("Updated data:", updatedData);
      await updateMealPlan(updatedData);
      toast.success("Update meal plan successfully!");
      router.push("/admin/meal");
    } catch (error) {
      console.error("Error updating meal plan:", error);
      message.error("Error updating meal plan!");
    }
  };

  const transformMealPlanDetails = (
    mealPlanDetails: MealPlanDetail[],
  ): Day[] => {
    const groupedDays: Record<
      string,
      {
        Breakfast: string[];
        Lunch: string[];
        Dinner: string[];
        Snacks: string[];
        totalCalories: number;
        totalByMealType: any;
        totalFat: number;
        totalCarbs: number;
        totalProtein: number;
      }
    > = {};

    mealPlanDetails.forEach((detail) => {
      if (!groupedDays[detail.dayNumber]) {
        groupedDays[detail.dayNumber] = {
          Breakfast: [],
          Lunch: [],
          Dinner: [],
          Snacks: [],
          totalCalories: 0,
          totalByMealType: {},
          totalFat: 0,
          totalCarbs: 0,
          totalProtein: 0,
        };
      }

      const mealTypeMap: Record<
        string,
        "Breakfast" | "Lunch" | "Dinner" | "Snacks"
      > = {
        Breakfast: "Breakfast",
        Lunch: "Lunch",
        Dinner: "Dinner",
        Snacks: "Snacks",
      };

      const mealType = mealTypeMap[detail.mealType];

      if (mealType) {
        groupedDays[detail.dayNumber][mealType].push(
          detail.foodName.toString(),
        );
      }

      // Update total by meal type
      if (!groupedDays[detail.dayNumber].totalByMealType[detail.mealType]) {
        groupedDays[detail.dayNumber].totalByMealType[detail.mealType] = {
          calories: 0,
          carbs: 0,
          fat: 0,
          protein: 0,
        };
      }

      groupedDays[detail.dayNumber].totalByMealType[detail.mealType].calories +=
        detail.totalCalories;
      groupedDays[detail.dayNumber].totalByMealType[detail.mealType].carbs +=
        detail.totalCarbs;
      groupedDays[detail.dayNumber].totalByMealType[detail.mealType].fat +=
        detail.totalFat;
      groupedDays[detail.dayNumber].totalByMealType[detail.mealType].protein +=
        detail.totalProtein;

      // Update total calories and nutrients for the day
      groupedDays[detail.dayNumber].totalCalories += detail.totalCalories;
      groupedDays[detail.dayNumber].totalFat += detail.totalFat;
      groupedDays[detail.dayNumber].totalCarbs += detail.totalCarbs;
      groupedDays[detail.dayNumber].totalProtein += detail.totalProtein;
    });

    return Object.entries(groupedDays).map(
      ([
        dayNumber,
        {
          totalCalories,
          totalByMealType,
          totalFat,
          totalCarbs,
          totalProtein,
          ...foodDetails
        },
      ]) => ({
        dayNumber,
        foodDetails,
        totalCalories,
        totalByMealType,
        totalFat,
        totalCarbs,
        totalProtein,
      }),
    );
  };

  if (isLoading) {
    return (
      <DefaultLayout>
        <div className="flex h-screen items-center justify-center">
          <Spin size="large" />
        </div>
      </DefaultLayout>
    );
  }

  if (isError || !mealPlan) {
    return (
      <DefaultLayout>
        <p className="text-center text-red-500">do not have any meal plans</p>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="flex justify-between">
        <Link href="/admin/meal">
          <div className="cursor-pointer p-3">Back</div>
        </Link>
        <div className="flex space-x-4">
          {isEditing
            ? // Conditionally render the buttons based on the user role
              userRole !== "Admin" && (
                <>
                  <Button className="h-10 p-3" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button
                    className="h-10 p-3"
                    type="primary"
                    onClick={saveChanges}
                  >
                    Save meal plan
                  </Button>
                </>
              )
            : // Hide "Edit meal plan" button for Admin
              userRole !== "Admin" && (
                <Button className="h-10 p-3" onClick={handleEdit}>
                  Edit meal plan
                </Button>
              )}
        </div>
      </div>

      <div className="w-full rounded-lg border-2 border-green-800">
        <div className="px-10 py-5 text-lg font-bold">Meal plan detail</div>
        <div className="px-10">
          <Form name="mealPlanForm">
            <Form.Item name="planName" label="Meal plan name">
              <Input
                defaultValue={mealPlan.planName} // Use value to bind to the state
                onChange={(e) =>
                  setMealPlan({ ...mealPlan, planName: e.target.value })
                } // Update the state when the input changes
                disabled={isDisabled}
              />
            </Form.Item>

            <Form.Item name="healthGoal" label="Health goal">
              <Select
                defaultValue={mealPlan.healthGoal} // Bind to healthGoal state
                onChange={(value) =>
                  setMealPlan({ ...mealPlan, healthGoal: value })
                }
                disabled={isDisabled}
              >
                <Select.Option value="Tăng cân">Tăng cân</Select.Option>
                <Select.Option value="Giảm cân">Giảm cân</Select.Option>
                <Select.Option value="Duy trì cân nặng">
                  Duy trì cân nặng
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="duration" label="Duration (days)">
              <InputNumber
                defaultValue={mealPlan.duration} // Bind to duration state
                onChange={(value) =>
                  setMealPlan({ ...mealPlan, duration: value })
                }
                disabled={isDisabled}
              />
            </Form.Item>

            <Form.Item name="createdBy" label="Created by">
              <Input defaultValue={mealPlan.createdBy} disabled />
            </Form.Item>

            <Form.Item name="createdAt" label="Created At">
              <Input defaultValue={mealPlan.createdAt} disabled />
            </Form.Item>
          </Form>
        </div>

        <div className="space-y-5 p-10">
          <UpdateMealDaily
            mealPlanDetails={
              transformMealPlanDetails(mealPlan.mealPlanDetails) as Day[]
            }
            mealPlanId={Number(mealPlanId)}
            planName={mealPlan.planName}
            healthGoal={mealPlan.healthGoal}
            duration={mealPlan.duration}
            createdBy={mealPlan.createdBy}
            createdAt={mealPlan.createdAt}
            isDisabled={isDisabled}
            saveChanges={saveChanges}
          />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default MealPlanDetailPage;
