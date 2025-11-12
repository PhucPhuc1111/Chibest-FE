"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Table,
  Tag,
  Input,
  Button,
  Select,
  Spin,
} from "antd";
import { SearchOutlined, PlusOutlined, ExportOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { StockAdjustmentSummary } from "../../types/stocktake";
import useStockTakeStore from "../../stores/useStockTakeStore";
import StockTakeDetail from "./StockTakeDetail";
import StockDateFilter, { StockDateFilterChange } from "./components/StockDateFilter";
import { useRouter } from "next/navigation";

export default function StockTakeList() {
  const router = useRouter();
  const {
    stockAdjustments,
    isLoading,
    getStockAdjustments,
  } = useStockTakeStore();

  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const [searchParams, setSearchParams] = useState({
    search: "",
    status: undefined as string | undefined,
    fromDate: undefined as string | undefined,
    toDate: undefined as string | undefined,
  });

  useEffect(() => {
    getStockAdjustments(searchParams);
  }, [getStockAdjustments, searchParams]); // Thêm getStockAdjustments vào dependency

  const columns: ColumnsType<StockAdjustmentSummary> = useMemo(
    () => [
      { 
        title: "Mã điều chỉnh", 
        dataIndex: "adjustmentCode", 
        width: 200,
        render: (code: string) => <span className="font-medium">{code}</span>
      },
      { 
        title: "Ngày điều chỉnh", 
        dataIndex: "adjustmentDate", 
        width: 180,
        render: (date: string) => new Date(date).toLocaleDateString('vi-VN')
      },
      { 
        title: "Loại điều chỉnh", 
        dataIndex: "adjustmentType", 
        width: 150,
        render: (type: string) => <Tag color="blue">{type}</Tag>
      },
      {
        title: "Giá trị thay đổi",
        dataIndex: "totalValueChange",
        align: "right",
        width: 160,
        render: (value: number) => (
          <span className={value >= 0 ? "text-green-600" : "text-red-600"}>
            {value >= 0 ? '+' : ''}{value.toLocaleString('vi-VN')} ₫
          </span>
        ),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        width: 150,
        render: (status: string) => {
          const colorMap: { [key: string]: string } = {
            'Đã Duyệt': 'green',
            'Chờ Duyệt': 'orange',
            'Đã Hủy': 'red',
            'Tạm': 'blue',
          };
          return <Tag color={colorMap[status] || 'default'}>{status}</Tag>;
        },
      },
    ],
    []
  );

  const handleSearch = (value: string) => {
    setSearchParams(prev => ({ ...prev, search: value }));
  };

  const handleStatusChange = (value: string | undefined) => {
    setSearchParams(prev => ({ ...prev, status: value }));
  };

  const handleDateFilterChange = (val: StockDateFilterChange) => {
    if (val.mode === "preset") {
      // Xử lý preset date nếu cần
    } else {
      const [from, to] = val.value;
      setSearchParams(prev => ({ 
        ...prev, 
        fromDate: from, 
        toDate: to 
      }));
    }
  };

  const handleResetFilters = () => {
    setSearchParams({
      search: "",
      status: undefined,
      fromDate: undefined,
      toDate: undefined,
    });
  };

  const handleCreateNew = () => {
    router.push("/stocktakes/new"); // Điều hướng đến trang tạo mới
  };

  return (
    <div className="flex gap-4 flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-[300px] xl:w-[320px] bg-white border rounded-md p-3 shrink-0">
        <div className="mb-3">
          <Input
            prefix={<SearchOutlined />}
            allowClear
            placeholder="Tìm mã điều chỉnh"
            value={searchParams.search}
            onChange={(e) => handleSearch(e.target.value)}
            onPressEnter={(e) => handleSearch((e.target as HTMLInputElement).value)}
          />
        </div>

        <div className="space-y-4">
          <div>
            <StockDateFilter
              onChange={handleDateFilterChange}
            />
          </div>

          <div>
            <div className="text-[13px] font-semibold mb-1">Trạng thái</div>
            <Select
              allowClear
              className="w-full"
              placeholder="Chọn trạng thái"
              options={[
                { label: "Đã Duyệt", value: "Đã Duyệt" },
                { label: "Chờ Duyệt", value: "Chờ Duyệt" },
                { label: "Đã Hủy", value: "Đã Hủy" },
                { label: "Tạm", value: "Tạm" },
              ]}
              value={searchParams.status}
              onChange={handleStatusChange}
            />
          </div>

          <div className="pt-1">
            <Button type="link" onClick={handleResetFilters}>
              Mặc định
            </Button>
          </div>
        </div>
      </aside>

      {/* Table */}
      <section className="flex-1 min-w-0">
        <div className="bg-white border rounded-md overflow-x-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 px-4 py-2 border-b">
            <div className="text-[13px] text-gray-500 whitespace-nowrap">
              Tổng: <b>{stockAdjustments.length}</b> phiếu điều chỉnh
            </div>
            <div className="flex gap-2 shrink-0">
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleCreateNew}
              >
                Tạo điều chỉnh
              </Button>
              <Button type="default" icon={<ExportOutlined />}>
                Xuất file
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="py-10 flex justify-center">
              <Spin />
            </div>
          ) : (
            <Table
              rowKey="id"
              columns={columns}
              dataSource={stockAdjustments}
              size="middle"
              pagination={{
                pageSize: 15,
                showTotal: (total) => `1 - ${Math.min(15, total)} trong ${total} phiếu`,
              }}
              scroll={{ x: 800 }}
              expandable={{
                expandedRowRender: (record) => (
                  <StockTakeDetail adjustmentId={record.id} />
                ),
                expandRowByClick: true,
                expandedRowKeys,
                onExpand: (expanded, record) => {
                  setExpandedRowKeys(expanded ? [record.id] : []);
                },
              }}
            />
          )}
        </div>
      </section>
    </div>
  );
}