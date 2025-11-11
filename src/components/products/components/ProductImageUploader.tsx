"use client";

import { Upload, Image as AntdImage, message } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { useState } from "react";

interface ProductImageUploaderProps {
  onImagesChange: (files: File[]) => Promise<string[]>;
  sku: string;
  maxImages?: number; // default 5
}

export default function ProductImageUploader({
  onImagesChange,
  sku,
  maxImages = 5,
}: ProductImageUploaderProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Ngăn upload tự động của AntD
  const beforeUpload = () => false;

  const handleAddImage = async (info: { fileList: UploadFile[] }) => {
    const newList = info.fileList;

    if (!sku) {
      message.warning("Vui lòng nhập SKU trước khi upload ảnh");
      return;
    }

    if (newList.length > maxImages) {
      message.warning(`Chỉ được tối đa ${maxImages} ảnh (1 ảnh chính + 4 ảnh phụ)`);
      return;
    }

    // Lấy các file mới được thêm
    const newFiles = newList
      .filter(f => f.originFileObj && !fileList.some(existing => existing.uid === f.uid))
      .map(f => ({
        ...f,
        preview: f.originFileObj ? URL.createObjectURL(f.originFileObj) : f.url,
      }));

    if (newFiles.length > 0) {
      setFileList(prev => [...prev, ...newFiles].slice(0, maxImages));

      try {
        await onImagesChange(newFiles.map(f => f.originFileObj!));
      } catch (err) {
        message.error("Upload ảnh thất bại");
        console.error(err);
      }
    } else {
      setFileList(newList);
    }
  };

  const handleRemove = (index: number) => {
    setFileList(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col items-center justify-start gap-2">
    <div className="flex gap-2">
      {/* Ảnh chính */}
      <div className="relative w-[180px] h-[180px]  border border-dashed rounded-md bg-gray-50 flex items-center justify-center hover:border-blue-400 transition">
        {fileList[0] ? (
          <>
            <AntdImage
              src={fileList[0].preview || fileList[0].url}
              className="w-full h-full object-cover rounded-md"
              preview={{ zIndex: 20000 }}
              alt="main"
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleRemove(0);
              }}
              className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
            >
              <CloseOutlined className="text-[10px]" />
            </button>
          </>
        ) : (
          <Upload accept="image/*" showUploadList={false} beforeUpload={beforeUpload} onChange={handleAddImage} disabled={!sku}>
            <button
              type="button"
              className="flex flex-col items-center text-gray-500 hover:text-blue-500 disabled:text-gray-300 disabled:cursor-not-allowed"
              disabled={!sku}
            >
              <PlusOutlined className="text-lg mb-1" />
              <span className="text-xs">{sku ? "Thêm ảnh" : "Nhập SKU trước"}</span>
              <p className="text-xs text-gray-400 mt-1">Mỗi ảnh không quá 2 MB</p>
            </button>
          </Upload>
        )}
      </div>

      {/* Ảnh phụ */}
      <div className="flex flex-col gap-2">
        {Array.from({ length: maxImages - 1 }).map((_, idx) => {
          const realIndex = idx + 1;
          const file = fileList[realIndex];
          return (
            <div
              key={idx}
              className="relative w-[39px] h-[39px] border border-dashed rounded-md bg-gray-50 flex items-center justify-center hover:border-blue-400 transition"
            >
              {file ? (
                <>
                  <AntdImage
                    src={file.preview || file.url}
                    className="w-full h-full object-cover rounded-md"
                    preview={{ zIndex: 2000 }}
                    alt={`sub-${idx}`}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemove(realIndex);
                    }}
                    className="absolute top-1 right-1 bg-white border text-gray-700 rounded-full w-4 h-4 flex items-center justify-center hover:bg-gray-100"
                  >
                    <CloseOutlined className="text-[8px]" />
                  </button>
                </>
              ) : (
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  onChange={handleAddImage}
                  disabled={!sku}
                >
                  <button
                    type="button"
                    className="text-gray-400 hover:text-blue-500 disabled:text-gray-300 disabled:cursor-not-allowed"
                    disabled={!sku}
                  >
                    <PlusOutlined />
                  </button>
                </Upload>
              )}
            </div>
          );
        })}
      </div>
    </div>
    </div>
  );
}
