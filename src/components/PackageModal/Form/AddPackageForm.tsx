import React from "react";
import { Form, Input, InputNumber } from "antd";

const AddPackageForm: React.FC<{ form: any }> = ({ form }) => {
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
        name="packageName"
        label="Package name"
        rules={[{ required: true, message: "Package name is requird" },
          {
            pattern: /^[a-zA-Z0-9áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ\s]*$/,
            message: 'Package name must not contain special characters',
          }
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="duration"
        label="Duration (ngày)"
        rules={[{ required: true, message: "Duration is required" }]}
      >
        <InputNumber type="number" />
      </Form.Item>
   
      <Form.Item
        name="price"
        label="Price (VNĐ)"
        rules={[{ required: true, message: "Price is required" }]}
      >
        <InputNumber type="number" />
      </Form.Item>
   
      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: "Desciption is required " }]}
       
      >
      <Input />
      </Form.Item>
     
    </Form>
  );
};

export default AddPackageForm;
