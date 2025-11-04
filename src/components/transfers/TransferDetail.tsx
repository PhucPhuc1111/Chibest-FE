// "use client";

// import { Tabs, Table, Input, Tag } from "antd";
// import type { TabsProps } from "antd";
// import type { ColumnsType } from "antd/es/table";
// import { useRouter } from "next/navigation";
// import type { Transfer, TransferProductItem } from "@/types/transfer";
// import {
//   EditOutlined ,
//   DeleteOutlined,
//   CopyOutlined,
//   ExportOutlined,
//   SaveOutlined,
//   PrinterOutlined,
// } from "@ant-design/icons";
// export default function TransferDetail({ transfer }: { transfer: Transfer }) {
//   const router = useRouter();

//   const tagColor =
//     transfer.status === "Đang chuyển"
//       ? "blue"
//       : transfer.status === "Phiếu tạm"
//       ? "orange"
//       : "green";

//   // ===== Cột bảng sản phẩm =====
//   const columns: ColumnsType<TransferProductItem> = [
//     { title: "Mã hàng", dataIndex: "id", width: 150 },
//     { title: "Tên hàng", dataIndex: "name", width: 320 },
//     {
//       title: "Số lượng chuyển",
//       dataIndex: "qtyTransfer",
//       align: "center",
//       width: 140,
//     },
//     {
//       title: "Số lượng nhận",
//       dataIndex: "qtyReceive",
//       align: "center",
//       width: 140,
//     },
//     {
//       title: "Giá chuyển/nhận",
//       dataIndex: "price",
//       align: "right",
//       width: 160,
//       render: (v: number) => v.toLocaleString(),
//     },
//     {
//       title: "Thành tiền chuyển",
//       align: "right",
//       width: 180,
//       render: (r) => (r.qtyTransfer * r.price).toLocaleString(),
//     },
//     {
//       title: "Thành tiền nhận",
//       align: "right",
//       width: 180,
//       render: (r) => (r.qtyReceive * r.price).toLocaleString(),
//     },
//   ];

//   // ===== Tổng cộng =====
//   const totalQtyTransfer = transfer.products.reduce(
//     (a, b) => a + b.qtyTransfer,
//     0
//   );
//   const totalValueTransfer = transfer.products.reduce(
//     (a, b) => a + b.qtyTransfer * b.price,
//     0
//   );

//   // ===== Tab duy nhất: "Thông tin" =====
//   const items: TabsProps["items"] = [
//     {
//       key: "info",
//       label: "Thông tin",
//       children: (
//         <div className="bg-white p-4 rounded-md border">
//           {/* HEADER THÔNG TIN PHIẾU */}
//           <div className="flex justify-between items-center mb-2">
//             <div className="text-lg font-semibold flex items-center gap-2">
//               {transfer.id} <Tag color={tagColor}>{transfer.status}</Tag>
//             </div>
//             <div className="text-sm text-gray-500">
//               Người tạo: <b>{transfer.creator}</b>
//               {transfer.receiver && (
//                 <>
//                   {" "} | Người nhận: <b>{transfer.receiver}</b>
//                 </>
//               )}
//             </div>
//           </div>

//           <div className="text-sm text-gray-600 mb-3">
//             <div className="flex justify-between">
//               <span>
//                 Chuyển từ: <b>{transfer.fromBranch}</b> (
//                 {transfer.dateTransfer})
//               </span>
//               <span>
//                 Chuyển đến: <b>{transfer.toBranch}</b>{" "}
//                 {transfer.dateReceive && `(${transfer.dateReceive})`}
//               </span>
//             </div>
//           </div>

//           {/* BẢNG SẢN PHẨM */}
//           <div className="border rounded-md p-3 bg-white mb-3">
//             <div className="flex gap-3 mb-2">
//               <Input placeholder="Tìm mã hàng" className="max-w-[160px]" />
//               <Input placeholder="Tìm tên hàng" className="max-w-[220px]" />
//             </div>

//             <Table
//               rowKey="id"
//               columns={columns}
//               dataSource={transfer.products}
//               pagination={false}
//               size="small"
//               onRow={(r) => ({
//                 onClick: () => router.push(`/admin/products/${r.id}`),
//               })}
//               rowClassName="cursor-pointer hover:bg-blue-50"
//               scroll={{ x: 1200 }}
//             />

//             <div className="mt-3 grid grid-cols-2">
//               <div>
//                 <div className="flex gap-2 my-2">
//                  <EditOutlined />
//                 <p className="text-sm text-gray-500">Ghi chú chuyển</p>
//                 </div>

//                 <textarea
//                   className="rounded border w-full h-20 p-2 text-sm"
//                   placeholder="Ghi chú..."
//                 />
//               </div>
//               {/* --- PHẦN TỔNG KIỂU KIOTVIET (CĂN PHẢI LABEL) --- */}
//             <div className="w-[280px] ml-auto text-sm text-gray-700 mt-4 border-t border-gray-200 pt-3">
//             <div className="space-y-1.5">
//                 <div className="flex">
//                 <label className="text-gray-600 w-[160px] text-right pr-2">
//                     Tổng số mặt hàng:
//                 </label>
//                 <div className="text-right font-medium text-gray-800 flex-1">
//                     {transfer.products.length}
//                 </div>
//                 </div>

//                 <div className="flex">
//                 <label className="text-gray-600 w-[160px] text-right pr-2">
//                     Tổng SL chuyển:
//                 </label>
//                 <div className="text-right font-medium text-gray-800 flex-1">
//                     {totalQtyTransfer}
//                 </div>
//                 </div>

//                 <div className="flex">
//                 <label className="text-gray-600 w-[160px] text-right pr-2">
//                     Tổng giá trị chuyển:
//                 </label>
//                 <div className="text-right font-semibold text-gray-900 flex-1">
//                     {totalValueTransfer.toLocaleString("vi-VN")} ₫
//                 </div>
//                 </div>

//                 <div className="flex">
//                 <label className="text-gray-600 w-[160px] text-right pr-2">
//                     Tổng SL nhận:
//                 </label>
//                 <div className="text-right font-medium text-gray-800 flex-1">
//                     {totalQtyTransfer}
//                 </div>
//                 </div>

//                 <div className="flex">
//                 <label className="text-gray-600 w-[160px] text-right pr-2">
//                     Tổng giá trị nhận:
//                 </label>
//                 <div className="text-right font-semibold text-gray-900 flex-1">
//                     {totalValueTransfer.toLocaleString("vi-VN")} ₫
//                 </div>
//                 </div>
//             </div>
//             </div>

//             </div>
//           </div>

//           {/* NÚT HÀNH ĐỘNG */}
//           <div className=" flex items-center justify-between gap-2">
//             <div className="flex space-x-2">
//             <button className="px-3 py-1 border rounded flex items-center gap-1">
//               <DeleteOutlined /> Hủy
//             </button>
//             <button className="px-3 py-1 border rounded flex items-center gap-1">
//               <CopyOutlined /> Sao chép
//             </button>
//             <button className="px-3 py-1 border rounded flex items-center gap-1">
//               <ExportOutlined /> Xuất file
//             </button>
//             <button className="px-3 py-1 border rounded flex items-center gap-1">
//               <PrinterOutlined /> In tem mã
//             </button>
//             </div>
//             <div className="flex space-x-2">
//              <button className="px-3 py-1 border rounded flex items-center gap-1">
//               < PrinterOutlined /> In 
//             </button>
//             <button className="px-3 py-1 border rounded flex items-center gap-1">
//               <SaveOutlined /> Lưu
//             </button>
//             </div>
            
//           </div>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="mt-2">
//       <Tabs defaultActiveKey="info" items={items} />
//     </div>
//   );
// }
// src/components/transfers/TransferDetail.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Tabs, Table, Input, Tag, Button, Modal } from "antd";
import type { TabsProps, TableProps } from "antd";
import type { TransferItem } from "@/types/transfer";
import { useTransferStore } from "@/stores/useTransferStore";
import {
  DeleteOutlined,
  CopyOutlined,
  ExportOutlined,
  SaveOutlined,
  PrinterOutlined,
  MailOutlined,
} from "@ant-design/icons";

interface TransferDetailProps {
  id: string;
  onDeleted?: (deletedId: string) => void;
}

export default function TransferDetail({ id, onDeleted }: TransferDetailProps) {
  const { detail, getById, deleteTransfer, getAll } = useTransferStore();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const loadDetail = async () => {
      if (!detail || detail.id !== id) {
        setLoading(true);
        const result = await getById(id);
        setLoading(false);
        if (!result.success && result.message) {
          // Handle error if needed
        }
      }
    };
    loadDetail();
  }, [id, detail, getById]);

  // Xử lý hiển thị confirm delete
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  // Xử lý xác nhận xóa
  const handleConfirmDelete = async () => {
    if (!detail) return;
    
    setDeleteLoading(true);
    try {
      const result = await deleteTransfer(detail.id);
      
      if (result.success) {
        await getAll();
        // Gọi callback để thông báo cho parent component
        if (onDeleted) {
          onDeleted(detail.id);
        }
        // Đóng confirm
        setShowDeleteConfirm(false);
      } 
    } catch {
      // Handle error
    } finally {
      setDeleteLoading(false);
    }
  };

  // Xử lý hủy xóa
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft": return "blue";
      case "Hoàn Thành": return "green";
      case "Đã Hủy": return "red";
      default: return "default";
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case "Draft": return "Nháp";
      case "Hoàn Thành": return "Hoàn thành";
      case "Đã Hủy": return "Đã hủy";
      default: return status;
    }
  };

  const columns: TableProps<TransferItem>["columns"] = useMemo(
    () => [
      { 
        title: "Mã hàng", 
        dataIndex: "sku", 
        width: 150,
        render: (sku: string) => sku || "—"
      },
      { 
        title: "Tên hàng", 
        dataIndex: "productName", 
        width: 300,
        render: (name: string) => name || "—"
      },
      { 
        title: "Số lượng", 
        dataIndex: "quantity", 
        align: "center", 
        width: 100,
        render: (qty: number) => qty || 0
      },
      {
        title: "Đơn giá",
        dataIndex: "unitPrice",
        align: "right",
        width: 120,
        render: (v: number) => (v || 0).toLocaleString("vi-VN") + " đ",
      },
      {
        title: "Phí phụ thu",
        dataIndex: "extraFee",
        align: "right",
        width: 120,
        render: (v: number) => (v || 0).toLocaleString("vi-VN") + " đ",
      },
      {
        title: "Phí hoa hồng",
        dataIndex: "commissionFee",
        align: "right",
        width: 120,
        render: (v: number) => (v || 0).toLocaleString("vi-VN") + " đ",
      },
      {
        title: "Mã container",
        dataIndex: "containerCode",
        width: 120,
        render: (code: string) => code || "—"
      },
      {
        title: "Thành tiền",
        align: "right",
        width: 160,
        render: (_: unknown, record: TransferItem) => {
          const total = (record.quantity || 0) * (record.unitPrice || 0);
          return total.toLocaleString("vi-VN") + " đ";
        },
      },
    ],
    []
  );

  if (loading) {
    return <div className="px-3 py-2 text-center">Đang tải chi tiết phiếu chuyển...</div>;
  }

  if (!detail) {
    return <div className="px-3 py-2 text-center text-gray-500">Không tìm thấy thông tin phiếu chuyển</div>;
  }

  const order = detail;
  const statusColor = getStatusColor(order.status);
  const statusDisplayName = getStatusDisplayName(order.status);

  const totalQty = order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) ?? 0;
  const totalAmount = order.items?.reduce((sum, item) => {
    const itemTotal = (item.quantity || 0) * (item.unitPrice || 0);
    return sum + itemTotal;
  }, 0) ?? 0;
  const totalExtraFee = order.items?.reduce((sum, item) => sum + (item.extraFee || 0), 0) ?? 0;
  const totalCommissionFee = order.items?.reduce((sum, item) => sum + (item.commissionFee || 0), 0) ?? 0;

  const infoTab: TabsProps["items"] = [
    {
      key: "info",
      label: "Thông tin",
      children: (
        <div className="bg-white p-4 rounded-md border">
          <Modal
            title="Xác nhận xóa phiếu chuyển"
            open={showDeleteConfirm}
            onOk={handleConfirmDelete}
            onCancel={handleCancelDelete}
            okText="Xóa"
            cancelText="Hủy"
            okType="danger"
            confirmLoading={deleteLoading}
            styles={{
              mask: { zIndex: 1000 },
              wrapper: { zIndex: 1001 }
            }}
          >
            <p>
              Bạn có chắc chắn muốn xóa phiếu chuyển `<strong>{order.code}</strong>`? 
              Hành động này không thể hoàn tác.
            </p>
          </Modal>

          {/* HEADER */}
          <div className="flex justify-between items-center mb-2">
            <div className="text-lg font-semibold flex items-center gap-2">
              {order.code} <Tag color={statusColor}>{statusDisplayName}</Tag>
            </div>
            <div className="text-sm text-gray-500">Kho đi: {order.fromWarehouseName}</div>
          </div>

          {/* Thông tin kho */}
          <div className="text-sm text-gray-600 mb-3">
            <span>
              Từ kho: <b>{order.fromWarehouseName}</b> → Đến kho: <b>{order.toWarehouseName}</b>
            </span>
          </div>

          {/* Thời gian */}
          <div className="text-sm text-gray-600 mb-3 flex justify-between items-center">
            <span>
              Thời gian: <b>{order.time ? new Date(order.time).toLocaleString('vi-VN') : "—"}</b>
            </span>
          </div>

          {/* TABLE ITEMS */}
          <div className="border rounded-md p-3 bg-white mb-3">
            <div className="flex gap-3 mb-2">
              <Input placeholder="Tìm mã hàng" className="max-w-[160px]" />
              <Input placeholder="Tìm tên hàng" className="max-w-[220px]" />
            </div>

            <Table<TransferItem>
              rowKey="id"
              columns={columns}
              dataSource={order.items || []}
              pagination={false}
              size="small"
              scroll={{ x: 1200 }}
            />

            {/* FOOTER GRID */}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-600 mb-1">Ghi chú:</label>
                <textarea
                  className="rounded border w-full h-24 p-2 text-sm"
                  value={order.note || ""}
                  placeholder="Ghi chú..."
                  readOnly
                />
              </div>

              {/* Tổng hợp bên phải */}
              <div className="w-[320px] ml-auto text-sm text-gray-700 mt-1 border-t border-gray-200 pt-3">
                <div className="space-y-1.5">
                  <div className="flex">
                    <label className="text-gray-600 w-[170px] text-right pr-2">
                      Số lượng mặt hàng:
                    </label>
                    <div className="text-right font-medium text-gray-800 flex-1">
                      {order.items?.length || 0}
                    </div>
                  </div>

                  <div className="flex">
                    <label className="text-gray-600 w-[170px] text-right pr-2">
                      Tổng tiền hàng:
                    </label>
                    <div className="text-right font-medium text-gray-800 flex-1">
                      {totalAmount.toLocaleString("vi-VN")} đ
                    </div>
                  </div>

                  <div className="flex">
                    <label className="text-gray-600 w-[170px] text-right pr-2">
                      Phí phụ thu:
                    </label>
                    <div className="text-right font-medium text-gray-800 flex-1">
                      {totalExtraFee.toLocaleString("vi-VN")} đ
                    </div>
                  </div>

                  <div className="flex">
                    <label className="text-gray-600 w-[170px] text-right pr-2">
                      Phí hoa hồng:
                    </label>
                    <div className="text-right font-medium text-gray-800 flex-1">
                      {totalCommissionFee.toLocaleString("vi-VN")} đ
                    </div>
                  </div>

                  <div className="flex">
                    <label className="text-gray-600 w-[170px] text-right pr-2">
                      Giảm giá:
                    </label>
                    <div className="text-right font-medium text-gray-800 flex-1">
                      {order.discountAmount?.toLocaleString("vi-VN") || "0"} đ
                    </div>
                  </div>

                  <div className="flex">
                    <label className="text-gray-600 w-[170px] text-right pr-2">
                      Tổng SL:
                    </label>
                    <div className="text-right font-medium text-gray-800 flex-1">
                      {totalQty}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex space-x-2">
              <Button 
                className="flex items-center gap-1" 
                icon={<DeleteOutlined />}
                onClick={handleDeleteClick}
                loading={deleteLoading}
                danger
              >
                Hủy
              </Button>
              <Button className="flex items-center gap-1" icon={<CopyOutlined />}>
                Sao chép
              </Button>
              <Button className="flex items-center gap-1" icon={<ExportOutlined />}>
                Xuất file
              </Button>
              <Button className="flex items-center gap-1" icon={<MailOutlined />}>
                Gửi mail
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button type="primary" className="flex items-center gap-1" icon={<ExportOutlined />}>
                Mở phiếu
              </Button>
              <Button className="flex items-center gap-1" icon={<SaveOutlined />}>
                Lưu
              </Button>
              <Button className="flex items-center gap-1" icon={<PrinterOutlined />}>
                In mã tem
              </Button>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="px-3 py-2">
      <Tabs defaultActiveKey="info" items={infoTab} />
    </div>
  );
}