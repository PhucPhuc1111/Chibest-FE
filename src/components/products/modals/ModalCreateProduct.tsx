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
import { useState, useEffect, useRef, useCallback } from "react";
import { useProductStore } from "@/stores/useProductStore";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { useBranchStore } from "@/stores/useBranchStore";
import { useSessionStore } from "@/stores/useSessionStore";
import { useFileStore } from "@/stores/useFileStore";
import TiptapEditor from "@/components/ui/tiptap/TiptapEditor";
import ProductImageUploader from "../components/ProductImageUploader";
import type { 
  ProductCreateRequest,
  ProductFormValues,
  ModalCreateProductProps,
  Product,
  ProductVariant,
  TableProduct
} from "@/types/product";
import api from "@/api/axiosInstance";
import { PlusOutlined } from "@ant-design/icons";

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

type ProductLegacyFields = {
  "category-id"?: string;
  "is-master"?: boolean;
  "parent-sku"?: string | null;
  "created-at"?: string;
};

const getLegacyField = <K extends keyof ProductLegacyFields>(
  data: Product | ProductVariant | TableProduct | null,
  field: K
): ProductLegacyFields[K] | undefined => {
  if (!data) {
    return undefined;
  }

  return (data as ProductLegacyFields)[field];
};

const hasStyle = (
  data: Product | ProductVariant | TableProduct
): data is Product | ProductVariant => "style" in data;

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
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>("");
  const [sku, setSku] = useState("");
  const formSubmittedRef = useRef(false);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const [colorOptions, setColorOptions] = useState<{ label: string; value: string }[]>([]);
  const [sizeOptions, setSizeOptions] = useState<{ label: string; value: string }[]>([]);
  const [colorLoading, setColorLoading] = useState(false);
  const [sizeLoading, setSizeLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const { updateProduct, loading, getProducts } = useProductStore();
  const { categories, getCategories } = useCategoryStore();
  const { branches, getBranches } = useBranchStore();
  const { uploadImage } = useFileStore();
  const activeBranchId = useSessionStore((state) => state.activeBranchId);

  const isCreatingVariant = !!parentProduct;

  const fetchColors = useCallback(async () => {
    setColorLoading(true);
    try {
      const response = await api.get<{
        "status-code": number;
        data: { id: string; code: string }[];
      }>("/api/color");
      if (response.data["status-code"] === 200) {
        const items = response.data.data || [];
        setColorOptions(items.map((item) => ({ label: item.code, value: item.id })));
      } else {
        setColorOptions([]);
      }
    } catch (error) {
      console.error("Failed to fetch colors", error);
      message.error("Không thể tải danh sách màu sắc.");
    } finally {
      setColorLoading(false);
    }
  }, []);

  const fetchSizes = useCallback(async () => {
    setSizeLoading(true);
    try {
      const response = await api.get<{
        "status-code": number;
        data: { id: string; code: string }[];
      }>("/api/size");
      if (response.data["status-code"] === 200) {
        const items = response.data.data || [];
        setSizeOptions(items.map((item) => ({ label: item.code, value: item.id })));
      } else {
        setSizeOptions([]);
      }
    } catch (error) {
      console.error("Failed to fetch sizes", error);
      message.error("Không thể tải danh sách kích thước.");
    } finally {
      setSizeLoading(false);
    }
  }, []);

  useEffect(() => {
    getCategories();
    getBranches();
  }, [getCategories, getBranches]);

  useEffect(() => {
    if (open) {
      fetchColors();
      fetchSizes();
    }
  }, [open, fetchColors, fetchSizes]);

  useEffect(() => {
    if (open) {
      form.resetFields();
      setDescription("");
      setAvatarUrl("");
      setAvatarFile(null);
      setVideoFile(null);
      setVideoPreview((prev) => {
        if (prev) {
          URL.revokeObjectURL(prev);
        }
        return "";
      });
      formSubmittedRef.current = false;

      if (isUpdate && productData) {
        // Pre-fill data cho update với type safety
        setSku(productData.sku || "");
        setDescription(productData.description || "");
        setAvatarUrl(productData.avartarUrl || "");
        
        setTimeout(() => {
          const legacyCategoryId = getLegacyField(productData, "category-id");
          const formValues: Partial<FormData> = {
            name: productData.name,
            categoryId: legacyCategoryId ?? "",
            brand: productData.brand || "",
            color: productData.color || "",
            size: productData.size || "",
            style: hasStyle(productData) ? productData.style || "" : "",
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

  const createProductWithFormData = async ({
    values,
    finalSku,
    isMasterValue,
    parentSkuValue,
    previousDate,
  }: {
    values: ProductFormValues;
    finalSku: string;
    isMasterValue: boolean;
    parentSkuValue: string | null;
    previousDate: string;
  }) => {
    if (!avatarFile) {
      message.warning("Vui lòng chọn ảnh sản phẩm (1 ảnh)");
      return;
    }

    if (!videoFile) {
      message.warning("Vui lòng chọn video sản phẩm (1 video)");
      return;
    }

    setCreating(true);
    try {
      const formData = new FormData();
      formData.append("Sku", finalSku);
      formData.append("Name", values.name);
      formData.append("Description", description || "");
      formData.append("Brand", values.brand || "");
      formData.append("Material", values.material || "");
      formData.append("Style", values.style || "");
      formData.append("Status", values.status || "Available");
      formData.append("Weight", String(values.weight || 0));
      formData.append("CategoryId", values.categoryId);
      formData.append("SellingPrice", String(values.sellingPrice || 0));
      formData.append("CostPrice", String(values.costPrice || 0));
      formData.append("IsMaster", String(isMasterValue));
      formData.append("ParentSku", parentSkuValue ?? "");
      formData.append("EffectiveDate", `${previousDate}T00:00:00.000`);
      formData.append("ExpiryDate", "2099-12-31T23:59:59.000");
      formData.append("Note", values.note || "");
      formData.append("VideoUrl", "");
      formData.append("AvatarUrl", avatarUrl || "");
      formData.append("ColorId", "");
      formData.append("SizeId", "");
      formData.append("BranchId", activeBranchId ?? branches[0]?.id ?? "");
      formData.append("Id", "");

      (values.colorIds || []).forEach((id) => {
        formData.append("ColorIds", id);
      });

      (values.sizeIds || []).forEach((id) => {
        formData.append("SizeIds", id);
      });

      formData.append("AvatarFile", avatarFile);
      formData.append("VideoFile", videoFile);

      const response = await api.post("/api/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.["status-code"] === 201) {
        message.success("Tạo hàng hóa thành công");
        await getProducts();
        onClose();
      } else {
        const apiMessage = response.data?.message || "Tạo hàng hóa thất bại";
        message.error(apiMessage);
      }
    } catch (error) {
      console.error("Error creating product (multipart):", error);
      message.error("Tạo hàng hóa thất bại");
    } finally {
      setCreating(false);
    }
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
      if (!file) {
        return [];
      }

      if (isUpdate) {
        const category = categories.find(cat => cat.id === categoryId);
        let categoryNameForUpload = category?.name || "product";
        categoryNameForUpload = normalizeCategoryName(categoryNameForUpload);
        const imageUrl = await uploadImage(file, sku, categoryNameForUpload);
        if (imageUrl) {
          setAvatarUrl(imageUrl);
          setAvatarFile(null);
          message.success("Upload ảnh thành công");
          return [imageUrl];
        }
        return [];
      }

      const previewUrl = URL.createObjectURL(file);
      setAvatarFile(file);
      setAvatarUrl(previewUrl);
      message.success("Đã chọn ảnh sản phẩm");
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

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    if (!sku.trim()) {
      message.warning("Vui lòng nhập SKU trước khi upload video");
      return;
    }
    const MAX_VIDEO_SIZE = 1024 * 1024 * 1024; // 1GB
    if (file.size > MAX_VIDEO_SIZE) {
      message.warning("Video vượt quá dung lượng tối đa 1GB. Vui lòng chọn video nhỏ hơn.");
      if (event.target) {
        event.target.value = "";
      }
      return;
    }
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
    if (event.target) {
      event.target.value = "";
    }
    message.success("Đã chọn video sản phẩm");
  };

  const handleRemoveVideo = () => {
    setVideoFile(null);
    setVideoPreview((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev);
      }
      return "";
    });
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
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

      const currentDate = new Date().toISOString().split("T")[0];
      const previousDate = (() => {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        return date.toISOString().split("T")[0];
      })();

      let isMasterValue: boolean;
      let parentSkuValue: string | null = null;
      
      if (isUpdate && productData) {
        const legacyIsMaster = getLegacyField(productData, "is-master");
        const legacyParentSku = getLegacyField(productData, "parent-sku");
        isMasterValue = legacyIsMaster ?? productData.isMaster ?? true;
        parentSkuValue = legacyParentSku ?? productData.parentSku ?? null;
      } else if (isCreatingVariant && parentProduct) {
        isMasterValue = false;
        parentSkuValue = parentProduct.sku;
      } else {
        isMasterValue = true;
        parentSkuValue = null;
      }

      if (isUpdate) {
        const finalAvatarUrl = avatarUrl;
        const productRequestData: ProductCreateRequest = {
          id: productData?.id,
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
          "is-master": isMasterValue,
          status: values.status || "Available",
          "created-at": productData
            ? getLegacyField(productData, "created-at") || currentDate
            : currentDate,
          "updated-at": currentDate,
          "category-id": values.categoryId,
          "parent-sku": parentSkuValue,
          "selling-price": values.sellingPrice || 0,
          "cost-price": values.costPrice || 0,
          "effective-date": previousDate,
          "expiry-date": "2099-12-31",
          "branch-id": activeBranchId ?? branches[0]?.id ?? "",
        };

        const success = await updateProduct(productRequestData);
        if (success) {
          message.success("Cập nhật hàng hóa thành công");
          onClose();
        }
      } else {
        await createProductWithFormData({
          values,
          finalSku,
          isMasterValue,
          parentSkuValue,
          previousDate,
        });
      }
    } catch (error) {
      console.error(`Error ${isUpdate ? "updating" : "creating"} product:`, error);
      message.error(isUpdate ? "Cập nhật hàng hóa thất bại" : "Tạo hàng hóa thất bại");
    } finally {
      formSubmittedRef.current = false;
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
            colorIds: [],
            sizeIds: [],
            note: "",
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
              />
            </Form.Item>

            <Form.Item label="Ảnh sản phẩm" className="col-span-1 row-span-3">
              <ProductImageUploader 
                onImagesChange={handleImageUpload}
                sku={sku}
                initialImage={avatarUrl}
                maxImages={1}
              />
              {avatarUrl && (
                <div className="mt-2 text-xs text-green-600">
                  ✓ Đã upload ảnh thành công
                </div>
              )}
            </Form.Item>
            <Form.Item label="Video sản phẩm" className="col-span-1">
              <div className="border border-dashed rounded-md bg-gray-50 p-3 flex flex-col items-center justify-center text-center">
                {videoPreview ? (
                  <>
                    <video
                      src={videoPreview}
                      controls
                      className="w-full h-48 rounded-md bg-black object-cover"
                    />
                    <Button danger size="small" className="mt-2" onClick={handleRemoveVideo}>
                      Xóa video
                    </Button>
                  </>
                ) : (
                  <>
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleVideoChange}
                      disabled={!sku}
                    />
                    <Button
                      icon={<PlusOutlined />}
                      type="dashed"
                      onClick={() => videoInputRef.current?.click()}
                      disabled={!sku}
                    >
                      {sku ? "Chọn video" : "Nhập SKU trước"}
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      Chỉ hỗ trợ 1 video (tối đa 1GB)
                    </p>
                  </>
                )}
              </div>
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
              <Form.Item
                label="Màu sắc (tạo biến thể)"
                name="colorIds"
              >
                <Select
                  mode="multiple"
                  placeholder="Chọn màu sắc"
                  loading={colorLoading}
                  options={colorOptions}
                  allowClear
                />
              </Form.Item>
              <Form.Item
                label="Kích thước (tạo biến thể)"
                name="sizeIds"
              >
                <Select
                  mode="multiple"
                  placeholder="Chọn kích thước"
                  loading={sizeLoading}
                  options={sizeOptions}
                  allowClear
                />
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
                    <div className="space-y-4">
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
                      <Form.Item label="Ghi chú" name="note" className="mb-0">
                        <Input.TextArea rows={3} placeholder="Nhập ghi chú cho sản phẩm" />
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
            <Button type="primary" htmlType="submit" loading={loading || creating}>
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
    </Modal>
  );
}
