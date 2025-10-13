import { Button, Modal, Form, Spin, message } from "antd";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import DetailFoodForm from "./Form/DetailFoodForm";
import { useGetFoodById, updateFood, useGetAllFoods, getFoodById } from "@/app/data"; // API lấy dữ liệu theo ID
import Cookies from "js-cookie";
const FoodModal: React.FC<{ foodId: number; refetch: () => void }> = ({ foodId, refetch }) => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [form] = Form.useForm();
  const [currentFood, setCurrentFood] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null); 
  const { data: allFoods } = useGetAllFoods(1,500,""); 
  const userRole = Cookies.get("userRole");
  // Mở modal
  const showDetailModal = () => {
    setIsEditing(false);
    setOpen(true);
  };

  // Bật chế độ chỉnh sửa
  const enableEdit = () => {
    setIsEditing(true);
  };

  // Đóng modal và reset form về giá trị ban đầu
  const handleCancel = () => {
    setOpen(false);
    setIsEditing(false);
    form.resetFields(); // Reset form khi đóng modal
  };

  // Xử lý khi lưu dữ liệu
  const handleSave = async () => {
    form.validateFields().then(async (values) => {
      setLoadingSave(true);

      try {
        const isDuplicate = allFoods?.some(
          (food) => food.foodName === values.foodName && food.foodId !== foodId
        );
        if (isDuplicate) {
          message.error("Tên thực phẩm đã tồn tại, vui lòng chọn tên khác!"); // Hiển thị thông báo lỗi nếu trùng tên
          setLoadingSave(false);
          return;
        }

        const payload = {
          FoodId: Number(foodId),
          FoodName: values.foodName ?? currentFood?.foodName,
          MealType: values.mealType ?? currentFood?.mealType,
          FoodType: values.foodType ?? currentFood?.foodType,
          ServingSize: values.servingSize ?? currentFood?.servingSize,
          Calories: values.calories ?? currentFood?.calories,
          Protein: values.protein ?? currentFood?.protein,
          Carbs: values.carbs ?? currentFood?.carbs,
          Fat: values.fat ?? currentFood?.fat,
          Glucid: values.glucid ?? currentFood?.glucid,
          Fiber: values.fiber ?? currentFood?.fiber,
          FoodImageUrl: values.imageUrl ?? currentFood?.imageUrl, // Lấy giá trị ảnh từ form nếu có
          Description: values.description ?? currentFood?.description,
          Ingredients: values.ingredients ? [...values.ingredients] : [],
        };

        await updateFood(payload);
        toast.success("Update food succesfully!");
        setOpen(false);
        refetch();
      } catch (error) {
       const err = error as any;
               const errorMessage = err?.response?.data?.message || "Dữ liệu không hợp lệ, vui lòng thử lại!";
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
      const fetchFoodData = async () => {
        try {
          const response = await getFoodById(foodId);
          setCurrentFood(response.data);
          // setImageUrl(response.data?.imageUrl);
          // Cập nhật giá trị form khi dữ liệu thực phẩm được tải
          form.setFieldsValue({
            foodName: response.data?.foodName,
            mealType: response.data?.mealType,
            foodType: response.data?.foodType,
            servingSize: response.data?.servingSize,
            calories: response.data?.calories,
            protein: response.data?.protein,
            carbs: response.data?.carbs,
            fat: response.data?.fat,
            glucid: response.data?.glucid,
            fiber: response.data?.fiber,
            imageUrl: response.data?.imageUrl, // Cập nhật trường imageUrl trong form
            description: response.data?.description,
            ingredients: response.data?.ingredients?.map((ingredient: any) => ingredient.ingredientId) || [],
          });
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu thực phẩm:", error);
        }
      };
      fetchFoodData();
    }
  }, [open, foodId, form]);

  return (
    <>
      <Button style={{ backgroundColor: '#2f855a', color: 'white' }} onClick={showDetailModal}>Detail</Button>
      <Modal
        title={isEditing ? "Edit food" : "Detail food"}
        open={open}
        width={800}
        onCancel={handleCancel}
        maskClosable={false}
        // footer={[
        //   isEditing ? (
        //     <>
        //       <Button key="cancel" onClick={handleCancel}>Cancel</Button>
        //       <Button key="submit" style={{ backgroundColor: '#2f855a', color: 'white' }} onClick={handleSave} loading={loadingSave}>Save</Button>
        //     </>
        //   ) : (
        //     <Button key="edit" style={{ backgroundColor: '#2f855a', color: 'white' }} onClick={enableEdit}>Edit</Button>
        //   )
        // ]}
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
          )]}
      >
        <DetailFoodForm form={form} isEditing={isEditing} foodId={foodId} />
      </Modal>
    </>
  );
};

export default FoodModal;
