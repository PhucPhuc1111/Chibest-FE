
// src/components/salesPlans/SalesPlanDetail.tsx
"use client";

import { useEffect, useState } from "react";
import { Tabs, Table, Tag, Image, Spin } from "antd";
import type { TabsProps, TableProps } from "antd";

// Mock data cho items của từng plan
const mockPlanItems: { [key: string]: any[] } = {
  "plan-001": [
    {
      "id": "plan-item-001",
      "plan-id": "plan-001",
      "product-id": "ccbf283a-7702-4642-93bf-1a02df40e835",
      "sku": "HH000009",
      "product-name": "Thịt bò khô 30g",
      "avatar-url": "https://cdn2-retail-images.kiotviet.vn/2025/11/03/shopledaihanh/78154db5ae074a3fbaf7c47bbdfff08c.jpg",
      "category-name": "Quần Kaki",
      "color": "đỏ",
      "size": "L",
      "status": "Đã hoàn thành",
      "cost-price": 48000.00,
      "selling-price": 65000.00,
      "quantity": 50,
      "notes": "Chất lượng tốt, đã kiểm tra",
      "created-at": "2025-11-20T10:30:00Z",
      "updated-at": "2025-11-21T14:00:00Z"
    },
    {
      "id": "plan-item-002",
      "plan-id": "plan-001",
      "product-id": "dad85040-ae23-4b2c-b2aa-ce2c21a66a86",
      "sku": "HH000011",
      "product-name": "Phở bò phố cổ",
      "avatar-url": null,
      "category-name": "Quần Kaki",
      "color": "đỏ",
      "size": "L",
      "status": "Đang xử lý",
      "cost-price": 25000.00,
      "selling-price": 42000.00,
      "quantity": 100,
      "notes": "Đang chụp hình, dự kiến xong chiều nay",
      "created-at": "2025-11-20T11:00:00Z",
      "updated-at": "2025-11-21T09:15:00Z"
    },
    {
      "id": "plan-item-003",
      "plan-id": "plan-001",
      "product-id": "5bd17525-7fcc-4094-9f52-a1a0fdcae237",
      "sku": "HH000015",
      "product-name": "Kem dưỡng da Johnson xanh",
      "avatar-url": "https://cdn2-retail-images.kiotviet.vn/2025/11/07/shopledaihanh/c1a6c327e8c741ed83b0aa62ced64a2f.jpg",
      "category-name": "Quần Kaki",
      "color": "xanh",
      "size": "M",
      "status": "Đang xử lý",
      "cost-price": 10000.00,
      "selling-price": 35000.00,
      "quantity": 200,
      "notes": "Cần làm content chi tiết",
      "created-at": "2025-11-20T12:00:00Z",
      "updated-at": "2025-11-21T10:30:00Z"
    },
    {
      "id": "plan-item-004",
      "plan-id": "plan-001",
      "product-id": "d5f4e74a-8d20-47e0-8298-12709298b8f0",
      "sku": "HH000016",
      "product-name": "Kem dưỡng da Johnson đỏ",
      "avatar-url": null,
      "category-name": "Áo Thun",
      "color": "đỏ",
      "size": "XL",
      "status": "Đã hoàn thành",
      "cost-price": 1000.00,
      "selling-price": 5000.00,
      "quantity": 500,
      "notes": "Sản phẩm phổ biến, stock nhiều",
      "created-at": "2025-11-20T13:00:00Z",
      "updated-at": "2025-11-21T08:45:00Z"
    },
    {
      "id": "plan-item-005",
      "plan-id": "plan-001",
      "product-id": "1b5f9548-2c54-4ca6-a00d-fed887d79fa0",
      "sku": "HH000023",
      "product-name": "Yếm váy jean túi nắp",
      "avatar-url": "https://cdn2-retail-images.kiotviet.vn/2025/11/03/shopledaihanh/78154db5ae074a3fbaf7c47bbdfff08c.jpg",
      "category-name": "Áo Thun",
      "color": "xanh",
      "size": "L",
      "status": "Chưa xử lý",
      "cost-price": 80000.00,
      "selling-price": 120000.00,
      "quantity": 30,
      "notes": "Đợi duyệt từ quản lý",
      "created-at": "2025-11-20T14:00:00Z",
      "updated-at": "2025-11-20T14:00:00Z"
    }
  ],
  "plan-002": [
    {
      "id": "plan-item-006",
      "plan-id": "plan-002",
      "product-id": "ae835c56-7ae3-4ce5-a5e2-321b2da67ac0",
      "sku": "HH000025",
      "product-name": "Set áo 2 dây dù viền bèo",
      "avatar-url": "https://cdn2-retail-images.kiotviet.vn/2025/11/07/shopledaihanh/c1a6c327e8c741ed83b0aa62ced64a2f.jpg",
      "category-name": "Áo Thun",
      "color": "đỏ",
      "size": "M",
      "status": "Đã hoàn thành",
      "cost-price": 80000.00,
      "selling-price": 110000.00,
      "quantity": 75,
      "notes": "Bán chạy, cần đặt thêm",
      "created-at": "2025-10-15T08:30:00Z",
      "updated-at": "2025-10-25T16:00:00Z"
    },
    {
      "id": "plan-item-007",
      "plan-id": "plan-002",
      "product-id": "de98421c-3104-41dc-90e8-d29a48a1ac6f",
      "sku": "HH000026",
      "product-name": "Áo thun sọc lệch vai",
      "avatar-url": "https://cdn2-retail-images.kiotviet.vn/2025/11/08/shopledaihanh/33d496a1228b400fa3ae6280c0aaf24f.jpg",
      "category-name": "Áo Thun",
      "color": "xanh",
      "size": "L",
      "status": "Đã hoàn thành",
      "cost-price": 80000.00,
      "selling-price": 115000.00,
      "quantity": 60,
      "notes": "Mẫu mới, phản hồi tốt từ khách",
      "created-at": "2025-10-16T09:00:00Z",
      "updated-at": "2025-10-28T14:30:00Z"
    },
    {
      "id": "plan-item-008",
      "plan-id": "plan-002",
      "product-id": "e43d04a0-e7d1-4661-aaea-dfb096de7a07",
      "sku": "peleven",
      "product-name": "peleven",
      "avatar-url": "http://103.68.83.52:5000/api/file/image?urlPath=images%2Faos%2Fpeleven.jpg",
      "category-name": "Áo",
      "color": "Đen",
      "size": "XL",
      "status": "Đã hoàn thành",
      "cost-price": 100000.00,
      "selling-price": 160000.00,
      "quantity": 40,
      "notes": "Premium product, đã bán được vài chiếc",
      "created-at": "2025-10-17T10:00:00Z",
      "updated-at": "2025-10-31T17:00:00Z"
    }
  ],
  "plan-003": [
    {
      "id": "plan-item-009",
      "plan-id": "plan-003",
      "product-id": "ccbf283a-7702-4642-93bf-1a02df40e835",
      "sku": "HH000009-XMAS",
      "product-name": "Thịt bò khô 30g - Phiên bản Giáng sinh",
      "avatar-url": null,
      "category-name": "Quần Kaki",
      "color": "đỏ",
      "size": "L",
      "status": "Chưa xử lý",
      "cost-price": 50000.00,
      "selling-price": 75000.00,
      "quantity": 100,
      "notes": "Sắp tới, cần chuẩn bị packaging đặc biệt",
      "created-at": "2025-11-15T09:15:00Z",
      "updated-at": "2025-11-15T09:15:00Z"
    },
    {
      "id": "plan-item-010",
      "plan-id": "plan-003",
      "product-id": "1b5f9548-2c54-4ca6-a00d-fed887d79fa0",
      "sku": "HH000023-XMAS",
      "product-name": "Yếm váy jean túi nắp - Phiên bản Giáng sinh",
      "avatar-url": "https://cdn2-retail-images.kiotviet.vn/2025/11/03/shopledaihanh/78154db5ae074a3fbaf7c47bbdfff08c.jpg",
      "category-name": "Áo Thun",
      "color": "xanh",
      "size": "M",
      "status": "Chưa xử lý",
      "cost-price": 90000.00,
      "selling-price": 140000.00,
      "quantity": 50,
      "notes": "Design đặc biệt cho mùa lễ",
      "created-at": "2025-11-15T09:30:00Z",
      "updated-at": "2025-11-15T09:30:00Z"
    }
  ]
};

// Mock data cho plans
const mockPlans = [
  {
    "id": "plan-001",
    "name": "Kế hoạch Tháng 11/2025",
    "description": "Xử lý các sản phẩm mới nhập",
    "start-date": "2025-11-01",
    "end-date": "2025-11-30",
    "status": "Đang thực hiện",
    "created-at": "2025-11-20T10:30:00Z",
    "updated-at": "2025-11-21T15:45:00Z",
    "created-by": "Trần Văn Quân Trị",
    "supplier-id": "sup-001",
    "supplier-name": "NCC Việt Phát",
    "total-items": 5,
    "completed-items": 2,
    "in-progress-items": 2,
    "pending-items": 1
  },
  {
    "id": "plan-002",
    "name": "Kế hoạch Tháng 10/2025",
    "description": "Xử lý sản phẩm mùa thu",
    "start-date": "2025-10-01",
    "end-date": "2025-10-31",
    "status": "Hoàn thành",
    "created-at": "2025-10-15T08:00:00Z",
    "updated-at": "2025-10-31T17:30:00Z",
    "created-by": "Nguyễn Thị Hương",
    "supplier-id": "sup-002",
    "supplier-name": "NCC Hải Nam",
    "total-items": 3,
    "completed-items": 3,
    "in-progress-items": 0,
    "pending-items": 0
  },
  {
    "id": "plan-003",
    "name": "Kế hoạch Tháng 12/2025",
    "description": "Chuẩn bị dịp Giáng sinh",
    "start-date": "2025-12-01",
    "end-date": "2025-12-31",
    "status": "Chưa bắt đầu",
    "created-at": "2025-11-15T09:00:00Z",
    "updated-at": "2025-11-15T09:00:00Z",
    "created-by": "Lê Minh Tuấn",
    "supplier-id": "sup-001",
    "supplier-name": "NCC Việt Phát",
    "total-items": 4,
    "completed-items": 0,
    "in-progress-items": 0,
    "pending-items": 4
  }
];

interface SalesPlanDetailProps {
  planId: string;
  onStatusUpdated?: (planId: string) => void;
}

export default function SalesPlanDetail({ planId, onStatusUpdated }: SalesPlanDetailProps) {
  const [planDetail, setPlanDetail] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetail = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        // Find plan from mock data
        const plan = mockPlans.find(p => p.id === planId);
        setPlanDetail(plan);
        setItems(mockPlanItems[planId] || []);
        setLoading(false);
      }, 500);
    };
    
    loadDetail();
  }, [planId]);

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      "Đã hoàn thành": "green",
      "Đang xử lý": "blue", 
      "Chưa xử lý": "orange",
      "Hoàn thành": "green",
      "Đang thực hiện": "blue",
      "Chưa bắt đầu": "orange"
    };
    return colorMap[status] || "default";
  };

  const productColumns: TableProps<any>["columns"] = [
    {
      title: "Hình ảnh",
      dataIndex: "avatar-url",
      key: "avatar-url",
      width: 80,
      render: (avatarUrl: string) => 
        avatarUrl ? (
          <Image 
            width={40} 
            height={40} 
            src={avatarUrl} 
            alt="product" 
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div className="w-10 h-10 bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
            No Image
          </div>
        )
    },
    { 
      title: "Mã SKU", 
      dataIndex: "sku", 
      key: "sku",
      width: 120
    },
    { 
      title: "Tên sản phẩm", 
      dataIndex: "product-name", 
      key: "product-name",
      width: 200
    },
    { 
      title: "Danh mục", 
      dataIndex: "category-name", 
      key: "category-name",
      width: 120
    },
    { 
      title: "Màu sắc", 
      dataIndex: "color", 
      key: "color",
      width: 100
    },
    { 
      title: "Kích thước", 
      dataIndex: "size", 
      key: "size",
      width: 100
    },
    {
      title: "Giá vốn",
      dataIndex: "cost-price",
      key: "cost-price",
      width: 120,
      render: (price: number) => price?.toLocaleString("vi-VN") + " đ" || "0 đ"
    },
    {
      title: "Giá bán",
      dataIndex: "selling-price", 
      key: "selling-price",
      width: 120,
      render: (price: number) => price?.toLocaleString("vi-VN") + " đ" || "0 đ"
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity", 
      width: 100,
      align: "center"
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      )
    },
    {
      title: "Ghi chú",
      dataIndex: "notes", 
      key: "notes",
      render: (notes: string) => notes || "—"
    }
  ];

  if (loading) {
    return <div className="px-3 py-2 text-center">Đang tải chi tiết kế hoạch...</div>;
  }

  if (!planDetail) {
    return <div className="px-3 py-2 text-center text-gray-500">Không tìm thấy thông tin kế hoạch</div>;
  }

  const infoTab: TabsProps["items"] = [
    {
      key: "info",
      label: "Thông tin",
      children: (
        <div className="bg-white p-4 rounded-md border">
          {/* Header thông tin kế hoạch */}
          <div className="mb-6">
            <div className="text-lg font-semibold mb-2">{planDetail.name}</div>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Mã kế hoạch:</span> {planDetail.id}
              </div>
              <div>
                <span className="font-medium">Nhà cung cấp:</span> {planDetail["supplier-name"]}
              </div>
              <div>
                <span className="font-medium">Người tạo:</span> {planDetail["created-by"]}
              </div>
              <div>
                <span className="font-medium">Trạng thái:</span> 
                <Tag color={getStatusColor(planDetail.status)} className="ml-2">
                  {planDetail.status}
                </Tag>
              </div>
              <div>
                <span className="font-medium">Thời gian bắt đầu:</span>{" "}
                {planDetail["start-date"] ? new Date(planDetail["start-date"]).toLocaleDateString('vi-VN') : "—"}
              </div>
              <div>
                <span className="font-medium">Thời gian kết thúc:</span>{" "}
                {planDetail["end-date"] ? new Date(planDetail["end-date"]).toLocaleDateString('vi-VN') : "—"}
              </div>
            </div>
            <div className="mt-3">
              <span className="font-medium">Mô tả:</span> {planDetail.description}
            </div>
          </div>

          {/* Table sản phẩm */}
          <div className="border rounded-md p-3 bg-white">
            <div className="mb-3 font-medium">Danh sách sản phẩm cần xử lý</div>
            
            <Table
              rowKey="id"
              columns={productColumns}
              dataSource={items}
              pagination={false}
              size="small"
              scroll={{ x: 1200 }}
            />

            {/* Thống kê */}
            <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
              <div className="text-center p-2 bg-blue-50 rounded">
                <div className="font-semibold">Tổng sản phẩm</div>
                <div className="text-lg">{planDetail["total-items"]}</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="font-semibold">Đã hoàn thành</div>
                <div className="text-lg">{planDetail["completed-items"]}</div>
              </div>
              <div className="text-center p-2 bg-yellow-50 rounded">
                <div className="font-semibold">Đang xử lý</div>
                <div className="text-lg">{planDetail["in-progress-items"]}</div>
              </div>
              <div className="text-center p-2 bg-orange-50 rounded">
                <div className="font-semibold">Chờ xử lý</div>
                <div className="text-lg">{planDetail["pending-items"]}</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "inventory",
      label: "demo",
      children: (
        <div className="p-4 text-center text-gray-500">
          Demo - Thông tin thẻ kho sẽ được hiển thị ở đây
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