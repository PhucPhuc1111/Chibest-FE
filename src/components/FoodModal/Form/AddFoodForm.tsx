import React, { useState } from "react";
import { Form, Input, Select } from "antd";
import { useGetAllIngredients, useGetAllFoods } from "@/app/data";
import { toast } from "react-toastify";
import ImageUpload from "./imageUpload";

const { Option } = Select;

const AddFoodForm: React.FC<{ form: any }> = ({ form }) => {

  // Fetching all ingredients
  const { data: ingredientsData, isLoading: isLoadingIngredients } = useGetAllIngredients(1, 500, '');

  // Map the ingredients data to match the required format for the Select options
  const ingredientOptions = ingredientsData?.map(ingredient => ({
    label: ingredient.ingredientName,
    value: ingredient.ingredientId,
  })) || [];

  const { data: allFoods } = useGetAllFoods(1, 100, "");

  const onFinish = async (values: any) => {
    const isDuplicate = allFoods?.some((food) => food.foodName === values.foodName);

    if (isDuplicate) {
      console.error("Food name đã tồn tại, vui lòng chọn tên khác!");
      return;
    }
  };

  return (
    <Form form={form} name="add-food-form" onFinish={onFinish}>
      <div className="flex space-x-2">
        <div className="w-2/3">
          <Form.Item
            name="foodName"
            label="Food name"
            rules={[{ required: true, message: "Food name is required" },
              {
                pattern: /^[a-zA-Z0-9áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ\s]*$/,
                message: 'Food name must not contain special characters',
              }
            ]}
          >
            <Input />
          </Form.Item>

          <div className="flex justify-between space-x-4">
            <Form.Item
              name="mealType"
              label="Select meal type"
              rules={[{ required: true, message: "Meal type is required" }]}
              style={{ width: '50%' }}
            >
              <Select placeholder="Select meal type" allowClear>
                <Option value="Breakfast">Sáng</Option>
                <Option value="Lunch">Trưa</Option>
                <Option value="Dinner">Tối</Option>
                <Option value="Snack">Phụ</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="foodType"
              label="Select food type"
              style={{ width: '50%' }}
              rules={[{ required: true, message: "Food type is required" }]}
            >
              <Select placeholder="Select food type" allowClear>
                <Option value="Vegetable">Rau củ quả</Option>
                <Option value="Fruit">Trái cây</Option>
                <Option value="Broth">Món nước</Option>
                <Option value="Noodle">Món mì</Option>
                <Option value="Bread">Bánh mì</Option>
                <Option value="Meat">Thịt</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="servingSize"
            label="Serving size"
            rules={[{ required: true, message: "Serving size is required" }]}
          >
            <Input />
          </Form.Item>

          <div className="flex justify-between space-x-4">
            <Form.Item
              name="calories"
              label="Calories (cal)"
              rules={[{ required: true, message: "Calories is required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="protein"
              label="Protein (g)"
              rules={[{ required: true, message: "Protein is required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="carbs"
              label="Carbs (g)"
              rules={[{ required: true, message: "Carbs is required" }]}
            >
              <Input />
            </Form.Item>
          </div>

          <div className="flex justify-between space-x-4">
            <Form.Item
              name="fat"
              label="Fat (g)"
              rules={[{ required: true, message: "Fat is required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="glucid"
              label="Glucid (g)"
              rules={[{ required: true, message: "Glucid is required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="fiber"
              label="Fiber(g)"
              rules={[{ required: true, message: "fiber is required" }]}
            >
              <Input />
            </Form.Item>
          </div>
        </div>

        <div className="w-1/3">
          <Form.Item
            name="imgUrl"
            label="Image"
          >
            <ImageUpload />
          </Form.Item>
        </div>
      </div>

      {/* Ingredients Field with Search */}
      <Form.Item
        name="ingredients"
        label="Ingredients"
      >
        <Select
          mode="multiple"
          placeholder="Select ingredients"
          options={ingredientOptions}
          loading={isLoadingIngredients}
          allowClear
          showSearch
          filterOption={(input, option) => {
            if (option && option.label) {
   
              return (option.label as string).toLowerCase().includes(input.toLowerCase());
            }
            return false;
          }}
        />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: "Description is required" }]}
      >
        <Input.TextArea />
      </Form.Item>

      {/* <Form.Item
        name="other"
        label="Khác"
      >
        <Input.TextArea />
      </Form.Item> */}
    </Form>
  );
};

export default AddFoodForm;
