// import React, { useState, useEffect, useCallback } from "react";
// import { DownOutlined } from "@ant-design/icons";
// import { Button, Form, Select } from "antd";
// import { useGetAllFoods } from "@/app/data";
// import { DayMeal } from "@/app/admin/meal/create-meal/page";

// interface MealSelectionFormProps {
//   day: DayMeal;
//   editMode: boolean;
//   updateDay: (dayNumber: number, foodDetails: DayMeal["foodDetails"]) => void;
// }

// const MealSelectionForm: React.FC<MealSelectionFormProps> = ({
//   day,
//   editMode,
//   updateDay,
// }) => {
//   const { data: foodList, isLoading } = useGetAllFoods(1, 100, "");

//   const handleChange = (
//     mealType: keyof DayMeal["foodDetails"],
//     selectedFoods: number[],
//   ) => {
//     updateDay(day.dayNumber, { ...day.foodDetails, [mealType]: selectedFoods });
//   };

//   return (
//     <Form
//       name={`form_${day.dayNumber}`}
//       style={{ maxWidth: 600 }}
//       disabled={!editMode}
//     >
//       {(
//         [
//           "Breakfast",
//           "Lunch",
//           "Dinner",
//           "Snacks",
//         ] as (keyof DayMeal["foodDetails"])[]
//       ).map((mealType) => (
//         // <Form.Item key={mealType} label={`Bữa ${mealType}`}>
//         //   <Select
//         //     placeholder={`Chọn bữa ${mealType}`}
//         //     allowClear
//         //     mode="multiple"
//         //     value={day.foodDetails[mealType]}
//         //     disabled={!editMode || isLoading}
//         //     loading={isLoading}
//         //     onChange={(values) => handleChange(mealType, values as number[])}
//         //   >
//         //     {foodList?.map((food) => (
//         //       <Select.Option key={food.foodId} value={food.foodId}>
//         //         {food.foodName}
//         //       </Select.Option>
//         //     ))}
//         //   </Select>
//         // </Form.Item>
//         <Form.Item key={mealType} label={`Bữa ${mealType}`}>
//   <Select
//     placeholder={`Chọn bữa ${mealType}`}
//     allowClear
//     mode="multiple"
//     value={day.foodDetails[mealType]}
//     disabled={!editMode || isLoading}
//     loading={isLoading}
//     onChange={(values) => handleChange(mealType, values as number[])}
//     showSearch // Bật tính năng tìm kiếm
//     filterOption={(input, option) => {
//       // Đảm bảo 'option?.label' là chuỗi trước khi so sánh
//       if (option?.label) {
//         return (option.label as string).toLowerCase().includes(input.toLowerCase());
//       }
//       return false;
//     }}
//   >
//     {foodList?.map((food) => (
//       <Select.Option key={food.foodId} value={food.foodId} label={food.foodName}>
//         {food.foodName}
//       </Select.Option>
//     ))}
//   </Select>
// </Form.Item>
//       ))}
//     </Form>
//   );
// };

// interface AddMealDailyProps {
//   onChange: (days: DayMeal[]) => void;
// }

// const AddMealDaily: React.FC<AddMealDailyProps> = ({ onChange = () => {} }) => {
//   const [days, setDays] = useState<DayMeal[]>([]);
//   const [open, setOpen] = useState<number | null>(null);
//   const [editMode, setEditMode] = useState<Record<number, boolean>>({});

//   useEffect(() => {
//     onChange(days);
//   }, [days, onChange]);

//   const addDay = useCallback(() => {
//     setDays((prevDays) => [
//       ...prevDays,
//       {
//         dayNumber: prevDays.length + 1,
//         foodDetails: { Breakfast: [], Lunch: [], Dinner: [], Snacks: [] },
//         totalCalories: 0,
//       },
//     ]);
//   }, []);

//   const deleteDay = useCallback((dayNumber: number) => {
//     setDays((prevDays) =>
//       prevDays.filter((day) => day.dayNumber !== dayNumber),
//     );
//   }, []);

//   const toggleEditMode = useCallback((dayNumber: number) => {
//     setEditMode((prev) => ({ ...prev, [dayNumber]: !prev[dayNumber] }));
//   }, []);

//   const updateDay = (
//     dayNumber: number,
//     foodDetails: DayMeal["foodDetails"],
//   ) => {
//     setDays((prevDays) =>
//       prevDays.map((day) =>
//         day.dayNumber === dayNumber ? { ...day, foodDetails } : day,
//       ),
//     );
//   };

//   return (
//     <div>
//       <div className="mb-3 flex items-center justify-between">
//         <div className="text-lg font-semibold">Danh sách các ngày</div>
//         <Button className="bg-green-800 text-white" onClick={addDay}>
//           Thêm ngày
//         </Button>
//       </div>

//       {days.map((day) => (
//         <div key={day.dayNumber} className="pt-10">
//           <div
//             className="flex w-full justify-between rounded-t-xl bg-green-800 p-3 font-semibold text-white"
//             onClick={() =>
//               setOpen(open === day.dayNumber ? null : day.dayNumber)
//             }
//           >
//             <div>{`Ngày ${day.dayNumber}`}</div>
//             <div className="action-buttons flex space-x-3">
//               <DownOutlined
//                 className={`${open === day.dayNumber ? "rotate-180" : ""}`}
//               />
//               {editMode[day.dayNumber] ? (
//                 <>
//                   <Button
//                     type="primary"
//                     onClick={() => toggleEditMode(day.dayNumber)}
//                   >
//                     Lưu
//                   </Button>
//                   <Button onClick={() => toggleEditMode(day.dayNumber)}>
//                     Hủy
//                   </Button>
//                 </>
//               ) : (
//                 <Button onClick={() => toggleEditMode(day.dayNumber)}>
//                   Sửa
//                 </Button>
//               )}
//               <Button
//                 className="bg-red-600 text-white"
//                 onClick={() => deleteDay(day.dayNumber)}
//               >
//                 Xóa
//               </Button>
//             </div>
//           </div>

//           {open === day.dayNumber && (
//             <div className="border-2 border-green-800 p-10">
//               <MealSelectionForm
//                 day={day}
//                 editMode={!!editMode[day.dayNumber]}
//                 updateDay={updateDay}
//               />
//               <div className="bg-green-800 p-5 text-center text-lg font-semibold text-white">
//                 Tổng calo: {day.totalCalories} cal
//               </div>
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default AddMealDaily;
import React, { useState, useEffect, useCallback } from "react";
import { Button, Form, Select } from "antd";
import { useGetAllFoods } from "@/app/data";
import { DayMeal } from "@/app/admin/meal/create-meal/page";
import { DownOutlined } from "@ant-design/icons";

// MealSelectionForm cho phép lựa chọn các món ăn cho từng bữa trong ngày
interface MealSelectionFormProps {
  day: DayMeal;
  editMode: boolean;
  updateDay: (dayNumber: number, foodDetails: DayMeal["foodDetails"]) => void;
  updateTotalNutrition: (
    dayNumber: number,
    mealType: "Breakfast" | "Lunch" | "Dinner" | "Snacks",
    totalCalories: number,
    totalCarbs: number,
    totalFat: number,
    totalProtein: number
  ) => void;
}

const MealSelectionForm: React.FC<MealSelectionFormProps> = ({
  day,
  editMode,
  updateDay,
  updateTotalNutrition,
}) => {
  const { data: foodList, isLoading } = useGetAllFoods(1, 500, "");

  const calculateTotalNutrition = (foodIds: number[]) => {
    let totalCalories = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalProtein = 0;
  
    foodIds.forEach((foodId) => {
      const food = foodList?.find((item) => item.foodId === foodId);
      if (food) {
        totalCalories += food.calories;
        totalCarbs += food.carbs;
        totalFat += food.fat;
        totalProtein += food.protein;
      }
    });
    totalCalories = parseFloat(totalCalories.toFixed(1));
    totalCarbs = parseFloat(totalCarbs.toFixed(1));
    totalFat = parseFloat(totalFat.toFixed(1));
    totalProtein = parseFloat(totalProtein.toFixed(1));
    return { totalCalories, totalCarbs, totalFat, totalProtein };
  };
  

  const handleChange = (
    mealType: keyof DayMeal["foodDetails"],
    selectedFoods: number[],
  ) => {
    updateDay(day.dayNumber, { ...day.foodDetails, [mealType]: selectedFoods });
    
    const { totalCalories, totalCarbs, totalFat, totalProtein } = calculateTotalNutrition(selectedFoods);
    
    // Gọi updateTotalNutrition thay vì updateTotalCalories
    updateTotalNutrition(day.dayNumber, mealType, totalCalories, totalCarbs, totalFat, totalProtein);
  };
  

  return (
    <div>

  
    <div className="flex w-full">
      <div className="w-2/3">
        <Form
          name={`form_${day.dayNumber}`}
          style={{ maxWidth: 600 }}
          disabled={!editMode}
        >
          {(
            [
              "Breakfast",
              "Lunch",
              "Dinner",
              "Snacks",
            ] as (keyof DayMeal["foodDetails"])[]
          ).map((mealType) => (
            <Form.Item key={mealType} label={` ${mealType}`}>
              <Select
                placeholder={`Chọn bữa ${mealType}`}
                allowClear
                mode="multiple"
                value={day.foodDetails[mealType]}
                disabled={!editMode || isLoading}
                loading={isLoading}
                onChange={(values) =>
                  handleChange(mealType, values as number[])
                }
                showSearch
                filterOption={(input, option) => {
                  if (option?.label) {
                    return (option.label as string)
                      .toLowerCase()
                      .includes(input.toLowerCase());
                  }
                  return false;
                }}
              >
                {foodList?.map((food) => (
                  <Select.Option
                    key={food.foodId}
                    value={food.foodId}
                    label={food.foodName}
                  >
                    {food.foodName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          ))}
        </Form>
      </div>
      {/* <div className="w-1/3">
        <div>
          <p className="flex justify-center text-xl font-semibold">Total calories</p>
          <div className="space-y-5">
            <p>Breakfast: {day.totalByMealType?.Breakfast?.calories || 0} cal</p>
            <p>Lunch: {day.totalByMealType?.Lunch?.calories || 0} cal</p>
            <p>Dinner: {day.totalByMealType?.Dinner?.calories || 0} cal</p>
            <p>Snacks: {day.totalByMealType?.Snacks?.calories || 0} cal</p>
            
          </div>
        </div>
      </div> */}
      
    </div>
    <div className="flex justify-between ">
    <div className="border-2 rounded-lg border-green-800  mb-5 ">
    <div className="flex justify-center bg-green-800 text-white p-3 w-full text-xl font-semibold">Total Calories</div>
          <div className="space-y-5 p-5">
            <p>Breakfast: {day.totalByMealType?.Breakfast?.calories} cal</p>
            <p>Lunch: {day.totalByMealType?.Lunch?.calories} cal</p>
            <p>Dinner: {day.totalByMealType?.Dinner?.calories} cal</p>
            <p>Snacks: {day.totalByMealType?.Snacks?.calories} cal</p>
            
          </div>
        </div>
        <div className="border-2 rounded-lg border-green-800  mb-5 ">
        <div className="flex justify-center bg-green-800 text-white p-3 w-full text-xl font-semibold">Total Fat</div>
          <div className="space-y-5 p-5">
            <p>Breakfast: {day.totalByMealType?.Breakfast?.fat} g</p>
            <p>Lunch: {day.totalByMealType?.Lunch?.fat} g</p>
            <p>Dinner: {day.totalByMealType?.Dinner?.fat} g</p>
            <p>Snacks: {day.totalByMealType?.Snacks?.fat} g</p>
            
          </div>
        </div>
        <div className="border-2 rounded-lg border-green-800  mb-5 ">
          <div className="flex justify-center bg-green-800 text-white p-3 w-full text-xl font-semibold">Total Carbs</div>
          <div className="space-y-5 p-5">
            <p>Breakfast: {day.totalByMealType?.Breakfast?.carbs} g</p>
            <p>Lunch: {day.totalByMealType?.Lunch?.carbs} g</p>
            <p>Dinner: {day.totalByMealType?.Dinner?.carbs} g</p>
            <p>Snacks: {day.totalByMealType?.Snacks?.carbs} g</p>
            
          </div>
        </div>
        <div className="border-2 rounded-lg border-green-800  mb-5 ">
          <div className="flex justify-center bg-green-800 text-white p-3 w-full text-xl font-semibold">Total Protein</div>
          <div className="space-y-5 p-5">
            <p>Breakfast: {day.totalByMealType?.Breakfast?.protein} g</p>
            <p>Lunch: {day.totalByMealType?.Lunch?.protein} g</p>
            <p>Dinner: {day.totalByMealType?.Dinner?.protein} g</p>
            <p>Snacks: {day.totalByMealType?.Snacks?.protein} g</p>
            
          </div>
        </div>
    </div>  </div>
  );
};

// AddMealDaily cho phép thêm các ngày vào kế hoạch bữa ăn
interface AddMealDailyProps {
  onChange: (days: DayMeal[]) => void;
}

const AddMealDaily: React.FC<AddMealDailyProps> = ({ onChange = () => {} }) => {
  const [days, setDays] = useState<DayMeal[]>([]);
  const [open, setOpen] = useState<number | null>(null);
  const [editMode, setEditMode] = useState<Record<number, boolean>>({});
  const { data: allFoods } = useGetAllFoods(1, 500, "");

  useEffect(() => {
    onChange(days);
  }, [days, onChange]);

  const addDay = useCallback(() => {
    setDays((prevDays) => [
      ...prevDays,
      {
        dayNumber: prevDays.length + 1,
        foodDetails: { Breakfast: [], Lunch: [], Dinner: [], Snacks: [] },
        totalCalories: 0,
        totalCarbs: 0,
        totalFat: 0,
        totalProtein: 0,
        totalByMealType: {
          Breakfast: { calories: 0, carbs: 0, fat: 0, protein: 0 },
          Lunch: { calories: 0, carbs: 0, fat: 0, protein: 0 },
          Dinner: { calories: 0, carbs: 0, fat: 0, protein: 0 },
          Snacks: { calories: 0, carbs: 0, fat: 0, protein: 0 },
        },
      },
    ]);
  }, []);
  const deleteDay = useCallback((dayNumber: number) => {
    setDays((prevDays) =>
      prevDays.filter((day) => day.dayNumber !== dayNumber),
    );
  }, []);

  const toggleEditMode = useCallback((dayNumber: number) => {
    setEditMode((prev) => ({ ...prev, [dayNumber]: !prev[dayNumber] }));
  }, []);

  const updateDay = (
    dayNumber: number,
    foodDetails: DayMeal["foodDetails"],
  ) => {
    const { totalCalories, totalCarbs, totalFat, totalProtein } = calculateTotalNutrition(foodDetails);
    // Cập nhật lại foodDetails cho ngày
    setDays((prevDays) =>
      prevDays.map((day) =>
        day.dayNumber === dayNumber
          ? {
              ...day,
              foodDetails,
              totalCalories,
              totalCarbs,
              totalFat,
              totalProtein,
            }
          : day,
      ),
    );
  };

  const updateTotalNutrition  = (
    dayNumber: number,
    mealType: "Breakfast" | "Lunch" | "Dinner" | "Snacks",
  
    totalCalories: number,
    totalCarbs: number,
    totalFat: number,
    totalProtein: number
  ) => {
    setDays((prevDays) =>
      prevDays.map((day) =>
        day.dayNumber === dayNumber
          ? {
              ...day,
              totalByMealType: {
                ...(day.totalByMealType || {
                  Breakfast: { calories: 0, carbs: 0, fat: 0, protein: 0 },
                  Lunch: { calories: 0, carbs: 0, fat: 0, protein: 0 },
                  Dinner: { calories: 0, carbs: 0, fat: 0, protein: 0 },
                  Snacks: { calories: 0, carbs: 0, fat: 0, protein: 0 },
                }),
                [mealType]: {
                  ...((day.totalByMealType &&
                    day.totalByMealType[mealType]) || {
                    calories: 0,
                    carbs: 0,
                    fat: 0,
                    protein: 0,
                  }),
                  calories: parseFloat(totalCalories.toFixed(1)),
                  carbs: parseFloat(totalCarbs.toFixed(1)),
                  fat: parseFloat(totalFat.toFixed(1)),
                  protein: parseFloat(totalProtein.toFixed(1)),
                },
              },
              ...calculateTotalNutrition(day.foodDetails),
            }
          : day,
      ),
    );
  };
  const calculateTotalNutrition  = (foodDetails: DayMeal["foodDetails"]) => {
    // Tính tổng số calo cho ngày
    let totalCalories = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalProtein = 0;
    Object.entries(foodDetails).forEach(([mealType, foodIds]) => {
      foodIds.forEach((foodId) => {
        // Sử dụng danh sách allFoods để tìm thông tin món ăn
        const food = allFoods?.find((item) => item.foodId === foodId);
        if (food) {
          totalCalories += food.calories;
      totalCarbs += food.carbs;
      totalFat += food.fat;
      totalProtein += food.protein;
        }
      });
    });

    return { totalCalories, totalCarbs, totalFat, totalProtein };
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="text-lg font-semibold">Days list</div>
        <Button className="bg-green-800 text-white" onClick={addDay}>
          Add day
        </Button>
      </div>

      {days.map((day) => (
        <div key={day.dayNumber} className="pt-10">
          <div
            className="flex w-full justify-between rounded-t-xl bg-green-800 p-3 font-semibold text-white"
            onClick={() =>
              setOpen(open === day.dayNumber ? null : day.dayNumber)
            }
          >
            <div>{`Day ${day.dayNumber}`}</div>
            <div className="action-buttons flex space-x-3">
              <DownOutlined
                className={`${open === day.dayNumber ? "rotate-180" : ""}`}
              />
              {editMode[day.dayNumber] ? (
                <>
                  <Button
                    type="primary"
                    onClick={() => toggleEditMode(day.dayNumber)}
                  >
                    Save
                  </Button>
                  <Button onClick={() => toggleEditMode(day.dayNumber)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => toggleEditMode(day.dayNumber)}>
                  Edit
                </Button>
              )}
              <Button
                className="bg-red-600 text-white"
                onClick={() => deleteDay(day.dayNumber)}
              >
                Delete
              </Button>
            </div>
          </div>

          {open === day.dayNumber && (
            <div className="border-2 border-green-800 p-10">
              <MealSelectionForm
                day={day}
                editMode={!!editMode[day.dayNumber]}
                updateDay={updateDay}
                updateTotalNutrition={updateTotalNutrition}
              />
              <div className="bg-green-800 p-5 text-center text-lg font-semibold text-white">
               
              <p>Total carbs: {day.totalCarbs.toFixed(1)} g</p>
<p>Total fat: {day.totalFat.toFixed(1)} g</p>
<p>Total protein: {day.totalProtein.toFixed(1)} g</p>
<p>Total calo: {day.totalCalories} cal</p>

              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AddMealDaily;
