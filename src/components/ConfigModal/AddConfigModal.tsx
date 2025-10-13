import { Button, Modal, Form } from "antd";
import { useState } from "react";
import AddIngredientForm from "./Form/AddConfigForm";
import { useQueryClient } from "@tanstack/react-query";
import { createIngredient, createSystemConfiguration } from "@/app/data";
import { toast } from "react-toastify";
import { createPackage } from "@/app/data/package";
import AddPackageForm from "./Form/AddConfigForm";
import AddConfigForm from "./Form/AddConfigForm";

const AddConfigModal: React.FC = () => {
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
        const existingSystemConfigurations: any[] = queryClient.getQueryData(["systemConfigurations"]) || [];


        const isDuplicate = existingSystemConfigurations.some(
          (configName: any) => configName.name.toLowerCase() === values.name.toLowerCase()
        );

        if (isDuplicate) {
          form.setFields([
            {
              name: "name",
              errors: ["systemconfiguration đã tồn tại"],
            },
          ]);
          setConfirmLoading(false);
          return;
        }

       
        await createSystemConfiguration(values);
        toast.success("Add system configuration successfully!");
        setOpen(false);
        setConfirmLoading(false);
        form.resetFields();
        queryClient.invalidateQueries({ queryKey: ["systemConfigurations"] }); 
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
       Add System Configuration
      </Button>
      <Modal
        title="Add System Configuration"
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
        <AddConfigForm form={form} />
      </Modal>
    </>
  );
};

export default AddConfigModal;
