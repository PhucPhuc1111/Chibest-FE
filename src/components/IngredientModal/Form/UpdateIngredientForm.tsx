import React from 'react';
import { Form, Input, InputNumber, Select, Space } from 'antd';

const { Option } = Select;

const UpdateIngredientForm: React.FC<{ form: any }> = ({ form }) => {
  const onFinish = (values: any) => {
    console.log('Received values:', values); // Xử lý khi form submit
  };

  return (
       <Form
          form={form}
          name="control-hooks"
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            name="ingredientName"
            label="Ingredient name"
            rules={[{ required: true, message: "Ingredient name is required" },
              {
                pattern: /^[a-zA-Z0-9áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ\s]*$/,
                message: 'Ingredient name must not contain special characters',
              }
            ]}
          >
            <Input />
          </Form.Item>
    
          <Form.Item
            name="calories"
            label="Calories"
            rules={[{ required: true, message: "Calories is required" }]}
          >
            <InputNumber type="number" />
          </Form.Item>
          <Form.Item
            name="carbs"
            label="Carbs"
            rules={[{ required: true, message: "Carbs is required" }]}
          >
            <InputNumber type="number" />
          </Form.Item>
          <Form.Item
            name="fat"
            label="Fat"
            rules={[{ required: true, message: "Fat is required" }]}
          >
            <InputNumber type="number" />
          </Form.Item>
          <Form.Item
            name="protein"
            label="Protein"
            rules={[{ required: true, message: "Protein is required" }]}
          >
            <InputNumber type="number" />
          </Form.Item>
        </Form>
  );
};

export default UpdateIngredientForm;
