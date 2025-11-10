"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Table,
  Input,
  Button,
  Select,
  Spin,
  Tag,
  Modal,
  Form,
  InputNumber,
  DatePicker,
} from "antd";
import type { SelectProps } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { usePriceBookStore } from "@/stores/usePriceBookStore";
import { useSessionStore } from "@/stores/useSessionStore";
import type { PriceBookItem } from "@/types/pricebook";
import { useBranchStore } from "@/stores/useBranchStore";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { useProductStore } from "@/stores/useProductStore";
import dayjs, { type Dayjs } from "dayjs";

export default function PriceBookList() {
  const {
    items,
    isLoading,
    getAll,
    resetFilters,
    filters,
    setFilters,
    totalRecords,
    createPrice,
  } = usePriceBookStore();
  const userBranchId = useSessionStore((state) => state.userBranchId);
  const activeBranchId = useSessionStore((state) => state.activeBranchId);

  const categoryKey = useMemo(
    () => (filters.categoryIds ?? []).join("|"),
    [filters.categoryIds]
  );

  const branches = useBranchStore((state) => state.branches);
  const getBranches = useBranchStore((state) => state.getBranches);
  const branchLoading = useBranchStore((state) => state.loading);

  const categories = useCategoryStore((state) => state.categories);
  const getCategories = useCategoryStore((state) => state.getCategories);
  const categoryLoading = useCategoryStore((state) => state.loading);

  const products = useProductStore((state) => state.products);
  const getProducts = useProductStore((state) => state.getProducts);
  const searchProducts = useProductStore((state) => state.searchProducts);
  const productLoading = useProductStore((state) => state.loading);

  const [searchValue, setSearchValue] = useState(filters.productName ?? "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setSearchValue(filters.productName ?? "");
  }, [filters.productName]);

  useEffect(() => {
    getAll();
  }, [
    getAll,
    filters.pageIndex,
    filters.pageSize,
    filters.branchId,
    filters.productName,
    filters.stockStatus,
    filters.priceCondition,
    filters.priceType,
    filters.priceOperator,
    filters.priceValue,
    categoryKey,
  ]);

  useEffect(() => {
    const branchId = userBranchId ?? activeBranchId ?? null;
    if (filters.branchId !== branchId) {
      setFilters({ branchId, pageIndex: 1 });
    }
  }, [userBranchId, activeBranchId, filters.branchId, setFilters]);

  useEffect(() => {
    getBranches({ pageIndex: 1, pageSize: 100 });
  }, [getBranches]);

  useEffect(() => {
    getCategories({ PageNumber: 1, PageSize: 200 });
  }, [getCategories]);

  useEffect(() => {
    if (isModalOpen) {
      getProducts({ PageNumber: 1, PageSize: 50 });
    }
  }, [isModalOpen, getProducts]);

  const handleSearch = (value: string) => {
    const trimmed = value.trim();
    setFilters({
      productName: trimmed.length ? trimmed : undefined,
      pageIndex: 1,
    });
  };

  const handleCategoryChange = (value: string[]) => {
    setFilters({ categoryIds: value, pageIndex: 1 });
  };

  const branchOptions = useMemo<SelectProps<string | null>["options"]>(
    () => [
      { label: "Toàn hệ thống", value: null },
      ...branches.map((branch) => ({
        label: branch.name,
        value: branch.id,
      })),
    ],
    [branches]
  );

  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        label: category.name,
        value: category.id,
      })),
    [categories]
  );

  const productOptions = useMemo(
    () =>
      products.map((product) => ({
        label: `${product.name} (${product.sku})`,
        value: product.id,
      })),
    [products]
  );

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsSubmitting(false);
    form.resetFields();
  };

  const handleSubmitModal = async () => {
    let values: {
      productId: string;
      branchId?: string | null;
      sellingPrice: string;
      costPrice: string;
      effectiveDate: Dayjs;
      expiryDate?: Dayjs;
      note?: string;
    };

    try {
      values = await form.validateFields();
    } catch {
      return;
    }

    setIsSubmitting(true);

    try {
      const formatDate = (date: Dayjs) =>
        dayjs(date).format("YYYY-MM-DDTHH:mm:ss.SSS");

      const result = await createPrice({
        "product-id": values.productId,
        "branch-id": values.branchId ?? null,
        "selling-price": Number(values.sellingPrice),
        "cost-price": Number(values.costPrice),
        "effective-date": formatDate(values.effectiveDate),
        "expiry-date": values.expiryDate ? formatDate(values.expiryDate) : null,
        note: values.note?.trim() || undefined,
      });

      if (result.success) {
        handleCloseModal();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: ColumnsType<PriceBookItem> = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      width: 220,
      render: (_: string, record) => (
        <div className="max-w-[240px]">
          <div className="font-medium text-gray-900">
            {record.name || "—"}
          </div>
          {record.sku ? (
            <div className="text-xs text-gray-500 truncate">{record.sku}</div>
          ) : null}
        </div>
      ),
    },
    {
      title: "Giá vốn",
      dataIndex: "cost-price",
      // align: "right",
      width: 80,
      render: (v: number) => v?.toLocaleString("vi-VN") + " đ" || "0 đ",
    },
    {
      title: "Giá bán",
      dataIndex: "selling-price",
      // align: "right",
      width: 80,
      render: (v: number) => v?.toLocaleString("vi-VN") + " đ" || "0 đ",
    },
    {
      title: "Hiệu lực từ",
      dataIndex: "effective-date",
      width: 80,
      render: (date: string) => date ? new Date(date).toLocaleDateString('vi-VN') : "—"
    },
    {
      title: "Hết hiệu lực",
      dataIndex: "expiry-date",
      width: 80,
      render: (date: string | null) => date ? new Date(date).toLocaleDateString('vi-VN') : "—"
    },

    // {
    //   title: "Ngày tạo",
    //   dataIndex: "created-at",
    //   width: 80,
    //   render: (date: string) => date ? new Date(date).toLocaleDateString('vi-VN') : "—"
    // },
  
    // {
    //   title: "Branch ID",
    //   dataIndex: "branch-id",
    //   width: 120,
    //   render: (id: string | null) => id ? id.substring(0, 8) + "..." : "—"
    // },
    {
      title: "Trạng thái",
      dataIndex: "expiry-date",
      width: 120,
      render: (expiryDate: string | null) => {
        const now = new Date();
        const expiry = expiryDate ? new Date(expiryDate) : null;
        
        if (!expiry) {
          return <Tag color="green">Đang hiệu lực</Tag>;
        } else if (expiry > now) {
          return <Tag color="blue">Sắp hết hạn</Tag>;
        } else {
          return <Tag color="red">Hết hiệu lực</Tag>;
        }
      },
    },
  ];

  return (
    <div className="flex gap-4 ">
      {/* ==== Sidebar Filter ==== */}
      <aside className="w-[300px] shrink-0 bg-white rounded-md border border-gray-200 p-3">
        <div className="mb-3">
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm..."
            value={searchValue}
            onChange={(e) => {
              const nextValue = e.target.value;
              setSearchValue(nextValue);
              if (!nextValue.trim().length) {
                setFilters({ productName: undefined, pageIndex: 1 });
              }
            }}
            onPressEnter={() => handleSearch(searchValue)}
            onBlur={() => handleSearch(searchValue)}
          />
        </div>

        <div className="space-y-4">
          {/* Bảng giá */}
          <div>
            <div className="text-[13px] font-semibold mb-1 flex justify-between">
              <span>Bảng giá</span>
              <Button type="link" size="small">
                Tạo mới
              </Button>
            </div>
            <Select
              mode="multiple"
              className="w-full"
              defaultValue={["Bảng giá chung"]}
              options={[{ label: "Bảng giá chung", value: "Bảng giá chung" }]}
            />
          </div>

          {/* Nhóm hàng */}
          <div>
            <div className="text-[13px] font-semibold mb-1">Nhóm hàng</div>
            <Select
              mode="multiple"
              showSearch
              allowClear
              className="w-full"
              placeholder="Chọn nhóm hàng"
              value={filters.categoryIds}
              onChange={handleCategoryChange}
              options={categoryOptions}
              loading={categoryLoading}
            />
          </div>
          <div className="pt-1">
            <Button type="link" onClick={resetFilters}>
              Mặc định
            </Button>
          </div>
        </div>
      </aside>

      {/* ==== Table ==== */}
      <section className="flex-1">
        <div className="bg-white rounded-md border border-gray-200">
          <div className="flex justify-between items-center px-4 py-2 border-b">
            <div className="text-[13px] text-gray-500">
              Tổng: <b>{totalRecords.toLocaleString()}</b> bản ghi giá
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <Button type="primary" onClick={handleOpenModal}>
                  + Thiết lập giá
                </Button>
                <Button>Import</Button>
                <Button>Xuất file</Button>
                {/* <Button>⚙️</Button> */}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="py-0 flex justify-center">
              <Spin />
            </div>
          ) : (
            <Table
              rowKey="id"
              columns={columns}
              dataSource={items}
              size="middle"
              pagination={{
                pageSize: filters.pageSize,
                current: filters.pageIndex,
                total: totalRecords,
                showSizeChanger: true,
                pageSizeOptions: ['20', '50', '100'],
                onChange: (page, pageSize) =>
                  setFilters({
                    pageIndex: page,
                    pageSize: pageSize || filters.pageSize,
                  }),
                onShowSizeChange: (page, pageSize) =>
                  setFilters({
                    pageIndex: page,
                    pageSize: pageSize || filters.pageSize,
                  }),
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} trong ${total.toLocaleString()} bản ghi`,
              }}
              scroll={{ x: 480 }}
              //  scroll={{ x: 'max-content' }}
              rowClassName="hover:bg-blue-50"
              sticky
            />
          )}
        </div>
      </section>

      <Modal
        open={isModalOpen}
        title="Thiết lập giá mới"
        onCancel={handleCloseModal}
        onOk={handleSubmitModal}
        okText="Lưu"
        cancelText="Hủy"
        confirmLoading={isSubmitting}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            sellingPrice: undefined,
            costPrice: undefined,
          }}
        >
          <Form.Item
            label="Sản phẩm"
            name="productId"
            rules={[{ required: true, message: "Vui lòng chọn sản phẩm" }]}
          >
            <Select<string>
              showSearch
              placeholder="Chọn sản phẩm"
              options={productOptions}
              optionFilterProp="label"
              filterOption={false}
              onSearch={(value) => searchProducts(value)}
              loading={productLoading}
              allowClear
            />
          </Form.Item>

          <Form.Item label="Chi nhánh" name="branchId">
            <Select<string | null>
              allowClear
              placeholder="Chọn chi nhánh (hoặc bỏ trống cho toàn hệ thống)"
              options={branchOptions}
              optionFilterProp="label"
              showSearch
              loading={branchLoading}
            />
          </Form.Item>

          <Form.Item
            label="Giá bán"
            name="sellingPrice"
            rules={[{ required: true, message: "Vui lòng nhập giá bán" }]}
          >
            <InputNumber<string>
              min="0"
              className="!w-full"
              controls={false}
              stringMode
              placeholder="Nhập giá bán"
              formatter={(value) => {
                if (!value) return "";
                const numeric = value.replace(/[^\d]/g, "");
                if (!numeric) return "";
                return `${numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ₫`;
              }}
              parser={(value) => (value ? value.replace(/[^\d]/g, "") : "")}
            />
          </Form.Item>

          <Form.Item
            label="Giá vốn"
            name="costPrice"
            rules={[{ required: true, message: "Vui lòng nhập giá vốn" }]}
          >
            <InputNumber<string>
              min="0"
              className="!w-full"
              controls={false}
              stringMode
              placeholder="Nhập giá vốn"
              formatter={(value) => {
                if (!value) return "";
                const numeric = value.replace(/[^\d]/g, "");
                if (!numeric) return "";
                return `${numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ₫`;
              }}
              parser={(value) => (value ? value.replace(/[^\d]/g, "") : "")}
            />
          </Form.Item>

          <Form.Item
            label="Ngày hiệu lực"
            name="effectiveDate"
            rules={[{ required: true, message: "Vui lòng chọn ngày hiệu lực" }]}
          >
            <DatePicker className="w-full" showTime />
          </Form.Item>

          <Form.Item label="Ngày hết hiệu lực" name="expiryDate">
            <DatePicker className="w-full" showTime />
          </Form.Item>

          <Form.Item label="Ghi chú" name="note">
            <Input.TextArea rows={3} placeholder="Nhập ghi chú (không bắt buộc)" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}