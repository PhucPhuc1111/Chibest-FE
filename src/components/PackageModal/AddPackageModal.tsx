import { Button, Modal, Form } from "antd";
import { useState } from "react";
import AddIngredientForm from "./Form/AddPackageForm";
import { useQueryClient } from "@tanstack/react-query";
import { createIngredient } from "@/app/data";
import { toast } from "react-toastify";
import { createPackage } from "@/app/data/package";
import AddPackageForm from "./Form/AddPackageForm";

const AddPackageModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      console.log("Form Values:", values);
      setConfirmLoading(true);

      try {
        const existingPackages: any[] = queryClient.getQueryData(["packages"]) || [];


        const isDuplicate = existingPackages.some(
          (premiumPackage: any) => premiumPackage.packageName.toLowerCase() === values.packageName.toLowerCase()
        );

        if (isDuplicate) {
          form.setFields([
            {
              name: "packageName",
              errors: ["Tên gói đã tồn tại"],
            },
          ]);
          setConfirmLoading(false);
          return;
        }

       
        await createPackage(values);
        toast.success("Add package successfully!");
        setOpen(false);
        setConfirmLoading(false);
        form.resetFields();
        queryClient.invalidateQueries({ queryKey: ["packages"] }); 
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
    console.log("Clicked cancel button");
    setOpen(false); 
  };

  const handleReset = () => {
    form.resetFields(); 
  };

  return (
    <>
      <Button style={{ backgroundColor: "#2f855a", color: "white" }} onClick={showModal}>
       Add package
      </Button>
      <Modal
        title="Thêm gói"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={[
          <Button key="reset" onClick={handleReset} style={{ marginRight: 10 }}>
            Reset
          </Button>,
          <Button key="cancel" onClick={handleCancel} style={{ marginRight: 10 }}>
            Cancel
          </Button>,
          <Button key="submit" style={{ backgroundColor: '#2f855a', color: 'white' }} loading={confirmLoading} onClick={handleOk}>
            Submit
          </Button>,
        ]}
      >
        <AddPackageForm form={form} />
      </Modal>
    </>
  );
};

export default AddPackageModal;
