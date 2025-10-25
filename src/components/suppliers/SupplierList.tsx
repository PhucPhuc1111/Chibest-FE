"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Table,
  // Tag,
  Input,
  Button,
  Select,
  InputNumber,
  // DatePicker,
  Spin,
  // Radio,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined } from "@ant-design/icons";
import { useSupplierStore } from "@/stores/useSupplierStore";
import type { Supplier } from "@/types/supplier";
import SupplierDetail from "./SupplierDetail";
import DateFilter from "./components/DateFilter";
// const { RangePicker } = DatePicker;

export default function SupplierList() {
  const { data, isLoading, getAll, setFilters, resetFilters, filters } =
    useSupplierStore();

  // chỉ mở 1 hàng giống KiotViet
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

  // fetch mỗi khi filter đổi
  useEffect(() => {
    getAll();
  }, [filters, getAll]);

  // build nhóm NCC từ data demo
  const groups = useMemo(
    () => Array.from(new Set(data.map((d) => d.group).filter(Boolean))) as string[],
    [data]
  );

  const columns: ColumnsType<Supplier> = [
    {
      title: "",
      dataIndex: "_select",
      width: 48,
      fixed: "left",
      render: () => <input type="checkbox" className="mx-2" />,
    },
    { title: "Mã nhà cung cấp", dataIndex: "id", width: 160, fixed: "left" },
    { title: "Tên nhà cung cấp", dataIndex: "name", width: 280 },
    { title: "Điện thoại", dataIndex: "phone", width: 160 },
    { title: "Email", dataIndex: "email", width: 220 },
    {
      title: "Nợ cần trả hiện tại",
      dataIndex: "currentDebt",
      align: "right",
      width: 200,
      render: (v: number) => v.toLocaleString("vi-VN"),
    },
    {
      title: "Tổng mua",
      dataIndex: "totalPurchase",
      align: "right",
      width: 180,
      render: (v: number) => v.toLocaleString("vi-VN"),
    },
  ];

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
              setFilters({ q: (e.target as HTMLInputElement).value })
            }
            onBlur={(e) =>
              setFilters({ q: (e.target as HTMLInputElement).value })
            }
          />
        </div>

        <div className="space-y-4">
          {/* Nhóm nhà cung cấp */}
          <div className="">
            <div className="text-[13px] font-semibold mb-1">
              Nhóm nhà cung cấp
            </div>
            <Select
              className="w-full"
              allowClear
              placeholder="Tất cả các nhóm"
              options={groups.map((g) => ({ label: g, value: g }))}
              onChange={(v) => setFilters({ group: v ?? null })}
            />
          </div>

          {/* Tổng mua */}
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
                    totalFrom: Number((e.target as HTMLInputElement).value) || null,
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
                    totalTo: Number((e.target as HTMLInputElement).value) || null,
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
                              setFilters({ datePreset: val.value }); // string
                            } else {
                              const [from, to] = val.value;          // [YYYY-MM-DD, YYYY-MM-DD]
                              setFilters({ fromDate: from, toDate: to, datePreset: null });
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
                    debtFrom: Number((e.target as HTMLInputElement).value) || null,
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
                    debtTo: Number((e.target as HTMLInputElement).value) || null,
                  })
                }
              />
              </div>
              
            </div>
          </div>

          {/* Trạng thái */}
          <div>
            <div className="text-[13px] font-semibold mb-1">Trạng thái</div>
            <Select<("Đang hoạt động" | "Ngừng hoạt động")[]>
              mode="multiple"
              allowClear
              className="w-full"
              placeholder="Chọn trạng thái"
              options={[
                { label: "Đang hoạt động", value: "Đang hoạt động" },
                { label: "Ngừng hoạt động", value: "Ngừng hoạt động" },
              ]}
              onChange={(v) => setFilters({ status: v && v.length ? v : undefined })}
            />
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
              Tổng: <b>{data.length.toLocaleString()}</b> nhà cung cấp
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
            <Table<Supplier>
              rowKey="id"
              columns={columns}
              dataSource={data}
              size="middle"
              pagination={{ pageSize: 15, showSizeChanger: false }}
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
