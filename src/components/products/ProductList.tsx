// components/products/ProductList.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useProductStore } from "@/stores/useProductStore";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { useBranchStore } from "@/stores/useBranchStore";
import { useSessionStore } from "@/stores/useSessionStore";
import { Button, Input, Select, Table, Skeleton, Dropdown, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined } from "@ant-design/icons";
import SubVariantTable from "./SubVariantTable";
import ModalCreateProduct from "./modals/ModalCreateProduct";
import ModalCreateService from "./modals/ModalCreateService";
import ModalCreateCombo from "./modals/ModalCreateCombo";
import type { Product, TableProduct } from "@/types/product";
import ProductTabsDetail from "./ProductTabsDetail";
import Image from "next/image";
import api from "@/api/axiosInstance";
interface ProductFilters {
  SearchTerm?: string;
  CategoryId?: string;
  Status?: string;
  FromDate?: string;
  ToDate?: string;
  BranchId?: string;
  PageNumber?: number;
  PageSize?: number;
  SortBy?: string;
  SortDescending?: boolean;
}

interface ProductImportResponse {
  "status-code": number;
  message: string;
  data?: {
    created?: number;
    updated?: number;
    errors?: string[];
  };
}

const PRODUCT_EXPORT_COLUMNS: string[] = [
  "Sku",
  "Name",
  "Description",
  "AvatarUrl",
  "Color",
  "Size",
  "Style",
  "Brand",
  "Material",
  "Weight",
  "IsMaster",
  "Status",
  "CreatedAt",
  "UpdatedAt",
  "ParentSku",
  "SellingPrice",
  "CostPrice",
  "EffectiveDate",
  "ExpiryDate",
  "Note",
  "Type",
  "CategoryName",
];

const DEFAULT_PRODUCT_IMAGE = "/images/noimage.png";

const normalizeImageSrc = (src?: string | null): string => {
  if (!src) {
    return DEFAULT_PRODUCT_IMAGE;
  }

  const trimmed = src.trim();
  if (!trimmed) {
    return DEFAULT_PRODUCT_IMAGE;
  }

  const normalized = trimmed.replace(/\\/g, "/");

  if (
    normalized.startsWith("http://") ||
    normalized.startsWith("https://") ||
    normalized.startsWith("data:") ||
    normalized.startsWith("blob:")
  ) {
    return normalized;
  }

  if (normalized.startsWith("//")) {
    return normalized;
  }

  if (normalized.startsWith("/")) {
    return normalized;
  }

  return `/${normalized}`;
};

function ProductThumbnail({
  src,
  alt,
  width,
  height,
  className,
}: {
  src?: string | null;
  alt: string;
  width: number;
  height: number;
  className?: string;
}) {
  const [imageSrc, setImageSrc] = useState(() => normalizeImageSrc(src));

  useEffect(() => {
    setImageSrc(normalizeImageSrc(src));
  }, [src]);

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setImageSrc(DEFAULT_PRODUCT_IMAGE)}
    />
  );
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
  const {  getBranches } = useBranchStore();
  const activeBranchId = useSessionStore((state) => state.activeBranchId);
  const setActiveBranchId = useSessionStore((state) => state.setActiveBranchId);

  const [openType, setOpenType] = useState<"product" | "service" | "combo" | null>(null);
  const [filters, setFilters] = useState<ProductFilters>({
    PageNumber: 1,
    PageSize: 10,
    SortBy: "createdat",
    SortDescending: true,
  });
   const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch data khi component mount và khi filters thay đổi
  useEffect(() => {
    getProducts(filters);
    getCategories();
    getBranches();
  }, [filters, getProducts, getCategories, getBranches]);

  // Đồng bộ BranchId với session store
  useEffect(() => {
    setFilters((prev) => {
      const normalizedBranchId = activeBranchId ?? undefined;
      if (prev.BranchId === normalizedBranchId) {
        return prev;
      }
      return {
        ...prev,
        BranchId: normalizedBranchId,
        PageNumber: 1,
      };
    });
  }, [activeBranchId]);

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
  // const branchOptions = useMemo(() => {
  //   return branches.map(branch => ({
  //     label: branch.name,
  //     value: branch.id,
  //   }));
  // }, [branches]);

  // const tableProducts = useMemo(() => {
  //   const masterProducts = products.filter(product => product.isMaster);
  //     return masterProducts.map(product => {
  //   // Tìm tất cả variants của product này (có parentSku trùng với sku của master)
  //   const variants = products.filter(variant => 
  //     variant.parentSku === product.sku && !variant.isMaster
  //   );
  //   return {
  //     id: product.id,
  //     name: product.name,
  //     variant: product.description || "",
  //     sellingPrice: product.sellingPrice || 0, 
  //     costPrice: product.costPrice || 0,      
  //     stockQuantity: product.stockQuantity || 0, 
  //     createdAt: "",
  //     avartarUrl: product.avartarUrl || "/default-product.png",
  //     type: "product",
  //     group: product.categoryName || "",
  //     supplier: product.brand || "",
  //     attrs: {
  //       color: product.color,
  //       size: product.size,
  //     },
  //     status: product.status,
  //     sku: product.sku,
  //     description: product.description,
  //     color: product.color,
  //     size: product.size,
  //     brand: product.brand,
  //     material: product.material,
  //     weight: product.weight,
  //     isMaster: product.isMaster,
  //     parentSku: product.parentSku,
  //     variants: variants, 
  //   };

  
  // });
  // }, [products]);
// Transform products từ API format sang frontend format cho table
const tableProducts = useMemo(() => {
  // Tạo map để group
  const productMap = new Map<string, { master: Product | null; variants: Product[] }>();
  
  // Phân loại products
  products.forEach(product => {
    if (product.isMaster) {
      // Sản phẩm master - tạo group mới
      if (!productMap.has(product.id)) {
        productMap.set(product.id, {
          master: product,
          variants: [],
        });
      } else {
        const existingGroup = productMap.get(product.id);
        if (existingGroup) {
          existingGroup.master = product;
        }
      }
    } else {
      // Sản phẩm variant
      if (product.parentSku) {
        // Variant có parent - tìm master
        const masterProduct = products.find(p => p.sku === product.parentSku && p.isMaster);
        if (masterProduct) {
          // Có master - thêm vào group của master
          const masterGroup = productMap.get(masterProduct.id);
          if (masterGroup) {
            masterGroup.variants.push(product);
          } else {
            productMap.set(masterProduct.id, {
              master: masterProduct,
              variants: [product],
            });
          }
        } else {
          // Không tìm thấy master - tạo group độc lập cho variant
          const existingGroup = productMap.get(product.id);
          if (existingGroup) {
            existingGroup.variants.push(product);
          } else {
            productMap.set(product.id, {
              master: null,
              variants: [product],
            });
          }
        }
      } else {
        // Variant không có parentSku - tạo group độc lập
        const existingGroup = productMap.get(product.id);
        if (existingGroup) {
          existingGroup.variants.push(product);
        } else {
          productMap.set(product.id, {
            master: null,
            variants: [product],
          });
        }
      }
    }
  });

  // Tạo danh sách hiển thị
  const result: TableProduct[] = [];
  
  productMap.forEach((group: { master: Product | null; variants: Product[] }) => {
    const { master, variants } = group;
    
    if (master) {
      // Có master - master hiển thị đầu, variants trong expanded row
      result.push({
        id: master.id,
        name: master.name,
        variant: master.description || "",
        sellingPrice: master.sellingPrice || 0,
        costPrice: master.costPrice || 0,
        stockQuantity: master.stockQuantity || 0,
        createdAt: "",
        avartarUrl: normalizeImageSrc(master.avartarUrl),
        type: "product",
        group: master.categoryName || "",
        supplier: master.brand || "",
        attrs: {
          color: master.color,
          size: master.size,
        },
        status: master.status,
        sku: master.sku,
        description: master.description,
        color: master.color,
        size: master.size,
        brand: master.brand,
        material: master.material,
        weight: master.weight,
        isMaster: true,
        parentSku: master.parentSku,
        variants: variants,
        isGroupMaster: true,
        hasVariants: variants.length > 0,
      });
    } else if (variants.length > 0) {
      // Không có master, chỉ có variants độc lập
      variants.forEach((variant) => {
        result.push({
          id: variant.id,
          name: variant.name,
          variant: variant.description || "",
          sellingPrice: variant.sellingPrice || 0,
          costPrice: variant.costPrice || 0,
          stockQuantity: variant.stockQuantity || 0,
          createdAt: "",
          avartarUrl: normalizeImageSrc(variant.avartarUrl),
          type: "product",
          group: variant.categoryName || "",
          supplier: variant.brand || "",
          attrs: {
            color: variant.color,
            size: variant.size,
          },
          status: variant.status,
          sku: variant.sku,
          description: variant.description,
          color: variant.color,
          size: variant.size,
          brand: variant.brand,
          material: variant.material,
          weight: variant.weight,
          isMaster: false,
          parentSku: variant.parentSku,
          variants: [],
          isGroupMaster: false,
          hasVariants: false,
          isOrphanVariant: true, // ✅ Flag để biết đây là variant độc lập
        });
      });
    }
  });

  return result;
}, [products]);
  // Cập nhật filters
  const handleFilterChange = (newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      PageNumber: 1, // Reset về trang 1 khi filter
    }));

    if ("BranchId" in newFilters) {
      const branchValue = newFilters.BranchId ?? null;
      if (activeBranchId !== branchValue) {
        setActiveBranchId(branchValue);
      }
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      PageNumber: 1,
      PageSize: 10,
      BranchId: activeBranchId ?? undefined,
      SortBy: "createdat",
      SortDescending: true,
    });
  };

  // Search products
  const handleSearch = (value: string) => {
    if (value.trim()) {
      searchProducts(value);
    } else {
      getProducts(filters);
    }
  };

  const handleImportClick = () => {
    if (importing) {
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setImporting(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post<ProductImportResponse>("/api/product/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const statusCode = response.data?.["status-code"];

      if (statusCode === 200) {
        const result = response.data?.data;
        message.success(
          result
            ? `Import sản phẩm thành công. Tạo: ${result.created ?? 0}, cập nhật: ${result.updated ?? 0}`
            : "Import sản phẩm thành công."
        );

        if (result?.errors && result.errors.length > 0) {
          message.warning(`Có ${result.errors.length} lỗi khi import sản phẩm.`);
          console.warn("Product import errors:", result.errors);
        }

        getProducts(filters);
      } else {
        const apiMessage = response.data?.message || "Import sản phẩm thất bại.";
        message.error(apiMessage);
      }
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { message?: string } } };
      const errorMessage = apiError?.response?.data?.message || "Import sản phẩm thất bại.";
      console.error("Import sản phẩm error:", error);
      message.error(errorMessage);
    } finally {
      setImporting(false);
      event.target.value = "";
    }
  };

  const handleExport = async () => {
    if (exporting) {
      return;
    }

    setExporting(true);

    try {
      const response = await api.post<ArrayBuffer>(
        "/api/file/export",
        {
          "product-export-view-columns": PRODUCT_EXPORT_COLUMNS,
        },
        {
          responseType: "arraybuffer",
          headers: {
            "Content-Type": "application/json-patch+json",
            Accept: "application/octet-stream",
          },
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      if (blob.size === 0) {
        message.warning("File export rỗng.");
      } else if (typeof window !== "undefined") {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        const timestamp = new Date().toISOString().replace(/[:T]/g, "-").split(".")[0];
        link.href = url;
        link.download = `products-${timestamp}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        message.success("Xuất file sản phẩm thành công.");
      }
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { message?: string } } };
      const errorMessage = apiError?.response?.data?.message || "Xuất file sản phẩm thất bại.";
      console.error("Export sản phẩm error:", error);
      message.error(errorMessage);
    } finally {
      setExporting(false);
    }
  };


  const handleExpand = (expanded: boolean, record: TableProduct) => {
    if (expanded) {
       setExpandedRowKeys([record.id]);
    } else {
      setExpandedRowKeys([]);
    }
  };

  // Cột bảng
  const columns: ColumnsType<TableProduct> = [
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
      render: (sku: string, record: TableProduct) => (
        <div className="flex items-center gap-2">
          <ProductThumbnail
            src={
              record.isGroupMaster
                ? record.avartarUrl
                : record.variants?.[0]?.avartarUrl ?? record.avartarUrl ?? DEFAULT_PRODUCT_IMAGE
            }
            alt={record.name}
            width={32}
            height={40}
            className="w-8 h-10 rounded object-cover"
          />
          <div>
            <div className="font-medium">{sku}</div>
          </div>
        </div>
      ),
      sorter: (a, b) => (a.sku || "").localeCompare(b.sku || ""),
    },
    {
      title: "Tên hàng",
      dataIndex: "name",
      ellipsis: true,
      render: (name: string, record: TableProduct) => (
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
      dataIndex: "sellingPrice",
      align: "right" as const,
      width: 120,
      render: (v: number) => v?.toLocaleString() + "₫",
      sorter: (a, b) => (a.sellingPrice || 0) - (b.sellingPrice || 0),
    },
    {
      title: "Giá vốn",
      dataIndex: "costPrice",
      align: "right" as const,
      width: 120,
      render: (v: number) => v?.toLocaleString() + "₫",
      sorter: (a, b) => (a.costPrice || 0) - (b.costPrice || 0),
    },
    {
      title: "Tồn kho",
      dataIndex: "stockQuantity",
      align: "center" as const,
      width: 100,
      sorter: (a, b) => (a.stockQuantity || 0) - (b.stockQuantity || 0),
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
//     {
//   title: "Loại",
//   dataIndex: "isGroupMaster",
//   width: 140,
//   render: (isGroupMaster: boolean, record: TableProduct) => {
//     if (record.isOrphanVariant) {
//       return <span className="px-2 py-1 rounded text-xs bg-orange-100 text-orange-800">Biến thể độc lập</span>;
//     }
//     return (
//       <span className={`px-2 py-1 rounded text-xs ${
//         isGroupMaster ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
//       }`}>
//         {isGroupMaster ? "Sản phẩm chính" : "Biến thể"}
//       </span>
//     );
//   },
// },
  ];

  // Dropdown items cho tạo mới
  const dropdownItems = [
    {
      key: "product",
      label: "Hàng hóa",
      onClick: () => setOpenType("product"),
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
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                hidden
                onChange={handleFileChange}
              />
              <Button onClick={handleImportClick} loading={importing} disabled={importing}>
                Import file
              </Button>
              <Button onClick={handleExport} loading={exporting} disabled={exporting}>
                Export file
              </Button>
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
              // expandable={{
              // expandedRowRender: (record) => (
              //     <SubVariantTable master={record} />
              //   ),
              //   expandedRowKeys: expandedRowKeys, 
              //   onExpand: handleExpand, 
              //   rowExpandable: () => true,
              // }}
expandable={{
  expandedRowRender: (record) => {
    if (record.isGroupMaster && record.hasVariants) {
      // Master có variants - hiển thị SubVariantTable
      return <SubVariantTable master={record} />;
    } else if (record.isOrphanVariant) {
      // Variant độc lập - hiển thị ProductTabsDetail
      return (
        <ProductTabsDetail 
          master={record} 
          variant={record}
        />
      );
    } else {
      // Master không có variants - hiển thị ProductTabsDetail
      return (
        <ProductTabsDetail 
          master={record} 
          variant={record}
        />
      );
    }
  },
  expandedRowKeys: expandedRowKeys, 
  onExpand: handleExpand, 
  rowExpandable: (record) => {
    // Cho phép expand nếu:
    // - Là master có variants
    // - Là variant độc lập
    // - Là master không có variants (để chỉnh sửa)
    return record.isGroupMaster || record.isOrphanVariant || record.isMaster;
  },
  expandRowByClick: true,
  columnWidth: 0,
  expandIcon: () => null,
}}
              rowClassName={() => "hover:bg-blue-50 cursor-pointer"}
              onRow={(record) => ({
                onClick: (event) => {
                  const target = event.target as HTMLElement;
                  const tagName = target.tagName.toLowerCase();

                  if (["input", "button", "a", "svg", "path"].includes(tagName)) {
                    return;
                  }

                  const isExpanded = expandedRowKeys.includes(record.id);
                  if (isExpanded) {
                    setExpandedRowKeys([]);
                  } else {
                    setExpandedRowKeys([record.id]);
                  }
                },
              })}
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