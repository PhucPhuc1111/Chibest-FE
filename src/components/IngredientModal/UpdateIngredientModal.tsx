import { Button, Modal, Form } from 'antd';
import { useState, useEffect } from 'react';
import { getIngredientById, updateIngredient, useGetAllIngredients } from '@/app/data/ingredient';
import UpdateIngredientForm from './Form/UpdateIngredientForm';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";
const UpdateIngredientModal: React.FC<{ ingredientId: number; refetch: () => void }> = ({ ingredientId, refetch }) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const [currentIngredient, setCurrentIngredient] = useState<any>(null);

  const showModal = () => {
    setOpen(true);
  };

  const { data: allIngredientsData } = useGetAllIngredients(1, 500, "");

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      setConfirmLoading(true);

      try {
        const allIngredients = allIngredientsData || [];
        
        const isDuplicate = 
          values.ingredientName.toLowerCase() !== currentIngredient?.ingredientName.toLowerCase() &&
          allIngredients.some(
            (ingredient: any) => 
              ingredient.ingredientName.toLowerCase() === values.ingredientName.toLowerCase() &&
              ingredient.id !== ingredientId
          );

        if (isDuplicate) {
          form.setFields([
            {
              name: 'ingredientName',
              errors: ['Tên nguyên liệu đã tồn tại'],
            },
          ]);
          console.error('Tên nguyên liệu đã tồn tại!', { position: 'top-right' });
          setConfirmLoading(false);
          return;
        }

        await updateIngredient(ingredientId, values,);
        refetch();
        setOpen(false);
        setConfirmLoading(false);
        form.resetFields();
        toast.success('Update ingredient successfully  ', { position: 'top-right' });
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

  useEffect(() => {
    if (open) {
      const fetchIngredientData = async () => {
        try {
          const response = await getIngredientById(ingredientId);
          setCurrentIngredient(response.data);
          form.setFieldsValue({
            ingredientName: response.data?.ingredientName,
            // category: response.data?.category,
            // unit: response.data?.unit,
            calories: response.data?.calories,
            carbs: response.data?.carbs,
            fat: response.data?.fat,
            protein: response.data?.protein,
          });
        } catch (error) {
          console.error('Lỗi khi lấy dữ liệu nguyên liệu:', error);
        }
      };
      fetchIngredientData();
    }
  }, [open, ingredientId, form]);
  const userRole = Cookies.get("userRole");
  return (
    <>
      <Button style={{ backgroundColor: '#2f855a', color: 'white' }} onClick={showModal}>
        Detail
      </Button>
      <Modal
        title="Edit ingredient"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={[
          (userRole !== "Admin" && (
            <>
              <Button key="cancel" onClick={handleCancel} style={{ marginRight: 10 }}>
                Cancel
              </Button>
              <Button
                key="submit"
                style={{ backgroundColor: '#2f855a', color: 'white' }}
                loading={confirmLoading}
                onClick={handleOk}
              >
                Submit
              </Button>
            </>
          )) || null, // Hide buttons for Admin
        
        ]}
      >
        <UpdateIngredientForm form={form} />
      </Modal>
    </>
  );
};

export default UpdateIngredientModal;
