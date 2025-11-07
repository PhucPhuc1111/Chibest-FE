"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Table,
  Input,
  Button,
  Select,
  DatePicker,
  Form,
  message,
  Modal,
  Upload,
  Tag,
} from "antd";
import type { TableProps, UploadProps } from "antd";
import {
  UploadOutlined,
  SaveOutlined,
  CheckOutlined,
  CalendarOutlined,
  SearchOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useTransferStore } from "@/stores/useTransferStore";
import useWarehouseStore from "@/stores/useWarehouseStore";
import {useProductStore} from "@/stores/useProductStore"; 
import type { CreateMultiTransferPayload } from "@/types/transfer";
import type { Product } from "@/types/product";
import dayjs from "dayjs";
import type { RcFile } from "antd/es/upload";

interface ProductRow {
  id: string;
  sku: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  extraFee: number;
  commissionFee: number;
  discount: number;
  containerCode: string;
  total: number;
  productId?: string;
}

interface ImportedProduct {
  id: string;
  quantity: number;
  "unit-price": number;
  "extra-fee": number;
  "commission-fee": number;
  discount: number;
  note: string | null;
  "product-name": string;
  sku: string;
  "container-code": string | null;
}

interface DestinationState {
  id: string;
  toWarehouseId?: string;
  products: ProductRow[];
}

function createEmptyProduct(): ProductRow {
  return {
    id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    sku: "",
    productName: "",
    quantity: 0,
    unitPrice: 0,
    extraFee: 0,
    commissionFee: 0,
    discount: 0,
    containerCode: "",
    total: 0,
  };
}

function createEmptyDestination(): DestinationState {
  return {
    id: `destination-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    toWarehouseId: undefined,
    products: [],
  };
}

function cloneProductRow(product: ProductRow): ProductRow {
  return {
    ...product,
    id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };
}

function calculateProductTotal(item: ProductRow): number {
  const quantity = item.quantity || 0;
  const unitPrice = item.unitPrice || 0;
  const extraFee = item.extraFee || 0;
  const commissionFee = item.commissionFee || 0;
  const discount = item.discount || 0;
  return quantity * unitPrice + extraFee + commissionFee - discount;
}

export default function TransferNew() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  
  // Stores 
  const { createMultiTransfer, importFile, isLoading } = useTransferStore();
  const { warehouses, getWarehouses } = useWarehouseStore();
  const { products, searchProducts } = useProductStore();

  const initialDestination = useMemo(() => createEmptyDestination(), []);
  
  // State
  const [destinations, setDestinations] = useState<DestinationState[]>([initialDestination]);
  const [activeDestinationId, setActiveDestinationId] = useState<string>(initialDestination.id);
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});
  const [pendingImport, setPendingImport] = useState<{ destinationId: string; data: ImportedProduct[] } | null>(
    null
  );
  const [searchModalState, setSearchModalState] = useState<{ destinationId: string | null; visible: boolean }>(
    { destinationId: null, visible: false }
  );
  const fromWarehouseId = Form.useWatch("fromWarehouseId", form);

  // Load warehouses on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      await getWarehouses();
    };
    loadInitialData();
  }, [getWarehouses]);

  // Get user info from localStorage
  const getUserInfo = () => {
    if (typeof window === 'undefined') return null;
    try {
      const userInfo = localStorage.getItem('userInfo');
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      console.error('Error getting user info:', error);
      return null;
    }
  };

  const updateDestinationProducts = (
    destinationId: string,
    updater: (products: ProductRow[]) => ProductRow[]
  ) => {
    setDestinations((prev) =>
      prev.map((destination) =>
        destination.id === destinationId
          ? { ...destination, products: updater(destination.products) }
          : destination
      )
    );
  };

  const handleProductChange = (
    destinationId: string,
    index: number,
    field: keyof ProductRow,
    value: string | number
  ) => {
    updateDestinationProducts(destinationId, (products) => {
      const list = [...products];
      if (!list[index]) {
        list[index] = createEmptyProduct();
      }

      list[index] = { ...list[index], [field]: value };

      if (
        field === "quantity" ||
        field === "unitPrice" ||
        field === "extraFee" ||
        field === "commissionFee" ||
        field === "discount"
      ) {
        const total = Math.max(0, calculateProductTotal(list[index]));
        list[index].total = total;
      }

      return list;
    });
  };

  const addProductRow = (destinationId: string, product?: ProductRow) => {
    const newProduct: ProductRow = product || createEmptyProduct();
    updateDestinationProducts(destinationId, (products) => [...products, newProduct]);
  };

  const removeProductRow = (destinationId: string, index: number) => {
    updateDestinationProducts(destinationId, (products) =>
      products.filter((_, i) => i !== index)
    );
  };

  const handleDestinationWarehouseChange = (destinationId: string, warehouseId?: string) => {
    setDestinations((prev) =>
      prev.map((destination) =>
        destination.id === destinationId ? { ...destination, toWarehouseId: warehouseId } : destination
      )
    );
  };

  const addDestination = () => {
    let createdDestination: DestinationState | undefined;

    setDestinations((prev) => {
      const newDestination = createEmptyDestination();

      if (prev.length > 0) {
        const template = prev[0];
        newDestination.products = template.products.map((product) => cloneProductRow(product));
      }

      createdDestination = newDestination;
      return [...prev, newDestination];
    });

    if (createdDestination) {
      const destinationId = createdDestination.id;
      setActiveDestinationId(destinationId);
      setSearchTerms((prev) => ({ ...prev, [destinationId]: "" }));
      setSelectedFiles((prev) => ({ ...prev, [destinationId]: null }));
    }
  };

  const removeDestination = (destinationId: string) => {
    if (destinations.length === 1) {
      messageApi.warning("Cần ít nhất một kho nhận");
      return;
    }

    setDestinations((prev) => {
      const next = prev.filter((destination) => destination.id !== destinationId);
      if (activeDestinationId === destinationId) {
        setActiveDestinationId(next[0]?.id ?? "");
      }
      return next;
    });
    setSelectedFiles((prev) => {
      const next = { ...prev };
      delete next[destinationId];
      return next;
    });
    setSearchTerms((prev) => {
      const next = { ...prev };
      delete next[destinationId];
      return next;
    });
  };

  // File upload handlers
  const handleFileSelect = (destinationId: string, file: RcFile) => {
    setSelectedFiles((prev) => ({ ...prev, [destinationId]: file }));
    setActiveDestinationId(destinationId);
    return false; // Prevent automatic upload
  };

  const clearSelectedFile = (destinationId: string) => {
    setSelectedFiles((prev) => ({ ...prev, [destinationId]: null }));
  };

  const handleImport = async (destinationId: string) => {
    const file = selectedFiles[destinationId];
    if (!file) {
      messageApi.warning("Vui lòng chọn file để import!");
      return;
    }

    const result = await importFile(file as File);
    if (result.success && result.data) {
      setPendingImport({ destinationId, data: result.data });
    }
  };

  const confirmImport = () => {
    if (!pendingImport) return;

    const { destinationId, data } = pendingImport;
    const importedProducts: ProductRow[] = data.map((item, index) => ({
      id: `imported-${index}-${Date.now()}`,
      sku: item.sku || "",
      productName: item["product-name"] || "",
      quantity: item.quantity || 0,
      unitPrice: item["unit-price"] || 0,
      extraFee: item["extra-fee"] || 0,
      commissionFee: item["commission-fee"] || 0,
      discount: item.discount || 0,
      containerCode: item["container-code"] || "",
      total: Math.max(
        0,
        (item.quantity || 0) * (item["unit-price"] || 0) +
          (item["extra-fee"] || 0) +
          (item["commission-fee"] || 0) -
          (item.discount || 0)
      ),
      productId: item.id,
    }));

    updateDestinationProducts(destinationId, (products) => [...products, ...importedProducts]);
    setPendingImport(null);
    clearSelectedFile(destinationId);
    messageApi.success(`Đã thêm ${importedProducts.length} sản phẩm từ file import!`);
  };

  // Search product handlers
  const handleSearch = async (destinationId: string) => {
    const keyword = (searchTerms[destinationId] || "").trim();
    if (!keyword) {
      messageApi.warning("Vui lòng nhập từ khóa tìm kiếm!");
      return;
    }

    try {
      setActiveDestinationId(destinationId);
      await searchProducts(keyword);
      setSearchModalState({ destinationId, visible: true });
    } catch (error) {
      console.log("Search failed:", error);
    }
  };

  const selectProduct = (destinationId: string, product: Product) => {
    const newProduct: ProductRow = {
      id: `${product.id}-${Date.now()}`,
      sku: product.sku,
      productName: product.name,
      quantity: 1,
      unitPrice: product.costPrice || 0,
      extraFee: 0,
      commissionFee: 0,
      discount: 0,
      containerCode: "",
      total: product.costPrice || 0,
      productId: product.id,
    };
    addProductRow(destinationId, newProduct);
    setSearchModalState({ destinationId: null, visible: false });
    setSearchTerms((prev) => ({ ...prev, [destinationId]: "" }));
  };

  const buildColumns = (destinationId: string): TableProps<ProductRow>["columns"] => [
    {
      title: "STT",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Mã hàng",
      dataIndex: "sku",
      width: 120,
      render: (value, _, index) => (
        <Input
          value={value}
          placeholder="Nhập mã hàng"
          onChange={(e) => handleProductChange(destinationId, index, "sku", e.target.value)}
        />
      ),
    },
    {
      title: "Tên hàng",
      dataIndex: "productName",
      width: 200,
      render: (value, _, index) => (
        <Input
          value={value}
          placeholder="Nhập tên hàng"
          onChange={(e) => handleProductChange(destinationId, index, "productName", e.target.value)}
        />
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      width: 100,
      render: (value, _, index) => (
        <Input
          type="number"
          value={value}
          placeholder="0"
          onChange={(e) =>
            handleProductChange(destinationId, index, "quantity", Number(e.target.value))
          }
        />
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "unitPrice",
      width: 120,
      render: (value, _, index) => (
        <Input
          type="number"
          value={value}
          placeholder="0"
          onChange={(e) =>
            handleProductChange(destinationId, index, "unitPrice", Number(e.target.value))
          }
        />
      ),
    },
    {
      title: "Phí phụ thu",
      dataIndex: "extraFee",
      width: 120,
      render: (value, _, index) => (
        <Input
          type="number"
          value={value}
          placeholder="0"
          onChange={(e) =>
            handleProductChange(destinationId, index, "extraFee", Number(e.target.value))
          }
        />
      ),
    },
    {
      title: "Phí hoa hồng",
      dataIndex: "commissionFee",
      width: 120,
      render: (value, _, index) => (
        <Input
          type="number"
          value={value}
          placeholder="0"
          onChange={(e) =>
            handleProductChange(destinationId, index, "commissionFee", Number(e.target.value))
          }
        />
      ),
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      width: 100,
      render: (value, _, index) => (
        <Input
          type="number"
          value={value}
          placeholder="0"
          onChange={(e) =>
            handleProductChange(destinationId, index, "discount", Number(e.target.value))
          }
        />
      ),
    },
    {
      title: "Thành tiền",
      dataIndex: "total",
      width: 140,
      render: (total) => <span>{(total || 0).toLocaleString("vi-VN")} đ</span>,
    },
    {
      title: "Thao tác",
      width: 80,
      render: (_, __, index) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeProductRow(destinationId, index)}
        />
      ),
    },
  ];

  // Tổng tiền
  const destinationSummaries = useMemo(() => {
    return destinations.map((destination) => {
      const summary = destination.products.reduce(
        (acc, item) => {
          const qty = item.quantity || 0;
          const unit = item.unitPrice || 0;
          const extra = item.extraFee || 0;
          const commission = item.commissionFee || 0;
          const discount = item.discount || 0;
          const total = qty * (unit + extra + commission) - discount;

          return {
            totalQty: acc.totalQty + qty,
            totalExtraFee: acc.totalExtraFee + extra,
            totalCommissionFee: acc.totalCommissionFee + commission,
            totalDiscount: acc.totalDiscount + discount,
            totalAmount: acc.totalAmount + total,
          };
        },
        {
          totalQty: 0,
          totalExtraFee: 0,
          totalCommissionFee: 0,
          totalDiscount: 0,
          totalAmount: 0,
        }
      );

      return { id: destination.id, ...summary };
    });
  }, [destinations]);

  const aggregateTotals = useMemo(() => {
    return destinationSummaries.reduce(
      (acc, summary) => ({
        totalQty: acc.totalQty + summary.totalQty,
        totalExtraFee: acc.totalExtraFee + summary.totalExtraFee,
        totalCommissionFee: acc.totalCommissionFee + summary.totalCommissionFee,
        totalDiscount: acc.totalDiscount + summary.totalDiscount,
        totalAmount: acc.totalAmount + summary.totalAmount,
      }),
      {
        totalQty: 0,
        totalExtraFee: 0,
        totalCommissionFee: 0,
        totalDiscount: 0,
        totalAmount: 0,
      }
    );
  }, [destinationSummaries]);

  const handleSave = async (status: "Draft" | "Hoàn Thành") => {
    try {
      const values = await form.validateFields();

      if (!destinations.length) {
        messageApi.warning("Vui lòng thêm ít nhất một kho nhận!");
        return;
      }

      const invalidDestination = destinations.find((destination) => !destination.toWarehouseId);
      if (invalidDestination) {
        messageApi.warning("Vui lòng chọn kho nhận cho tất cả điểm đến!");
        return;
      }

      const emptyDestination = destinations.find((destination) => destination.products.length === 0);
      if (emptyDestination) {
        messageApi.warning("Mỗi kho nhận cần có ít nhất một sản phẩm!");
        return;
      }

      const missingProduct = destinations.some((destination) =>
        destination.products.some((product) => !product.productId)
      );

      if (missingProduct) {
        messageApi.warning("Một số sản phẩm chưa có thông tin hợp lệ. Vui lòng chọn từ danh sách hệ thống.");
        return;
      }

      if (!values.fromWarehouseId) {
        messageApi.warning("Vui lòng chọn kho đi!");
        return;
      }

      const userInfo = getUserInfo();
      const employeeId = userInfo?.accountId;

      if (!employeeId) {
        messageApi.warning("Không tìm thấy thông tin người dùng!");
        return;
      }

      const orderDateValue = values.orderDate
        ? values.orderDate.format("YYYY-MM-DD")
        : dayjs().format("YYYY-MM-DD");

      const payload: CreateMultiTransferPayload = {
        "from-warehouse-id": values.fromWarehouseId,
        "employee-id": employeeId,
        "order-date": orderDateValue,
        "note": values.note || "",
        "pay-method": values.payMethod || "Bank Transfer",
        "discount-amount": aggregateTotals.totalDiscount,
        "sub-total": aggregateTotals.totalAmount,
        "paid": 0,
        destinations: destinations.map((destination) => ({
          "to-warehouse-id": destination.toWarehouseId as string,
          products: destination.products.map((product) => ({
            "product-id": product.productId as string,
            quantity: product.quantity || 0,
            "unit-price": product.unitPrice || 0,
            "extra-fee": product.extraFee || 0,
            "commission-fee": product.commissionFee || 0,
            discount: product.discount || 0,
            note: product.containerCode ? `Container: ${product.containerCode}` : "",
          })),
        })),
      };

      const result = await createMultiTransfer(payload);
      if (result.success) {
        messageApi.success(
          `Phiếu chuyển ${status === "Draft" ? "đã được lưu tạm" : "tạo thành công"}!`
        );
        router.push("/transfers");
      } else {
        messageApi.error(result.message || "Tạo phiếu chuyển thất bại");
      }
    } catch (error) {
      console.error("Save error:", error);
      messageApi.error("Vui lòng kiểm tra lại thông tin!");
    }
  };

  return (
    <>
      {contextHolder}
      <div className="bg-gray-50 p-4 min-h-screen">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Chuyển hàng</h2>
                <p className="text-sm text-gray-500">
                  Phân bổ sản phẩm cho từng kho.
                </p>
              </div>
              <Button type="primary" icon={<PlusOutlined />} onClick={addDestination}>
                Thêm kho nhận
              </Button>
            </div>

            <div className="space-y-4">
              {destinations.map((destination, index) => {
                const summary =
                  destinationSummaries.find((item) => item.id === destination.id) ?? {
                    totalQty: 0,
                    totalExtraFee: 0,
                    totalCommissionFee: 0,
                    totalDiscount: 0,
                    totalAmount: 0,
                  };
                const selectedFile = selectedFiles[destination.id];
                const searchValue = searchTerms[destination.id] ?? "";
                const columns = buildColumns(destination.id);
                const hasProducts = destination.products.length > 0;
                const uploadProps: UploadProps = {
                  beforeUpload: (file) => handleFileSelect(destination.id, file),
                  accept: ".xlsx,.xls",
                  showUploadList: false,
                };

                return (
                  <div
                    key={destination.id}
                    className="bg-white border border-gray-200 rounded-md shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3 border-b px-4 py-3">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-gray-700">Kho nhận {index + 1}</span>
                          <Tag color="blue">{destination.products.length} SP</Tag>
                        </div>
                        <Select
                          placeholder="Chọn kho nhận"
                          value={destination.toWarehouseId}
                          onChange={(value) => handleDestinationWarehouseChange(destination.id, value)}
                          onClear={() => handleDestinationWarehouseChange(destination.id, undefined)}
                          allowClear
                          className="w-full"
                          options={warehouses
                            .filter((warehouse) => warehouse.id !== fromWarehouseId)
                            .map((warehouse) => ({
                              value: warehouse.id,
                              label: `${warehouse.name} (${warehouse.code})`,
                            }))}
                        />
                      </div>
                      {destinations.length > 1 && (
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => removeDestination(destination.id)}
                        />
                      )}
                    </div>

                    <div className="px-4 py-4 space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <Input
                          placeholder="Tìm hàng hóa theo mã hoặc tên"
                          value={searchValue}
                          onFocus={() => setActiveDestinationId(destination.id)}
                          onChange={(e) =>
                            setSearchTerms((prev) => ({ ...prev, [destination.id]: e.target.value }))
                          }
                          onPressEnter={() => handleSearch(destination.id)}
                          suffix={
                            <SearchOutlined
                              onClick={() => handleSearch(destination.id)}
                              className="cursor-pointer text-gray-500"
                            />
                          }
                        />
                        <div className="flex flex-wrap items-center gap-2">
                          <Upload {...uploadProps}>
                            <Button icon={<UploadOutlined />}>Chọn file</Button>
                          </Upload>
                          {selectedFile && (
                            <div className="flex items-center gap-2 text-sm">
                              <Tag color="blue">{selectedFile.name}</Tag>
                              <Button
                                size="small"
                                type="primary"
                                onClick={() => handleImport(destination.id)}
                                loading={isLoading}
                              >
                                Thực hiện
                              </Button>
                              <Button
                                size="small"
                                icon={<DeleteOutlined />}
                                onClick={() => clearSelectedFile(destination.id)}
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {hasProducts ? (
                        <div className="space-y-3">
                          <Table
                            bordered
                            size="small"
                            rowKey="id"
                            columns={columns}
                            dataSource={destination.products}
                            pagination={false}
                            scroll={{ x: 1200 }}
                          />
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
                            <div className="flex justify-between">
                              <span>Tổng số lượng</span>
                              <span>{summary.totalQty.toLocaleString("vi-VN")}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Phí phụ thu</span>
                              <span>{summary.totalExtraFee.toLocaleString("vi-VN")} đ</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Phí hoa hồng</span>
                              <span>{summary.totalCommissionFee.toLocaleString("vi-VN")} đ</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Giảm giá</span>
                              <span>-{summary.totalDiscount.toLocaleString("vi-VN")} đ</span>
                            </div>
                            <div className="flex justify-between col-span-2 md:col-span-4 font-semibold text-gray-700 border-t pt-2">
                              <span>Tổng tiền</span>
                              <span>{summary.totalAmount.toLocaleString("vi-VN")} đ</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center border border-dashed border-gray-200 rounded-md py-10 text-sm text-gray-500 text-center">
                          <p>Chưa có sản phẩm trong kho nhận này.</p>
                          <div className="mt-2 flex items-center gap-2">
                            <Button type="link" onClick={() => handleSearch(destination.id)}>
                              Tìm sản phẩm
                            </Button>
                            <Button type="link" onClick={() => addProductRow(destination.id)}>
                              Thêm dòng trống
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end">
                        <Button
                          type="dashed"
                          icon={<PlusOutlined />}
                          size="small"
                          onClick={() => addProductRow(destination.id)}
                        >
                          Thêm dòng sản phẩm
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full lg:w-[340px] bg-white border border-gray-200 rounded-md p-4 flex flex-col justify-between">
            <Form form={form} layout="vertical" className="space-y-3">
              <Form.Item
                label="Kho đi"
                name="fromWarehouseId"
                rules={[{ required: true, message: "Vui lòng chọn kho đi" }]}
              >
                <Select
                  placeholder="Chọn kho đi"
                  loading={isLoading}
                  options={warehouses.map((warehouse) => ({
                    value: warehouse.id,
                    label: `${warehouse.name} (${warehouse.code})`,
                  }))}
                />
              </Form.Item>

              <Form.Item
                label="Ngày chuyển"
                name="orderDate"
                initialValue={dayjs()}
                rules={[{ required: true, message: "Vui lòng chọn ngày chuyển" }]}
              >
                <DatePicker
                  className="w-full"
                  format="DD/MM/YYYY"
                  suffixIcon={<CalendarOutlined />}
                />
              </Form.Item>

              <Form.Item
                label="Phương thức thanh toán"
                name="payMethod"
                initialValue="Bank Transfer"
              >
                <Select
                  options={[
                    { value: "Bank Transfer", label: "Chuyển khoản" },
                    { value: "Cash", label: "Tiền mặt" },
                  ]}
                />
              </Form.Item>

              <Form.Item label="Ghi chú" name="note">
                <Input.TextArea rows={3} placeholder="Ghi chú" />
              </Form.Item>
            </Form>

            <div className="mt-4 text-sm space-y-2 border-t pt-3">
              <div className="flex justify-between">
                <span>Số kho nhận</span>
                <span>{destinations.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Tổng số lượng</span>
                <span>{aggregateTotals.totalQty.toLocaleString("vi-VN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí phụ thu</span>
                <span>{aggregateTotals.totalExtraFee.toLocaleString("vi-VN")} đ</span>
              </div>
              <div className="flex justify-between">
                <span>Phí hoa hồng</span>
                <span>{aggregateTotals.totalCommissionFee.toLocaleString("vi-VN")} đ</span>
              </div>
              <div className="flex justify-between">
                <span>Giảm giá</span>
                <span>-{aggregateTotals.totalDiscount.toLocaleString("vi-VN")} đ</span>
              </div>
              <div className="flex justify-between text-base font-semibold">
                <span>Tổng tiền</span>
                <span>{aggregateTotals.totalAmount.toLocaleString("vi-VN")} đ</span>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                icon={<SaveOutlined />}
                onClick={() => handleSave("Draft")}
                loading={isLoading}
                className="flex-1"
              >
                Lưu tạm
              </Button>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => handleSave("Hoàn Thành")}
                loading={isLoading}
                className="flex-1 bg-green-500 hover:bg-green-600"
              >
                Hoàn thành
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title="Xác nhận Import"
        open={Boolean(pendingImport)}
        onOk={confirmImport}
        onCancel={() => setPendingImport(null)}
        okText="Thêm vào danh sách"
        cancelText="Hủy"
        width={800}
      >
        <p>
          Bạn có muốn thêm {pendingImport?.data.length ?? 0} sản phẩm từ file import vào kho nhận này?
        </p>
        <Table
          size="small"
          dataSource={pendingImport?.data || []}
          pagination={false}
          scroll={{ y: 300 }}
          rowKey={(record, index) => `imported-${index}`}
          columns={[
            { title: "Mã hàng", dataIndex: "sku", width: 120 },
            { title: "Tên hàng", dataIndex: "product-name", width: 200 },
            { title: "Số lượng", dataIndex: "quantity", width: 80 },
            { title: "Đơn giá", dataIndex: "unit-price", width: 100 },
            { title: "Phí phụ thu", dataIndex: "extra-fee", width: 100 },
            { title: "Phí hoa hồng", dataIndex: "commission-fee", width: 100 },
          ]}
        />
      </Modal>

      <Modal
        title="Tìm kiếm sản phẩm"
        open={searchModalState.visible}
        onCancel={() => setSearchModalState({ destinationId: null, visible: false })}
        footer={null}
        width={800}
      >
        <div className="mb-4">
          <Input
            placeholder="Nhập mã hoặc tên sản phẩm"
            value={
              searchModalState.destinationId
                ? searchTerms[searchModalState.destinationId] ?? ""
                : ""
            }
            onChange={(e) => {
              const destinationId = searchModalState.destinationId;
              if (destinationId) {
                const value = e.target.value;
                setSearchTerms((prev) => ({ ...prev, [destinationId]: value }));
              }
            }}
            onPressEnter={() => {
              if (searchModalState.destinationId) {
                handleSearch(searchModalState.destinationId);
              }
            }}
            suffix={
              <SearchOutlined
                onClick={() => {
                  if (searchModalState.destinationId) {
                    handleSearch(searchModalState.destinationId);
                  }
                }}
                className="cursor-pointer"
              />
            }
          />
        </div>
        <Table
          size="small"
          dataSource={products}
          loading={isLoading}
          pagination={false}
          scroll={{ y: 400 }}
          rowKey="id"
          onRow={(record) => ({
            onClick: () => {
              if (searchModalState.destinationId) {
                selectProduct(searchModalState.destinationId, record);
              }
            },
            style: { cursor: "pointer" },
          })}
          columns={[
            { title: "Mã hàng", dataIndex: "sku", width: 120 },
            { title: "Tên hàng", dataIndex: "name", width: 200 },
            { title: "Màu", dataIndex: "color", width: 80 },
            { title: "Size", dataIndex: "size", width: 80 },
            {
              title: "Giá cost",
              dataIndex: "costPrice",
              width: 100,
              render: (price) => price?.toLocaleString("vi-VN"),
            },
            { title: "Tồn kho", dataIndex: "stockQuantity", width: 80 },
          ]}
        />
      </Modal>
    </>
  );
}