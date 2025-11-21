
// src/components/salesPlans/SalesPlanList.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Table, Tag, Input, Button, Select, Spin, message } from "antd";
import type { TableProps } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import SalesPlanDetail from "./SalesPlanDetail";

// Mock data - import từ file JSON của bạn
const mockSalesPlans = [
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
  },
  {
    "id": "plan-004",
    "name": "Kế hoạch Quý 1/2025",
    "description": "Xử lý hàng tồn kho đầu năm",
    "start-date": "2025-01-01",
    "end-date": "2025-03-31",
    "status": "Hoàn thành",
    "created-at": "2024-12-20T08:00:00Z",
    "updated-at": "2025-03-31T18:00:00Z",
    "created-by": "Phạm Văn Đạt",
    "supplier-id": "sup-003",
    "supplier-name": "NCC Thành Công",
    "total-items": 8,
    "completed-items": 8,
    "in-progress-items": 0,
    "pending-items": 0
  },
  {
    "id": "plan-005",
    "name": "Kế hoạch Tết Nguyên Đán",
    "description": "Chuẩn bị hàng hóa dịp Tết",
    "start-date": "2025-01-15",
    "end-date": "2025-02-15",
    "status": "Hoàn thành",
    "created-at": "2024-12-01T07:30:00Z",
    "updated-at": "2025-02-20T16:45:00Z",
    "created-by": "Nguyễn Thị Hương",
    "supplier-id": "sup-004",
    "supplier-name": "NCC Minh Anh",
    "total-items": 12,
    "completed-items": 12,
    "in-progress-items": 0,
    "pending-items": 0
  },
  {
    "id": "plan-006",
    "name": "Kế hoạch Back to School",
    "description": "Chuẩn bị hàng hóa mùa tựu trường",
    "start-date": "2025-08-01",
    "end-date": "2025-09-15",
    "status": "Đang thực hiện",
    "created-at": "2025-07-15T09:00:00Z",
    "updated-at": "2025-08-20T14:30:00Z",
    "created-by": "Hoàng Thị Lan",
    "supplier-id": "sup-005",
    "supplier-name": "NCC Phú Thái",
    "total-items": 6,
    "completed-items": 3,
    "in-progress-items": 2,
    "pending-items": 1
  }
];

export default function SalesPlanList() {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    pageIndex: 1,
    pageSize: 15
  });

  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setPlans(mockSalesPlans);
        setLoading(false);
      }, 1000);
    };
    loadData();
  }, [filters]);

  const handleCreateNew = () => {
    router.push("/salesPlans/new");
  };

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value, pageIndex: 1 }));
  };

  const handleStatusChange = (value: string) => {
    setFilters(prev => ({ ...prev, status: value, pageIndex: 1 }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      status: "",
      pageIndex: 1,
      pageSize: 15
    });
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      "Hoàn thành": "green",
      "Đang thực hiện": "blue", 
      "Chưa bắt đầu": "orange",
      "Tạm dừng": "red"
    };
    return colorMap[status] || "default";
  };

  const columns: TableProps<any>["columns"] = useMemo(
    () => [
      {
        title: "",
        dataIndex: "_select",
        width: 48,
        fixed: "left",
        render: () => <input type="checkbox" className="mx-2" />,
      },
      { 
        title: "Mã kế hoạch", 
        dataIndex: "id", 
        width: 140, 
        fixed: "left",
        render: (id: string) => id || "—"
      },
      { 
        title: "Tên kế hoạch", 
        dataIndex: "name", 
        width: 200,
        render: (name: string) => name || "—"
      },
      { 
        title: "Nhà cung cấp", 
        dataIndex: "supplier-name", 
        width: 150,
        render: (supplier: string) => supplier || "—"
      },
      { 
        title: "Người tạo", 
        dataIndex: "created-by", 
        width: 150,
        render: (creator: string) => creator || "—"
      },
      { 
        title: "Thời gian bắt đầu", 
        dataIndex: "start-date", 
        width: 150,
        render: (date: string) => date ? new Date(date).toLocaleDateString('vi-VN') : "—"
      },
      { 
        title: "Thời gian kết thúc", 
        dataIndex: "end-date", 
        width: 150,
        render: (date: string) => date ? new Date(date).toLocaleDateString('vi-VN') : "—"
      },
    //   {
    //     title: "Tổng sản phẩm",
    //     dataIndex: "total-items",
    //     align: "center",
    //     width: 120,
    //     render: (total: number) => total || 0
    //   },
    //   {
    //     title: "Hoàn thành",
    //     dataIndex: "completed-items",
    //     align: "center", 
    //     width: 120,
    //     render: (completed: number) => completed || 0
    //   },
    //   {
    //     title: "Đang xử lý",
    //     dataIndex: "in-progress-items",
    //     align: "center",
    //     width: 120,
    //     render: (inProgress: number) => inProgress || 0
    //   },
    //   {
    //     title: "Chờ xử lý", 
    //     dataIndex: "pending-items",
    //     align: "center",
    //     width: 120,
    //     render: (pending: number) => pending || 0
    //   },
      {
        title: "Trạng thái",
        dataIndex: "status",
        width: 140,
        render: (status: string) => {
          const color = getStatusColor(status);
          return <Tag color={color}>{status}</Tag>;
        },
      },
    ],
    []
  );

  const filteredPlans = plans.filter(plan => {
    const matchesSearch = !filters.search || 
      plan.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      plan.id.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = !filters.status || plan.status === filters.status;
    
    return matchesSearch && matchesStatus;
  });

  const STATUS_OPTIONS = [
    { value: "Hoàn thành", label: "Hoàn thành" },
    { value: "Đang thực hiện", label: "Đang thực hiện" },
    { value: "Chưa bắt đầu", label: "Chưa bắt đầu" },
  ];

  return (
    <>
      {contextHolder}
      <div className="flex gap-4">
        {/* SIDEBAR FILTER */}
        <aside className="w-[300px] min-h-screen shrink-0 bg-white rounded-md border border-gray-200 p-3">
          <div className="mb-3">
            <Input
              allowClear
              prefix={<SearchOutlined />}
              placeholder="Tìm theo mã hoặc tên"
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              onPressEnter={(e) => handleSearch((e.target as HTMLInputElement).value)}
            />
          </div>

          <div className="space-y-4">
            {/* Trạng thái */}
            <div>
              <div className="text-[13px] font-semibold mb-1">Trạng thái</div>
              <Select
                allowClear
                className="w-full"
                placeholder="Chọn trạng thái"
                value={filters.status}
                options={STATUS_OPTIONS}
                onChange={handleStatusChange}
              />
            </div>

            <div className="pt-1">
              <Button type="link" onClick={resetFilters}>
                Mặc định
              </Button>
            </div>
          </div>
        </aside>

        {/* TABLE + EXPAND DETAIL INLINE */}
        <section className="flex-1">
          <div className="bg-white rounded-md border border-gray-200 min-h-screen">
            <div className="flex justify-between items-center px-4 py-2 border-b">
              <div className="text-[13px] text-gray-500">
                Tổng: <b>{filteredPlans.length.toLocaleString()}</b> kế hoạch
              </div>
              <div className="flex gap-2">
                <Button type="primary" onClick={handleCreateNew}>
                  + Tạo kế hoạch
                </Button>
                <Button>Xuất file</Button>
                <Button>⚙️</Button>
              </div>
            </div>

            {loading ? (
              <div className="py-10 flex justify-center">
                <Spin />
              </div>
            ) : (
              <Table
                rowKey="id"
                columns={columns}
                dataSource={filteredPlans}
                size="middle"
                pagination={{ 
                  total: filteredPlans.length,
                  current: filters.pageIndex,
                  pageSize: filters.pageSize,
                  showSizeChanger: true,
                  pageSizeOptions: ['15', '20', '30', '50'],
                  onShowSizeChange: (current, size) => {
                    setFilters(prev => ({ ...prev, pageSize: size, pageIndex: 1 }));
                  },
                  onChange: (page, pageSize) => {
                    setFilters(prev => ({ 
                      ...prev, 
                      pageIndex: page, 
                      pageSize: pageSize || prev.pageSize 
                    }));
                  },
                }}
                scroll={{ x: 800 }}
                expandable={{
                  expandedRowRender: (record) => (
                    <SalesPlanDetail 
                      planId={record.id}
                      onStatusUpdated={() => {
                        // Refresh data if needed
                        setExpandedRowKeys(prev => prev.filter(key => key !== record.id));
                      }}
                    />
                  ),
                  expandRowByClick: true,
                  expandedRowKeys,
                  onExpand: (expanded, record) => {
                    setExpandedRowKeys(expanded ? [record.id] : []);
                  },
                }}
                rowClassName="cursor-pointer hover:bg-blue-50"
                sticky
              />
            )}
          </div>
        </section>
      </div>
    </>
  );
}