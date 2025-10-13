import React, { useState, useEffect } from "react";
import { Upload, Button, message, Image } from "antd";
import { PlusOutlined, LoadingOutlined, DeleteOutlined } from "@ant-design/icons";
import type { UploadChangeParam } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";

interface ImageUploadProps {
  value?: string | File; // Có thể là URL ảnh hoặc File
  onChange?: (file?: File | null) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange }) => {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    typeof value === "string" ? value : undefined
  );

  useEffect(() => {
    if (typeof value === "string") {
      setImagePreview(value);
    } else if (value instanceof File) {
      setImagePreview(URL.createObjectURL(value));
    } else {
      setImagePreview(undefined);
    }
  }, [value]);

  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpeg";
    if (!isJpgOrPng) {
      message.error("Bạn chỉ có thể tải lên JPG/PNG!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Hình ảnh phải nhỏ hơn 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      const file = info.file.originFileObj as File;
      setImagePreview(URL.createObjectURL(file));
      onChange?.(file);
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setImagePreview(undefined);
    onChange?.(null); // Xóa ảnh
  };

  return (
    <div>
      {imagePreview ? (
        <div style={{ position: "relative", display: "inline-block" }}>
          <Image src={imagePreview} alt="food" style={{ width: 150, height: 150 }} />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={handleRemove}
            style={{ position: "absolute", top: 0, right: 0 }}
          />
        </div>
      ) : (
        <Upload
          name="FoodImageUrl"
          listType="picture-card"
          showUploadList={false}
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>Tải lên</div>
        </Upload>
      )}
    </div>
  );
};

export default ImageUpload;
