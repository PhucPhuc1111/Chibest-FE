import { Button, Modal, Form } from 'antd';
import { useState } from 'react';

import { createAllergy } from "@/app/data/allergy";  
import { useQueryClient } from "@tanstack/react-query"; 
import AddAllergyForm from './Form/AddAllergyForm';
import { toast } from 'react-toastify';

const AddAllergyModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [form] = Form.useForm();
  const queryClient = useQueryClient(); 
  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      console.log('Form Values:', values);
      setConfirmLoading(true);
  
      try {
        
        const existingAllergies: any[] = queryClient.getQueryData(["allergies"]) || [];

        const isDuplicate = existingAllergies.some(
          (allergy: any) => allergy.allergyName.toLowerCase() === values.allergyName.toLowerCase()
        );
  
        if (isDuplicate) {
          form.setFields([
            {
              name: "allergyName",
              errors: ["Tên dị ứng đã tồn tại"],
            },
          ]);
          setConfirmLoading(false);
          return;
        }
        const formattedData = {
          AllergyName: values.allergyName,
          Notes: values.notes,
          ingredientIds: values.ingredientIds || [],
        
        };

        await createAllergy(formattedData);
        toast.success("Add allergy successfully!");
        setOpen(false);
        setConfirmLoading(false);
        form.resetFields();
        queryClient.invalidateQueries({ queryKey: ["allergies"] });
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
    setOpen(false);
  };

  const handleReset = () => {
    form.resetFields(); 
  };

  return (
    <>
      <Button style={{ backgroundColor: '#2f855a', color: 'white' }} onClick={showModal}>
        Add allergy
      </Button>
      <Modal
        title="Add allergy"
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
        <AddAllergyForm form={form} />
      </Modal>
    </>
  );
};

export default AddAllergyModal;
