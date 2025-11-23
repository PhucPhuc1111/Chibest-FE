// src/components/salesPlans/SupplierReport.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  Card, 
  Table, 
  Tag, 
  Statistic, 
  Row, 
  Col, 
  Progress, 
  Image, 
  Select, 
  Button, 
  Input 
} from "antd";
import type { TableProps } from "antd";
import { 
  SearchOutlined, 
  FileExcelOutlined, 
  PrinterOutlined, 
  EyeOutlined 
} from "@ant-design/icons";
import dayjs from 'dayjs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  TooltipProps
} from 'recharts';

// Interface từ data JSON
interface SalesPlanProduct {
  id: string;
  sku: string;
  "product-name": string;
  "avatar-url": string | null;
  "color": string;
  "size": string;
  "style": string;
  "sample-type": string;
  "sample-quantity": number;
  "sample-quantity-description": string;
  "delivery-date": string;
  "total-quantity": number;
  "finalize-date": string;
  status: string;
  notes: string;
  "supplier-name": string;
  "cost-price": number;
  "selling-price": number;
  "stock-quantity"?: number;
  "brand"?: string;
  "inventory-location"?: string;
  "weight"?: number;
}

interface SupplierStats {
  supplierName: string;
  totalProducts: number;
  totalQuantity: number;
  totalSampleQuantity: number;
  totalValue: number;
  completionRate: number;
  products: SalesPlanProduct[];
}

interface BarChartData {
  name: string;
  "Số sản phẩm": number;
  "Tổng số lượng": number;
  "Số lượng mẫu": number;
}

interface PieChartData {
  name: string;
  value: number;
  [key: string]: string | number; // ← Thêm index signature
}

interface OverallStats {
  totalSuppliers: number;
  totalProducts: number;
  totalQuantity: number;
  totalValue: number;
  avgCompletionRate: number;
}

interface SupplierOption {
  value: string;
  label: string;
}

interface TooltipPayload {
  color: string;
  name: string;
  value: number;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658'];

export default function SupplierReport() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<SalesPlanProduct[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string>("all");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/data/salesPlanData.json');
        const data = await response.json();
        
        if (data["status-code"] === 200) {
          setProducts(data.data["data-list"]);
        } else {
          console.error('Failed to load data:', data.message);
        }
      } catch (error) {
        console.error('Error loading sales plan data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Tính toán thống kê theo nhà cung cấp
  const supplierStats = useMemo((): SupplierStats[] => {
    const suppliers = [...new Set(products.map(p => p["supplier-name"]))];
    
    return suppliers.map(supplier => {
      const supplierProducts = products.filter(p => p["supplier-name"] === supplier);
      const totalQuantity = supplierProducts.reduce((sum, p) => sum + (p["total-quantity"] || 0), 0);
      const totalSampleQuantity = supplierProducts.reduce((sum, p) => sum + (p["sample-quantity"] || 0), 0);
      const totalValue = supplierProducts.reduce((sum, p) => sum + (p["cost-price"] || 0) * (p["total-quantity"] || 0), 0);
      
      const completionRate = Math.min(100, Math.round((totalSampleQuantity / totalQuantity) * 100) || 0);
      
      return {
        supplierName: supplier,
        totalProducts: supplierProducts.length,
        totalQuantity,
        totalSampleQuantity,
        totalValue,
        completionRate,
        products: supplierProducts
      };
    });
  }, [products]);

  // Dữ liệu cho biểu đồ cột
  const barChartData = useMemo((): BarChartData[] => {
    return supplierStats.map(stat => ({
      name: stat.supplierName,
      "Số sản phẩm": stat.totalProducts,
      "Tổng số lượng": stat.totalQuantity / 10,
      "Số lượng mẫu": stat.totalSampleQuantity,
    }));
  }, [supplierStats]);

  // Dữ liệu cho biểu đồ tròn
  const pieChartData = useMemo((): PieChartData[] => {
    return supplierStats.map(stat => ({
      name: stat.supplierName,
      value: stat.completionRate,
    }));
  }, [supplierStats]);

  // Lọc dữ liệu theo điều kiện
  const filteredStats = useMemo((): SupplierStats[] => {
    let filtered = supplierStats;
    
    if (selectedSupplier !== "all") {
      filtered = filtered.filter(stat => stat.supplierName === selectedSupplier);
    }
    
      
    if (searchText) {
      filtered = filtered.map(stat => ({
        ...stat,
        products: stat.products.filter(product => 
          product["product-name"].toLowerCase().includes(searchText.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchText.toLowerCase())
        )
      })).filter(stat => stat.products.length > 0);
    }
    
    return filtered;
  }, [supplierStats, selectedSupplier,  searchText]);

  // Tổng quan toàn bộ
  const overallStats = useMemo((): OverallStats => {
    return {
      totalSuppliers: supplierStats.length,
      totalProducts: supplierStats.reduce((sum, stat) => sum + stat.totalProducts, 0),
      totalQuantity: supplierStats.reduce((sum, stat) => sum + stat.totalQuantity, 0),
      totalValue: supplierStats.reduce((sum, stat) => sum + stat.totalValue, 0),
      avgCompletionRate: Math.round(supplierStats.reduce((sum, stat) => sum + stat.completionRate, 0) / supplierStats.length) || 0
    };
  }, [supplierStats]);

  const columns: TableProps<SupplierStats>["columns"] = [
    {
      title: "Nhà cung cấp",
      dataIndex: "supplierName",
      key: "supplierName",
      width: 200,
      render: (name: string) => (
        <div className="font-medium text-blue-600">{name}</div>
      ),
    },
    {
      title: "Số sản phẩm",
      dataIndex: "totalProducts",
      key: "totalProducts",
      width: 120,
      align: "center" as const,
      render: (count: number) => (
        <div className="text-base font-normal text-gray-700">
          {count.toLocaleString()}
        </div>
      ),
    },
    {
      title: "Tổng số lượng",
      dataIndex: "totalQuantity",
      key: "totalQuantity",
      width: 140,
      align: "center" as const,
      render: (quantity: number) => (
        <div className="text-base font-normal text-green-700">
          {quantity.toLocaleString()}
        </div>
      ),
    },
    {
      title: "Số lượng mẫu",
      dataIndex: "totalSampleQuantity",
      key: "totalSampleQuantity",
      width: 140,
      align: "center" as const,
      render: (quantity: number) => (
        <div className="text-base font-normal text-blue-700">
          {quantity.toLocaleString()}
        </div>
      ),
    },
    {
      title: "Tổng giá trị",
      dataIndex: "totalValue",
      key: "totalValue",
      width: 150,
      align: "center" as const,
      render: (value: number) => (
        <div className="text-base font-normal text-orange-700">
          {value.toLocaleString()}₫
        </div>
      ),
    },
    {
      title: "Tỷ lệ hoàn thành",
      dataIndex: "completionRate",
      key: "completionRate",
      width: 180,
      render: (rate: number) => (
        <div className="flex items-center gap-2">
          <Progress 
            percent={rate} 
            size="small" 
            strokeColor={
              rate >= 80 ? '#52c41a' :
              rate >= 50 ? '#faad14' : '#f5222d'
            }
            showInfo={false}
          />
          <span className="text-sm font-normal w-10 text-gray-700">{rate}%</span>
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 120,
      align: "center" as const,
      render: (_: unknown, record: SupplierStats) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record)}
          className="text-blue-600 hover:text-blue-800"
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  const productColumns: TableProps<SalesPlanProduct>["columns"] = [
    {
      title: "Hình ảnh",
      dataIndex: "avatar-url",
      key: "avatar-url",
      width: 80,
      render: (avatarUrl: string | null) => (
        <Image
          width={40}
          height={40}
          src={avatarUrl || "/images/noimage.png"}
          alt="product"
          className="rounded object-cover"
          fallback="/images/noimage.png"
          preview={false}
        />
      ),
    },
    {
      title: "Mã SKU",
      dataIndex: "sku",
      key: "sku",
      width: 120,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "product-name",
      key: "product-name",
      width: 200,
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
      key: "color",
      width: 100,
      render: (color: string) => <Tag color="blue">{color}</Tag>,
    },
    {
      title: "Kích thước",
      dataIndex: "size",
      key: "size",
      width: 100,
    },
    {
      title: "Loại mẫu",
      dataIndex: "sample-type",
      key: "sample-type",
      width: 120,
      render: (type: string) => (
        <Tag color={
          type === "Hàng tái" ? "blue" :
          type === "Mẫu hình" ? "green" :
          type === "Mẫu tái" ? "orange" : "purple"
        }>
          {type}
        </Tag>
      ),
    },
    {
      title: "Số lượng mẫu",
      dataIndex: "sample-quantity",
      key: "sample-quantity",
      width: 120,
      align: "center" as const,
    },
    {
      title: "Tổng số lượng",
      dataIndex: "total-quantity",
      key: "total-quantity",
      width: 120,
      align: "center" as const,
    },
    {
      title: "Ngày giao",
      dataIndex: "delivery-date",
      key: "delivery-date",
      width: 120,
      render: (date: string) => date ? dayjs(date).format('DD/MM/YYYY') : "—",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => (
        <Tag color={status === "Unavailable" ? "red" : "green"}>
          {status === "Unavailable" ? "Không khả dụng" : "Khả dụng"}
        </Tag>
      ),
    },
  ];

  const handleViewDetails = (supplier: SupplierStats): void => {
    console.log('View details for:', supplier.supplierName);
  };

  const handleExport = (): void => {
    console.log('Export data');
  };

  const handlePrint = (): void => {
    window.print();
  };

  const supplierOptions: SupplierOption[] = [
    { value: "all", label: "Tất cả nhà cung cấp" },
    ...supplierStats.map(stat => ({
      value: stat.supplierName,
      label: stat.supplierName
    }))
  ];

  // Custom Tooltip cho biểu đồ
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps): React.ReactNode => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-medium text-gray-800">{`${label}`}</p>
          {payload.map((entry: TooltipPayload, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Báo cáo nhà cung cấp</h1>
        <p className="text-gray-600">Thống kê và phân tích hiệu suất các nhà cung cấp</p>
      </div>

      {/* Filters */}
      <Card className="mb-6 shadow-sm">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm sản phẩm
            </label>
            <Input
              placeholder="Tìm theo tên sản phẩm hoặc mã SKU..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          
          <div className="w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nhà cung cấp
            </label>
            <Select
              value={selectedSupplier}
              onChange={setSelectedSupplier}
              options={supplierOptions}
              className="w-full"
            />
          </div>
         
          <div className="flex gap-2">
            <Button 
              type="primary" 
              icon={<FileExcelOutlined />}
              onClick={handleExport}
              className="bg-green-600 hover:bg-green-700"
            >
              Xuất Excel
            </Button>
            <Button 
              icon={<PrinterOutlined />}
              onClick={handlePrint}
            >
              In báo cáo
            </Button>
          </div>
        </div>
      </Card>

      {/* Overall Statistics */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Tổng số nhà cung cấp"
              value={overallStats.totalSuppliers}
              valueStyle={{ color: '#1890ff', fontSize: '24px', fontWeight: 'normal' }}
              prefix={<div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Tổng số sản phẩm"
              value={overallStats.totalProducts}
              valueStyle={{ color: '#52c41a', fontSize: '24px', fontWeight: 'normal' }}
              prefix={<div className="w-3 h-3 bg-green-500 rounded-full mr-2" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Tổng số lượng"
              value={overallStats.totalQuantity}
              valueStyle={{ color: '#faad14', fontSize: '24px', fontWeight: 'normal' }}
              prefix={<div className="w-3 h-3 bg-orange-500 rounded-full mr-2" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Tỷ lệ hoàn thành TB"
              value={overallStats.avgCompletionRate}
              suffix="%"
              valueStyle={{ color: '#722ed1', fontSize: '24px', fontWeight: 'normal' }}
              prefix={<div className="w-3 h-3 bg-purple-500 rounded-full mr-2" />}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={12}>
          <Card 
            title="Phân bố sản phẩm theo nhà cung cấp" 
            className="shadow-sm"
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="Số sản phẩm" 
                    fill="#0088FE" 
                    radius={[4, 4, 0, 0]}
                    name="Số sản phẩm"
                  />
                  <Bar 
                    dataKey="Tổng số lượng" 
                    fill="#00C49F" 
                    radius={[4, 4, 0, 0]}
                    name="Tổng số lượng (chia 10)"
                  />
                  <Bar 
                    dataKey="Số lượng mẫu" 
                    fill="#FFBB28" 
                    radius={[4, 4, 0, 0]}
                    name="Số lượng mẫu"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title="Tỷ lệ hoàn thành theo nhà cung cấp" 
            className="shadow-sm"
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: { name?: string; percent?: number }) => {
                      // ← Thêm type cho destructure
                      if (!name || percent === undefined) return '';
                      return `${name}: ${(percent * 100).toFixed(0)}%`;
                    }}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number | string) => [
                      typeof value === 'number' ? `${value}%` : value,
                      "Tỷ lệ hoàn thành"
                    ]} 
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Supplier Statistics Table */}
      <Card 
        title="Thống kê chi tiết theo nhà cung cấp" 
        className="shadow-sm"
        extra={
          <div className="text-sm text-gray-500">
            Hiển thị {filteredStats.length} nhà cung cấp
          </div>
        }
      >
        <Table
          loading={loading}
          columns={columns}
          dataSource={filteredStats}
          rowKey="supplierName"
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} nhà cung cấp`
          }}
          scroll={{ x: 1000 }}
          expandable={{
            expandedRowRender: (record: SupplierStats) => (
              <div className="p-4 bg-gray-50 rounded">
                <h4 className="font-semibold mb-3 text-gray-800">Sản phẩm của {record.supplierName}</h4>
                <Table
                  columns={productColumns}
                  dataSource={record.products}
                  rowKey="id"
                  pagination={false}
                  size="small"
                  scroll={{ x: 1200 }}
                />
              </div>
            ),
          }}
        />
      </Card>
    </div>
  );
}