import { Button, Modal, Form } from 'antd';
import { useState } from 'react';

import {createDisease } from "@/app/data/disease";  
import { useQueryClient } from "@tanstack/react-query"; 

import { toast } from 'react-toastify';
import AddDiseaseForm from './Form/AddDiseaseForm';

const AddDiseaseModal: React.FC = () => {
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
        
        const existingDiseases: any[] = queryClient.getQueryData(["diseases"]) || [];

        const isDuplicate = existingDiseases.some(
          (disease: any) => disease.diseaseName.toLowerCase() === values.diseaseName.toLowerCase()
        );
  
        if (isDuplicate) {
          form.setFields([
            {
              name: "diseaseName",
              errors: ["Tên bệnh đã tồn tại"],
            },
          ]);
          setConfirmLoading(false);
          return;
        }
        const formattedData = {
          DiseaseName: values.diseaseName,
          Description: values.description,
          ingredientIds: values.ingredientIds || [],
        
        };

        await createDisease(formattedData);
        toast.success("Add disease successfully!");
        setOpen(false);
        setConfirmLoading(false);
        form.resetFields();
        queryClient.invalidateQueries({ queryKey: ["diseases"] });
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
        Add disease
      </Button>
      <Modal
        title="Add disease"
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
        <AddDiseaseForm form={form} />
      </Modal>
    </>
  );
};

export default AddDiseaseModal;
