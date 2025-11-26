"use client";

import { useEffect, useState, useCallback } from "react";
import { Tabs, Table, Input, Tag, Pagination, Spin, Button } from "antd";
import type { TabsProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  CopyOutlined,
  ExportOutlined,
  SaveOutlined,
  PrinterOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import type { StockAdjustmentDetail } from "../../types/stocktake";
import useStockTakeStore from "../../stores/useStockTakeStore";

interface StockTakeDetailProps {
  adjustmentId: string;
}

export default function StockTakeDetail({ adjustmentId }: StockTakeDetailProps) {
  const { 
    currentStockAdjustment, 
    getStockAdjustmentById, 
    isLoading 
  } = useStockTakeStore();

  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Sử dụng useCallback để tránh re-render vô hạn
  const fetchStockAdjustment = useCallback(async () => {
    if (adjustmentId && currentStockAdjustment?.id !== adjustmentId) {
      await getStockAdjustmentById(adjustmentId);
    }
  }, [adjustmentId, currentStockAdjustment?.id, getStockAdjustmentById]);

  useEffect(() => {
    fetchStockAdjustment();
  }, [fetchStockAdjustment]); // Chỉ phụ thuộc vào fetchStockAdjustment

  // Hiển thị loading nếu đang tải và không có dữ liệu
  if (isLoading && !currentStockAdjustment) {
    return (
      <div className="p-4 flex justify-center">
        <Spin />
      </div>
    );
  }

  // Hiển thị thông báo nếu không có dữ liệu
  if (!currentStockAdjustment) {
    return (
      <div className="p-4 text-center text-gray-500">
        Không tìm thấy thông tin phiếu điều chỉnh
      </div>
    );
  }

  const { stockAdjustmentDetails, ...adjustment } = currentStockAdjustment;

  const totalPages = Math.ceil(stockAdjustmentDetails.length / pageSize);
  const visibleItems = stockAdjustmentDetails.slice(
    (page - 1) * pageSize, 
    page * pageSize
  );

  const tagColor = {
    'Đã Duyệt': 'green',
    'Chờ Duyệt': 'orange',
    'Đã Hủy': 'red',
    'Tạm': 'blue',
  }[adjustment.status] || 'default';

  const columns: ColumnsType<StockAdjustmentDetail> = [
    { 
      title: "SKU", 
      dataIndex: "sku", 
      width: 150,
      render: (sku: string) => <span className="font-mono">{sku}</span>
    },
    { 
      title: "Tên sản phẩm", 
      dataIndex: "productName", 
      width: 320 
    },
    { 
      title: "Tồn hệ thống", 
      dataIndex: "systemQty", 
      align: "center", 
      width: 120,
      render: (qty: number) => qty.toLocaleString('vi-VN')
    },
    { 
      title: "Tồn thực tế", 
      dataIndex: "actualQty", 
      align: "center", 
      width: 120,
      render: (qty: number) => qty.toLocaleString('vi-VN')
    },
    { 
      title: "SL chênh lệch", 
      dataIndex: "differenceQty", 
      align: "center", 
      width: 100,
      render: (qty: number) => (
        <span className={qty >= 0 ? "text-green-600" : "text-red-600"}>
          {qty >= 0 ? '+' : ''}{qty}
        </span>
      )
    },
    {
      title: "Đơn giá",
      dataIndex: "unitCost",
      align: "right",
      width: 120,
      render: (cost: number) => cost.toLocaleString('vi-VN') + ' ₫'
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
      )
    },
  ];

  const totalIncrease = stockAdjustmentDetails
    .filter(item => item.differenceQty > 0)
    .reduce((sum, item) => sum + item.differenceQty, 0);

  const totalDecrease = stockAdjustmentDetails
    .filter(item => item.differenceQty < 0)
    .reduce((sum, item) => sum + Math.abs(item.differenceQty), 0);

  const items: TabsProps["items"] = [
    {
      key: "info",
      label: "Thông tin chi tiết",
      children: (
        <div className="bg-white p-4 rounded-md border">
          {/* HEADER THÔNG TIN PHIẾU */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg font-semibold flex items-center gap-2">
              {adjustment.adjustmentCode} 
              <Tag color={tagColor} className="text-sm">
                {adjustment.status}
              </Tag>
            </div>
            <div className="text-sm text-gray-500">
              Nhân viên: <b>{adjustment.employeeName}</b>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
            <div>
              <div><strong>Chi nhánh:</strong> {adjustment.branchName}</div>
            </div>
            <div>
              <div>
                <strong>Ngày điều chỉnh:</strong> {new Date(adjustment.adjustmentDate).toLocaleDateString('vi-VN')}
              </div>
              {adjustment.approvedAt && (
                <div>
                  <strong>Ngày duyệt:</strong> {new Date(adjustment.approvedAt).toLocaleDateString('vi-VN')}
                </div>
              )}
            </div>
          </div>

          {/* Lý do điều chỉnh */}
          {adjustment.reason && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <div className="font-semibold text-sm mb-1">Lý do điều chỉnh:</div>
              <div className="text-sm">{adjustment.reason}</div>
            </div>
          )}

          {/* BẢNG CHI TIẾT HÀNG HÓA */}
          <div className="border rounded-md p-3 bg-white mb-4">
            <div className="flex gap-3 mb-3">
              <Input placeholder="Tìm theo SKU" className="max-w-[160px]" />
              <Input placeholder="Tìm tên sản phẩm" className="max-w-[220px]" />
            </div>

            <Table
              rowKey="id"
              columns={columns}
              dataSource={visibleItems}
              pagination={false}
              size="small"
              scroll={{ x: 1200 }}
              rowClassName="hover:bg-blue-50 cursor-pointer"
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-3">
                <Pagination
                  current={page}
                  total={stockAdjustmentDetails.length}
                  pageSize={pageSize}
                  showSizeChanger={false}
                  onChange={(p) => setPage(p)}
                />
                <span className="text-sm text-gray-500">
                  Tổng: {stockAdjustmentDetails.length} sản phẩm
                </span>
              </div>
            )}

            {/* TỔNG CỘNG */}
            <div className="mt-4 flex justify-end">
              <div className="w-[320px] text-sm text-gray-700 border-t border-gray-200 pt-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tổng lệch tăng:</span>
                    <span className="font-medium text-green-600">
                      +{totalIncrease.toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tổng lệch giảm:</span>
                    <span className="font-medium text-red-600">
                      -{totalDecrease.toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-800 font-semibold">Tổng giá trị thay đổi:</span>
                    <span className={`font-semibold ${
                      adjustment.totalValueChange >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {adjustment.totalValueChange >= 0 ? '+' : ''}
                      {adjustment.totalValueChange.toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* NÚT HÀNH ĐỘNG */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex space-x-2">
              <Button icon={<CloseCircleOutlined />}>
                Hủy phiếu
              </Button>
              <Button icon={<CopyOutlined />}>
                Sao chép
              </Button>
              <Button icon={<ExportOutlined />}>
                Xuất file
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button icon={<PrinterOutlined />}>
                In phiếu
              </Button>
              {adjustment.status === 'Chờ Duyệt' && (
                <Button type="primary" icon={<CheckCircleOutlined />}>
                  Duyệt phiếu
                </Button>
              )}
              <Button type="default" icon={<SaveOutlined />}>
                Lưu
              </Button>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="mt-2">
      <Tabs defaultActiveKey="info" items={items} />
    </div>
  );
}