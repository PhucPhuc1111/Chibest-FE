import React from 'react';
import { Form, Input, InputNumber, Select, Space } from 'antd';

const { Option } = Select;

const UpdateConfigForm: React.FC<{ form: any }> = ({ form }) => {
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
               name="name"
               label="Name"
               rules={[{ required: true, message: "Config name is required" },
                {
                  pattern: /^[a-zA-Z0-9áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ\s]*$/,
                  message: 'Config name must not contain special characters',
                }
               ]}
             >
               <Input disabled />
             </Form.Item>
             <Form.Item
               name="minValue"
               label="minValue"
               rules={[{ required: true, message: "minValue is required" }]}
             >
               <InputNumber type="number" />
             </Form.Item>
          
             <Form.Item
               name="maxValue"
               label="maxValue"
               rules={[{ required: true, message: "maxValue is required" }]}
             >
               <InputNumber type="number" />
             </Form.Item>
             <Form.Item
               name="unit"
               label="Unit"
               rules={[{ required: true, message: "unit is required" }]}
             >
               <Input disabled />
             </Form.Item>
             <Form.Item
               name="description"
               label="Description"
               rules={[{ required: true, message: "Description is required " }]}
             
             >
              <Input disabled/>
             </Form.Item>
            
           </Form>
  );
};

export default UpdateConfigForm;
