"use client";
import { Button, Popconfirm } from "antd";
import { deleteDiseaseById } from "@/app/data/disease"; // API xóa bệnh nền
import { useState } from "react";
import { toast } from "react-toastify";

const DeleteDiseaseModal: React.FC<{ diseaseId: number; refetch: () => void }> = ({ diseaseId, refetch }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleDelete = async () => {
    setConfirmLoading(true);
    try {
      await deleteDiseaseById(diseaseId);
      refetch(); // Làm mới danh sách sau khi xóa
      setConfirmLoading(false);
      toast.success("Delete disease successfully!");
    } catch (error) {
      const err = error as any;
      const errorMessage = err?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!";
    toast.error(errorMessage);
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    console.log("Hủy xóa bệnh nền");
  };

  return (
    <Popconfirm
      title="Are you sure you to delete this disease?"
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

export default DeleteDiseaseModal;
