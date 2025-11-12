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
  InputNumber,
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
import { useStockTakeStore } from "@/stores/useStockTakeStore";
import useWarehouseStore from "@/stores/useWarehouseStore";
import { useProductStore } from "@/stores/useProductStore";
import { useBranchStore } from "@/stores/useBranchStore";
import type { CreateStockAdjustmentRequest, CreateStockAdjustmentDetailRequest } from "@/types/stocktake";
import type { Product } from "@/types/product";
import dayjs from "dayjs";
import type { RcFile } from "antd/es/upload";

interface ProductRow {
  id: string;
  sku: string;
  productName: string;
  systemQty: number;
  actualQty: number;
  differenceQty: number;
  unitCost: number;
  totalValueChange: number;
  reason: string;
  productId?: string;
}

export default function StockTakeNew() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  
  // Stores 
  const { createStockAdjustment, isLoading } = useStockTakeStore();
  const { warehouses, getWarehouses } = useWarehouseStore();
  const { products, searchProducts } = useProductStore();
  const { branches, getBranches } = useBranchStore();
  
  // State
  const [productsList, setProductsList] = useState<ProductRow[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [, setImportedData] = useState<ProductRow[]>([]);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<string>("");

  // Load initial data on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      await getBranches();
      await getWarehouses();
    };
    loadInitialData();
  }, [getBranches, getWarehouses]);

  // Filter warehouses based on selected branch
  const filteredWarehouses = warehouses.filter(warehouse => {
    if (!selectedBranch) return true;
    
    // Find the selected branch to get its name
    const selectedBranchObj = branches.find(branch => branch.id === selectedBranch);
    if (!selectedBranchObj) return true;
    
    return warehouse.branchName.toLowerCase().includes(selectedBranchObj.name.toLowerCase());
  });

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

  const calculateDifferences = (product: ProductRow): ProductRow => {
    const systemQty = product.systemQty || 0;
    const actualQty = product.actualQty || 0;
    const differenceQty = actualQty - systemQty;
    const unitCost = product.unitCost || 0;
    const totalValueChange = differenceQty * unitCost;

    return {
      ...product,
      differenceQty,
      totalValueChange,
    };
  };

  const handleProductChange = (index: number, field: keyof ProductRow, value: string | number) => {
    const newList = [...productsList];
    if (!newList[index]) {
      newList[index] = createEmptyProduct();
    }

    newList[index] = { ...newList[index], [field]: value };
    newList[index] = calculateDifferences(newList[index]);
    
    setProductsList(newList);
  };

  const createEmptyProduct = (): ProductRow => ({
    id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    sku: "",
    productName: "",
    systemQty: 0,
    actualQty: 0,
    differenceQty: 0,
    unitCost: 0,
    totalValueChange: 0,
    reason: "",
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
    // TODO: Implement actual file import logic for stock adjustment
    messageApi.info("Chức năng import file sẽ được triển khai sau");
  };

  const confirmImport = () => {
    // TODO: Implement actual import confirmation logic
    setImportModalVisible(false);
    setSelectedFile(null);
    setImportedData([]);
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
      systemQty: product.stockQuantity || 0,
      actualQty: product.stockQuantity || 0,
      differenceQty: 0,
      unitCost: product.costPrice || 0,
      totalValueChange: 0,
      reason: "",
      productId: product.id,
    };
    addProductRow(newProduct);
    setSearchModalVisible(false);
    setSearchTerm("");
  };

  const handleBranchChange = (branchId: string) => {
    setSelectedBranch(branchId);
    
    // Reset warehouse selection when branch changes
    setTimeout(() => {
      form.setFieldValue("warehouseId", undefined);
    }, 0);
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
      title: "Tồn hệ thống",
      dataIndex: "systemQty",
      width: 120,
      render: (value, _, index) => (
        <InputNumber
          min={0}
          precision={0}
          style={{ width: '100%' }}
          value={value}
          placeholder="0"
          onChange={(value) =>
            handleProductChange(index, "systemQty", Number(value || 0))
          }
        />
      ),
    },
    {
      title: "Tồn thực tế",
      dataIndex: "actualQty",
      width: 120,
      render: (value, _, index) => (
        <InputNumber
          min={0}
          precision={0}
          style={{ width: '100%' }}
          value={value}
          placeholder="0"
          onChange={(value) =>
            handleProductChange(index, "actualQty", Number(value || 0))
          }
        />
      ),
    },
    {
      title: "Chênh lệch",
      dataIndex: "differenceQty",
      width: 100,
      render: (value) => (
        <span className={value >= 0 ? "text-green-600" : "text-red-600"}>
          {value >= 0 ? '+' : ''}{value}
        </span>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "unitCost",
      width: 120,
      render: (value, _, index) => (
        <InputNumber
          min={0}
          precision={0}
          style={{ width: '100%' }}
          value={value}
          placeholder="0"
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
          onChange={(value) =>
            handleProductChange(index, "unitCost", Number(value || 0))
          }
        />
      ),
    },
    {
      title: "Giá trị thay đổi",
      dataIndex: "totalValueChange",
      width: 140,
      render: (value) => (
        <span className={value >= 0 ? "text-green-600" : "text-red-600"}>
          {value >= 0 ? '+' : ''}{value.toLocaleString("vi-VN")} ₫
        </span>
      ),
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      width: 150,
      render: (value, _, index) => (
        <Input
          value={value}
          placeholder="Lý do điều chỉnh"
          onChange={(e) =>
            handleProductChange(index, "reason", e.target.value)
          }
        />
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

  // Tổng giá trị thay đổi
  const totalValueChange = productsList.reduce((sum, p) => sum + (p.totalValueChange || 0), 0);

  // Tổng số lượng tăng
  const totalIncrease = productsList
    .filter(p => p.differenceQty > 0)
    .reduce((sum, p) => sum + p.differenceQty, 0);

  // Tổng số lượng giảm
  const totalDecrease = productsList
    .filter(p => p.differenceQty < 0)
    .reduce((sum, p) => sum + Math.abs(p.differenceQty), 0);

  const handleSave = async (status: "Tạm" | "Chờ Duyệt") => {
    try {
      const values = await form.validateFields();

      if (productsList.length === 0) {
        messageApi.warning("Vui lòng thêm ít nhất một sản phẩm!");
        return;
      }

      if (!values.branchId || !values.warehouseId) {
        messageApi.warning("Vui lòng chọn chi nhánh và kho!");
        return;
      }

      const userInfo = getUserInfo();
      const employeeId = userInfo?.accountId;

      if (!employeeId) {
        messageApi.warning("Không tìm thấy thông tin người dùng!");
        return;
      }

      const adjustmentDetails: CreateStockAdjustmentDetailRequest[] = productsList.map((p) => ({
        "product-id": p.productId || "",
        "system-qty": p.systemQty || 0,
        "actual-qty": p.actualQty || 0,
        "difference-qty": p.differenceQty || 0,
        "unit-cost": p.unitCost || 0,
        reason: p.reason || "",
      }));

      const payload: CreateStockAdjustmentRequest = {
        "adjustment-code": values.adjustmentCode || "",
        "adjustment-date": values.adjustmentDate 
          ? values.adjustmentDate.format('YYYY-MM-DDTHH:mm:ss') 
          : dayjs().format('YYYY-MM-DDTHH:mm:ss'),
        "adjustment-type": values.adjustmentType || "Kiểm Kê",
        "branch-id": values.branchId,
        "warehouse-id": values.warehouseId,
        "employee-id": employeeId,
        "status": status,
        "note": values.note || "",
        "stock-adjustment-details": adjustmentDetails,
      };

      const result = await createStockAdjustment(payload);
      if (result.success) {
        messageApi.success(
          `Phiếu điều chỉnh đã được ${
            status === "Tạm" ? "lưu tạm" : "tạo thành công và chờ duyệt"
          }!`
        );
        router.push("/stock-take");
      } else {
        messageApi.error(result.message || "Tạo phiếu điều chỉnh thất bại");
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
                placeholder="Tìm hàng hóa theo mã hoặc tên"
                className="w-1/3"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onPressEnter={handleSearch}
                suffix={<SearchOutlined onClick={handleSearch} className="cursor-pointer" />}
              />
              <div className="flex gap-2">
                <Button
                  icon={<UploadOutlined />}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Import Excel
                </Button>
                <Upload {...uploadProps}>
                  <input id="file-upload" type="file" hidden />
                </Upload>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => addProductRow()}
                >
                  Thêm sản phẩm
                </Button>
              </div>
            </div>

            {productsList.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[450px]">
                <p className="text-gray-700 font-medium mb-1">
                  Thêm sản phẩm để điều chỉnh tồn kho
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
                label="Chi nhánh" 
                name="branchId"
                rules={[{ required: true, message: 'Vui lòng chọn chi nhánh' }]}
              >
                <Select 
                  placeholder="Chọn chi nhánh" 
                  onChange={handleBranchChange}
                  allowClear
                >
                  {branches.map(branch => (
                    <Select.Option key={branch.id} value={branch.id}>
                      {branch.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item 
                label="Kho điều chỉnh" 
                name="warehouseId"
                rules={[{ required: true, message: 'Vui lòng chọn kho' }]}
              >
                <Select 
                  placeholder="Chọn kho" 
                  loading={isLoading}
                  allowClear
                >
                  {filteredWarehouses.map(warehouse => (
                    <Select.Option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name} ({warehouse.code})
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item 
                label="Loại điều chỉnh" 
                name="adjustmentType"
                initialValue="Kiểm Kê"
              >
                <Select placeholder="Chọn loại điều chỉnh">
                  <Select.Option value="Kiểm Kê">Kiểm Kê</Select.Option>
                  <Select.Option value="Hư Hỏng">Hư Hỏng</Select.Option>
                  <Select.Option value="Mất Hàng">Mất Hàng</Select.Option>
                  <Select.Option value="Khác">Khác</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item 
                label="Mã phiếu điều chỉnh" 
                name="adjustmentCode"
              >
                <Input placeholder="Để trống để tự động tạo mã" />
              </Form.Item>

              <Form.Item 
                label="Ngày điều chỉnh" 
                name="adjustmentDate" 
                initialValue={dayjs()}
                rules={[{ required: true, message: 'Vui lòng chọn ngày điều chỉnh' }]}
              >
                <DatePicker
                  className="w-full"
                  format="DD/MM/YYYY HH:mm"
                  showTime
                  suffixIcon={<CalendarOutlined />}
                />
              </Form.Item>

              <div className="pt-1 text-sm space-y-2 border-t">
                <div className="flex justify-between">
                  <span>Tổng lệch tăng</span>
                  <span className="text-green-600">+{totalIncrease.toLocaleString("vi-VN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tổng lệch giảm</span>
                  <span className="text-red-600">-{totalDecrease.toLocaleString("vi-VN")}</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>Tổng giá trị thay đổi</span>
                  <span className={totalValueChange >= 0 ? "text-green-600" : "text-red-600"}>
                    {totalValueChange >= 0 ? '+' : ''}{totalValueChange.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
              </div>

              <Form.Item label="Ghi chú" name="note">
                <Input.TextArea rows={3} placeholder="Ghi chú điều chỉnh" />
              </Form.Item>
            </Form>

            {/* Buttons */}
            <div className="flex gap-2 mt-4">
              <Button
                icon={<SaveOutlined />}
                onClick={() => handleSave("Tạm")}
                loading={isLoading}
                className="flex-1"
              >
                Lưu tạm
              </Button>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => handleSave("Chờ Duyệt")}
                loading={isLoading}
                className="flex-1 bg-green-500 hover:bg-green-600"
              >
                Gửi duyệt
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
        <p>Chức năng import file cho điều chỉnh tồn kho sẽ được triển khai sau.</p>
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
            { 
              title: "Tồn kho", 
              dataIndex: "stockQuantity", 
              width: 80,
              render: (qty) => qty?.toLocaleString("vi-VN")
            },
          ]}
        />
      </Modal>
    </>
  );
}