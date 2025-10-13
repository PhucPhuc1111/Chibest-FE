import React from 'react';
import { Form, Input, Select, Space } from 'antd';
import { useGetAllIngredients, useGetAllFoods, useGetAllAllergies } from "@/app/data";
import { toast } from 'react-toastify';
const { Option } = Select;

const AddAllergyForm: React.FC<{ form: any }> = ({ form }) => {
  // Fetching all ingredients
    const { data: ingredientsData, isLoading: isLoadingIngredients } = useGetAllIngredients(1, 500, '');
  
    const { data: allAllergies } = useGetAllAllergies(1, 500, "");
  
    
    const ingredientOptions = ingredientsData?.map(ingredient => ({
      label: ingredient.ingredientName,
      value: ingredient.ingredientId,
    })) || [];
    
      const onFinish = async (values: any) => {
        const isDuplicate = allAllergies?.some((allergy) => allergy.allergyName === values.allergyName);
    
        if (isDuplicate) {
          toast.error("Allergy name đã tồn tại, vui lòng chọn tên khác!");
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
        name="allergyName"
        label="Allergy name"
        rules={[{ required: true, message: 'Allergy name is required' },
          {
            pattern: /^[a-zA-Z0-9áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ\s]*$/,
            message: 'Allergy name must not contain special characters',
          }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="notes"
        label="Note"
        rules={[{ required: true, message: 'Note is requied' }]}
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

export default AddAllergyForm;
