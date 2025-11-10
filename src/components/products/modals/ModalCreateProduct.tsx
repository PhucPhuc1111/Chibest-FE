// // components/products/modals/ModalCreateProduct.tsx
// "use client";

// import {
//   Modal,
//   Tabs,
//   Form,
//   Input,
//   Select,
//   InputNumber,
//   Collapse,
//   Button,
//   // Radio,
//   // Checkbox,
//   message,
// } from "antd";
// import { useState, useEffect } from "react";
// import { useProductStore } from "@/stores/useProductStore";
// import { useCategoryStore } from "@/stores/useCategoryStore";
// import { useBranchStore } from "@/stores/useBranchStore";
// import { useFileStore } from "@/stores/useFileStore";
// import TiptapEditor from "@/components/ui/tiptap/TiptapEditor";
// import ProductImageUploader from "../components/ProductImageUploader";

// const { TextArea } = Input;

// interface CreateProductForm {
//   name: string;
//   description: string;
//   "avatar-url"?: string;
//   color: string;
//   size: string;
//   style?: string;
//   brand: string;
//   material: string;
//   weight: number;
//   "is-master": boolean;
//   status: string;
//   "category-id": string;
//   "selling-price": number;
//   "cost-price": number;
//   "branch-id"?: string;
// }

// export default function ModalCreateProduct({
//   open,
//   onClose,
// }: {
//   open: boolean;
//   onClose: () => void;
// }) {
//   const [form] = Form.useForm();
//   const [activeTab, setActiveTab] = useState("1");
//   const [description, setDescription] = useState("");
//   const [uploadedImages, setUploadedImages] = useState<string[]>([]);
//   const [selectedBranch, setSelectedBranch] = useState<string>("");

//   const { createProduct, loading } = useProductStore();
//   const { categories, getCategories } = useCategoryStore();
//   const { branches, getBranches } = useBranchStore();
//   const { uploadImage } = useFileStore();

//   useEffect(() => {
//     if (open) {
//       getCategories();
//       getBranches();
//       form.resetFields();
//       setDescription("");
//       setUploadedImages([]);
//       setSelectedBranch("");
//     }
//   }, [open, getCategories, getBranches, form]);

//   const handleImageUpload = async (files: File[]) => {
//     try {
//       const uploadedUrls: string[] = [];
//       for (const file of files) {
//         const success = await uploadImage(file, file.name, "product");
//         if (success) {
//           // Trong thực tế, API upload nên trả về URL
//           // Tạm thời dùng local URL cho demo
//           uploadedUrls.push(URL.createObjectURL(file));
//         }
//       }
//       setUploadedImages(uploadedImages);
//       return uploadedUrls;
//     } catch (error) {
//       message.error("Lỗi khi upload ảnh");
//       console.log("err",error);
      
//       return [];
//     }
//   };

//   const handleSubmit = async (values: any) => {
//     try {
//       // Format data theo đúng API requirement (snake_case)
//       const productData = {
//         name: values.name,
//         description: description,
//         "avatar-url": uploadedImages[0] || "", // Sử dụng ảnh đầu tiên làm avatar
//         color: values.color || "",
//         size: values.size || "",
//         style: values.style || "",
//         brand: values.brand || "",
//         material: values.material || "",
//         weight: values.weight || 0,
//         "is-master": true, // Luôn là master product
//         status: "Available", // Theo API format
//         "category-id": values.categoryId,
//         "selling-price": values.sellingPrice || 0,
//         "cost-price": values.costPrice || 0,
//         "branch-id": selectedBranch || branches[0]?.id, // Sử dụng branch đầu tiên nếu không chọn
//         // Các trường có thể để mặc định
//         "effective-date": new Date().toISOString().split('T')[0],
//         "expiry-date": "2099-12-31",
//         "parent-sku": null,
//       };

//       console.log('Creating product with data:', productData);

//       const success = await createProduct(productData );
//       if (success) {
//         message.success("Tạo hàng hóa thành công");
//         onClose();
//       }
//     } catch (error) {
//       console.error('Error creating product:', error);
//       message.error("Lỗi khi tạo hàng hóa");
//     }
//   };

//   return (
//     <Modal
//       title="Tạo hàng hóa"
//       open={open}
//       onCancel={onClose}
//       footer={null}
//       width={900}
//       style={{ top: 48 }}
//       maskClosable={false}
//       zIndex={100}
//       styles={{
//         mask: { zIndex: 99 },
//         body: {
//           maxHeight: "calc(100vh - 200px)",
//           overflowY: "auto",
//           padding: 0,
//           scrollbarGutter: "stable",
//           background: "#fff",
//         },
//       }}
//     >
//       <Tabs
//         activeKey={activeTab}
//         onChange={setActiveTab}
//         items={[
//           { key: "1", label: "Thông tin" },
//           { key: "2", label: "Mô tả" },
//           { key: "3", label: "Chi nhánh kinh doanh" },
//         ]}
//       />

//       {/* =============== TAB 1: THÔNG TIN =============== */}
//       {activeTab === "1" && (
//         <Form
//           form={form}
//           layout="vertical"
//           onFinish={handleSubmit}
//           className="p-4"
//           initialValues={{
//             "cost-price": 0,
//             "selling-price": 0,
//             weight: 0,
//             "is-master": true,
//             status: "Available",
//           }}
//         >
//           <div className="grid grid-flow-col grid-cols-3 gap-x-4  ">
//             <Form.Item 
//               label="Mã hàng (SKU)" 
//               name="sku"
//               className="col-span-2"
//             >
//               <Input placeholder="Tự động tạo" disabled />
//             </Form.Item>

//             <Form.Item
//               label="Tên hàng"
//               name="name"
//               className="col-span-2"
//               rules={[{ required: true, message: "Vui lòng nhập tên hàng" }]}
//             >
//               <Input placeholder="Bắt buộc" />
//             </Form.Item>

//             <div className="relative">
//               <Form.Item
//                 label="Nhóm hàng"
//                 name="categoryId"
//                 className="[&_label]:text-[13px] [&_label]:font-normal [&_label]:text-red-600"
//                 rules={[{ required: true, message: "Bắt buộc chọn nhóm hàng" }]}
//               >
//                 <Select
//                   placeholder="Chọn nhóm hàng"
//                   options={categories.map(cat => ({
//                     label: cat.name,
//                     value: cat.id,
//                   }))}
//                 />
//               </Form.Item>
//             </div>

//             <Form.Item label="Thương hiệu" name="brand" className="col-span-1">
//               <Input placeholder="Nhập thương hiệu" />
//             </Form.Item>

//             <Form.Item label="Màu sắc" name="color" className="col-span-1">
//               <Input placeholder="Nhập màu sắc" />
//             </Form.Item>

//             <Form.Item label="Kích thước" name="size" className="col-span-1">
//               <Input placeholder="Nhập kích thước" />
//             </Form.Item>

//             <Form.Item label="Chất liệu" name="material" className="col-span-1">
//               <Input placeholder="Nhập chất liệu" />
//             </Form.Item>

//             <Form.Item label="Kiểu dáng" name="style" className="col-span-1">
//               <Input placeholder="Nhập kiểu dáng" />
//             </Form.Item>

//             <Form.Item label="Ảnh sản phẩm" className="col-span-1 row-span-3">
//               <ProductImageUploader onImagesChange={handleImageUpload} />
//             </Form.Item>
//           </div>

//           <div className="mt-3 flex flex-col gap-4">
//             {/* ====== Giá vốn, giá bán ====== */}
//             <Collapse
//               bordered
//               className="border border-gray-200 rounded-md shadow-sm"
//               defaultActiveKey={["price"]}
//             >
//               <Collapse.Panel header={<b>Giá vốn, giá bán</b>} key="price">
//                 <div className="grid grid-cols-2 gap-4">
//                   <Form.Item label="Giá vốn" name="costPrice" className="mb-0">
//                     <InputNumber 
//                       min={0} 
//                       className="w-full" 
//                       formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
//                       parser={value => value?.replace(/\$\s?|(,*)/g, '') as any}
//                     />
//                   </Form.Item>
//                   <Form.Item label="Giá bán" name="sellingPrice" className="mb-0">
//                     <InputNumber 
//                       min={0} 
//                       className="w-full"
//                       formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
//                       parser={value => value?.replace(/\$\s?|(,*)/g, '') as any}
//                     />
//                   </Form.Item>
//                 </div>
//               </Collapse.Panel>
//             </Collapse>

//             {/* ====== Thông tin khác ====== */}
//             <Collapse
//               bordered
//               className="border border-gray-200 rounded-md shadow-sm"
//               defaultActiveKey={["other"]}
//             >
//               <Collapse.Panel header={<b>Thông tin khác</b>} key="other">
//                 <div className="grid grid-cols-2 gap-4">
//                   <Form.Item label="Trọng lượng (gram)" name="weight" className="mb-0">
//                     <InputNumber min={0} className="w-full" />
//                   </Form.Item>
//                   <Form.Item label="Trạng thái" name="status" className="mb-0">
//                     <Select
//                       options={[
//                         { label: "Đang bán", value: "Available" },
//                         { label: "Ngừng bán", value: "Unavailable" },
//                         { label: "Hết hàng", value: "OutOfStock" },
//                       ]}
//                     />
//                   </Form.Item>
//                 </div>
//               </Collapse.Panel>
//             </Collapse>
//           </div>

//           {/* ----- Footer ----- */}
//           <div className="flex justify-end items-center gap-2 mt-3 border-t pt-3">
//             <Button onClick={onClose}>Bỏ qua</Button>
//             <Button type="default">Lưu & Tạo thêm hàng</Button>
//             <Button type="primary" htmlType="submit" loading={loading}>
//               Lưu
//             </Button>
//           </div>
//         </Form>
//       )}

//       {/* =============== TAB 2: MÔ TẢ =============== */}
//       {activeTab === "2" && (
//         <div className="p-4 space-y-4">
//           <div>
//             <h4 className="font-medium text-gray-700 mb-2">Mô tả</h4>
//             <TiptapEditor content={description} onChange={setDescription} />
//           </div>

//           <div>
//             <h4 className="font-medium text-gray-700 mb-2">
//               Mẫu ghi chú (hóa đơn, đặt hàng)
//             </h4>
//             <TextArea rows={3} />
//           </div>

//           <div className="flex justify-end items-center gap-2 border-t pt-3">
//             <Button onClick={onClose}>Bỏ qua</Button>
//             <Button type="primary" onClick={() => form.submit()}>
//               Lưu
//             </Button>
//           </div>
//         </div>
//       )}

//       {/* =============== TAB 3: CHI NHÁNH =============== */}
//       {activeTab === "3" && (
//         <div className="p-4">
//           <Form layout="vertical">
//             <Form.Item label="Chi nhánh áp dụng" name="branchId">
//               <Select
//                 placeholder="Chọn chi nhánh"
//                 options={branches.map(branch => ({
//                   label: branch.name,
//                   value: branch.id,
//                 }))}
//                 onChange={(value) => setSelectedBranch(value)}
//               />
//             </Form.Item>

//             <div className="flex justify-end items-center gap-2 border-t pt-3">
//               <Button onClick={onClose}>Bỏ qua</Button>
//               <Button type="primary" onClick={() => form.submit()}>
//                 Lưu
//               </Button>
//             </div>
//           </Form>
//         </div>
//       )}
//     </Modal>
//   );
// }

// components/products/modals/ModalCreateProduct.tsx
"use client";

import {
  Modal,
  Tabs,
  Form,
  Input,
  Select,
  InputNumber,
  Collapse,
  Button,
  message,
} from "antd";
import { useState, useEffect } from "react";
import { useProductStore } from "@/stores/useProductStore";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { useBranchStore } from "@/stores/useBranchStore";
import { useFileStore } from "@/stores/useFileStore";
import TiptapEditor from "@/components/ui/tiptap/TiptapEditor";
import ProductImageUploader from "../components/ProductImageUploader";

const { TextArea } = Input;

interface CreateProductForm {
  name: string;
  description: string;
  "avatar-url"?: string;
  color: string;
  size: string;
  style?: string;
  brand: string;
  material: string;
  weight: number;
  "is-master": boolean;
  status: string;
  "category-id": string;
  "selling-price": number;
  "cost-price": number;
  "branch-id"?: string;
  note?: string; // Thêm field ghi chú từ tab 2
}

export default function ModalCreateProduct({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("1");
  const [description, setDescription] = useState("");
  const [note, setNote] = useState(""); // Ghi chú từ tab 2
  const [avatarUrl, setAvatarUrl] = useState<string>(""); // URL ảnh
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [sku, setSku] = useState(""); // SKU để upload ảnh

  const { createProduct, loading } = useProductStore();
  const { categories, getCategories } = useCategoryStore();
  const { branches, getBranches } = useBranchStore();
  const { uploadImage } = useFileStore();

  useEffect(() => {
    if (open) {
      getCategories();
      getBranches();
      form.resetFields();
      setDescription("");
      setNote("");
      setAvatarUrl("");
      setSelectedBranch("");
      setSku("");
    }
  }, [open, getCategories, getBranches, form]);

  // Xử lý upload ảnh với SKU và category name
  const handleImageUpload = async (files: File[]) => {
    try {
      if (!sku.trim()) {
        message.warning("Vui lòng nhập SKU trước khi upload ảnh");
        return [];
      }

      const categoryName = form.getFieldValue("categoryId");
      if (!categoryName) {
        message.warning("Vui lòng chọn nhóm hàng trước khi upload ảnh");
        return [];
      }

      const uploadedUrls: string[] = [];
      for (const file of files) {
        // Lấy category name từ categoryId
        const category = categories.find(cat => cat.id === categoryName);
        const categoryNameForUpload = category?.name || "product";
        
        const imageUrl = await uploadImage(file, sku, categoryNameForUpload);
        if (imageUrl) {
          uploadedUrls.push(imageUrl);
        }
      }
      
      if (uploadedUrls.length > 0) {
        setAvatarUrl(uploadedUrls[0]); // Lấy ảnh đầu tiên làm avatar
        message.success(`Upload thành công ${uploadedUrls.length} ảnh`);
      }
      
      return uploadedUrls;
    } catch (error) {
      message.error("Lỗi khi upload ảnh");
      console.log("err", error);
      return [];
    }
  };

  // Tạo SKU tự động từ tên sản phẩm
  const generateSku = (productName: string) => {
    if (!productName) return "";
    
    // Chuyển tên sản phẩm thành SKU: "Áo thun trắng" -> "AO-THUN-TRANG"
    const sku = productName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Bỏ dấu
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, "") // Chỉ giữ chữ và số
      .replace(/\s+/g, '-') // Thay space bằng gạch ngang
      .substring(0, 20); // Giới hạn độ dài
    
    setSku(sku);
    return sku;
  };

  const handleSubmit = async (values: any) => {
    try {
      // Tạo SKU nếu chưa có
      const finalSku = sku || generateSku(values.name);
      
      if (!finalSku) {
        message.error("Vui lòng nhập tên sản phẩm để tạo SKU");
        return;
      }

      // Format data theo đúng API requirement
      const productData = {
        "id": "",
        "sku": finalSku,
        "name": values.name,
        "description": description || "",
        "avatar-url": avatarUrl || "", // URL ảnh đã upload
        "color": values.color || "",
        "size": values.size || "",
        "style": values.style || "",
        "brand": values.brand || "",
        "material": values.material || "",
        "weight": values.weight || 0,
        "is-master": true,
        "status": values.status || "Available",
        "created-at": new Date().toISOString().split('T')[0],
        "updated-at": new Date().toISOString().split('T')[0],
        "category-id": values.categoryId,
        "parent-sku": null,
        "selling-price": values.sellingPrice || 0,
        "cost-price": values.costPrice || 0,
        "effective-date": new Date().toISOString().split('T')[0],
        "expiry-date": "2099-12-31",
        "branch-id": selectedBranch || branches[0]?.id,
      };

      console.log('Creating product with data:', productData);

      const success = await createProduct(productData);
      if (success) {
        message.success("Tạo hàng hóa thành công");
        onClose();
      }
    } catch (error) {
      console.error('Error creating product:', error);
      message.error("Lỗi khi tạo hàng hóa");
    }
  };

  // Xử lý khi tên sản phẩm thay đổi
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (name && !sku) {
      generateSku(name);
    }
  };

  return (
    <Modal
      title="Tạo hàng hóa"
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      style={{ top: 48 }}
      maskClosable={false}
      zIndex={100}
      styles={{
        mask: { zIndex: 99 },
        body: {
          maxHeight: "calc(100vh - 200px)",
          overflowY: "auto",
          padding: 0,
          scrollbarGutter: "stable",
          background: "#fff",
        },
      }}
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          { key: "1", label: "Thông tin" },
          { key: "2", label: "Mô tả" },
          { key: "3", label: "Chi nhánh kinh doanh" },
        ]}
      />

      {/* =============== TAB 1: THÔNG TIN =============== */}
      {activeTab === "1" && (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="p-4"
          initialValues={{
            "cost-price": 0,
            "selling-price": 0,
            weight: 0,
            "is-master": true,
            status: "Available",
          }}
        >
          <div className="grid grid-cols-3 gap-4">
            <Form.Item 
              label="Mã hàng (SKU)" 
              className="col-span-2"
            >
              <Input 
                value={sku}
                placeholder="SKU sẽ tự động tạo từ tên hàng"
                onChange={(e) => setSku(e.target.value)}
                onBlur={(e) => {
                  if (!e.target.value && form.getFieldValue("name")) {
                    generateSku(form.getFieldValue("name"));
                  }
                }}
              />
            </Form.Item>

            <Form.Item
              label="Tên hàng"
              name="name"
              className="col-span-2"
              rules={[{ required: true, message: "Vui lòng nhập tên hàng" }]}
            >
              <Input 
                placeholder="Bắt buộc" 
                onChange={handleNameChange}
              />
            </Form.Item>

            <div className="relative">
              <Form.Item
                label="Nhóm hàng"
                name="categoryId"
                className="[&_label]:text-[13px] [&_label]:font-normal [&_label]:text-red-600"
                rules={[{ required: true, message: "Bắt buộc chọn nhóm hàng" }]}
              >
                <Select
                  placeholder="Chọn nhóm hàng"
                  options={categories.map(cat => ({
                    label: cat.name,
                    value: cat.id,
                  }))}
                />
              </Form.Item>
            </div>

            <Form.Item label="Thương hiệu" name="brand" className="col-span-1">
              <Input placeholder="Nhập thương hiệu" />
            </Form.Item>

            <Form.Item label="Màu sắc" name="color" className="col-span-1">
              <Input placeholder="Nhập màu sắc" />
            </Form.Item>

            <Form.Item label="Kích thước" name="size" className="col-span-1">
              <Input placeholder="Nhập kích thước" />
            </Form.Item>

            <Form.Item label="Chất liệu" name="material" className="col-span-1">
              <Input placeholder="Nhập chất liệu" />
            </Form.Item>

            <Form.Item label="Kiểu dáng" name="style" className="col-span-1">
              <Input placeholder="Nhập kiểu dáng" />
            </Form.Item>

            <Form.Item label="Ảnh sản phẩm" className="col-span-1 row-span-3">
              <ProductImageUploader 
                onImagesChange={handleImageUpload}
                sku={sku}
              />
              {avatarUrl && (
                <div className="mt-2 text-xs text-green-600">
                  ✓ Đã upload ảnh thành công
                </div>
              )}
            </Form.Item>
          </div>

          <div className="mt-3 flex flex-col gap-4">
            {/* ====== Giá vốn, giá bán ====== */}
            <Collapse
              bordered
              className="border border-gray-200 rounded-md shadow-sm"
              defaultActiveKey={["price"]}
            >
              <Collapse.Panel header={<b>Giá vốn, giá bán</b>} key="price">
                <div className="grid grid-cols-2 gap-4">
                  <Form.Item label="Giá vốn" name="costPrice" className="mb-0">
                    <InputNumber 
                      min={0} 
                      className="w-full" 
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    />
                  </Form.Item>
                  <Form.Item label="Giá bán" name="sellingPrice" className="mb-0">
                    <InputNumber 
                      min={0} 
                      className="w-full"
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    />
                  </Form.Item>
                </div>
              </Collapse.Panel>
            </Collapse>

            {/* ====== Thông tin khác ====== */}
            <Collapse
              bordered
              className="border border-gray-200 rounded-md shadow-sm"
              defaultActiveKey={["other"]}
            >
              <Collapse.Panel header={<b>Thông tin khác</b>} key="other">
                <div className="grid grid-cols-2 gap-4">
                  <Form.Item label="Trọng lượng (gram)" name="weight" className="mb-0">
                    <InputNumber min={0} className="w-full" />
                  </Form.Item>
                  <Form.Item label="Trạng thái" name="status" className="mb-0">
                    <Select
                      options={[
                        { label: "Đang bán", value: "Available" },
                        { label: "Ngừng bán", value: "Unavailable" },
                        { label: "Hết hàng", value: "OutOfStock" },
                      ]}
                    />
                  </Form.Item>
                </div>
              </Collapse.Panel>
            </Collapse>
          </div>

          {/* ----- Footer ----- */}
          <div className="flex justify-end items-center gap-2 mt-3 border-t pt-3">
            <Button onClick={onClose}>Bỏ qua</Button>
            <Button type="default">Lưu & Tạo thêm hàng</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Lưu
            </Button>
          </div>
        </Form>
      )}

      {/* =============== TAB 2: MÔ TẢ =============== */}
      {activeTab === "2" && (
        <div className="p-4 space-y-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Mô tả</h4>
            <TiptapEditor 
              content={description} 
              onChange={setDescription} 
              placeholder="Nhập mô tả chi tiết về sản phẩm..."
            />
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-2">
              Mẫu ghi chú (hóa đơn, đặt hàng)
            </h4>
            <TextArea 
              rows={3} 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Nhập ghi chú cho hóa đơn, đặt hàng..."
            />
          </div>

          <div className="flex justify-end items-center gap-2 border-t pt-3">
            <Button onClick={onClose}>Bỏ qua</Button>
            <Button type="primary" onClick={() => {
              // Chuyển về tab 1 để submit
              setActiveTab("1");
              setTimeout(() => form.submit(), 100);
            }}>
              Lưu
            </Button>
          </div>
        </div>
      )}

      {/* =============== TAB 3: CHI NHÁNH =============== */}
      {activeTab === "3" && (
        <div className="p-4">
          <Form layout="vertical">
            <Form.Item label="Chi nhánh áp dụng" name="branchId">
              <Select
                placeholder="Chọn chi nhánh"
                options={branches.map(branch => ({
                  label: branch.name,
                  value: branch.id,
                }))}
                onChange={(value) => setSelectedBranch(value)}
              />
            </Form.Item>

            <div className="flex justify-end items-center gap-2 border-t pt-3">
              <Button onClick={onClose}>Bỏ qua</Button>
              <Button type="primary" onClick={() => {
                // Chuyển về tab 1 để submit
                setActiveTab("1");
                setTimeout(() => form.submit(), 100);
              }}>
                Lưu
              </Button>
            </div>
          </Form>
        </div>
      )}
    </Modal>
  );
}