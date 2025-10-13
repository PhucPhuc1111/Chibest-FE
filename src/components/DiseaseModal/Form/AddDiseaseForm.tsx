import React from 'react';
import { Form, Input, Select, Space } from 'antd';
import { useGetAllIngredients, useGetAllFoods, useGetAllAllergies, useGetAllDiseases } from "@/app/data";
import { toast } from 'react-toastify';
const { Option } = Select;

const AddDiseaseForm: React.FC<{ form: any }> = ({ form }) => {
  // Fetching all ingredients
    const { data: ingredientsData, isLoading: isLoadingIngredients } = useGetAllIngredients(1, 500, '');
  
    const { data: allDiseases } = useGetAllDiseases(1, 500, "");
  
    
    const ingredientOptions = ingredientsData?.map(ingredient => ({
      label: ingredient.ingredientName,
      value: ingredient.ingredientId,
    })) || [];
    
      const onFinish = async (values: any) => {
        const isDuplicate = allDiseases?.some((disease) => disease.diseaseName === values.diseaseName);
    
        if (isDuplicate) {
          toast.error("Diseas Name đã tồn tại, vui lòng chọn tên khác!");
          return;
        }
      };
  return (
    <Form
      form={form}
      name="control-hooks"
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
    >
      <Form.Item
        name="diseaseName"
        label="Disease Name"
        rules={[
          { required: true, message: 'Diseas Name is required' },
         {
            pattern: /^[a-zA-Z0-9áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ\s]*$/,
            message: 'Diseas Name must not contain special characters',
          },]}
      
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: 'Description is required' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="ingredientIds"
        label="Ingredients to avoid"
      >
        <Select
          mode="multiple"
          placeholder="Select ingredients to avoid"
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
    </Form>
  );
};

export default AddDiseaseForm;
