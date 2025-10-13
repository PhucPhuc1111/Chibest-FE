"use client";
import { Button, Popconfirm } from "antd";
import { deleteAllergyById } from "@/app/data/allergy"; // Hàm gọi API xóa dị ứng
import { useState } from "react";
import { toast } from "react-toastify";

const DeleteAllergyModal: React.FC<{
  allergyId: number;
  refetch: () => void;
}> = ({ allergyId, refetch }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleDelete = async () => {
    setConfirmLoading(true);
    try {
      await deleteAllergyById(allergyId.toString());
      refetch();
      setConfirmLoading(false);

      toast.success("Delete allergy successfully!");
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
      title="Are you sure you want to delete this allergy?"
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

export default DeleteAllergyModal;
