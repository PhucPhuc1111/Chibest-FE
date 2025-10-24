"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Table,
  Tag,
  Input,
  Button,
  Select,
  DatePicker,
  Checkbox,
  Spin,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined } from "@ant-design/icons";
import { useTransferStore } from "@/stores/useTransferStore";
import type { Transfer, TransferStatus } from "@/types/transfer";
import TransferDetail from "./TransferDetail";

const { RangePicker } = DatePicker;

export default function TransferList() {
  const {
    transfers,
    isLoading,
    getAllTransfers,
    setFilters,
    resetFilters,
    filters,
    getTransferById,
    details,
  } = useTransferStore();

  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    getAllTransfers();
  }, [filters, getAllTransfers]);

  const columns: ColumnsType<Transfer> = useMemo(
    () => [
      {
        title: "",
        dataIndex: "_select",
        width: 48,
        fixed: "left",
        render: () => <input type="checkbox" className="mx-2" />,
      },
      { title: "Mã chuyển hàng", dataIndex: "id", width: 180, fixed: "left" },
      { title: "Ngày chuyển", dataIndex: "dateTransfer", width: 180 },
      { title: "Ngày nhận", dataIndex: "dateReceive", width: 180 },
      { title: "Từ chi nhánh", dataIndex: "fromBranch", width: 180 },
      { title: "Tới chi nhánh", dataIndex: "toBranch", width: 180 },
      {
        title: "Giá trị chuyển",
        dataIndex: "value",
        align: "right",
        width: 160,
        render: (v: number) => v?.toLocaleString(),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        width: 140,
        render: (v) => {
          const color =
            v === "Phiếu tạm" ? "orange" : v === "Đang chuyển" ? "blue" : "green";
          return <Tag color={color}>{v}</Tag>;
        },
      },
    ],
    []
  );

  return (
    <div className="flex gap-4">
      {/* ===== Sidebar Filter ===== */}
      <aside className="w-[300px] shrink-0 bg-white rounded-md border border-gray-200 p-3">
        <div className="mb-3">
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Theo mã phiếu chuyển"
            defaultValue={filters.q}
            onPressEnter={(e) =>
              setFilters({ q: (e.target as HTMLInputElement).value })
            }
            onBlur={(e) =>
              setFilters({ q: (e.target as HTMLInputElement).value })
            }
          />
        </div>

        <div className="space-y-4">
          {/* Chuyển đi */}
          <div>
            <div className="text-[13px] font-semibold mb-1">Chuyển đi</div>
            <Select
              className="w-full"
              allowClear
              placeholder="Chọn chi nhánh"
              options={[
                { label: "Chibest Quận 4", value: "Chibest Quận 4" },
                { label: "Chibest Thủ Đức", value: "Chibest Thủ Đức" },
                { label: "CHIBEST", value: "CHIBEST" },
              ]}
              onChange={(v) => setFilters({ fromBranch: v ?? null })}
            />
          </div>

          {/* Nhận về */}
          <div>
            <div className="text-[13px] font-semibold mb-1">Nhận về</div>
            <Select
              className="w-full"
              allowClear
              placeholder="Chọn chi nhánh"
              options={[
                { label: "Chibest Quận 4", value: "Chibest Quận 4" },
                { label: "Chibest Thủ Đức", value: "Chibest Thủ Đức" },
                { label: "CHIBEST", value: "CHIBEST" },
              ]}
              onChange={(v) => setFilters({ toBranch: v ?? null })}
            />
          </div>

          {/* Trạng thái */}
          <div>
            <div className="text-[13px] font-semibold mb-1">Trạng thái</div>
            <Select<TransferStatus[]>
              mode="multiple"
              allowClear
              className="w-full"
              placeholder="Chọn trạng thái"
              value={filters.status}
              options={[
                { label: "Phiếu tạm", value: "Phiếu tạm" },
                { label: "Đang chuyển", value: "Đang chuyển" },
                { label: "Đã nhận", value: "Đã nhận" },
              ]}
              onChange={(v) => setFilters({ status: v && v.length ? v : undefined })}
            />
          </div>

          {/* Thời gian */}
          <div>
            <div className="text-[13px] font-semibold mb-1">Thời gian</div>
            <RangePicker
              className="w-full"
              onChange={(val) =>
                setFilters({
                  fromDate: val?.[0]?.toISOString() ?? null,
                  toDate: val?.[1]?.toISOString() ?? null,
                })
              }
            />
          </div>

          {/* Tình trạng nhận hàng */}
          <div>
            <div className="text-[13px] font-semibold mb-1">
              Tình trạng nhận hàng
            </div>
            <div className="flex flex-wrap gap-2">
              <Checkbox> Tất cả </Checkbox>
              <Checkbox> Không khớp </Checkbox>
              <Checkbox> Khớp </Checkbox>
            </div>
          </div>

          <div className="pt-1">
            <Button type="link" onClick={resetFilters}>
              Mặc định
            </Button>
          </div>
        </div>
      </aside>

      {/* ===== Table + Master-detail inline ===== */}
      <section className="flex-1">
        <div className="bg-white rounded-md border border-gray-200">
          <div className="flex justify-between items-center px-4 py-2 border-b">
            <div className="text-[13px] text-gray-500">
              Tổng: <b>{transfers.length.toLocaleString()}</b> giao dịch
            </div>
            <div className="flex gap-2">
              <Button type="primary">+ Chuyển hàng</Button>
              <Button>Import file</Button>
              <Button>Xuất file</Button>
              <Button>⚙️</Button>
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
              dataSource={transfers}
              size="middle"
              pagination={{
                pageSize: 15,
                showTotal: (t) => `1 - ${Math.min(15, t)} trong ${t} giao dịch`,
              }}
              scroll={{ x: 1200 }}
              expandable={{
                expandedRowRender: (record) => {
                  const cached = details[record.id];
                  if (!cached) {
                    getTransferById(record.id);
                    return (
                      <div className="p-4 text-gray-500 italic">
                        Đang tải chi tiết phiếu {record.id}...
                      </div>
                    );
                  }
                  return <TransferDetail transfer={cached} />;
                },
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
