// app/sales-plans/new/page.tsx
"use client";

import { useState, useEffect } from "react";
import { 
  Table, 
  Input, 
  Button, 
  Card, 
  Tag, 
  Select, 
  DatePicker, 
  Form, 
  message, 
  Spin,
  Image,
  Space
} from "antd";
import type { TableProps } from "antd";
import { useRouter } from "next/navigation";
import { SearchOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";

// Mock data cho sản phẩm unavailable
const mockUnavailableProducts = [
  {
    id: "prod-001",
    sku: "HH000009",
    name: "Thịt bò khô 30g - Lỗi bao bì",
    avatar: "https://cdn2-retail-images.kiotviet.vn/2025/11/03/shopledaihanh/78154db5ae074a3fbaf7c47bbdfff08c.jpg",
    category: "Thực Phẩm",
    costPrice: 48000,
    sellingPrice: 65000,
    currentStock: 50,
    reason: "Bao bì rách, không đảm bảo vệ sinh",
    status: "unavailable",
    createdDate: "2025-11-20"
  },
  {
    id: "prod-002", 
    sku: "HH000011",
    name: "Phở bò phố cổ - Hết hạn",
    avatar: null,
    category: "Thực Phẩm",
    costPrice: 25000,
    sellingPrice: 42000,
    currentStock: 100,
    reason: "Sắp hết hạn sử dụng",
    status: "unavailable",
    createdDate: "2025-11-19"
  },
  {
    id: "prod-003",
    sku: "HH000015", 
    name: "Kem dưỡng da Johnson xanh - Lỗi in ấn",
    avatar: "https://cdn2-retail-images.kiotviet.vn/2025/11/07/shopledaihanh/c1a6c327e8c741ed83b0aa62ced64a2f.jpg",
    category: "Mỹ Phẩm",
    costPrice: 10000,
    sellingPrice: 35000,
    currentStock: 200,
    reason: "Nhãn mác in sai thông tin",
    status: "unavailable", 
    createdDate: "2025-11-18"
  },
  {
    id: "prod-004",
    sku: "HH000016",
    name: "Kem dưỡng da Johnson đỏ - Trầy xước",
    avatar: null,
    category: "Mỹ Phẩm", 
    costPrice: 1000,
    sellingPrice: 5000,
    currentStock: 500,
    reason: "Vỏ hộp bị trầy xước",
    status: "unavailable",
    createdDate: "2025-11-17"
  },
  {
    id: "prod-005",
    sku: "HH000023", 
    name: "Yếm váy jean túi nắp - Lỗi đường may",
    avatar: "https://cdn2-retail-images.kiotviet.vn/2025/11/03/shopledaihanh/78154db5ae074a3fbaf7c47bbdfff08c.jpg",
    category: "Thời Trang",
    costPrice: 80000,
    sellingPrice: 120000,
    currentStock: 30,
    reason: "Đường may bị lỗi, dễ bung chỉ",
    status: "unavailable",
    createdDate: "2025-11-16"
  },
  {
    id: "prod-006",
    sku: "HH000025",
    name: "Set áo 2 dây dù viền bèo - Màu lỗi",
    avatar: "https://cdn2-retail-images.kiotviet.vn/2025/11/07/shopledaihanh/c1a6c327e8c741ed83b0aa62ced64a2f.jpg",
    category: "Thời Trang",
    costPrice: 80000,
    sellingPrice: 110000, 
    currentStock: 75,
    reason: "Màu sắc không đúng với mẫu",
    status: "unavailable",
    createdDate: "2025-11-15"
  }
];

interface SelectedProduct {
  id: string;
  sku: string;
  name: string;
  avatar: string | null;
  category: string;
  costPrice: number;
  sellingPrice: number;
  currentStock: number;
  reason: string;
  plannedQuantity: number;
  dispositionPlan: string;
  notes: string;
}

export default function SalesPlanNew() {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [form] = Form.useForm();

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setProducts(mockUnavailableProducts);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddProduct = (product: any) => {
    // Check if product already selected
    if (selectedProducts.find(p => p.id === product.id)) {
      messageApi.warning("Sản phẩm đã được chọn");
      return;
    }

    const selectedProduct: SelectedProduct = {
      ...product,
      plannedQuantity: 1,
      dispositionPlan: "discount",
      notes: ""
    };

    setSelectedProducts(prev => [...prev, selectedProduct]);
    messageApi.success("Đã thêm sản phẩm vào kế hoạch");
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
    messageApi.success("Đã xóa sản phẩm khỏi kế hoạch");
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    setSelectedProducts(prev => 
      prev.map(p => p.id === productId ? { ...p, plannedQuantity: quantity } : p)
    );
  };

  const handleDispositionChange = (productId: string, plan: string) => {
    setSelectedProducts(prev => 
      prev.map(p => p.id === productId ? { ...p, dispositionPlan: plan } : p)
    );
  };

  const handleNotesChange = (productId: string, notes: string) => {
    setSelectedProducts(prev => 
      prev.map(p => p.id === productId ? { ...p, notes } : p)
    );
  };

  const handleSubmit = async (values: any) => {
    if (selectedProducts.length === 0) {
      messageApi.error("Vui lòng chọn ít nhất một sản phẩm");
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      messageApi.success("Tạo kế hoạch bán hàng thành công!");
      setLoading(false);
      router.push("/salesPlans");
    }, 2000);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(products.map(p => p.category)));

  const productColumns: TableProps<any>['columns'] = [
    {
      title: 'Hình ảnh',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      render: (avatar: string) => 
        avatar ? (
          <Image 
            width={40} 
            height={40} 
            src={avatar} 
            alt="product" 
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div className="w-10 h-10 bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
            No Image
          </div>
        )
    },
    {
      title: 'Mã SKU',
      dataIndex: 'sku',
      key: 'sku',
      width: 120,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      width: 120,
    },
    {
      title: 'Tồn kho',
      dataIndex: 'currentStock',
      key: 'currentStock',
      width: 100,
      align: 'center',
    },
    {
      title: 'Giá vốn',
      dataIndex: 'costPrice',
      key: 'costPrice',
      width: 120,
      render: (price: number) => price?.toLocaleString("vi-VN") + " đ",
    },
    {
      title: 'Lý do',
      dataIndex: 'reason',
      key: 'reason',
      width: 200,
      render: (reason: string) => (
        <Tag color="orange" className="text-xs">
          {reason}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button 
          type="primary" 
          size="small"
          icon={<PlusOutlined />}
          onClick={() => handleAddProduct(record)}
          disabled={selectedProducts.some(p => p.id === record.id)}
        >
          Chọn
        </Button>
      ),
    },
  ];

  const selectedProductColumns: TableProps<SelectedProduct>['columns'] = [
    {
      title: 'Mã SKU',
      dataIndex: 'sku',
      key: 'sku',
      width: 120,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: 'SL tồn',
      dataIndex: 'currentStock',
      key: 'currentStock',
      width: 80,
      align: 'center',
    },
    {
      title: 'SL xử lý',
      key: 'plannedQuantity',
      width: 120,
      render: (_, record) => (
        <Input
          type="number"
          min={1}
          max={record.currentStock}
          value={record.plannedQuantity}
          onChange={(e) => handleQuantityChange(record.id, parseInt(e.target.value) || 1)}
          style={{ width: 80 }}
        />
      ),
    },
    {
      title: 'Phương án xử lý',
      key: 'dispositionPlan',
      width: 150,
      render: (_, record) => (
        <Select
          value={record.dispositionPlan}
          onChange={(value) => handleDispositionChange(record.id, value)}
          style={{ width: '100%' }}
          options={[
            { value: 'discount', label: 'Giảm giá bán' },
            { value: 'return', label: 'Trả nhà cung cấp' },
            { value: 'repair', label: 'Sửa chữa' },
            { value: 'destroy', label: 'Tiêu hủy' },
            { value: 'donate', label: 'Quyên góp' },
          ]}
        />
      ),
    },
    {
      title: 'Ghi chú',
      key: 'notes',
      width: 200,
      render: (_, record) => (
        <Input
          value={record.notes}
          onChange={(e) => handleNotesChange(record.id, e.target.value)}
          placeholder="Ghi chú..."
        />
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Button 
          danger
          type="text"
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveProduct(record.id)}
        />
      ),
    },
  ];

  const getDispositionPlanLabel = (plan: string) => {
    const planMap: { [key: string]: string } = {
      'discount': 'Giảm giá bán',
      'return': 'Trả NCC',
      'repair': 'Sửa chữa',
      'destroy': 'Tiêu hủy',
      'donate': 'Quyên góp'
    };
    return planMap[plan] || plan;
  };

  const getDispositionPlanColor = (plan: string) => {
    const colorMap: { [key: string]: string } = {
      'discount': 'blue',
      'return': 'orange',
      'repair': 'purple',
      'destroy': 'red',
      'donate': 'green'
    };
    return colorMap[plan] || 'default';
  };

  return (
    <>
      {contextHolder}
      <div className="p-0 min-h-screen mx-auto">
        
          {/* <p className="text-gray-600">Chọn sản phẩm không bán được và lập kế hoạch xử lý</p> */}
        

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Thông tin kế hoạch */}
            

            {/* Danh sách sản phẩm */}
            <div className="lg:col-span-2 space-y-6">
              {/* Sản phẩm đã chọn */}
              {selectedProducts.length > 0 && (
                <Card 
                  title={`Sản phẩm đã chọn (${selectedProducts.length})`}
                  className="border-blue-200 bg-blue-50"
                >
                  <Table
                    columns={selectedProductColumns}
                    dataSource={selectedProducts}
                    rowKey="id"
                    pagination={false}
                    size="small"
                    scroll={{ x: 800 }}
                  />
                </Card>
              )}

              {/* Danh sách sản phẩm unavailable */}
              <Card 
                title="Danh sách sản phẩm không bán được"
                extra={
                  <Space>
                    <Input
                      prefix={<SearchOutlined />}
                      placeholder="Tìm theo mã, tên sản phẩm..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ width: 250 }}
                    />
                    <Select
                      placeholder="Tất cả danh mục"
                      value={selectedCategory}
                      onChange={setSelectedCategory}
                      style={{ width: 150 }}
                      options={categories.map(cat => ({ value: cat, label: cat }))}
                      allowClear
                    />
                  </Space>
                }
              >
                {loading ? (
                  <div className="py-10 text-center">
                    <Spin />
                  </div>
                ) : (
                  <Table
                    columns={productColumns}
                    dataSource={filteredProducts}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    size="small"
                    scroll={{ x: 1000 }}
                  />
                )}
              </Card>
            </div>
            <div className="lg:col-span-1">
              <Card title="Thông tin kế hoạch" className="sticky top-0">
                <div className="space-y-4">
                  <Form.Item
                    label="Tên kế hoạch"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên kế hoạch' }]}
                  >
                    <Input placeholder="Nhập tên kế hoạch" />
                  </Form.Item>

                  <Form.Item
                    label="Mô tả"
                    name="description"
                  >
                    <Input.TextArea 
                      placeholder="Mô tả kế hoạch xử lý..."
                      rows={3}
                    />
                  </Form.Item>

                  <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                      label="Ngày bắt đầu"
                      name="startDate"
                      rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
                    >
                      <DatePicker 
                        style={{ width: '100%' }}
                        placeholder="Chọn ngày"
                      />
                    </Form.Item>

                    <Form.Item
                      label="Ngày kết thúc"
                      name="endDate"
                      rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
                    >
                      <DatePicker 
                        style={{ width: '100%' }}
                        placeholder="Chọn ngày"
                      />
                    </Form.Item>
                  </div>

                  <Form.Item
                    label="Nhà cung cấp"
                    name="supplier"
                  >
                    <Select
                      placeholder="Chọn nhà cung cấp"
                      options={[
                        { value: 'sup-001', label: 'NCC Việt Phát' },
                        { value: 'sup-002', label: 'NCC Hải Nam' },
                        { value: 'sup-003', label: 'NCC Thành Công' },
                        { value: 'sup-004', label: 'NCC Minh Anh' },
                      ]}
                    />
                  </Form.Item>

                  {/* Thống kê */}
                  <div className="border-t pt-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Số sản phẩm:</span>
                        <span className="font-semibold">{selectedProducts.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tổng số lượng:</span>
                        <span className="font-semibold">
                          {selectedProducts.reduce((sum, p) => sum + p.plannedQuantity, 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tổng giá vốn:</span>
                        <span className="font-semibold">
                          {selectedProducts
                            .reduce((sum, p) => sum + (p.costPrice * p.plannedQuantity), 0)
                            .toLocaleString("vi-VN")} đ
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={loading}
                      className="flex-1"
                    >
                      Tạo kế hoạch
                    </Button>
                    <Button 
                      onClick={() => router.push('/salesPlans')}
                      className="flex-1"
                    >
                      Hủy
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
}