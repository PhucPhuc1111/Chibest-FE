"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Table, Input, Button, InputNumber, Spin, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined } from "@ant-design/icons";
import { isAxiosError } from "axios";
import {
  useBranchDebtStore,
  type BranchDebtFilters,
} from "@/stores/useBranchDebtStore";
import type { BranchDebtListItem } from "@/types/branch";
import BranchDebtDetail from "./BranchDebtDetail";
import DateFilter, {
  type DateFilterValue,
  DEFAULT_DATE_PRESET,
} from "@/components/suppliers/components/DateFilter";
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

type SetFiltersFn = (params: Partial<BranchDebtFilters>) => void;
type ResetFiltersFn = () => void;

export default function BranchDebtList() {
  const { data, isLoading, getAll, setFilters, resetFilters, filters, total } =
    useBranchDebtStore();
  const router = useRouter();

  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const [isExporting, setIsExporting] = useState(false);

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

  const columns: ColumnsType<BranchDebtListItem> = useMemo(
    () => [
      {
        title: "STT",
        dataIndex: "index",
        width: 90,
        fixed: "left",
        render: (_value, _record, index) =>
          (pageIndex - 1) * pageSize + index + 1,
      },
      { title: "Tên chi nhánh", dataIndex: "name", width: 250 },
      { title: "Email", dataIndex: "email", width: 210 },
      {
        title: "Tổng nợ",
        dataIndex: "totalDebt",
        width: 190,
        render: (v?: number) => (v ?? 0).toLocaleString("vi-VN") + " ₫",
      },
      {
        title: "Đã trả (có)",
        dataIndex: "paidAmount",
        width: 190,
        render: (v?: number) => (v ?? 0).toLocaleString("vi-VN") + " ₫",
      },
      {
        title: "Hàng trả",
        dataIndex: "returnAmount",
        width: 190,
        render: (v?: number) => (v ?? 0).toLocaleString("vi-VN") + " ₫",
      },
      {
        title: "Nợ cần trả",
        dataIndex: "remainingDebt",
        width: 190,
        render: (v?: number) => (
          <span className="font-semibold">
            {(v ?? 0).toLocaleString("vi-VN") + " ₫"}
          </span>
        ),
      },
      {
        title: "Giao dịch gần nhất",
        dataIndex: "lastTransactionDate",
        width: 210,
        render: (v?: string) =>
          v ? new Date(v).toLocaleString("vi-VN") : "Chưa có dữ liệu",
      },
    ],
    [pageIndex, pageSize]
  );

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

      const response = await api.get<Blob>("/api/branch-debt/export", {
        params,
        responseType: "blob",
      });

      const blob = response.data;
      const contentDisposition =
        response.headers["content-disposition"] ??
        response.headers["Content-Disposition"];
      const fileName =
        getFileNameFromContentDisposition(contentDisposition) ??
        "BranchDebts.xlsx";

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
    <div className="flex gap-4">
      <aside className="w-[300px] shrink-0 bg-white rounded-md border border-gray-200 p-3">
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          resetFilters={resetFilters}
          dateFilterValue={dateFilterValue}
        />
      </aside>

      <section className="flex-1">
        <div className="bg-white rounded-md border border-gray-200">
          <div className="flex justify-between items-center px-4 py-2 border-b">
            <div className="text-[13px] text-gray-500">
              Tổng: <b>{total.toLocaleString()}</b> chi nhánh
            </div>
            <div className="flex gap-2">
              <Button type="primary" onClick={() => router.push("/branch")}>
                + Chi nhánh
              </Button>
              <Button>Import file</Button>
              <Button loading={isExporting} onClick={handleExport}>
                Xuất file
              </Button>
              <Button>⚙️</Button>
            </div>
          </div>

          {isLoading ? (
            <div className="py-10 flex justify-center">
              <Spin />
            </div>
          ) : (
            <Table<BranchDebtListItem>
              rowKey="id"
              columns={columns}
              dataSource={data}
              size="middle"
              pagination={{
                current: filters.pageIndex,
                pageSize: filters.pageSize,
                total,
                showSizeChanger: true,
                pageSizeOptions: ["10", "15", "20", "50"],
              }}
              onChange={(pagination) => {
                setFilters({
                  pageIndex: pagination.current ?? 1,
                  pageSize: pagination.pageSize ?? filters.pageSize,
                });
              }}
              scroll={{ x: 1200 }}
              expandable={{
                expandedRowRender: (record) => (
                  <div className="px-3 py-2">
                    <BranchDebtDetail branch={record} />
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

type FilterSidebarProps = {
  filters: BranchDebtFilters;
  setFilters: SetFiltersFn;
  resetFilters: ResetFiltersFn;
  dateFilterValue: DateFilterValue;
};

function FilterSidebar({
  filters,
  setFilters,
  resetFilters,
  dateFilterValue,
}: FilterSidebarProps) {
  const [searchValue, setSearchValue] = useState(filters.search ?? "");
  const [totalFromValue, setTotalFromValue] = useState<number | null>(
    filters.totalFrom ?? null
  );
  const [totalToValue, setTotalToValue] = useState<number | null>(
    filters.totalTo ?? null
  );
  const [debtFromValue, setDebtFromValue] = useState<number | null>(
    filters.debtFrom ?? null
  );
  const [debtToValue, setDebtToValue] = useState<number | null>(
    filters.debtTo ?? null
  );

  useEffect(() => {
    setSearchValue(filters.search ?? "");
  }, [filters.search]);

  useEffect(() => {
    setTotalFromValue(filters.totalFrom ?? null);
  }, [filters.totalFrom]);

  useEffect(() => {
    setTotalToValue(filters.totalTo ?? null);
  }, [filters.totalTo]);

  useEffect(() => {
    setDebtFromValue(filters.debtFrom ?? null);
  }, [filters.debtFrom]);

  useEffect(() => {
    setDebtToValue(filters.debtTo ?? null);
  }, [filters.debtTo]);

  return (
    <>
      <div className="mb-3">
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder="Theo mã, tên, email"
          value={searchValue}
          onPressEnter={() =>
            setFilters({
              search: searchValue.trim(),
              pageIndex: 1,
            })
          }
          onChange={(e) => setSearchValue(e.target.value)}
          onBlur={() =>
            setFilters({
              search: searchValue.trim(),
              pageIndex: 1,
            })
          }
        />
      </div>

      <div className="space-y-4">
        <div>
          <div className="text-[13px] font-semibold mb-1">Tổng nợ</div>
          <div className="flex flex-col space-y-2">
            <div className="w-full">
              <InputNumber
                className="w-full"
                placeholder="Từ"
                value={totalFromValue ?? undefined}
                onChange={(value) => setTotalFromValue(value ?? null)}
                onBlur={() =>
                  setFilters({
                    totalFrom: totalFromValue ?? null,
                    pageIndex: 1,
                  })
                }
              />
            </div>
            <div className="w-full">
              <InputNumber
                className="w-full"
                placeholder="Tới"
                value={totalToValue ?? undefined}
                onChange={(value) => setTotalToValue(value ?? null)}
                onBlur={() =>
                  setFilters({
                    totalTo: totalToValue ?? null,
                    pageIndex: 1,
                  })
                }
              />
            </div>
          </div>
        </div>

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

        <div>
          <div className="text-[13px] font-semibold mb-1">Nợ hiện tại</div>
          <div className="flex flex-col space-y-2">
            <div className="w-full">
              <InputNumber
                className="w-full"
                placeholder="Từ"
                value={debtFromValue ?? undefined}
                onChange={(value) => setDebtFromValue(value ?? null)}
                onBlur={() =>
                  setFilters({
                    debtFrom: debtFromValue ?? null,
                    pageIndex: 1,
                  })
                }
              />
            </div>
            <div className="w-full">
              <InputNumber
                className="w-full"
                placeholder="Tới"
                value={debtToValue ?? undefined}
                onChange={(value) => setDebtToValue(value ?? null)}
                onBlur={() =>
                  setFilters({
                    debtTo: debtToValue ?? null,
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
    </>
  );
}

