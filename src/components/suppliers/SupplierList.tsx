"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Table,
  // Tag,
  Input,
  Button,
  InputNumber,
  // DatePicker,
  Spin,
  // Radio,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined } from "@ant-design/icons";
import { useSupplierStore } from "@/stores/useSupplierStore";
import type { SupplierDebtListItem } from "@/types/supplier";
import SupplierDetail from "./SupplierDetail";
import DateFilter from "./components/DateFilter";
// const { RangePicker } = DatePicker;

export default function SupplierList() {
  const { data, isLoading, getAll, setFilters, resetFilters, filters, total } =
    useSupplierStore();

  // chỉ mở 1 hàng giống KiotViet
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

  // fetch mỗi khi filter đổi
  useEffect(() => {
    getAll();
  }, [filters, getAll]);


  const pageIndex = filters.pageIndex ?? 1;
  const pageSize = filters.pageSize ?? 15;

  const columns: ColumnsType<SupplierDebtListItem> = useMemo(() => [
    {
      title: "STT",
      dataIndex: "index",
      width: 90,
      fixed: "left",
      render: (_value, _record, index) =>
        (pageIndex - 1) * pageSize + index + 1,
    },
    { title: "Tên nhà cung cấp", dataIndex: "name", width: 250 },
    { title: "Điện thoại", dataIndex: "phone", width: 130 },
    {
      title: "Hàng Lỗi/Trả",
      dataIndex: "returnAmount",
      width: 190,
      render: (v?: number) => (v ?? 0).toLocaleString("vi-VN") + " ₫",
    },
    {
      title: "Đã trả (có)",
      dataIndex: "payAmount",
      width: 190,
      render: (v?: number) => (v ?? 0).toLocaleString("vi-VN") + " ₫",
    },
    {
      title: "Tổng nợ",
      dataIndex: "totalDebt",
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
  ], [pageIndex, pageSize]);

  return (
    <div className="flex gap-4">
      {/* Sidebar Filter */}
      <aside className="w-[300px] shrink-0 bg-white rounded-md border border-gray-200 p-3">
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
            <div className="flex flex-col  space-y-2
            ">
              <div  className="w-full ">
            <InputNumber
                
                style={{width:275}}
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
              <div  className="w-full" >
                <InputNumber
                 style={{width:275}}
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
          <div className="">
            <div className="text-[13px] font-semibold mb-1">Thời gian</div>
            
                 <DateFilter 
                          onChange={(val) => {
                            if (val.mode === "preset") {
                              setFilters({ datePreset: val.value, pageIndex: 1 }); // string
                            } else {
                              const [from, to] = val.value;          // [YYYY-MM-DD, YYYY-MM-DD]
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
            <div className="flex flex-col  space-y-2">
              <div className="w-full ">
                <InputNumber
                 style={{width:275}}
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
                style={{width:275}}
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
      </aside>

      {/* Table + inline detail */}
      <section className="flex-1">
        <div className="bg-white rounded-md border border-gray-200">
          <div className="flex justify-between items-center px-4 py-2 border-b">
            <div className="text-[13px] text-gray-500">
              Tổng: <b>{total.toLocaleString()}</b> nhà cung cấp
            </div>
            <div className="flex gap-2">
              <Button type="primary">+ Nhà cung cấp</Button>
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
            <Table<SupplierDebtListItem>
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
