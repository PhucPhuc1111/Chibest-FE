"use client";

import { Upload, Image as AntdImage, message } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { useState } from "react";

interface ProductImageUploaderProps {
  onImagesChange: (files: File[]) => Promise<string[]>;
  sku: string;
  maxImages?: number;
  initialImage?: string; // ✅ THÊM PROP NÀY
}

export default function ProductImageUploader({
  onImagesChange,
  sku,
  maxImages = 5,
  initialImage = "", // ✅ NHẬN INITIAL IMAGE
}: ProductImageUploaderProps) {
  const [fileList, setFileList] = useState<UploadFile[]>(() => {
    // ✅ KHỞI TẠO VỚI INITIAL IMAGE
    if (initialImage) {
      return [{
        uid: '-1',
        name: 'initial-image',
        status: 'done',
        url: initialImage,
      }];
    }
    return [];
  });

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

    // ✅ CHỈ UPLOAD KHI NGƯỜI DÙNG CHỌN XONG ẢNH
    const newFiles = newList
      .filter(f => f.originFileObj && !fileList.some(existing => existing.uid === f.uid))
      .map(f => ({
        ...f,
        preview: f.originFileObj ? URL.createObjectURL(f.originFileObj) : f.url,
      }));

    // ✅ CẬP NHẬT UI TRƯỚC
    setFileList(prev => [...prev, ...newFiles].slice(0, maxImages));

    // ✅ CHỈ UPLOAD KHI CÓ FILE MỚI
    if (newFiles.length > 0) {
      try {
        await onImagesChange(newFiles.map(f => f.originFileObj!));
      } catch (err) {
        message.error("Upload ảnh thất bại");
        console.error(err);
        // ✅ ROLLBACK NẾU UPLOAD THẤT BẠI
        setFileList(prev => prev.filter(f => !newFiles.some(nf => nf.uid === f.uid)));
      }
    }
  };

  const handleRemove = async (index: number) => {
    const fileToRemove = fileList[index];
    setFileList(prev => prev.filter((_, i) => i !== index));
    
    // ✅ CÓ THỂ THÊM LOGIC XÓA ẢNH TRÊN SERVER Ở ĐÂY
    if (fileToRemove.url) {
      console.log('Xóa ảnh:', fileToRemove.url);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start gap-2">
      <div className="flex gap-2">
        {/* Ảnh chính */}
        <div className="relative w-[180px] h-[180px] border border-dashed rounded-md bg-gray-50 flex items-center justify-center hover:border-blue-400 transition overflow-hidden">
          {fileList[0] ? (
            <>
              <div className="w-full h-full flex items-center justify-center">
                <AntdImage
                  src={fileList[0].preview || fileList[0].url}
                  className="max-w-full max-h-full object-contain"
                  wrapperClassName="flex items-center justify-center w-full h-full"
                  preview={{ 
                    zIndex: 20000,
                    maskClassName: "rounded-md"
                  }}
                  alt="main"
                />
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemove(0);
                }}
                className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-all z-10"
              >
                <CloseOutlined className="text-xs" />
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
                className="flex flex-col items-center text-gray-500 hover:text-blue-500 disabled:text-gray-300 disabled:cursor-not-allowed p-4"
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
                className="relative w-[39px] h-[39px] border border-dashed rounded-md bg-gray-50 flex items-center justify-center hover:border-blue-400 transition overflow-hidden"
              >
                {file ? (
                  <>
                    <div className="w-full h-full flex items-center justify-center">
                      <AntdImage
                        src={file.preview || file.url}
                        className="max-w-full max-h-full object-contain"
                        wrapperClassName="flex items-center justify-center w-full h-full"
                        preview={{ 
                          zIndex: 2000,
                          maskClassName: "rounded-md"
                        }}
                        alt={`sub-${idx}`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemove(realIndex);
                      }}
                      className="absolute -top-1 -right-1 bg-white border border-gray-300 text-gray-700 rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all z-10"
                    >
                      <CloseOutlined className="text-[10px]" />
                    </button>
                  </>
                ) : (
                  <Upload
                    accept="image/*"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={handleAddImage}
                    disabled={!sku || fileList.length >= maxImages}
                  >
                    <button
                      type="button"
                      className="text-gray-400 hover:text-blue-500 disabled:text-gray-300 disabled:cursor-not-allowed p-2"
                      disabled={!sku || fileList.length >= maxImages}
                    >
                      <PlusOutlined className="text-sm" />
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
