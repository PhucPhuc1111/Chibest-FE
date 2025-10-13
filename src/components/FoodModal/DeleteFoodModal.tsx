import React, { useState } from 'react';
import { Button, Popconfirm } from 'antd';
import { deleteFoodById } from '@/app/data';
import { toast } from 'react-toastify';

const DeleteFoodModal: React.FC<{ foodId: number; refetch: () => void }> = ({ foodId, refetch }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  
    const handleDelete = async () => {
      setConfirmLoading(true);
      try {
        await deleteFoodById(foodId);
        refetch(); // Làm mới danh sách sau khi xóa
        setConfirmLoading(false);
        toast.success("Delete food successfully!");
      } 
        catch (error) {
          const err = error as any;
          const errorMessage = err?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!";
        toast.error(errorMessage);
          setConfirmLoading(false);
      }
    };
  
    const handleCancel = () => {
      console.log("Hủy xóa thực phẩm");
    };
  
    return (
      <Popconfirm
        title="Bạn có chắc chắn muốn xóa thực phẩm này?"
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
  
  export default DeleteFoodModal;