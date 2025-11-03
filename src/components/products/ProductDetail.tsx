// "use client";
// import { useEffect } from "react";
// import { useParams } from "next/navigation";
// import { useProductStore } from "@/stores/useProductStore";

// export default function ProductDetail() {
//   const { id } = useParams();
//   const { product, getProductById, isLoading } = useProductStore();

//   useEffect(() => {
//     if (id) getProductById(id as string);
//   }, [id, getProductById]);

//   if (isLoading) return <p>Đang tải chi tiết...</p>;
//   if (!product) return <p>Không tìm thấy sản phẩm</p>;

//   return (
//     <div className="p-4">
//       <div className="flex gap-4">
//         <img src={product.image} alt={product.name} className="rounded-md" width={120} />
//         <div>
//           <h1 className="text-xl font-bold mb-1">{product.name}</h1>
//           <p className="text-sm text-gray-600">{product.variant}</p>
//           <div className="mt-2 flex gap-2">
//             <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded">{product.type}</span>
//             <span className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded">{product.sellType}</span>
//             <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">{product.point}</span>
//           </div>
//           <p className="mt-4 font-medium text-gray-700">Giá bán: {product.price.toLocaleString()}₫</p>
//           <p className="text-gray-500">Giá vốn: {product.cost.toLocaleString()}₫</p>
//           <p className="text-gray-500">Tồn kho: {product.stock}</p>
//         </div>
//       </div>
//     </div>
//   );
// }
