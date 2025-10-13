import { Button, Modal, Form } from 'antd';
import { useState, useEffect } from 'react';
import UpdateIngredientForm from './Form/UpdateConfigForm';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getPackageById, updatePackage, useGetAllPackages } from '@/app/data/package';
import { getSystemConfigurationById, Package, updateSystemConfiguration, useGetAllSystemConfigurations } from '@/app/data';
import UpdatePackageForm from './Form/UpdateConfigForm';
import UpdateConfigForm from './Form/UpdateConfigForm';

const UpdateConfigModal: React.FC<{ configId: number; refetch: () => void }> = ({ configId, refetch }) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const [currentPackage, setCurrentPackage] =  useState<any>(null);

  const showModal = () => {
    setOpen(true);
  };

  const { data: allPackagesData } = useGetAllSystemConfigurations(1, 500, "");

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      setConfirmLoading(true);

      try {
        const allPackages = allPackagesData || [];
        
        const isDuplicate = 
          values.name.toLowerCase() !== currentPackage?.name.toLowerCase() &&
          allPackages.some(
            (configName: any) => 
              configName.name.toLowerCase() === values.name.toLowerCase() &&
            configName.id !== configId
          );

        if (isDuplicate) {
          form.setFields([
            {
              name: 'name',
              errors: ['Tên gói đã tồn tại'],
            },
          ]);
          console.error('Tên gói đã tồn tại!', { position: 'top-right' });
          setConfirmLoading(false);
          return;
        }

        await updateSystemConfiguration(configId, values,);
        refetch();
        setOpen(false);
        setConfirmLoading(false);
        form.resetFields();
        toast.success('Update system configuration successfully !', { position: 'top-right' });
      } catch (error) {
        const err = error as any;
        const errorMessage = err?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!";
      toast.error(errorMessage);
        setConfirmLoading(false);
      }
    }).catch((errorInfo) => {
      console.log('Validate Failed:', errorInfo);
      setConfirmLoading(false);
    });
  };

  const handleCancel = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      const fetchPackageData = async () => {
        try {
          const response = await getSystemConfigurationById(configId);
          setCurrentPackage(response.data);
          form.setFieldsValue({
            name: response.data?.name,
            minValue: response.data?.minValue,
            maxValue: response.data?.maxValue,
            unit: response.data?.unit,
            description: response?.data?.description,
          });
        } catch (error) {
          console.error('Lỗi khi lấy dữ liệu nguyên liệu:', error);
        }
      };
      fetchPackageData();
    }
  }, [open, configId, form]);

  return (
    <>
      <Button style={{ backgroundColor: '#2f855a', color: 'white' }} onClick={showModal}>
        Edit
      </Button>
      <Modal
        title="Edit package"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel} style={{ marginRight: 10 }}>
            Cancel
          </Button>,
          <Button key="submit" style={{ backgroundColor: '#2f855a', color: 'white' }} loading={confirmLoading} onClick={handleOk}>
           Submit
          </Button>,
        ]}
      >
        <UpdateConfigForm form={form} />
      </Modal>
    </>
  );
};

export default UpdateConfigModal;
