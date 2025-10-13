import React, { useState } from 'react';
import { Button, Popconfirm } from 'antd';
import { toast } from 'react-toastify';
import { deleteIngredientById, deleteSystemConfigurationId } from '@/app/data';
import { deletePackageById } from '@/app/data/package';

const DeleteConfigModal: React.FC<{
  configId: number;
  refetch: () => void;
}> = ({ configId, refetch }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleDelete = async () => {
    setConfirmLoading(true);
    try {
      await deleteSystemConfigurationId(configId);
      refetch();
      setConfirmLoading(false);

      toast.success("Delete system configuration successfully!");
    } catch (error) {
      const err = error as any;
      const errorMessage = err?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!";
    toast.error(errorMessage);
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
  };
  return (
    <Popconfirm
    title="Are you sure to delete this system configuration ?"
    onConfirm={handleDelete}
    onCancel={handleCancel}
    okButtonProps={{ loading: confirmLoading }}
    cancelButtonProps={{ disabled: confirmLoading }}
  >
    <Button type="primary" danger>
      Delete
    </Button>
  </Popconfirm>
  );
};

export default DeleteConfigModal;