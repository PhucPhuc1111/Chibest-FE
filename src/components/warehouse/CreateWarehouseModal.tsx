import { Modal, Form, Input, Select, Switch, message } from 'antd';
import { useState, useEffect } from 'react';
import { WarehouseFormData, Branch } from '@/types/warehouse';
import { createWarehouse, getBranches, updateWarehouse } from '@/api/warehouseApi';

interface CreateWarehouseModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: WarehouseFormData;
  mode?: 'create' | 'update';
}

const CreateWarehouseModal: React.FC<CreateWarehouseModalProps> = ({
  visible,
  onClose,
  onSuccess,
  initialData,
  mode = 'create',
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await getBranches();
        setBranches(response.data);
      } catch (error) {
        console.error('Error fetching branches:', error);
        message.error('Không thể tải danh sách chi nhánh');
      }
    };

    if (visible) {
      fetchBranches();
    }
  }, [visible]);

  useEffect(() => {
    if (visible && initialData) {
      form.setFieldsValue({
        name: initialData.name,
        code: initialData.code,
        address: initialData.address,
        'phone-number': initialData['phone-number'],
        'branch-id': initialData['branch-id'],
        'is-main-warehouse': initialData['is-main-warehouse'],
        status: initialData.status,
      });
    }
  }, [visible, initialData, form]);

  const handleSubmit = async (values: WarehouseFormData) => {
    try {
      setLoading(true);
      if (mode === 'update' && initialData) {
        await updateWarehouse(initialData.id, values);
        message.success('Cập nhật kho thành công');
      } else {
        await createWarehouse(values);
        message.success('Tạo kho thành công');
      }
      form.resetFields();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      message.error(
        mode === 'update' ? 'Có lỗi xảy ra khi cập nhật kho' : 'Mã kho đã tồn tại'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={mode === 'update' ? 'Cập nhật kho' : 'Tạo kho mới'}
      open={visible}
      onCancel={onClose}
      footer={null}
      maskClosable={false}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          status: 'Hoạt động',
          'is-main-warehouse': false,
        }}
      >
        <Form.Item
          label="Tên kho"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên kho' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mã kho"
          name="code"
          rules={[{ required: true, message: 'Vui lòng nhập mã kho' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Chi nhánh"
          name="branch-id"
          rules={[{ required: true, message: 'Vui lòng chọn chi nhánh' }]}
        >
          <Select placeholder="Chọn chi nhánh">
            {branches.map((branch) => (
              <Select.Option key={branch.id} value={branch.id}>
                {branch.name}
              </Select.Option>
            ))}
          </Select>
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
            { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Kho chính"
          name="is-main-warehouse"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
        >
          <Select>
            <Select.Option value="Hoạt động">Hoạt động</Select.Option>
            <Select.Option value="Ngưng hoạt động">Ngưng hoạt động</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Đang tạo...' : mode === 'update' ? 'Cập nhật' : 'Tạo kho'}
          </button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateWarehouseModal;