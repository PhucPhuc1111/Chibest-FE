import React, { useState } from 'react';
import { Button, Popconfirm } from 'antd';
import { toast } from 'react-toastify';
import { deleteMealPlanById } from '@/app/data';

const DeleteMealPlanModal: React.FC<{
  mealPlanId: number;
  refetch: () => void;
}>  = ({ mealPlanId, refetch }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleDelete = async () => {
    setConfirmLoading(true);
    try {
      await deleteMealPlanById(mealPlanId);
      refetch();
      setConfirmLoading(false);

      toast.success("Delete meal plan successfully!");
    } catch (error) {
      toast.error("Delete meal plan unsuccessfully");
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
  };
  return (
     <Popconfirm
       title="Are you sure to delete this meal plan?"
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

export default DeleteMealPlanModal;