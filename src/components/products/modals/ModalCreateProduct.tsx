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
import { useState, useEffect, useRef } from "react";
import { useProductStore } from "@/stores/useProductStore";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { useBranchStore } from "@/stores/useBranchStore";
import { useFileStore } from "@/stores/useFileStore";
import TiptapEditor from "@/components/ui/tiptap/TiptapEditor";
import ProductImageUploader from "../components/ProductImageUploader";
import type { 
  ProductCreateRequest,
  ProductFormValues,
  ModalCreateProductProps 
} from "@/types/product";

interface FormData {
  name: string;
  color: string;
  size: string;
  style: string;
  brand: string;
  material: string;
  weight: number;
  status: string;
  categoryId: string;
  sellingPrice: number;
  costPrice: number;
}

export default function ModalCreateProduct({
  open,
  onClose,
  parentProduct = null,
  productData = null,
  isUpdate = false,
}: ModalCreateProductProps) {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("1");
  const [description, setDescription] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [sku, setSku] = useState("");
  const formSubmittedRef = useRef(false);

  const { createProduct, updateProduct, loading } = useProductStore();
  const { categories, getCategories } = useCategoryStore();
  const { branches, getBranches } = useBranchStore();
  const { uploadImage } = useFileStore();

  const isCreatingVariant = !!parentProduct;

  useEffect(() => {
    getCategories();
    getBranches();
  }, [getCategories, getBranches]);

  useEffect(() => {
    if (open) {
      form.resetFields();
      setDescription("");
      setAvatarUrl("");
      setSelectedBranch("");
      formSubmittedRef.current = false;

      if (isUpdate && productData) {
        // Pre-fill data cho update với type safety
        setSku(productData.sku || "");
        setDescription(productData.description || "");
        setAvatarUrl(productData.avartarUrl || "");
        
        setTimeout(() => {
          const formValues: Partial<FormData> = {
            name: productData.name,
            categoryId: (productData as any)["category-id"] || "",
            brand: productData.brand || "",
            color: productData.color || "",
            size: productData.size || "",
            style: productData.style || "",
            material: productData.material || "",
            weight: productData.weight || 0,
            status: productData.status || "Available",
            sellingPrice: productData.sellingPrice || 0,
            costPrice: productData.costPrice || 0,
          };
          form.setFieldsValue(formValues);
        }, 0);
      } else if (parentProduct) {
        setSku(generateVariantSku(parentProduct.sku));
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
  }, [open, parentProduct, productData, isUpdate, form]);

  const generateVariantSku = (parentSku: string): string => {
    const baseSku = parentSku.replace(/-VARIANT-\d+$/, '');
    const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${baseSku}-VARIANT-${randomSuffix}`;
  };

  const generateSku = (productName: string): string => {
    if (!productName) return "";
    
    const generatedSku = productName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, "")
      .replace(/\s+/g, '-')
      .substring(0, 20);
    
    setSku(generatedSku);
    return generatedSku;
  };

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
        setAvatarUrl(imageUrl);
        message.success("Upload ảnh thành công");
        return [imageUrl];
      }

      return [];
    } catch (error) {
      console.error("Upload image error:", error);
      message.error("Upload ảnh thất bại");
      return [];
    }
  };

  const normalizeCategoryName = (categoryName: string): string => {
    if (!categoryName) return "product";
    return categoryName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, '-')
      .substring(0, 20);
  };

  const handleSubmit = async (values: ProductFormValues): Promise<void> => {
    if (formSubmittedRef.current) return;
    formSubmittedRef.current = true;

    try {
      let finalSku = sku;
      if (!finalSku && values.name && !isUpdate) {
        finalSku = isCreatingVariant && parentProduct
          ? generateVariantSku(parentProduct.sku)
          : generateSku(values.name);
      }
      
      if (!finalSku) {
        message.error("Vui lòng nhập tên sản phẩm để tạo SKU");
        return;
      }

      const finalAvatarUrl = avatarUrl;
      const currentDate = new Date().toISOString().split("T")[0];

      // FIX: Xử lý is-master và parent-sku đúng cách
      let isMasterValue: boolean;
      let parentSkuValue: string | null = null;
      
      if (isUpdate && productData) {
        // Khi update: giữ nguyên giá trị từ dữ liệu gốc
        isMasterValue = (productData as any)["is-master"] ?? productData.isMaster ?? true;
        parentSkuValue = (productData as any)["parent-sku"] || productData.parentSku || null;
      } else if (isCreatingVariant && parentProduct) {
        // Khi tạo variant mới: là master = false
        isMasterValue = false;
        parentSkuValue = parentProduct.sku;
      } else {
        // Khi tạo master product mới: là master = true
        isMasterValue = true;
        parentSkuValue = null;
      }

      const productRequestData: ProductCreateRequest = {
        id: isUpdate && productData ? productData.id : "",
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
        "is-master": isMasterValue, // FIXED: Sử dụng giá trị đã xử lý
        status: values.status || "Available",
        "created-at": isUpdate && productData ? (productData as any)["created-at"] || currentDate : currentDate,
        "updated-at": currentDate,
        "category-id": values.categoryId,
        "parent-sku": parentSkuValue, // FIXED: Sử dụng giá trị đã xử lý
        "selling-price": values.sellingPrice || 0,
        "cost-price": values.costPrice || 0,
        "effective-date": currentDate,
        "expiry-date": "2099-12-31",
        "branch-id": selectedBranch || branches[0]?.id || "",
      };

      console.log("Submitting product data:", {
        ...productRequestData,
        "is-master": isMasterValue,
        "parent-sku": parentSkuValue
      });

      let success = false;
      if (isUpdate) {
        success = await updateProduct(productRequestData);
      } else {
        success = await createProduct(productRequestData);
      }

      if (success) {
        message.success(isUpdate ? "Cập nhật hàng hóa thành công" : "Tạo hàng hóa thành công");
        onClose();
      }
    } catch (error) {
      console.error(`Error ${isUpdate ? 'updating' : 'creating'} product:`, error);
      message.error(isUpdate ? "Cập nhật hàng hóa thất bại" : "Tạo hàng hóa thất bại");
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const name = e.target.value;
    if (name && !sku && !isUpdate) {
      generateSku(name);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const getModalTitle = (): string => {
    if (isUpdate) return "Cập nhật hàng hóa";
    if (isCreatingVariant) return "Tạo sản phẩm phụ";
    return "Tạo hàng hóa";
  };

  return (
    <Modal
      title={getModalTitle()}
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
      {isCreatingVariant && parentProduct && (
        <div className="bg-blue-50 border border-blue-200 p-3 m-4 rounded-md">
          <div className="text-sm text-blue-800">
            <strong>Đang tạo sản phẩm phụ:</strong> {parentProduct.name} (SKU: {parentProduct.sku})
          </div>
        </div>
      )}

      {/* Hiển thị thông báo nếu đang update */}
      {isUpdate && productData && (
        <div className="bg-yellow-50 border border-yellow-200 p-3 m-4 rounded-md">
          <div className="text-sm text-yellow-800">
            <strong>Đang cập nhật sản phẩm:</strong> {productData.name} (SKU: {productData.sku})
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
            costPrice: 0,
            sellingPrice: 0,
            weight: 0,
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
                  if (!e.target.value && form.getFieldValue("name") && !isUpdate) {
                    generateSku(form.getFieldValue("name"));
                  }
                }}
                disabled={isUpdate}
              />
              {isCreatingVariant && (
                <div className="text-xs text-gray-500 mt-1">
                  SKU variant được tạo tự động từ SKU cha
                </div>
              )}
              {isUpdate && (
                <div className="text-xs text-gray-500 mt-1">
                  Không thể thay đổi SKU khi cập nhật
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
                />
              </Form.Item>
            </div>

            <Form.Item 
              label="Thương hiệu" 
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
              />
            </Form.Item>

            <Form.Item label="Ảnh sản phẩm" className="col-span-1 row-span-3">
              <ProductImageUploader 
                onImagesChange={handleImageUpload}
                sku={sku}
                initialImage={avatarUrl}
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
            <Button onClick={onClose}>Bỏ qua</Button>
            {!isUpdate && (
              <Button type="default">Lưu & Tạo thêm hàng</Button>
            )}
            <Button type="primary" htmlType="submit" loading={loading}>
              {isUpdate ? "Cập nhật" : "Lưu"}
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