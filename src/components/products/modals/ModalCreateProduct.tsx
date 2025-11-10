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
import { useState, useEffect,useRef  } from "react";
import { useProductStore } from "@/stores/useProductStore";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { useBranchStore } from "@/stores/useBranchStore";
// import {useBranchDebtStore}from "@/stores/useBranchDebtStore";
import { useFileStore } from "@/stores/useFileStore";
import TiptapEditor from "@/components/ui/tiptap/TiptapEditor";
import ProductImageUploader from "../components/ProductImageUploader";

interface ParentProduct {
  id: string;
  sku: string;
  name: string;
  "category-id": string;
  brand: string;
  "is-master": boolean;
}
interface ProductFormValues {
  name: string;
  color?: string;
  size?: string;
  style?: string;
  brand?: string;
  material?: string;
  weight?: number;
  status?: string;
  categoryId: string;
  sellingPrice?: number;
  costPrice?: number;
}
interface ModalCreateProductProps {
  open: boolean;
  onClose: () => void;
  parentProduct?: ParentProduct | null; 
}

export default function ModalCreateProduct({
  open,
  onClose,
  parentProduct = null,

}: ModalCreateProductProps) {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("1");
  const [description, setDescription] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string>(""); // URL ảnh
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [sku, setSku] = useState(""); // SKU để upload ảnh
const formSubmittedRef = useRef(false);
  const { createProduct, loading } = useProductStore();
  const { categories, getCategories } = useCategoryStore();
  const { branches, getBranches } = useBranchStore();
  const { uploadImage } = useFileStore();
const isCreatingVariant = !!parentProduct;
useEffect(() => {
     getCategories();
    getBranches();

}, []);

useEffect(() => {
  if (open) {
    form.resetFields();
    setDescription("");
    setAvatarUrl("");
    setSelectedBranch("");
    formSubmittedRef.current = false;
    if (parentProduct) {
      setSku(generateVariantSku(parentProduct.sku));
      // Sử dụng setTimeout để tránh synchronous updates
      setTimeout(() => {
        form.setFieldsValue({
          categoryId: parentProduct["category-id"],
          brand: parentProduct.brand,
        });
      }, 0);
    } else {
      setSku("");
    }
  }
}, [open, parentProduct, form]);
  const generateVariantSku = (parentSku: string) => {
    const baseSku = parentSku.replace(/-VARIANT-\d+$/, ''); 
    const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${baseSku}-VARIANT-${randomSuffix}`;
  };
  const generateSku = (productName: string) => {
    if (!productName) return "";
    
    const sku = productName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, "")
      .replace(/\s+/g, '-')
      .substring(0, 20);
    
    setSku(sku);
    return sku;
  };
  // Xử lý upload ảnh với SKU và category name
const handleImageUpload = async (files: File[]): Promise<string[]> => {
  try {
    if (!sku.trim()) {
      message.warning("Vui lòng nhập SKU trước khi upload ảnh");
      return [];
    }
    const categoryId = form.getFieldValue("categoryId");
    if (!categoryId) {
      message.warning("Vui lòng chọn nhóm hàng trước khi upload ảnh");
      return [];
    }
    const file = files[0];
    const category = categories.find(cat => cat.id === categoryId);
    let categoryNameForUpload = category?.name || "product";
    categoryNameForUpload = normalizeCategoryName(categoryNameForUpload);
    const imageUrl = await uploadImage(file, sku, categoryNameForUpload);
    if (imageUrl) {
      // Cập nhật state avatarUrl
      setAvatarUrl(imageUrl);
      message.success("Upload ảnh thành công");
      return [imageUrl];
    }

    return [];
  } catch (error) {
    console.error("err", error);
    return [];
  }
};
  // Hàm chuẩn hóa tên category để tránh lỗi khi upload
const normalizeCategoryName = (categoryName: string): string => {
  if (!categoryName) return "product";
 return categoryName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") 
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, '-') 
    .substring(0, 20); 
}

 const handleSubmit = async (values: ProductFormValues) => {
  if (formSubmittedRef.current) return;
  formSubmittedRef.current = true;

  try {
    let finalSku = sku;
    if (!finalSku && values.name) {
      finalSku = isCreatingVariant
        ? generateVariantSku(parentProduct!.sku)
        : generateSku(values.name);
    }
    if (!finalSku) {
      message.error("Vui lòng nhập tên sản phẩm để tạo SKU");
      return;
    }
    const finalAvatarUrl = avatarUrl; 

    const productData = {
      id: "",
      sku: finalSku,
      name: values.name,
      description: description || "",
      "avatar-url": finalAvatarUrl || "", 
      color: values.color || "",
      size: values.size || "",
      style: values.style || "",
      brand: values.brand || "",
      material: values.material || "",
      weight: values.weight || 0,
      "is-master": !isCreatingVariant,
      status: values.status || "Available",
      "created-at": new Date().toISOString().split("T")[0],
      "updated-at": new Date().toISOString().split("T")[0],
      "category-id": values.categoryId,
      "parent-sku": isCreatingVariant ? parentProduct!.sku : null,
      "selling-price": values.sellingPrice || 0,
      "cost-price": values.costPrice || 0,
      "effective-date": new Date().toISOString().split("T")[0],
      "expiry-date": "2099-12-31",
      "branch-id": selectedBranch || branches[0]?.id,
    };
    const success = await createProduct(productData);
    if (success) {
      message.success("Tạo hàng hóa thành công");
      onClose();
    }
  } catch (error) {
    console.error("Error creating product:", error);
  }
};

  // Xử lý khi tên sản phẩm thay đổi
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (name && !sku) {
      generateSku(name);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
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
      {/* Hiển thị thông tin parent nếu đang tạo variant */}
      {isCreatingVariant && (
        <div className="bg-blue-50 border border-blue-200 p-3 m-4 rounded-md">
          <div className="text-sm text-blue-800">
            <strong>Đang tạo sản phẩm phụ:</strong> {parentProduct.name} (SKU: {parentProduct.sku})
          </div>
        </div>
      )}
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
            "is-master":  !isCreatingVariant,
            status: "Available",
          }}
          onKeyDown={handleKeyDown}
        >
          <div className="grid grid-flow-col grid-cols-3 gap-x-4">
            <Form.Item 
              label="Mã hàng (SKU)" 
              className="col-span-2"
            >
              <Input 
                value={sku}
                placeholder={isCreatingVariant ? "SKU variant sẽ tự động tạo" : "SKU sẽ tự động tạo từ tên hàng"}
                onChange={(e) => setSku(e.target.value)}
                onBlur={(e) => {
                  if (!e.target.value && form.getFieldValue("name")) {
                    generateSku(form.getFieldValue("name"));
                  }
                }}
              />
              {isCreatingVariant && (
                <div className="text-xs text-gray-500 mt-1">
                  SKU variant được tạo tự động từ SKU cha
                </div>
              )}
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
                  //  disabled={isCreatingVariant}
                />
              </Form.Item>
            </div>

            <Form.Item label="Thương hiệu" 
            name="brand" 
            className="[&_label]:text-[13px] [&_label]:font-normal [&_label]:text-red-600"
            rules={[{ required: true, message: "Bắt buộc chọn thương hiệu" }]}
            >
              <Select
                  placeholder="Chọn thương hiệu"
                  options={branches.map(branch => ({
                  label: branch.name,
                  value: branch.name,
                }))}
                onChange={(value) => setSelectedBranch(value)}
                // disabled={isCreatingVariant}
                />
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
            <div className="grid grid-cols-2 gap-4">
              <Form.Item label="Màu sắc" name="color" className="col-span-1">
              <Input placeholder="Nhập màu sắc" />
            </Form.Item>

            <Form.Item label="Kích thước" name="size" className="col-span-1">
              <Input placeholder="Nhập kích thước" />
            </Form.Item>
            </div>
             <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Chất liệu" name="material" className="col-span-1">
              <Input placeholder="Nhập chất liệu" />
            </Form.Item>

            <Form.Item label="Kiểu dáng" name="style" className="col-span-1">
              <Input placeholder="Nhập kiểu dáng" />
            </Form.Item> 
             </div>
          </div>
          <div className="mt-3 flex flex-col gap-4">
            {/* ====== Giá vốn, giá bán ====== */}
            <Collapse
              bordered
              className="border border-gray-200 rounded-md shadow-sm"
              defaultActiveKey={["price"]}
              items={[
                {
                  key: "price",
                  label: <b>Giá vốn, giá bán</b>,
                  children: (
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
                  )
                }
              ]}
            />

            {/* ====== Thông tin khác ====== */}
          <Collapse
              bordered
              className="border border-gray-200 rounded-md shadow-sm"
              defaultActiveKey={["other"]}
              items={[
                {
                  key: "other",
                  label: <b>Thông tin khác</b>,
                  children: (
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
                  )
                }
              ]}
            />
          </div>

          {/* ----- Footer ----- */}
          <div className="flex justify-end items-center gap-2 mt-3 border-t pt-3">
            <Button onClick={onClose} >Bỏ qua</Button>
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

          {/* <div>
            <h4 className="font-medium text-gray-700 mb-2">
              Mẫu ghi chú (hóa đơn, đặt hàng)
            </h4>
            <TextArea 
              rows={3} 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Nhập ghi chú cho hóa đơn, đặt hàng..."
            />
          </div> */}

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