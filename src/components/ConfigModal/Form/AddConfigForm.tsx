import React from "react";
import { Form, Input, InputNumber } from "antd";

const AddConfigForm: React.FC<{ form: any }> = ({ form }) => {
  const onFinish = (values: any) => {
    console.log("Received values:", values); // Xử lý khi form submit
  };

  return (
    <Form
      form={form}
      name="control-hooks"
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
    >
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: "name is requird" },
          {
            pattern: /^[a-zA-Z0-9áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ\s]*$/,
            message: 'Package name must not contain special characters',
          }
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="minValue"
        label="Min Value"
        rules={[{ required: true, message: "minValue is required" }]}
      >
        <InputNumber type="number" />
      </Form.Item>
   
      <Form.Item
        name="maxValue"
        label="Max Value"
        rules={[{ required: true, message: "maxValue is required" }]}
      >
        <InputNumber type="number" />
      </Form.Item>
   
      <Form.Item
        name="unit"
        label="Unit"
        rules={[{ required: true, message: "Unit is required " }]}
       
      >
      <Input />
      </Form.Item>
      <Form.Item
        name="description"
        label="description"
        rules={[{ required: true, message: "description is required " }]}
       
      >
      <Input />
      </Form.Item>
     
    </Form>
  );
};

export default AddConfigForm;
