
// // components/products/components/ProductImageUploader.tsx
// import { Upload, Image as AntdImage, message } from "antd";
// import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
// import type { UploadFile } from "antd/es/upload/interface";
// import { useState } from "react";

// interface ProductImageUploaderProps {
//   onImagesChange: (files: File[]) => Promise<string[]>;
// }

// export default function ProductImageUploader({ onImagesChange }: ProductImageUploaderProps) {
//   const [fileList, setFileList] = useState<UploadFile[]>([]);

//   const handleAddImage = async ({ fileList: newList }: { fileList: UploadFile[] }) => {
//     if (newList.length > 5) {
//       message.warning("Chỉ được tối đa 5 ảnh (1 ảnh chính + 4 ảnh phụ)");
//       return;
//     }

//     // Lấy các file mới được thêm
//     const newFiles = newList
//       .filter(file => !fileList.some(existing => existing.uid === file.uid))
//       .filter(file => file.originFileObj);

//     if (newFiles.length > 0) {
//       const files = newFiles.map(f => f.originFileObj!);
//       await onImagesChange(files);
      
//       // Cập nhật fileList với preview URLs
//       const updatedList = newList.map(file => {
//         if (!file.url && !file.thumbUrl && file.originFileObj) {
//           return {
//             ...file,
//             preview: URL.createObjectURL(file.originFileObj),
//           };
//         }
//         return file;
//       });

//       setFileList(updatedList);
//     } else {
//       setFileList(newList);
//     }
//   };

//   const handleRemove = (index: number) => {
//     const newList = [...fileList];
//     newList.splice(index, 1);
//     setFileList(newList);
//   };

//   return (
//     <div className="flex flex-col items-center justify-start gap-2">
//       <div className="flex gap-2">
//         {/* Ảnh chính */}
//         <div className="relative w-[180px] h-[180px] rounded-md border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center hover:border-blue-400 transition">
//           {fileList[0] ? (
//             <>
//               <div className="w-full h-full">
//                 <AntdImage
//                   src={fileList[0].preview || fileList[0].thumbUrl || fileList[0].url}
//                   alt="main"
//                   height={180}
//                   width={180}
//                   className="w-full h-full object-cover rounded-md cursor-pointer"
//                   preview={{
//                     zIndex: 20000,
//                   }}
//                   rootClassName="!w-full !h-full"
//                 />
//               </div>
//               <button
//                 className="absolute top-0 right-0 bg-black/60 text-white text-xs px-1 py-0.5 rounded hover:bg-red-600"
//                 style={{ zIndex: 30000 }}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleRemove(0);
//                 }}
//               >
//                 <CloseOutlined className="text-[10px] text-amber-300" />
//               </button>
//             </>
//           ) : (
//             <Upload
//               accept="image/*"
//               showUploadList={false}
//               beforeUpload={() => false}
//               onChange={handleAddImage}
//             >
//               <button className="flex flex-col items-center text-gray-500 hover:text-blue-500">
//                 <PlusOutlined className="text-lg mb-1" />
//                 <span className="text-xs font-medium">Thêm ảnh</span>
//                 <p className="text-xs text-gray-400 mt-1">Mỗi ảnh không quá 2 MB</p>
//               </button>
//             </Upload>
//           )}
//         </div>

//         {/* Ảnh phụ */}
//         <div className="flex flex-col gap-2">
//           {Array.from({ length: 4 }).map((_, index) => {
//             const realIndex = index + 1;
//             const file = fileList[realIndex];
//             return (
//               <div
//                 key={index}
//                 className="relative w-[39px] h-[39px] rounded-md border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center hover:border-blue-400 transition"
//               >
//                 {file ? (
//                   <>
//                     <AntdImage
//                       src={file.preview || file.thumbUrl || file.url}
//                       alt={`sub-${index}`}
//                       height={39}
//                       width={39}
//                       className="w-full h-full object-cover rounded-md cursor-pointer"
//                       preview={{
//                         zIndex: 2000,
//                       }}
//                     />
//                     <button
//                       className="absolute top-[2px] right-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white border text-gray-700 rounded-full w-4.5 h-4.5 flex items-center justify-center hover:bg-gray-100"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleRemove(realIndex);
//                       }}
//                     >
//                       <CloseOutlined className="text-[8px]" />
//                     </button>
//                   </>
//                 ) : (
//                   <Upload
//                     accept="image/*"
//                     showUploadList={false}
//                     beforeUpload={() => false}
//                     onChange={handleAddImage}
//                   >
//                     <button className="text-gray-400 hover:text-blue-500 text-xl leading-none">
//                       <PlusOutlined />
//                     </button>
//                   </Upload>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }
// components/products/components/ProductImageUploader.tsx
"use client";

import { Upload, Image as AntdImage, message } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { useState } from "react";

interface ProductImageUploaderProps {
  onImagesChange: (files: File[]) => Promise<string[]>;
  sku: string;
}

export default function ProductImageUploader({ onImagesChange, sku }: ProductImageUploaderProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleAddImage = async ({ fileList: newList }: { fileList: UploadFile[] }) => {
    if (newList.length > 5) {
      message.warning("Chỉ được tối đa 5 ảnh (1 ảnh chính + 4 ảnh phụ)");
      return;
    }

    // Kiểm tra SKU
    if (!sku) {
      message.warning("Vui lòng nhập SKU trước khi upload ảnh");
      return;
    }

    // Lấy các file mới được thêm
    const newFiles = newList
      .filter(file => !fileList.some(existing => existing.uid === file.uid))
      .filter(file => file.originFileObj);

    if (newFiles.length > 0) {
      const files = newFiles.map(f => f.originFileObj!);
      await onImagesChange(files);
      
      // Cập nhật fileList với preview URLs
      const updatedList = newList.map(file => {
        if (!file.url && !file.thumbUrl && file.originFileObj) {
          return {
            ...file,
            preview: URL.createObjectURL(file.originFileObj),
          };
        }
        return file;
      });

      setFileList(updatedList);
    } else {
      setFileList(newList);
    }
  };

  const handleRemove = (index: number) => {
    const newList = [...fileList];
    newList.splice(index, 1);
    setFileList(newList);
  };

  return (
    <div className="flex flex-col items-center justify-start gap-2">
      <div className="text-xs text-gray-500 mb-2">
        SKU: {sku || "Chưa có"}
      </div>
      <div className="flex gap-2">
        {/* Ảnh chính */}
        <div className="relative w-[180px] h-[180px] rounded-md border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center hover:border-blue-400 transition">
          {fileList[0] ? (
            <>
              <div className="w-full h-full">
                <AntdImage
                  src={fileList[0].preview || fileList[0].thumbUrl || fileList[0].url}
                  alt="main"
                  height={180}
                  width={180}
                  className="w-full h-full object-cover rounded-md cursor-pointer"
                  preview={{
                    zIndex: 20000,
                  }}
                  rootClassName="!w-full !h-full"
                />
              </div>
              <button
                className="absolute top-0 right-0 bg-black/60 text-white text-xs px-1 py-0.5 rounded hover:bg-red-600"
                style={{ zIndex: 30000 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(0);
                }}
              >
                <CloseOutlined className="text-[10px] text-amber-300" />
              </button>
            </>
          ) : (
            <Upload
              accept="image/*"
              showUploadList={false}
              beforeUpload={() => false}
              onChange={handleAddImage}
              disabled={!sku}
            >
              <button 
                className="flex flex-col items-center text-gray-500 hover:text-blue-500 disabled:text-gray-300 disabled:cursor-not-allowed"
                disabled={!sku}
              >
                <PlusOutlined className="text-lg mb-1" />
                <span className="text-xs font-medium">
                  {sku ? "Thêm ảnh" : "Nhập SKU trước"}
                </span>
                <p className="text-xs text-gray-400 mt-1">Mỗi ảnh không quá 2 MB</p>
              </button>
            </Upload>
          )}
        </div>

        {/* Ảnh phụ */}
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, index) => {
            const realIndex = index + 1;
            const file = fileList[realIndex];
            return (
              <div
                key={index}
                className="relative w-[39px] h-[39px] rounded-md border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center hover:border-blue-400 transition"
              >
                {file ? (
                  <>
                    <AntdImage
                      src={file.preview || file.thumbUrl || file.url}
                      alt={`sub-${index}`}
                      height={39}
                      width={39}
                      className="w-full h-full object-cover rounded-md cursor-pointer"
                      preview={{
                        zIndex: 2000,
                      }}
                    />
                    <button
                      className="absolute top-[2px] right-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white border text-gray-700 rounded-full w-4.5 h-4.5 flex items-center justify-center hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(realIndex);
                      }}
                    >
                      <CloseOutlined className="text-[8px]" />
                    </button>
                  </>
                ) : (
                  <Upload
                    accept="image/*"
                    showUploadList={false}
                    beforeUpload={() => false}
                    onChange={handleAddImage}
                    disabled={!sku}
                  >
                    <button 
                      className="text-gray-400 hover:text-blue-500 text-xl leading-none disabled:text-gray-300 disabled:cursor-not-allowed"
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