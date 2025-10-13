import { Button, Modal, Form, Spin, message } from "antd";
import { useState, useEffect } from "react";
import { useGetFoodById, updateFood, useGetAllFoods, useGetAllergyById, useGetAllAllergies, updateAllergy, getAllergyById } from "@/app/data"; // API lấy dữ liệu theo ID
import { toast } from "react-toastify";
import DetailAllergyForm from "./Form/DetailAllergyForm";

import Cookies from "js-cookie";

const AllergyModal: React.FC<{ allergyId: number; refetch: () => void }> = ({ allergyId, refetch }) => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
 const [form] = Form.useForm();
  // const { data: currentAllergy, isLoading } = useGetAllergyById(allergyId);
  const [currentAllergy, setCurrentAllergy] = useState<any>(null);
 const { data: allAllergies } = useGetAllAllergies(1, 500, "");
 
   
 const showDetailModal = () => {

  setIsEditing(false);
  setOpen(true);
};

const enableEdit = () => {
  setIsEditing(true);
};

const handleCancel = () => {
  setOpen(false);
  setIsEditing(false);
  form.resetFields(); 
};
const userRole = Cookies.get("userRole");
const handleSave = async () => {
    form.validateFields().then(async (values) => {
      setLoadingSave(true);
      try {
        // Kiểm tra tên dị ứng trùng
        const isDuplicate = allAllergies?.some(
          (allergy) => allergy.allergyName === values.allergyName && allergy.allergyId !== allergyId
        );

        if (isDuplicate) {
          // Nếu trùng tên, hiển thị thông báo lỗi nhưng vẫn tiếp tục
          console.error("Tên dị ứng đã tồn tại, vui lòng chọn tên khác!");
        }

        // Payload gửi lên API
        const payload = {
          AllergyId: Number(allergyId),
          AllergyName: values.allergyName ?? currentAllergy?.allergyName,
          Notes: values.notes ?? currentAllergy?.notes,
          ingredientIds: values.ingredientIds ? [...values.ingredientIds] : [],
        };

        await updateAllergy(payload); // Gửi yêu cầu API để cập nhật dị ứng
        toast.success("Updated allergy successfully"); // Hiển thị thông báo thành công
        setOpen(false);
        refetch();
      } catch (error) {
        const err = error as any;
        const errorMessage = err?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!";
      toast.error(errorMessage);
      } finally {
        setLoadingSave(false); // Tắt trạng thái loading
      }
    }).catch((errorInfo) => {
      console.log("Validate Failed:", errorInfo);
      setLoadingSave(false);
    });
  };

useEffect(() => {
    if (open) {
      const fetchDiseaseData = async () => {
        try {
          const response = await getAllergyById(allergyId);
          setCurrentAllergy(response.data);
          // Cập nhật giá trị form khi dữ liệu dị ứng được tải
          form.setFieldsValue({
            allergyName: response.data?.allergyName,
            notes: response.data?.notes,
            ingredientIds: response.data?.ingredients?.map((ingredient: any) => ingredient.ingredientId) || [],
          });
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu dị ứng:", error);
        }
      };
      fetchDiseaseData();
    }
  }, [open, allergyId, form]);

  return (
    <>
      <Button style={{ backgroundColor: '#2f855a', color: 'white' }} onClick={showDetailModal}>Detail</Button>
     
      <Modal
        title={isEditing ? "Edit allergy" : "Allergy detail"}
        open={open}
        width={800}
        onCancel={handleCancel}
        maskClosable={false}
        footer={[
          // Conditionally render the "Edit" button based on userRole
          (userRole !== "Admin" && !isEditing) && (
            <Button key="edit" style={{ backgroundColor: '#2f855a', color: 'white' }} onClick={enableEdit}>
              Edit
            </Button>
          ),
          isEditing && (
            <>
              <Button key="cancel" onClick={handleCancel}>Cancel</Button>
              <Button key="submit" style={{ backgroundColor: '#2f855a', color: 'white' }} onClick={handleSave} loading={loadingSave}>Save</Button>
            </>
          )
        ]}
      >
      <DetailAllergyForm form={form} isEditing={isEditing} allergyId={allergyId} />

      </Modal>
    </>
  );
};

export default AllergyModal;
