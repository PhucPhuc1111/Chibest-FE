"use client";

import { useEffect, useMemo, useState } from "react";
import { Table, Tag, Input, Button, Select, Spin, message } from "antd";
import type { TableProps } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { usePurchaseOrderStore } from "@/stores/usePurchaseOrderStore";
import { useSessionStore } from "@/stores/useSessionStore";
import type { PurchaseOrderSummary, PurchaseOrderStatus } from "@/types/purchaseOrder";
import PurchaseOrderDetail from "./PurchaseOrderDetail";
import DateFilter from "../ui/DateFilter/DateFilter";

export default function PurchaseOrderList() {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const {
    list,
    isLoading,
    getAll,
    setFilters,
    resetFilters,
    filters,
  } = usePurchaseOrderStore();
  const userBranchId = useSessionStore((state) => state.userBranchId);
  const activeBranchId = useSessionStore((state) => state.activeBranchId);

  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "blue"; 
      case "Submitted":
        return "orange"; 
      case "Received":
        return "green"; 
      case "Cancelled":
        return "red"; 
      default:
        return "default"; 
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case "Draft":
        return "Nháp";
      case "Submitted":
        return "Đã gửi";
      case "Received":
        return "Đã nhận";
      case "Cancelled":
        return "Đã hủy";
      default:
        return status; 
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const result = await getAll();
      if (!result.success && result.message) {
        messageApi.warning(result.message);
      }
    };
    loadData();
  }, [filters, getAll, messageApi]);

  useEffect(() => {
    const branchId = userBranchId ?? activeBranchId ?? null;
    if (filters.branchId !== branchId) {
      setFilters({ branchId, pageIndex: 1 });
    }
  }, [userBranchId, activeBranchId, filters.branchId, setFilters]);

  const handleCreateNew = () => {
    router.push("/purchaseOrder/new");
  };

  const handleSearch = (value: string) => {
    setFilters({ search: value, pageIndex: 1 });
  };

  const columns: TableProps<PurchaseOrderSummary>["columns"] = useMemo(
    () => [
      {
        title: "",
        dataIndex: "_select",
        width: 48,
        fixed: "left",
        render: () => <input type="checkbox" className="mx-2" />,
      },
      { 
        title: "Mã phiếu nhập", 
        dataIndex: "code", 
        width: 160, 
        fixed: "left",
        render: (code: string) => code || "—"
      },
      { 
        title: "Thời gian", 
        dataIndex: "time", 
        width: 180,
        render: (time: string) => time ? new Date(time).toLocaleDateString('vi-VN') : "—"
      },
      { 
        title: "Nhà cung cấp", 
        dataIndex: "supplierName", 
        width: 240,
        render: (name: string) => name || "—"
      },
      {
        title: "Tổng tiền",
        dataIndex: "subTotal",
        align: "right",
        width: 160,
        render: (v: number) => v?.toLocaleString("vi-VN") + " đ" || "0 đ",
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        width: 140,
        render: (status: PurchaseOrderStatus) => {
          const color = getStatusColor(status);
          const displayName = getStatusDisplayName(status);
          return <Tag color={color}>{displayName}</Tag>;
        },
      },
    ],
    []
  );

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
              placeholder="Theo mã phiếu nhập"
              defaultValue={filters.search}
              onPressEnter={(e) => handleSearch((e.target as HTMLInputElement).value)}
              onBlur={(e) => handleSearch(e.target.value)}
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
                options={[
                  { label: "Nháp", value: "Draft" },
                  { label: "Đã gửi", value: "Submitted" },
                  { label: "Đã nhận", value: "Received" },
                  { label: "Đã hủy", value: "Cancelled" },
                ]}
                onChange={(value) => setFilters({ status: value, pageIndex: 1 })}
              />
            </div>

            {/* Thời gian */}
            <div>
              <div className="text-[13px] font-semibold mb-1">Thời gian</div>
              <DateFilter 
                onChange={(val) => {
                  const [from, to] = val.value;
                  setFilters({ fromDate: from, toDate: to, pageIndex: 1 });
                }}  
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
                Tổng: <b>{list.length.toLocaleString()}</b> phiếu nhập
              </div>
              <div className="flex gap-2">
                <Button type="primary" onClick={handleCreateNew}>
                  + Nhập hàng
                </Button>
                <Button>Xuất file</Button>
                <Button>⚙️</Button>
              </div>
            </div>

            {isLoading ? (
              <div className="py-10 flex justify-center">
                <Spin />
              </div>
            ) : (
              <Table<PurchaseOrderSummary>
                rowKey="id"
                columns={columns}
                dataSource={list}
                size="middle"
                pagination={{ 
                  pageSize: filters.pageSize, 
                  showSizeChanger: true,
                  pageSizeOptions: ['15', '20', '30', '50'],
                  total: list.length,
                  current: filters.pageIndex,
                  onShowSizeChange: (current, size) => {
                    setFilters({ pageSize: Number(size), pageIndex: 1 });
                  },
                  onChange: (page, pageSize) => setFilters({ pageIndex: page, pageSize }),
                }}
                scroll={{ x: 1200 }}
                expandable={{
                  expandedRowRender: (record) => (
                    // <PurchaseOrderDetail id={record.id} />
                     <PurchaseOrderDetail 
      id={record.id} 
      onDeleted={() => {
        // Đơn giản là đóng tất cả expanded rows
        setExpandedRowKeys([]);
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