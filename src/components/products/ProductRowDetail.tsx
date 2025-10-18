// "use client";
// import { Descriptions, Tag, Button } from "antd";

// export default function ProductRowDetail({ data }: { data: any }) {
//   return (
//     <div className="px-4 py-3 bg-white">
//       <div className="flex gap-4">
//         <img src={data.image} alt={data.name} className="w-[96px] h-[112px] rounded-md" />
//         <div className="flex-1">
//           <div className="flex items-center gap-2 mb-1">
//             <h3 className="text-[18px] font-semibold">{data.name}</h3>
//             {data.attrs?.color && <Tag>{data.attrs.color}</Tag>}
//             {data.attrs?.size && <Tag>{data.attrs.size}</Tag>}
//           </div>

//           <div className="flex gap-2 mb-3">
//             <Tag color="blue">{data.type}</Tag>
//             <Tag color="green">{data.sellType}</Tag>
//             <Tag> {data.point} </Tag>
//           </div>

//           <Descriptions column={3} size="small" labelStyle={{ width: 140 }}>
//             <Descriptions.Item label="Mã hàng">{data.id}</Descriptions.Item>
//             <Descriptions.Item label="Tồn kho">{data.stock}</Descriptions.Item>
//             <Descriptions.Item label="Giá vốn">{data.cost.toLocaleString()}</Descriptions.Item>
//             <Descriptions.Item label="Giá bán">{data.price.toLocaleString()}</Descriptions.Item>
//             <Descriptions.Item label="Thương hiệu">Chưa có</Descriptions.Item>
//             <Descriptions.Item label="Định mức tồn">0 - 0</Descriptions.Item>
//             <Descriptions.Item label="Vị trí">Chưa có</Descriptions.Item>
//             <Descriptions.Item label="Trọng lượng">0 g</Descriptions.Item>
//           </Descriptions>

//           <div className="mt-4 flex gap-8">
//             <Button type="primary">Chỉnh sửa</Button>
//             <Button>In tem mã</Button>
//             <Button>+ Thêm hàng hóa cùng loại</Button>
//             <Button>...</Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
