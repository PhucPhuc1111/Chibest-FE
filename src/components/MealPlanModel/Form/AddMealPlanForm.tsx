import React from 'react';
import { Form, Input, Select, Space } from 'antd';

const { Option } = Select;

const AddMealPlanForm: React.FC<{ form: any }> = ({ form }) => {
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
      <Form.Item name="Tên nguyên liệu" label="Tên nguyên liệu" rules={[{ required: true, message: 'Tên nguyên liệu là bắt buộc' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="Loại" label="Loại" rules={[{ required: true, message: 'Loại là bắt buộc' }]}>
        <Select placeholder="Chọn loại" allowClear>
          <Option value="Thịt">Thịt</Option>
          <Option value="Rau">Rau</Option>
          <Option value="Củ">Củ</Option>
          <Option value="Quả">Quả</Option>
          <Option value="Quả">Gia vị</Option>
          <Option value="Khác">Khác</Option>
        </Select>
      </Form.Item>
      <Form.Item name="Đơn vị" label="Đơn vị" rules={[{ required: true, message: 'Đơn vị là bắt buộc' }]}>
      {/* <Space>
<Input />
        <Select placeholder="Chọn đơn vị" allowClear>
          <Option value="gram">gram</Option>
          <Option value="chén">chén</Option>
          <Option value="quả">quả</Option>
          <Option value="củ">củ</Option>
        </Select>
      </Space> */}
      <Input />
      </Form.Item>
      <Form.Item name="Carlories" label="Carlories" rules={[{ required: true, message: 'Carlories là bắt buộc' }]}>
        <Input />
      </Form.Item>
      
    </Form>
  );
};

export default AddMealPlanForm;
