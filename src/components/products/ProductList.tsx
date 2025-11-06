// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useProductStore } from "@/stores/useProductStore";
// import { useCategoryStore } from "@/stores/useCategoryStore";
// import { useBranchStore } from "@/stores/useBranchStore";
// import { Button, Input, Select, Table, Skeleton, Dropdown, message } from "antd";
// import type { ColumnsType } from "antd/es/table";
// import { SearchOutlined } from "@ant-design/icons";
// // import dayjs from "dayjs";
// import SubVariantTable from "./SubVariantTable";
// // import type { Product } from "@/types/product";
// // const { RangePicker } = DatePicker;
// import ModalCreateProduct from "./modals/ModalCreateProduct";
// import ModalCreateService from "./modals/ModalCreateService";
// import ModalCreateCombo from "./modals/ModalCreateCombo";

// interface ProductFilters {
//   SearchTerm?: string;
//   CategoryId?: string;
//   Status?: string;
//   FromDate?: string;
//   ToDate?: string;
//   BranchId?: string;
//   PageNumber?: number;
//   PageSize?: number;
// }

// export default function ProductList() {
//   const {
//     products,
//     loading,
//     error,
//     getProducts,
//     searchProducts,
//   } = useProductStore();

//   const { categories, getCategories } = useCategoryStore();
//   const { branches, getBranches } = useBranchStore();

//   const [openType, setOpenType] = useState<"product" | "service" | "combo" | null>(null);
//   const [filters, setFilters] = useState<ProductFilters>({
//     PageNumber: 1,
//     PageSize: 10,
//   });

//   // Fetch data khi component mount và khi filters thay đổi
//   useEffect(() => {
//     getProducts(filters);
//     getCategories();
//     getBranches();
//   }, [filters]);

//   // Hiển thị error nếu có
//   useEffect(() => {
//     if (error) {
//       message.error(error);
//     }
//   }, [error]);

//   // Transform categories cho select options
//   const categoryOptions = useMemo(() => {
//     return categories.map(cat => ({
//       label: cat.name,
//       value: cat.id,
//     }));
//   }, [categories]);

//   // Transform branches cho select options
//   const branchOptions = useMemo(() => {
//     return branches.map(branch => ({
//       label: branch.name,
//       value: branch.id,
//     }));
//   }, [branches]);

//   // Transform products từ API format sang frontend format cho table
//   const tableProducts = useMemo(() => {
//     return products.map(product => ({
//       id: product.id,
//       name: product.name,
//       variant: product.description || "",
//       price: product.sellingPrice || 0,
//       cost: product.costPrice || 0,
//       stock: product.stockQuantity || 0,
//       createdAt: "", // API không có trường này
//       image: product.avartarUrl || "/default-product.png",
//       type: "product",
//       group: product.categoryName || "",
//       supplier: product.brand || "",
//       attrs: {
//         color: product.color,
//         size: product.size,
//       },
//       variants: [], // Cần lấy từ API nếu có
//     }));
//   }, [products]);

//   // Cập nhật filters
//   const handleFilterChange = (newFilters: Partial<ProductFilters>) => {
//     setFilters(prev => ({
//       ...prev,
//       ...newFilters,
//       PageNumber: 1, // Reset về trang 1 khi filter
//     }));
//   };

//   // Reset filters
//   const resetFilters = () => {
//     setFilters({
//       PageNumber: 1,
//       PageSize: 10,
//     });
//   };

//   // Search products
//   const handleSearch = (value: string) => {
//     if (value.trim()) {
//       searchProducts(value);
//     } else {
//       getProducts();
//     }
//   };

//   // Cột bảng
//   const columns: ColumnsType<any> = [
//     {
//       title: "",
//       dataIndex: "select",
//       width: 48,
//       render: () => <input type="checkbox" className="mx-2" />,
//       fixed: "left",
//     },
//     {
//       title: "Mã hàng",
//       dataIndex: "id",
//       width: 180,
//       fixed: "left",
//       render: (_: unknown, r: any) => (
//         <div className="flex items-center gap-2">
//           <img src={r.image} className="w-8 h-10 rounded" alt={r.name} />
//           <div>
//             <div className="font-medium">{r.id}</div>
//             <div className="text-xs text-gray-400">{r.id?.slice(0, 6)}...</div>
//           </div>
//         </div>
//       ),
//       sorter: (a, b) => a.id.localeCompare(b.id),
//     },
//     {
//       title: "Tên hàng",
//       dataIndex: "name",
//       ellipsis: true,
//       render: (_: unknown, r: any) => (
//         <div>
//           <div>{r.name}</div>
//           <div className="text-xs text-gray-500">{r.variant}</div>
//         </div>
//       ),
//       sorter: (a, b) => a.name.localeCompare(b.name),
//     },
//     {
//       title: "Giá bán",
//       dataIndex: "price",
//       align: "right" as const,
//       width: 120,
//       render: (v: number) => v?.toLocaleString() + "₫",
//       sorter: (a, b) => (a.price || 0) - (b.price || 0),
//     },
//     {
//       title: "Giá vốn",
//       dataIndex: "cost",
//       align: "right" as const,
//       width: 120,
//       render: (v: number) => v?.toLocaleString() + "₫",
//       sorter: (a, b) => (a.cost || 0) - (b.cost || 0),
//     },
//     {
//       title: "Tồn kho",
//       dataIndex: "stock",
//       align: "center" as const,
//       width: 100,
//       sorter: (a, b) => (a.stock || 0) - (b.stock || 0),
//     },
//     {
//       title: "Trạng thái",
//       dataIndex: "status",
//       width: 120,
//       render: (status: string) => (
//         <span className={`px-2 py-1 rounded text-xs ${
//           status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//         }`}>
//           {status === "Active" ? "Đang bán" : "Ngừng bán"}
//         </span>
//       ),
//     },
//   ];

//   // Dropdown items cho tạo mới
//   const dropdownItems = [
//     {
//       key: "product",
//       label: "Hàng hóa",
//       onClick: () => setOpenType("product"),
//     },
//     {
//       key: "service",
//       label: "Dịch vụ",
//       onClick: () => setOpenType("service"),
//     },
//     {
//       key: "combo",
//       label: "Combo - đóng gói",
//       onClick: () => setOpenType("combo"),
//     },
//   ];

//   return (
//     <div className="flex gap-4">
//       {/* Sidebar Filter */}
//       <aside className="w-[300px] shrink-0 bg-white rounded-md border border-gray-200 p-3">
//         <div className="mb-3">
//           <Input
//             allowClear
//             prefix={<SearchOutlined />}
//             placeholder="Theo mã, tên hàng"
//             onPressEnter={(e) => handleSearch((e.target as HTMLInputElement).value)}
//             onBlur={(e) => handleSearch(e.target.value)}
//           />
//         </div>

//         <div className="space-y-4">
//           <div>
//             <div className="text-[13px] font-semibold mb-1">Nhóm hàng</div>
//             <Select
//               className="w-full"
//               allowClear
//               placeholder="Chọn nhóm hàng"
//               options={categoryOptions}
//               onChange={(v) => handleFilterChange({ CategoryId: v })}
//             />
//           </div>

//           <div>
//             <div className="text-[13px] font-semibold mb-1">Trạng thái</div>
//             <Select
//               className="w-full"
//               allowClear
//               placeholder="Chọn trạng thái"
//               options={[
//                 { label: "Đang bán", value: "Active" },
//                 { label: "Ngừng bán", value: "Inactive" },
//               ]}
//               onChange={(v) => handleFilterChange({ Status: v })}
//             />
//           </div>

//           <div>
//             <div className="text-[13px] font-semibold mb-1">Chi nhánh</div>
//             <Select
//               className="w-full"
//               allowClear
//               placeholder="Chọn chi nhánh"
//               options={branchOptions}
//               onChange={(v) => handleFilterChange({ BranchId: v })}
//             />
//           </div>

//           <div className="pt-1">
//             <Button type="link" onClick={resetFilters}>
//               Mặc định
//             </Button>
//           </div>
//         </div>
//       </aside>

//       {/* Table cấp 1 */}
//       <section className="flex-1">
//         <div className="bg-white rounded-md border border-gray-200 p-2">
//           <div className="flex items-center justify-between px-2 py-2">
//             <div className="text-[13px] text-gray-500">
//               Tổng: <b>{tableProducts.length.toLocaleString()}</b> hàng hoá
//             </div>
//             <div className="flex gap-2">
//               <Dropdown
//                 menu={{ items: dropdownItems }}
//                 trigger={["hover"]}
//                 placement="bottomRight"
//               >
//                 <Button type="primary">+ Tạo mới</Button>
//               </Dropdown>
//               <Button>Import file</Button>
//               <Button>Export file</Button>
//             </div>
//           </div>

//           {loading ? (
//             <Skeleton active paragraph={{ rows: 8 }} />
//           ) : (
//             <Table
//               rowKey="id"
//               loading={loading}
//               columns={columns}
//               dataSource={tableProducts}
//               size="middle"
//               pagination={{ 
//                 pageSize: filters.PageSize,
//                 current: filters.PageNumber,
//                 total: tableProducts.length,
//                 showSizeChanger: true,
//                 onChange: (page, pageSize) => {
//                   handleFilterChange({ 
//                     PageNumber: page, 
//                     PageSize: pageSize 
//                   });
//                 }
//               }}
//               scroll={{ x: 1200 }}
//               expandable={{
//                 expandedRowRender: (record) => (
//                   <SubVariantTable master={record} />
//                 ),
//                 rowExpandable: () => true,
//               }}
//               rowClassName="hover:bg-blue-50"
//               sticky
//             />
//           )}
//         </div>
//       </section>

//       {/* Modals */}
//       <ModalCreateProduct open={openType === "product"} onClose={() => setOpenType(null)} />
//       <ModalCreateService open={openType === "service"} onClose={() => setOpenType(null)} />
//       <ModalCreateCombo open={openType === "combo"} onClose={() => setOpenType(null)} />
//     </div>
//   );
// }
// components/products/ProductList.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useProductStore } from "@/stores/useProductStore";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { useBranchStore } from "@/stores/useBranchStore";
import { Button, Input, Select, Table, Skeleton, Dropdown, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined } from "@ant-design/icons";
import SubVariantTable from "./SubVariantTable";
import ModalCreateProduct from "./modals/ModalCreateProduct";
import ModalCreateService from "./modals/ModalCreateService";
import ModalCreateCombo from "./modals/ModalCreateCombo";

interface ProductFilters {
  SearchTerm?: string;
  CategoryId?: string;
  Status?: string;
  FromDate?: string;
  ToDate?: string;
  BranchId?: string;
  PageNumber?: number;
  PageSize?: number;
}

export default function ProductList() {
  const {
    products,
    loading,
    error,
    getProducts,
    searchProducts,
  } = useProductStore();

  const { categories, getCategories } = useCategoryStore();
  const { branches, getBranches } = useBranchStore();

  const [openType, setOpenType] = useState<"product" | "service" | "combo" | null>(null);
  const [filters, setFilters] = useState<ProductFilters>({
    PageNumber: 1,
    PageSize: 10,
  });

  // Fetch data khi component mount và khi filters thay đổi
  useEffect(() => {
    getProducts(filters);
    getCategories();
    getBranches();
  }, [filters]);

  // Hiển thị error nếu có
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  // Transform categories cho select options
  const categoryOptions = useMemo(() => {
    return categories.map(cat => ({
      label: cat.name,
      value: cat.id,
    }));
  }, [categories]);

  // Transform branches cho select options
  const branchOptions = useMemo(() => {
    return branches.map(branch => ({
      label: branch.name,
      value: branch.id,
    }));
  }, [branches]);

  // Transform products từ API format sang frontend format cho table
  const tableProducts = useMemo(() => {
    return products.map(product => ({
      id: product.id,
      name: product.name,
      variant: product.description || "",
      price: product.sellingPrice || 0,
      cost: product.costPrice || 0,
      stock: product.stockQuantity || 0,
      createdAt: "", // API không có trường này
      image: product.avartarUrl || "/default-product.png",
      type: "product",
      group: product.categoryName || "",
      supplier: product.brand || "",
      attrs: {
        color: product.color,
        size: product.size,
      },
      status: product.status,
      // Thêm các trường cần thiết cho Variant type
      sku: product.sku,
      description: product.description,
      color: product.color,
      size: product.size,
      brand: product.brand,
      material: product.material,
      weight: product.weight,
      isMaster: product.isMaster,
      variants: [], // Không có variants trong API hiện tại
    }));
  }, [products]);

  // Cập nhật filters
  const handleFilterChange = (newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      PageNumber: 1, // Reset về trang 1 khi filter
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      PageNumber: 1,
      PageSize: 10,
    });
  };

  // Search products
  const handleSearch = (value: string) => {
    if (value.trim()) {
      searchProducts(value);
    } else {
      getProducts();
    }
  };

  // Cột bảng
  const columns: ColumnsType<any> = [
    {
      title: "",
      dataIndex: "select",
      width: 48,
      render: () => <input type="checkbox" className="mx-2" />,
      fixed: "left",
    },
    {
      title: "Mã hàng",
      dataIndex: "sku",
      width: 180,
      fixed: "left",
      render: (sku: string, record: any) => (
        <div className="flex items-center gap-2">
          <img src={record.image} className="w-8 h-10 rounded" alt={record.name} />
          <div>
            <div className="font-medium">{sku}</div>
            <div className="text-xs text-gray-400">{record.id?.slice(0, 6)}...</div>
          </div>
        </div>
      ),
      sorter: (a, b) => (a.sku || "").localeCompare(b.sku || ""),
    },
    {
      title: "Tên hàng",
      dataIndex: "name",
      ellipsis: true,
      render: (name: string, record: any) => (
        <div>
          <div>{name}</div>
          <div className="text-xs text-gray-500">
            {record.color && `Màu: ${record.color}`} 
            {record.size && ` • Size: ${record.size}`}
          </div>
        </div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      align: "right" as const,
      width: 120,
      render: (v: number) => v?.toLocaleString() + "₫",
      sorter: (a, b) => (a.price || 0) - (b.price || 0),
    },
    {
      title: "Giá vốn",
      dataIndex: "cost",
      align: "right" as const,
      width: 120,
      render: (v: number) => v?.toLocaleString() + "₫",
      sorter: (a, b) => (a.cost || 0) - (b.cost || 0),
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      align: "center" as const,
      width: 100,
      sorter: (a, b) => (a.stock || 0) - (b.stock || 0),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 120,
      render: (status: string) => (
        <span className={`px-2 py-1 rounded text-xs ${
          status === "Available" ? "bg-green-100 text-green-800" : 
          status === "Unavailable" ? "bg-red-100 text-red-800" : 
          "bg-gray-100 text-gray-800"
        }`}>
          {status === "Available" ? "Đang bán" : 
           status === "Unavailable" ? "Ngừng bán" : 
           status === "OutOfStock" ? "Hết hàng" : status}
        </span>
      ),
    },
  ];

  // Dropdown items cho tạo mới
  const dropdownItems = [
    {
      key: "product",
      label: "Hàng hóa",
      onClick: () => setOpenType("product"),
    },
    {
      key: "service",
      label: "Dịch vụ",
      onClick: () => setOpenType("service"),
    },
    {
      key: "combo",
      label: "Combo - đóng gói",
      onClick: () => setOpenType("combo"),
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
            placeholder="Theo mã, tên hàng"
            onPressEnter={(e) => handleSearch((e.target as HTMLInputElement).value)}
            onBlur={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-[13px] font-semibold mb-1">Nhóm hàng</div>
            <Select
              className="w-full"
              allowClear
              placeholder="Chọn nhóm hàng"
              options={categoryOptions}
              onChange={(v) => handleFilterChange({ CategoryId: v })}
            />
          </div>

          <div>
            <div className="text-[13px] font-semibold mb-1">Trạng thái</div>
            <Select
              className="w-full"
              allowClear
              placeholder="Chọn trạng thái"
              options={[
                { label: "Đang bán", value: "Available" },
                { label: "Ngừng bán", value: "Unavailable" },
                { label: "Hết hàng", value: "OutOfStock" },
              ]}
              onChange={(v) => handleFilterChange({ Status: v })}
            />
          </div>

          <div>
            <div className="text-[13px] font-semibold mb-1">Chi nhánh</div>
            <Select
              className="w-full"
              allowClear
              placeholder="Chọn chi nhánh"
              options={branchOptions}
              onChange={(v) => handleFilterChange({ BranchId: v })}
            />
          </div>

          <div className="pt-1">
            <Button type="link" onClick={resetFilters}>
              Mặc định
            </Button>
          </div>
        </div>
      </aside>

      {/* Table cấp 1 */}
      <section className="flex-1">
        <div className="bg-white rounded-md border border-gray-200 p-2">
          <div className="flex items-center justify-between px-2 py-2">
            <div className="text-[13px] text-gray-500">
              Tổng: <b>{tableProducts.length.toLocaleString()}</b> hàng hoá
            </div>
            <div className="flex gap-2">
              <Dropdown
                menu={{ items: dropdownItems }}
                trigger={["hover"]}
                placement="bottomRight"
              >
                <Button type="primary">+ Tạo mới</Button>
              </Dropdown>
              <Button>Import file</Button>
              <Button>Export file</Button>
            </div>
          </div>

          {loading ? (
            <Skeleton active paragraph={{ rows: 8 }} />
          ) : (
            <Table
              rowKey="id"
              loading={loading}
              columns={columns}
              dataSource={tableProducts}
              size="middle"
              pagination={{ 
                pageSize: filters.PageSize,
                current: filters.PageNumber,
                total: tableProducts.length,
                showSizeChanger: true,
                onChange: (page, pageSize) => {
                  handleFilterChange({ 
                    PageNumber: page, 
                    PageSize: pageSize 
                  });
                }
              }}
              scroll={{ x: 1200 }}
              expandable={{
                expandedRowRender: (record) => (
                  <SubVariantTable master={record} />
                ),
                rowExpandable: () => true,
              }}
              rowClassName="hover:bg-blue-50"
              sticky
            />
          )}
        </div>
      </section>

      {/* Modals */}
      <ModalCreateProduct open={openType === "product"} onClose={() => setOpenType(null)} />
      <ModalCreateService open={openType === "service"} onClose={() => setOpenType(null)} />
      <ModalCreateCombo open={openType === "combo"} onClose={() => setOpenType(null)} />
    </div>
  );
}