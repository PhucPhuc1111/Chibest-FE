import React, { useState } from 'react';
import { Button, Popconfirm } from 'antd';
import { toast } from 'react-toastify';
import { deleteIngredientById } from '@/app/data';

const DeleteIngredientModal: React.FC<{
  ingredientId: number;
  refetch: () => void;
}> = ({ ingredientId, refetch }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleDelete = async () => {
    setConfirmLoading(true);
    try {
      await deleteIngredientById(ingredientId);
      refetch();
      setConfirmLoading(false);

      toast.success("Delete ingredient successfully!");
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
    title="Are you sure to delete this ingredient?"
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

export default DeleteIngredientModal;