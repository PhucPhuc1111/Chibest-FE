"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Table,
  Input,
  Button,
  InputNumber,
  Spin,
  Drawer,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import { isAxiosError } from "axios";
import {
  useSupplierStore,
  type SupplierFilters,
} from "@/stores/useSupplierStore";
import type { SupplierDebtListItem } from "@/types/supplier";
import SupplierDetail from "./SupplierDetail";
import DateFilter, {
  type DateFilterValue,
  DEFAULT_DATE_PRESET,
} from "./components/DateFilter";
import api from "@/api/axiosInstance";
import { useRouter } from "next/navigation";

function getFileNameFromContentDisposition(
  contentDisposition?: string
): string | null {
  if (!contentDisposition) {
    return null;
  }

  const fileNameStarMatch = contentDisposition.match(
    /filename\*=(?:UTF-8'')?([^;]+)/i
  );
  if (fileNameStarMatch?.[1]) {
    return decodeURIComponent(fileNameStarMatch[1].replace(/['"]/g, "").trim());
  }

  const fileNameMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
  if (fileNameMatch?.[1]) {
    return fileNameMatch[1].trim();
  }

  return null;
}

type SetFiltersFn = (params: Partial<SupplierFilters>) => void;
type ResetFiltersFn = () => void;

export default function SupplierList() {
  const { data, isLoading, getAll, setFilters, resetFilters, filters, total } =
    useSupplierStore();
  const router = useRouter();

  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Check mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // fetch mỗi khi filter đổi
  useEffect(() => {
    getAll();
  }, [filters, getAll]);

  const pageIndex = filters.pageIndex ?? 1;
  const pageSize = filters.pageSize ?? 15;

  const dateFilterValue = useMemo<DateFilterValue>(() => {
    if (filters.datePreset) {
      return { mode: "preset", preset: filters.datePreset };
    }

    if (filters.fromDate && filters.toDate) {
      return {
        mode: "custom",
        range: [filters.fromDate, filters.toDate],
      };
    }

    return { mode: "preset", preset: DEFAULT_DATE_PRESET };
  }, [filters.datePreset, filters.fromDate, filters.toDate]);

  const mobileColumns: ColumnsType<SupplierDebtListItem> = useMemo(() => [
    {
      title: "Nhà cung cấp",
      dataIndex: "name",
      fixed: "left",
      render: (name: string, record) => (
        <div className="text-xs">
          <div className="font-semibold truncate">{name}</div>
          <div className="text-gray-500">{record.phone || "—"}</div>
          <div className="font-semibold text-red-600">
            {(record.remainingDebt ?? 0).toLocaleString("vi-VN") + " ₫"}
          </div>
        </div>
      ),
    },
    {
      title: "Giao dịch",
      dataIndex: "lastTransactionDate",
      width: 120,
      render: (v?: string) => (
        <div className="text-xs">
          {v ? new Date(v).toLocaleDateString('vi-VN') : "—"}
        </div>
      ),
    },
  ], []);

  const desktopColumns: ColumnsType<SupplierDebtListItem> = useMemo(() => [
    {
      title: "STT",
      dataIndex: "index",
      width: 70,
      fixed: "left",
      render: (_value, _record, index) =>
        (pageIndex - 1) * pageSize + index + 1,
    },
    { 
      title: "Tên nhà cung cấp", 
      dataIndex: "name", 
      width: 200,
      render: (name: string) => (
        <div className="text-sm">{name}</div>
      )
    },
    { 
      title: "Điện thoại", 
      dataIndex: "phone", 
      width: 120,
      responsive: ['md'] as const,
    },
    {
      title: "Hàng Lỗi/Trả",
      dataIndex: "returnAmount",
      width: 140,
      responsive: ['lg'] as const,
      render: (v?: number) => (v ?? 0).toLocaleString("vi-VN") + " ₫",
    },
    {
      title: "Đã trả (có)",
      dataIndex: "payAmount",
      width: 140,
      responsive: ['lg'] as const,
      render: (v?: number) => (v ?? 0).toLocaleString("vi-VN") + " ₫",
    },
    {
      title: "Tổng nợ",
      dataIndex: "totalDebt",
      width: 140,
      responsive: ['md'] as const,
      render: (v?: number) => (v ?? 0).toLocaleString("vi-VN") + " ₫",
    },
    {
      title: "Nợ cần trả",
      dataIndex: "remainingDebt",
      width: 150,
      render: (v?: number) => (
        <span className="font-semibold text-sm">
          {(v ?? 0).toLocaleString("vi-VN") + " ₫"}
        </span>
      ),
    },
    {
      title: "Giao dịch gần nhất",
      dataIndex: "lastTransactionDate",
      width: 160,
      responsive: ['xl'] as const,
      render: (v?: string) =>
        v ? new Date(v).toLocaleString("vi-VN") : "—",
    },
  ], [pageIndex, pageSize]);

  const handleExport = useCallback(async () => {
    try {
      setIsExporting(true);

      const params: Record<string, unknown> = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (
          value === undefined ||
          value === null ||
          value === "" ||
          value === "all" ||
          key === "pageIndex" ||
          key === "pageSize"
        ) {
          return;
        }
        params[key] = value;
      });

      const response = await api.get<Blob>("/api/supplier-debt/export", {
        params,
        responseType: "blob",
      });

      const blob = response.data;
      const contentDisposition =
        response.headers["content-disposition"] ??
        response.headers["Content-Disposition"];
      const fileName =
        getFileNameFromContentDisposition(contentDisposition) ??
        "SupplierDebts.xlsx";

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      message.success("Xuất file thành công");
    } catch (error) {
      let errorMessage = "Xuất file thất bại";

      if (isAxiosError(error)) {
        const apiMessage = (error.response?.data as { message?: string })?.message;
        if (apiMessage) {
          errorMessage = apiMessage;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      message.error(errorMessage);
    } finally {
      setIsExporting(false);
    }
  }, [filters]);

  return (
    <div className="flex gap-4 flex-col lg:flex-row">
      {/* Filter Toggle Button for Mobile */}
      <div className="lg:hidden">
        <Button 
          icon={<FilterOutlined />}
          onClick={() => setShowFilters(true)}
          className="w-full"
        >
          Bộ lọc
        </Button>
      </div>

      {/* Filter Drawer for Mobile */}
      <Drawer
        title="Bộ lọc"
        placement="left"
        open={showFilters}
        onClose={() => setShowFilters(false)}
        width={300}
      >
        <FilterContent
          filters={filters}
          setFilters={setFilters}
          resetFilters={resetFilters}
          dateFilterValue={dateFilterValue}
        />
      </Drawer>

      {/* Sidebar Filter for Desktop */}
      <aside className="hidden lg:block w-[300px] shrink-0 bg-white rounded-md border border-gray-200 p-3">
        <FilterContent
          filters={filters}
          setFilters={setFilters}
          resetFilters={resetFilters}
          dateFilterValue={dateFilterValue}
        />
      </aside>

      {/* Table + inline detail */}
      <section className="flex-1 min-w-0">
        <div className="bg-white rounded-md border border-gray-200 overflow-x-auto">
          {/* Responsive Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 px-3 sm:px-4 py-2 border-b">
            <div className="text-xs sm:text-[13px] text-gray-500 whitespace-nowrap">
              Tổng: <b>{total.toLocaleString()}</b> nhà cung cấp
            </div>
            <div className="flex gap-1 sm:gap-2 flex-wrap">
              <Button 
                type="primary" 
                size="small" 
                className="text-xs sm:text-base h-7 sm:h-auto"
                onClick={() => router.push("/account")}
              >
                + Nhà cung cấp
              </Button>
              <Button 
                size="small" 
                className="text-xs sm:text-base h-7 sm:h-auto"
              >
                Import
              </Button>
              <Button
                size="small"
                className="text-xs sm:text-base h-7 sm:h-auto"
                loading={isExporting}
                onClick={handleExport}
              >
                Xuất file
              </Button>
              <Button 
                size="small" 
                className="text-xs sm:text-base h-7 sm:h-auto"
              >
                ⚙️
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="py-10 flex justify-center">
              <Spin />
            </div>
          ) : (
            <Table<SupplierDebtListItem>
              rowKey="id"
              columns={isMobile ? mobileColumns : desktopColumns}
              dataSource={data}
              size="middle"
              pagination={{
                current: filters.pageIndex,
                pageSize: filters.pageSize,
                total,
                showSizeChanger: !isMobile,
                simple: isMobile,
                responsive: true,
                pageSizeOptions: ["10", "15", "20", "50"],
                showTotal: (total, range) => 
                  isMobile ? `${range[0]}-${range[1]} của ${total}` : `Hiển thị ${range[0]}-${range[1]} của ${total} mục`,
              }}
              onChange={(pagination) => {
                setFilters({
                  pageIndex: pagination.current ?? 1,
                  pageSize: pagination.pageSize ?? filters.pageSize,
                });
              }}
              scroll={{ 
                x: isMobile ? 500 : 800,
                y: 600 
              }}
              expandable={{
                expandedRowRender: (record) => (
                  <div className="px-3 py-2">
                    <SupplierDetail supplier={record} /> 
                  </div>
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
  );
}

type FilterContentProps = {
  filters: SupplierFilters;
  setFilters: SetFiltersFn;
  resetFilters: ResetFiltersFn;
  dateFilterValue: DateFilterValue;
};

function FilterContent({
  filters,
  setFilters,
  resetFilters,
  dateFilterValue,
}: FilterContentProps) {
  return (
    <div className="space-y-4">
      <div className="mb-3">
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder="Theo mã, tên, số điện thoại"
          defaultValue={filters.q}
          onPressEnter={(e) =>
            setFilters({
              q: (e.target as HTMLInputElement).value,
              pageIndex: 1,
            })
          }
          onBlur={(e) =>
            setFilters({
              q: (e.target as HTMLInputElement).value,
              pageIndex: 1,
            })
          }
        />
      </div>

      <div className="space-y-4">
        <div>
          <div className="text-[13px] font-semibold mb-1">Tổng mua</div>
          <div className="flex flex-col space-y-2">
            <div className="w-full">
              <InputNumber
                className="w-full"
                placeholder="Từ"
                onBlur={(e) =>
                  setFilters({
                    totalFrom:
                      Number((e.target as HTMLInputElement).value) || null,
                    pageIndex: 1,
                  })
                }
              />
            </div>
            <div className="w-full">
              <InputNumber
                className="w-full"
                placeholder="Tới"
                onBlur={(e) =>
                  setFilters({
                    totalTo:
                      Number((e.target as HTMLInputElement).value) || null,
                    pageIndex: 1,
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Thời gian */}
        <div>
          <div className="text-[13px] font-semibold mb-1">Thời gian</div>
          <DateFilter
            value={dateFilterValue}
            onChange={(val) => {
              if (val.mode === "preset") {
                setFilters({
                  datePreset: val.value,
                  fromDate: null,
                  toDate: null,
                  pageIndex: 1,
                });
              } else {
                const [from, to] = val.value;
                setFilters({
                  fromDate: from,
                  toDate: to,
                  datePreset: null,
                  pageIndex: 1,
                });
              }
            }}
          />
        </div>

        {/* Nợ hiện tại */}
        <div>
          <div className="text-[13px] font-semibold mb-1">Nợ hiện tại</div>
          <div className="flex flex-col space-y-2">
            <div className="w-full">
              <InputNumber
                className="w-full"
                placeholder="Từ"
                onBlur={(e) =>
                  setFilters({
                    debtFrom:
                      Number((e.target as HTMLInputElement).value) || null,
                    pageIndex: 1,
                  })
                }
              />
            </div>
            <div className="w-full">
              <InputNumber
                className="w-full"
                placeholder="Tới"
                onBlur={(e) =>
                  setFilters({
                    debtTo:
                      Number((e.target as HTMLInputElement).value) || null,
                    pageIndex: 1,
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="pt-1">
          <Button type="link" onClick={resetFilters}>
            Mặc định
          </Button>
        </div>
      </div>
    </div>
  );
}