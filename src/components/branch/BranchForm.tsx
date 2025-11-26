import { Form, Input, Select, Switch, Button } from 'antd';
import { BranchFormData } from '@/types/branch';

interface BranchFormProps {
  initialValues?: Partial<BranchFormData>;
  onSubmit: (values: BranchFormData) => void;
  isLoading?: boolean;
  mode: 'create' | 'edit';
}

const BranchForm: React.FC<BranchFormProps> = ({
  initialValues,
  onSubmit,
  isLoading,
  mode
}) => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onSubmit}
    >
      <Form.Item
        label="Tên chi nhánh"
        name="name"
        rules={[{ required: true, message: 'Vui lòng nhập tên chi nhánh' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Mã chi nhánh"
        name="code"
        rules={[{ required: true, message: 'Vui lòng nhập mã chi nhánh' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Địa chỉ"
        name="address"
        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Số điện thoại"
        name="phone-number"
        rules={[
          { required: true, message: 'Vui lòng nhập số điện thoại' },
          { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
        ]}
      >
        <Input />
      </Form.Item>


      <Form.Item
        label="Loại chi nhánh"
        name="is-franchise"
        valuePropName="checked"
      >
        <Switch 
          checkedChildren="Nhượng quyền" 
          unCheckedChildren="Trực thuộc"
        />
      </Form.Item>

      <Form.Item
        label="Trạng thái"
        name="status"
        rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
      >
        <Select>
          <Select.Option value="Active">Hoạt động</Select.Option>
          <Select.Option value="Inactive">Ngưng hoạt động</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {mode === 'create' ? 'Tạo chi nhánh' : 'Cập nhật'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BranchForm;