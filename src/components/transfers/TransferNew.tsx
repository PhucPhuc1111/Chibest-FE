"use client";

import { useState, useEffect } from "react";
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
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useTransferStore } from "@/stores/useTransferStore";
import useWarehouseStore from "@/stores/useWarehouseStore";
import {useProductStore} from "@/stores/useProductStore"; 
import type { CreateTransferPayload } from "@/types/transfer";
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

export default function TransferNew() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  
  // Stores 
  const { createTransfer, importFile, isLoading } = useTransferStore();
  const { warehouses, getWarehouses } = useWarehouseStore();
  const { products, searchProducts } = useProductStore();
  
  // State
  const [productsList, setProductsList] = useState<ProductRow[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importedData, setImportedData] = useState<ImportedProduct[]>([]);
  const [searchModalVisible, setSearchModalVisible] = useState(false);

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

  const handleProductChange = (index: number, field: keyof ProductRow, value: string | number) => {
    const newList = [...productsList];
    if (!newList[index]) {
      newList[index] = createEmptyProduct();
    }

    newList[index] = { ...newList[index], [field]: value };

    if (["quantity", "unitPrice", "extraFee", "commissionFee", "discount"].includes(field)) {
      const item = newList[index];
      const quantity = item.quantity || 0;
      const unitPrice = item.unitPrice || 0;
      const extraFee = item.extraFee || 0;
      const commissionFee = item.commissionFee || 0;
      const discount = item.discount || 0;
      const itemTotal = (quantity * unitPrice) + extraFee + commissionFee - discount;
      newList[index].total = Math.max(0, itemTotal);
    }
    setProductsList(newList);
  };

  const createEmptyProduct = (): ProductRow => ({
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
  });
  
  const addProductRow = (product?: ProductRow) => {
    const newProduct: ProductRow = product || createEmptyProduct();
    setProductsList([...productsList, newProduct]);
  };

  const removeProductRow = (index: number) => {
    const newList = productsList.filter((_, i) => i !== index);
    setProductsList(newList);
  };

  // File upload handlers
  const handleFileSelect = (file: RcFile) => {
    setSelectedFile(file);
    return false; // Prevent automatic upload
  };

  const handleImport = async () => {
    if (!selectedFile) {
      messageApi.warning("Vui lòng chọn file để import!");
      return;
    }

    const result = await importFile(selectedFile);
    if (result.success && result.data) {
      setImportedData(result.data);
      setImportModalVisible(true);
    }
  };

  const confirmImport = () => {
    const importedProducts: ProductRow[] = importedData.map((item, index) => ({
      id: `imported-${index}-${Date.now()}`,
      sku: item.sku || "",
      productName: item["product-name"] || "",
      quantity: item.quantity || 0,
      unitPrice: item["unit-price"] || 0,
      extraFee: item["extra-fee"] || 0,
      commissionFee: item["commission-fee"] || 0,
      discount: item.discount || 0,
      containerCode: item["container-code"] || "",
      total: (item.quantity || 0) * (item["unit-price"] || 0) + (item["extra-fee"] || 0) + (item["commission-fee"] || 0) - (item.discount || 0),
      productId: item.id,
    }));

    setProductsList([...productsList, ...importedProducts]);
    setImportModalVisible(false);
    setSelectedFile(null);
    setImportedData([]);
    messageApi.success(`Đã thêm ${importedProducts.length} sản phẩm từ file import!`);
  };

 // Search product handlers
const handleSearch = async () => {
  if (!searchTerm.trim()) {
    messageApi.warning("Vui lòng nhập từ khóa tìm kiếm!");
    return;
  }
  
  try {

    await searchProducts(searchTerm);
    setSearchModalVisible(true);
  } catch (error) {

    console.log("Search failed:", error);
  }
};

  const selectProduct = (product: Product) => {
    const newProduct: ProductRow = {
      id: product.id,
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
    addProductRow(newProduct);
    setSearchModalVisible(false);
    setSearchTerm("");
  };

  const columns: TableProps<ProductRow>["columns"] = [
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
          onChange={(e) => handleProductChange(index, "sku", e.target.value)}
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
          onChange={(e) =>
            handleProductChange(index, "productName", e.target.value)
          }
        />
      ),
    },
    {
      title: "Mã container",
      dataIndex: "containerCode",
      width: 120,
      render: (value, _, index) => (
        <Input
          value={value}
          placeholder="Mã container"
          onChange={(e) => handleProductChange(index, "containerCode", e.target.value)}
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
            handleProductChange(index, "quantity", Number(e.target.value))
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
            handleProductChange(index, "unitPrice", Number(e.target.value))
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
            handleProductChange(index, "extraFee", Number(e.target.value))
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
            handleProductChange(index, "commissionFee", Number(e.target.value))
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
            handleProductChange(index, "discount", Number(e.target.value))
          }
        />
      ),
    },
    {
      title: "Thành tiền",
      dataIndex: "total",
      width: 140,
      render: (total) => (
        <span>{(total || 0).toLocaleString("vi-VN")} đ</span>
      ),
    },
    {
      title: "Thao tác",
      width: 80,
      render: (_, __, index) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeProductRow(index)}
        />
      ),
    },
  ];

  // Tổng tiền
  const totalAmount = productsList.reduce((sum, p) => {
    const quantity = p.quantity || 0;
    const unitPrice = p.unitPrice || 0;
    const extraFee = p.extraFee || 0;
    const commissionFee = p.commissionFee || 0;
    const discount = p.discount || 0;
    return sum + ((quantity * unitPrice) + extraFee + commissionFee - discount);
  }, 0);

  const totalQty = productsList.reduce((sum, p) => sum + (p.quantity || 0), 0);
  const totalExtraFee = productsList.reduce((sum, p) => sum + (p.extraFee || 0), 0);
  const totalCommissionFee = productsList.reduce((sum, p) => sum + (p.commissionFee || 0), 0);
  const totalDiscount = productsList.reduce((sum, p) => sum + (p.discount || 0), 0);

  const handleSave = async (status: "Draft" | "Hoàn Thành") => {
    try {
      const values = await form.validateFields();

      if (productsList.length === 0) {
        messageApi.warning("Vui lòng thêm ít nhất một sản phẩm!");
        return;
      }

      if (!values.fromWarehouseId || !values.toWarehouseId) {
        messageApi.warning("Vui lòng chọn kho đi và kho đến!");
        return;
      }

      const userInfo = getUserInfo();
      const employeeId = userInfo?.accountId;

      if (!employeeId) {
        messageApi.warning("Không tìm thấy thông tin người dùng!");
        return;
      }

      const payload: CreateTransferPayload = {
        "invoice-code": values.invoiceCode || null,
        "order-date": values.orderDate 
          ? values.orderDate.format('YYYY-MM-DD') 
          : dayjs().format('YYYY-MM-DD'),
        "pay-method": "Bank Transfer",
        "sub-total": totalAmount,
        "discount-amount": totalDiscount,
        "paid": 0,
        "note": values.note || "",
        "from-warehouse-id": values.fromWarehouseId,
        "to-warehouse-id": values.toWarehouseId,
        "employee-id": employeeId,
        "transfer-order-details": productsList.map((p) => ({
          "quantity": p.quantity || 0,
          "unit-price": p.unitPrice || 0,
          "extra-fee": p.extraFee || 0,
          "commission-fee": p.commissionFee || 0,
          "discount": p.discount || 0,
          "note": p.containerCode ? `Container: ${p.containerCode}` : "",
          "product-id": p.productId || "",
        })),
      };

      const result = await createTransfer(payload);
      if (result.success) {
        messageApi.success(
          `Phiếu chuyển đã được ${
            status === "Draft" ? "lưu tạm" : "tạo thành công"
          }!`
        );
        router.push("/transfers");
      } else {
        messageApi.error(result.message || "Tạo phiếu chuyển thất bại");
      }
    } catch (error) {
      console.error('Save error:', error);
      messageApi.error("Vui lòng kiểm tra lại thông tin!");
    }
  };

  const uploadProps: UploadProps = {
    beforeUpload: handleFileSelect,
    accept: ".xlsx,.xls",
    showUploadList: false,
  };

  return (
    <>
      {contextHolder}
      <div className="bg-gray-50 p-4 min-h-screen">
        <div className="flex gap-4">
          {/* Left Table */}
          <div className="flex-1 bg-white rounded-md border border-gray-200">
            <div className="border-b px-4 py-2 flex justify-between items-center">
              <Input
                placeholder="Tìm hàng hóa theo mã hoặc tên "
                className="w-1/3"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onPressEnter={handleSearch}
                suffix={<SearchOutlined onClick={handleSearch} className="cursor-pointer" />}
              />
            </div>

            {productsList.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[450px]">
                <p className="text-gray-700 font-medium mb-1">
                  Thêm sản phẩm từ file excel
                </p>
                <p className="text-sm text-gray-500 mb-3">
                  (Tải về file mẫu:
                  <a href="#" className="text-blue-500 ml-1">
                    Excel file
                  </a>
                  )
                </p>
                <div className="flex gap-2">
                  <Upload {...uploadProps}>
                    <Button type="primary" icon={<UploadOutlined />}>
                      Chọn file dữ liệu
                    </Button>
                  </Upload>
                  {selectedFile && (
                    <div className="flex items-center gap-2">
                      <Tag color="blue">{selectedFile.name}</Tag>
                      <Button 
                        type="primary" 
                        onClick={handleImport}
                        loading={isLoading}
                      >
                        Thực hiện
                      </Button>
                      <Button 
                        onClick={() => setSelectedFile(null)}
                        icon={<DeleteOutlined />}
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-3">
                <Table
                  bordered
                  size="small"
                  rowKey="id"
                  columns={columns}
                  dataSource={productsList}
                  pagination={false}
                  scroll={{ x: 1400 }}
                />
              </div>
            )}
          </div>

          {/* Right Panel */}
          <div className="w-[340px] bg-white border border-gray-200 rounded-md p-4 flex flex-col justify-between">
            <Form form={form} layout="vertical" className="space-y-2">
              <Form.Item 
                label="Kho đi" 
                name="fromWarehouseId"
                rules={[{ required: true, message: 'Vui lòng chọn kho đi' }]}
              >
                <Select placeholder="Chọn kho đi" loading={isLoading}>
                  {warehouses.map(warehouse => (
                    <Select.Option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name} ({warehouse.code})
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item 
                label="Kho đến" 
                name="toWarehouseId"
                rules={[{ required: true, message: 'Vui lòng chọn kho đến' }]}
              >
                <Select placeholder="Chọn kho đến" loading={isLoading}>
                  {warehouses.map(warehouse => (
                    <Select.Option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name} ({warehouse.code})
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item 
                label="Mã phiếu chuyển" 
                name="invoiceCode"
                rules={[{ required: false, message: 'Mã phiếu chuyển' }]}
              >
                <Input placeholder="Để trống để tự động tạo mã" />
              </Form.Item>

              <Form.Item label="Trạng thái" name="status" initialValue="Draft">
                <Input value="Nháp" disabled />
              </Form.Item>

              <Form.Item 
                label="Ngày chuyển" 
                name="orderDate" 
                initialValue={dayjs()}
                rules={[{ required: true, message: 'Vui lòng chọn ngày chuyển' }]}
              >
                <DatePicker
                  className="w-full"
                  format="DD/MM/YYYY HH:mm"
                  showTime
                  suffixIcon={<CalendarOutlined />}
                />
              </Form.Item>

              <div className="pt-1 text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Tổng số lượng</span>
                  <span>{totalQty.toLocaleString("vi-VN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tổng phí phụ thu</span>
                  <span>{totalExtraFee.toLocaleString("vi-VN")} đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Tổng phí hoa hồng</span>
                  <span>{totalCommissionFee.toLocaleString("vi-VN")} đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Tổng giảm giá</span>
                  <span>- {totalDiscount.toLocaleString("vi-VN")} đ</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>Tổng tiền</span>
                  <span>{totalAmount.toLocaleString("vi-VN")} đ</span>
                </div>
              </div>

              <Form.Item label="Ghi chú" name="note">
                <Input.TextArea rows={2} placeholder="Ghi chú" />
              </Form.Item>
            </Form>

            {/* Buttons */}
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

      {/* Import Confirmation Modal */}
      <Modal
        title="Xác nhận Import"
        open={importModalVisible}
        onOk={confirmImport}
        onCancel={() => setImportModalVisible(false)}
        okText="Thêm vào danh sách"
        cancelText="Hủy"
        width={800}
      >
        <p>Bạn có muốn thêm {importedData.length} sản phẩm từ file import vào danh sách?</p>
        <Table
          size="small"
          dataSource={importedData}
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
            { title: "Mã container", dataIndex: "container-code", width: 120 },
          ]}
        />
      </Modal>

      {/* Search Product Modal */}
      <Modal
        title="Tìm kiếm sản phẩm"
        open={searchModalVisible}
        onCancel={() => setSearchModalVisible(false)}
        footer={null}
        width={800}
      >
        <div className="mb-4">
          <Input
            placeholder="Nhập mã hoặc tên sản phẩm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onPressEnter={handleSearch}
            suffix={<SearchOutlined onClick={handleSearch} className="cursor-pointer" />}
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
            onClick: () => selectProduct(record),
            style: { cursor: 'pointer' },
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
              render: (price) => price?.toLocaleString("vi-VN") 
            },
            { title: "Tồn kho", dataIndex: "stockQuantity", width: 80 },
          ]}
        />
      </Modal>
    </>
  );
}