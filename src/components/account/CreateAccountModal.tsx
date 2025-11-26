import { Modal, Form, Input, Select, message } from 'antd';
import { useState, useEffect } from 'react';
import { createAccount, CreateAccountPayload, getRoles, RoleItem } from '@/api/accountApi';

interface CreateAccountModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const statusOptions = [
  { label: 'Hoạt động', value: 'Active' },
  { label: 'Ngưng hoạt động', value: 'Inactive' },
];

const CreateAccountModal: React.FC<CreateAccountModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm<CreateAccountPayload>();
  const [loading, setLoading] = useState(false);
  const [roleOptions, setRoleOptions] = useState<RoleItem[]>([]);
  const [roleLoading, setRoleLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      const fetchRoles = async () => {
        try {
          setRoleLoading(true);
          const roles = await getRoles();
          setRoleOptions(roles);
        } catch (error) {
          console.error('Failed to fetch roles:', error);
          message.error('Không thể tải danh sách vai trò.');
          setRoleOptions([]);
        } finally {
          setRoleLoading(false);
        }
      };

      fetchRoles();
    } else {
      form.resetFields();
    }
  }, [visible, form]);

  const handleSubmit = async (values: CreateAccountPayload) => {
    try {
      setLoading(true);
      await createAccount(values);
      message.success('Tạo tài khoản thành công');
      onSuccess();
      onClose();
      form.resetFields();
    } catch (error) {
      console.error('Failed to create account:', error);
      message.error('Không thể tạo tài khoản. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Tạo tài khoản"
      open={visible}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      maskClosable={false}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          status: 'Active',
        }}
      >
        <Form.Item
          label="Mã tài khoản"
          name="code"
          rules={[{ required: true, message: 'Vui lòng nhập mã tài khoản' }]}
        >
          <Input placeholder="Nhập mã tài khoản" />
        </Form.Item>

        <Form.Item
          label="Tên"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
        >
          <Input placeholder="Nhập tên" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>

        <Form.Item label="Số điện thoại" name="phone-number">
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>
        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
        >
          <Select options={statusOptions} placeholder="Chọn trạng thái" />
        </Form.Item>

        <Form.Item
          label="Vai trò"
          name="role-id"
          rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
        >
          <Select
            placeholder="Chọn vai trò"
            options={roleOptions.map((role) => ({
              label: role.name,
              value: role.id,
            }))}
            loading={roleLoading}
            notFoundContent={roleLoading ? 'Đang tải...' : 'Không có dữ liệu'}
          />
        </Form.Item>

        <Form.Item className="mb-0 flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? 'Đang tạo...' : 'Tạo tài khoản'}
          </button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateAccountModal;

