// import React, { useEffect, useState } from "react";
// import { Button, Form, Image, Input, Select, Upload, UploadFile } from "antd";
// import { useGetAllAllergies, useGetAllDiseases, useGetAllIngredients } from "@/app/data";
// import { UploadOutlined } from "@ant-design/icons";

// const DetailFoodForm: React.FC<{ form: any, foodId: number, isEditing: boolean }> = ({
//   form,
//   isEditing,
//   foodId,
// }) => {
//   const { Option } = Select;
//   const { data: diseasesData, isLoading: isLoadingDiseases } = useGetAllDiseases(1, 100, "");
//   const { data: allergiesData, isLoading: isLoadingAllergies } = useGetAllAllergies(1, 100, "");
//   const { data: ingredientsData, isLoading: isLoadingIngredients } = useGetAllIngredients(1, 500, "");

//   const [fileList, setFileList] = useState<UploadFile<any>[]>([]);
//   const [imageUrl, setImageUrl] = useState<string | null>(form.getFieldValue("imageUrl"));

//   const diseaseOptions = diseasesData?.map((disease) => ({
//     label: disease.diseaseName,
//     value: disease.diseaseId,
//   })) || [];

//   const ingredientOptions = ingredientsData?.map((ingredient) => ({
//     label: ingredient.ingredientName,
//     value: ingredient.ingredientId,
//   })) || [];

//   const allergyOptions = allergiesData?.map((allergy) => ({
//     label: allergy.allergyName,
//     value: allergy.allergyId,
//   })) || [];

//   // Sử dụng useEffect để đảm bảo rằng mỗi lần form và foodId thay đổi, imageUrl sẽ được cập nhật
//   useEffect(() => {
//     const imageUrlFromForm = form.getFieldValue('imageUrl');
//     if (imageUrlFromForm) {
//       setImageUrl(imageUrlFromForm); // Cập nhật lại imageUrl từ form
//     }
//   }, [form, foodId]);

//   return (
//     <Form form={form} name="food-details">
//       <div className="flex space-x-2">
//         <div className="w-2/3">
//           <Form.Item name="foodName" label="Food name"
//             rules={[
//               { required: true, message: 'Food name là bắt buộc' },
//               {
//                 pattern: /^[a-zA-Z0-9áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ\s]*$/,
//                 message: 'Food name không được chứa ký tự đặc biệt ',
//               }
//             ]}>
//             <Input disabled={!isEditing} />
//           </Form.Item>

//           <div className="flex justify-between space-x-4">
//             <Form.Item
//               name="mealType"
//               label="Chọn bữa"
//               style={{ width: "50%" }}
//             >
//               <Select placeholder="Chọn bữa" allowClear disabled={!isEditing}>
//                 <Option value="Main">Chính</Option>
//                 <Option value="Dessert">Phụ</Option>
//               </Select>
//             </Form.Item>

//             <Form.Item name="foodType" label="Loại" style={{ width: "50%" }}>
//               <Select placeholder="Chọn loại" allowClear disabled={!isEditing}>
//                 <Option value="Vegetable">Rau củ quả</Option>
//                 <Option value="Fruit">Trái cây</Option>
//                 <Option value="Broth">Món nước</Option>
//                 <Option value="Noodle">Món mì</Option>
//                 <Option value="Bread">Bánh mì</Option>
//                 <Option value="Meat">Thịt</Option>
//               </Select>
//             </Form.Item>
//           </div>

//           <Form.Item name="servingSize" label="Khẩu phần">
//             <Input disabled={!isEditing} />
//           </Form.Item>

//           <div className="flex justify-between space-x-4">
//             <Form.Item name="calories" label="Calories (cal)">
//               <Input disabled={!isEditing} />
//             </Form.Item>
//             <Form.Item name="protein" label="Protein (g)">
//               <Input disabled={!isEditing} />
//             </Form.Item>
//             <Form.Item name="carbs" label="Carbs (g)">
//               <Input disabled={!isEditing} />
//             </Form.Item>
//           </div>

//           <div className="flex justify-between space-x-4">
//             <Form.Item name="fat" label="Fat (g)">
//               <Input disabled={!isEditing} />
//             </Form.Item>
//             <Form.Item name="glucid" label="Glucid (g)">
//               <Input disabled={!isEditing} />
//             </Form.Item>
//             <Form.Item name="fiber" label="Chất xơ (g)">
//               <Input disabled={!isEditing} />
//             </Form.Item>
//           </div>
//         </div>

//         <div className="w-1/3">
//           <Form.Item name="imageUrl" label="Hình ảnh">
//             {!isEditing ? (
//               imageUrl ? (
//                 <Image src={imageUrl} alt="Food Image" className="w-full h-auto rounded-lg" />
//               ) : (
//                 <span>Chưa có hình ảnh</span>
//               )
//             ) : (
//               <Upload
//                 listType="picture-card"
//                 fileList={fileList}
//                 beforeUpload={() => false}
//                 onChange={({ fileList }) => {
//                   if (fileList.length > 0) {
//                     setFileList(fileList);
//                     setImageUrl(fileList[0].originFileObj ? URL.createObjectURL(fileList[0].originFileObj) : null);
//                     form.setFieldsValue({ imageUrl: fileList[0].originFileObj });
//                   } else {
//                     setFileList([]);
//                     setImageUrl(null);
//                     form.setFieldsValue({ imageUrl: "" });
//                   }
//                 }}
//                 onRemove={() => {
//                   setFileList([]);
//                   setImageUrl(null);
//                   form.setFieldsValue({ imageUrl: "" });
//                 }}
//               >
//                 {fileList.length === 0 && <Button icon={<UploadOutlined />}>Chọn ảnh</Button>}
//               </Upload>
//             )}
//           </Form.Item>
//         </div>
//       </div>

//       <Form.Item name="ingredients" label="Nguyên liệu">
//         <Select
//           mode="multiple"
//           placeholder="Chọn nguyên liệu"
//           options={ingredientOptions}
//           loading={isLoadingIngredients}
//           allowClear
//           disabled={!isEditing}
//         />
//       </Form.Item>

//       <Form.Item name="description" label="Mô tả">
//         <Input.TextArea disabled={!isEditing} />
//       </Form.Item>

//       <Form.Item name="foodId" initialValue={foodId} hidden>
//         <Input />
//       </Form.Item>
//     </Form>
//   );
// };

// export default DetailFoodForm;
import React, { useEffect, useState } from "react";
import { Button, Form, Image, Input, Select, Upload, UploadFile } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getFoodById, useGetAllIngredients } from "@/app/data";

const DetailFoodForm: React.FC<{ form: any, foodId: number, isEditing: boolean }> = ({
  form,
  isEditing,
  foodId,
}) => {
  const { Option } = Select;
  const [fileList, setFileList] = useState<UploadFile<any>[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { data: ingredientsData, isLoading: isLoadingIngredients } = useGetAllIngredients(1, 500, "");
  // Giả sử bạn đã fetch dữ liệu từ API và nhận được giá trị imageUrl
  // Ví dụ: API trả về dữ liệu:
  const [currentFood, setCurrentFood] = useState<any>(null);

  // Fetch food data and update form fields
  useEffect(() => {
    const fetchFoodData = async () => {
      try {
        const response = await getFoodById(foodId);
        setCurrentFood(response.data);
        const fetchedImageUrl = response.data?.imageUrl;

        // Nếu không có ảnh, set imageUrl là null hoặc rỗng
        const imageUrlToSet = fetchedImageUrl ? fetchedImageUrl : null;
        // const fetchedImageUrl = response.data?.imageUrl;
        setImageUrl(fetchedImageUrl); // Set image URL
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
          imageUrl: fetchedImageUrl, // Set image URL in form field
          description: response.data?.description,
          ingredients: response.data?.ingredients?.map((ingredient: any) => ingredient.ingredientId) || [],
        });
        setImageUrl(imageUrlToSet);
      } catch (error) {
        console.error("Error fetching food data:", error);
      }
    };

 

    fetchFoodData();
  }, [foodId, form]);  // Chạy lại khi foodId hoặc form thay đổi
  const ingredientOptions = ingredientsData?.map((ingredient) => ({
    label: ingredient.ingredientName,
    value: ingredient.ingredientId,
  })) || [];
  return (
    <Form form={form} name="food-details">
      <div className="flex space-x-2">
        <div className="w-2/3">
          <Form.Item name="foodName" label="Food name"
            rules={[
              { required: true, message: 'Food name is required' },
              {
                pattern: /^[a-zA-Z0-9áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ\s]*$/,
                message: 'Food name must not contain special characters',
              }
            ]}>
            <Input disabled={!isEditing} />
          </Form.Item>

          <div className="flex justify-between space-x-4">
            <Form.Item
              name="mealType"
              label="Select meal type"
              style={{ width: "50%" }}
            >
              <Select placeholder="Select meal type" allowClear disabled={!isEditing}>
              <Option value="Breakfast">Sáng</Option>
                <Option value="Lunch">Trưa</Option>
                <Option value="Dinner">Tối</Option>
                <Option value="Snack">Phụ</Option>
              </Select>
            </Form.Item>

            <Form.Item name="foodType" label="Food type" style={{ width: "50%" }}>
              <Select placeholder="Select food type" allowClear disabled={!isEditing}>
                <Option value="Vegetable">Rau củ quả</Option>
                <Option value="Fruit">Trái cây</Option>
                <Option value="Broth">Món nước</Option>
                <Option value="Noodle">Món mì</Option>
                <Option value="Bread">Bánh mì</Option>
                <Option value="Meat">Thịt</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item name="servingSize" label="Serving Size">
            <Input disabled={!isEditing} />
          </Form.Item>

          <div className="flex justify-between space-x-4">
            <Form.Item name="calories" label="Calories (cal)">
              <Input disabled={!isEditing} />
            </Form.Item>
            <Form.Item name="protein" label="Protein (g)">
              <Input disabled={!isEditing} />
            </Form.Item>
            <Form.Item name="carbs" label="Carbs (g)">
              <Input disabled={!isEditing} />
            </Form.Item>
          </div>

          <div className="flex justify-between space-x-4">
            <Form.Item name="fat" label="Fat (g)">
              <Input disabled={!isEditing} />
            </Form.Item>
            <Form.Item name="glucid" label="Glucid (g)">
              <Input disabled={!isEditing} />
            </Form.Item>
            <Form.Item name="fiber" label="Fiber (g)">
              <Input disabled={!isEditing} />
            </Form.Item>
          </div>
        </div>

        <div className="w-1/3">
          {/* Hiển thị ảnh bên ngoài Form.Item */}
          <div className="m-4">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt="Food Image"
                className="w-full h-auto rounded-lg"
              />
            ) : (
              <span>Do not have image</span>
            )}
          </div>

          {/* Chỉ sử dụng Form.Item cho giá trị imageUrl */}
          <Form.Item name="imageUrl" label="Image" style={{ display: "none" }}>
            <Input />
          </Form.Item>

          {/* Upload ảnh trong chế độ chỉnh sửa */}
          {/* {isEditing && (
            <Upload
              
              fileList={fileList}
              beforeUpload={() => false}
              onChange={({ fileList }) => {
                if (fileList.length > 0) {
                  setFileList(fileList);
                  setImageUrl(fileList[0].originFileObj ? URL.createObjectURL(fileList[0].originFileObj) : null);
                  form.setFieldsValue({ imageUrl: fileList[0].originFileObj });
                } else {
                  setFileList([]);
                  setImageUrl(null);
                  form.setFieldsValue({ imageUrl: "" });
                }
              }}
              onRemove={() => {
                setFileList([]);
                setImageUrl(null);
                form.setFieldsValue({ imageUrl: "" });
              }}
            >
              {fileList.length === 0 && <Button icon={<UploadOutlined />}>Chọn ảnh</Button>}
            </Upload>
          )} */}
          {isEditing && (
  <Upload

    fileList={fileList}
    beforeUpload={() => false}  // Ngừng tải lên tự động
    onChange={({ fileList }) => {
      if (fileList.length > 0) {
        const newFile = fileList[0].originFileObj;
        setFileList(fileList);  // Cập nhật danh sách file
        setImageUrl(newFile ? URL.createObjectURL(newFile) : null);  // Tạo URL cho ảnh
        form.setFieldsValue({ imageUrl: newFile });  // Cập nhật giá trị vào form
      } else {
        setFileList([]);  // Reset danh sách file nếu không có ảnh
        setImageUrl(null);  // Reset URL ảnh
        form.setFieldsValue({ imageUrl: "" });  // Reset trường imageUrl trong form
      }
    }}
    onRemove={() => {
      setFileList([]);  // Xóa file khi người dùng loại bỏ ảnh
      setImageUrl(null);  // Xóa URL ảnh
      form.setFieldsValue({ imageUrl: "" });  // Reset giá trị trường imageUrl
    }}
  >
    {fileList.length === 0 && <Button icon={<UploadOutlined />}>Chọn ảnh</Button>}
  </Upload>
)}

        </div>
      </div>

      <Form.Item name="ingredients" label="Ingredients">
        <Select
          mode="multiple"
          placeholder="Select ingredients"
          options={ingredientOptions}
          loading={isLoadingIngredients}
          allowClear
          disabled={!isEditing}
          showSearch
          filterOption={(input, option) => {
            if (option && option.label) {
   
              return (option.label as string).toLowerCase().includes(input.toLowerCase());
            }
            return false;
          }}
        />
      </Form.Item>

      <Form.Item name="description" label="Mô tả">
        <Input.TextArea disabled={!isEditing} />
      </Form.Item>

      <Form.Item name="foodId" initialValue={foodId} hidden>
        <Input />
      </Form.Item>
    </Form>
  );
};

export default DetailFoodForm;
