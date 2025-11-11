// "use client";

// import { Upload, Image as AntdImage, message } from "antd";
// import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
// import type { UploadFile, UploadProps } from "antd/es/upload/interface";
// import { useState } from "react";

// interface ProductImageUploaderProps {
//   onImagesChange: (files: File[]) => Promise<string[]>;
//   sku: string;
// }

// export default function ProductImageUploader({ onImagesChange, sku }: ProductImageUploaderProps) {
//   const [fileList, setFileList] = useState<UploadFile[]>([]);

//   // QUAN TRỌNG: Sửa lại hàm handleAddImage
//   const handleAddImage: UploadProps['onChange'] = (info) => {
//     const { fileList: newList } = info;
    
//     // Ngăn chặn mọi hành vi mặc định
 
//     if (newList.length > 5) {
//       message.warning("Chỉ được tối đa 5 ảnh (1 ảnh chính + 4 ảnh phụ)");
//       return;
//     }

//     // Kiểm tra SKU
//     if (!sku) {
//       message.warning("Vui lòng nhập SKU trước khi upload ảnh");
//       return;
//     }

//     // Lấy các file mới được thêm
//     const newFiles = newList
//       .filter(file => !fileList.some(existing => existing.uid === file.uid))
//       .filter(file => file.originFileObj);

//     if (newFiles.length > 0) {
//       const files = newFiles.map(f => f.originFileObj!);
        
//       // Gọi callback để upload ảnh
//       onImagesChange(files).then(() => {
//         // Cập nhật fileList với preview URLs SAU KHI upload thành công
//         const updatedList = newList.map(file => {
//           if (!file.url && !file.thumbUrl && file.originFileObj) {
//             return {
//               ...file,
//               preview: URL.createObjectURL(file.originFileObj),
//             };
//           }
//           return file;
//         });
//         setFileList(updatedList);
//       });
//     } else {
//       setFileList(newList);
//     }
//   };

//   // QUAN TRỌNG: Thêm hàm beforeUpload để ngăn upload tự động
//   const beforeUpload: UploadProps['beforeUpload'] = (file) => {
//     // Return false để ngăn upload tự động
//     return false;
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
//                   e.preventDefault();
//                   e.stopPropagation();
//                   handleRemove(0);
//                 }}
//                 type="button" // QUAN TRỌNG: Thêm type="button"
//               >
//                 <CloseOutlined className="text-[10px] text-amber-300" />
//               </button>
//             </>
//           ) : (
//             <Upload
//               accept="image/*"
//               showUploadList={false}
//               beforeUpload={beforeUpload} // QUAN TRỌNG: Thêm beforeUpload
//               onChange={handleAddImage}
//               disabled={!sku}
//             >
//               <button 
//                 className="flex flex-col items-center text-gray-500 hover:text-blue-500 disabled:text-gray-300 disabled:cursor-not-allowed"
//                 disabled={!sku}
//                 type="button" // QUAN TRỌNG: Thêm type="button"
//               >
//                 <PlusOutlined className="text-lg mb-1" />
//                 <span className="text-xs font-medium">
//                   {sku ? "Thêm ảnh" : "Nhập SKU trước"}
//                 </span>
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
//                         e.preventDefault();
//                         e.stopPropagation();
//                         handleRemove(realIndex);
//                       }}
//                       type="button" // QUAN TRỌNG: Thêm type="button"
//                     >
//                       <CloseOutlined className="text-[8px]" />
//                     </button>
//                   </>
//                 ) : (
//                   <Upload
//                     accept="image/*"
//                     showUploadList={false}
//                     beforeUpload={beforeUpload} // QUAN TRỌNG: Thêm beforeUpload
//                     onChange={handleAddImage}
//                     disabled={!sku}
//                   >
//                     <button 
//                       className="text-gray-400 hover:text-blue-500 text-xl leading-none disabled:text-gray-300 disabled:cursor-not-allowed"
//                       disabled={!sku}
//                       type="button" // QUAN TRỌNG: Thêm type="button"
//                     >
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
