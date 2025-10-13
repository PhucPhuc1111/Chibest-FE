import React, { useState } from 'react';
import { Button, Popconfirm } from 'antd';
import { toast } from 'react-toastify';
import { deleteIngredientById } from '@/app/data';
import { deletePackageById } from '@/app/data/package';

const DeletePackageModal: React.FC<{
  packageId: number;
  refetch: () => void;
}> = ({ packageId, refetch }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleDelete = async () => {
    setConfirmLoading(true);
    try {
      await deletePackageById(packageId);
      refetch();
      setConfirmLoading(false);

      toast.success("Delete package successfully!");
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
    title="Are you sure to delete this package ?"
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

export default DeletePackageModal;