"use client";

import {
  Modal,
  Form,
  Input,
  InputNumber,
  Collapse,
  Button,
  Select,
  message,
} from "antd";
import { useEffect, useRef, useState } from "react";
import TiptapEditor from "@/components/ui/tiptap/TiptapEditor";
import ProductImageUploader from "../components/ProductImageUploader";
import { PlusOutlined } from "@ant-design/icons";
import type {
  Product,
  ProductVariant,
  TableProduct,
  ProductFormValues,
} from "@/types/product";
import api from "@/api/axiosInstance";

type UpdateProduct = Product | ProductVariant | TableProduct | null;

interface ModalUpdateProductProps {
  open: boolean;
  onClose: () => void;
  productData: UpdateProduct;
  onSuccess?: () => void;
}

export default function ModalUpdateProduct({
  open,
  onClose,
  productData,
  onSuccess,
}: ModalUpdateProductProps) {
  const [form] = Form.useForm();
  const [description, setDescription] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>("");
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (open && productData) {
      form.resetFields();
      setDescription(productData.description || "");
      setAvatarUrl(productData.avartarUrl || "");
      setAvatarFile(null);
      setVideoFile(null);
      setVideoPreview("");

      form.setFieldsValue({
        name: productData.name,
        costPrice: productData.costPrice,
        sellingPrice: productData.sellingPrice,
        status: productData.status || "Available",
      });
    }
  }, [open, productData, form]);

  const handleImageUpload = async (files: File[]): Promise<string[]> => {
    const file = files[0];
    if (!file) {
      return [];
    }
    const previewUrl = URL.createObjectURL(file);
    setAvatarFile(file);
    setAvatarUrl(previewUrl);
    message.success("Đã chọn ảnh sản phẩm");
    return [];
  };

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const MAX_VIDEO_SIZE = 1024 * 1024 * 1024; // 1GB
    if (file.size > MAX_VIDEO_SIZE) {
      message.warning("Video vượt quá dung lượng tối đa 1GB. Vui lòng chọn video nhỏ hơn.");
      event.target.value = "";
      return;
    }
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
    event.target.value = "";
    message.success("Đã tải lên video sản phẩm");
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
    if (!productData?.id) {
      message.error("Không tìm thấy sản phẩm để cập nhật");
      return;
    }

    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append("Name", values.name);
      formData.append("Description", description || "");
      formData.append("CostPrice", String(values.costPrice || 0));
      formData.append("SellingPrice", String(values.sellingPrice || 0));
      formData.append("Status", values.status || "Available");

      if (avatarFile) {
        formData.append("AvatarFile", avatarFile);
      } else if (avatarUrl) {
        formData.append("AvatarUrl", avatarUrl);
      } else if (productData.avartarUrl) {
        formData.append("AvatarUrl", productData.avartarUrl);
      }

      if (videoFile) {
        formData.append("VideoFile", videoFile);
      } else {
        const productWithVideo = productData as Product & { videoUrl?: string };
        if (productWithVideo.videoUrl) {
          formData.append("VideoUrl", productWithVideo.videoUrl);
        }
      }

      const response = await api.put(`/api/product/${productData.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.["status-code"] === 200) {
        message.success("Cập nhật hàng hóa thành công");
        onSuccess?.();
        onClose();
      } else {
        const apiMessage = response.data?.message || "Cập nhật hàng hóa thất bại";
        message.error(apiMessage);
      }
    } catch (error) {
      console.error("Error updating product (multipart):", error);
      message.error("Cập nhật hàng hóa thất bại");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Modal
      title="Cập nhật hàng hóa"
      open={open}
      onCancel={onClose}
      footer={null}
      width={720}
      maskClosable={false}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          status: "Available",
        }}
      >
        <Form.Item
          label="Tên hàng"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên hàng" }]}
        >
          <Input placeholder="Nhập tên hàng" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Giá vốn"
            name="costPrice"
            rules={[{ required: true, message: "Vui lòng nhập giá vốn" }]}
          >
            <InputNumber
              min={0}
              className="w-full"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            />
          </Form.Item>

          <Form.Item
            label="Giá bán"
            name="sellingPrice"
            rules={[{ required: true, message: "Vui lòng nhập giá bán" }]}
          >
            <InputNumber
              min={0}
              className="w-full"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            />
          </Form.Item>
        </div>

        <Form.Item label="Trạng thái" name="status">
          <Select
            options={[
              { label: "Đang bán", value: "Available" },
              { label: "Ngừng bán", value: "UnAvailable" },
              { label: "Chưa bán", value: "NonCommercial" },
            ]}
          />
        </Form.Item>

        <Form.Item label="Mô tả">
          <TiptapEditor
            content={description}
            onChange={setDescription}
            placeholder="Nhập mô tả chi tiết..."
          />
        </Form.Item>

        <Collapse
          bordered
          className="border border-gray-200 rounded-md shadow-sm"
          items={[
            {
              key: "media",
              label: <b>Hình ảnh & Video</b>,
              children: (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <ProductImageUploader
                      onImagesChange={handleImageUpload}
                      sku={productData?.sku || ""}
                      initialImage={avatarUrl}
                      maxImages={1}
                    />
                  </div>
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
                        />
                        <Button icon={<PlusOutlined />} type="dashed" onClick={() => videoInputRef.current?.click()}>
                          Chọn video
                        </Button>
                        <p className="text-xs text-gray-500 mt-2">
                          Chỉ hỗ trợ 1 video (tối đa 1GB)
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ),
            },
          ]}
        />

        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={onClose}>Hủy</Button>
          <Button type="primary" htmlType="submit" loading={updating}>
            Lưu thay đổi
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

