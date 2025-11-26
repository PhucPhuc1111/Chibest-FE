"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Table, Input, Button, Modal, Form, message, Space } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { SearchOutlined, PlusOutlined, ReloadOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import api from "@/api/axiosInstance";

interface PermissionItem {
  id: string;
  code: string;
}

interface PermissionResponse {
  "status-code": number;
  message: string;
  data?: {
    "page-index": number;
    "page-size": number;
    "total-count": number;
    "total-page": number;
    "data-list": PermissionItem[];
  };
}

const DEFAULT_PAGINATION: TablePaginationConfig = {
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  pageSizeOptions: ["10", "20", "50", "100"],
};

export default function PermissionManagementPage() {
  const [permissions, setPermissions] = useState<PermissionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState<TablePaginationConfig>(DEFAULT_PAGINATION);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [activePermission, setActivePermission] = useState<PermissionItem | null>(null);
  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [updateSubmitting, setUpdateSubmitting] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const currentPage = pagination.current ?? DEFAULT_PAGINATION.current!;
  const currentPageSize = pagination.pageSize ?? DEFAULT_PAGINATION.pageSize!;

  const fetchPermissions = useCallback(
    async (page = 1, pageSize = 10, search = "") => {
      setLoading(true);
      try {
        const response = await api.get<PermissionResponse>("/api/permission", {
          params: {
            pageNumber: page,
            pageSize,
            search: search || undefined,
          },
        });

        if (response.data["status-code"] !== 200 || !response.data.data) {
          setPermissions([]);
          setPagination((prev) => ({
            ...prev,
            current: page,
            pageSize,
            total: 0,
          }));
          return;
        }

        const payload = response.data.data;
        setPermissions(payload["data-list"] ?? []);
        setPagination((prev) => ({
          ...prev,
          current: payload["page-index"],
          pageSize: payload["page-size"],
          total: payload["total-count"],
        }));
      } catch (error) {
        console.error("Failed to fetch permissions", error);
        message.error("Không thể tải danh sách quyền.");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      fetchPermissions(currentPage, currentPageSize, searchText);
    }, 400);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [fetchPermissions, currentPage, currentPageSize, searchText]);

  const handleSearchChange = (value: string) => {
    setSearchText(value);
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }));
  };

  const handleTableChange = (pag: TablePaginationConfig) => {
    setPagination((prev) => ({
      ...prev,
      current: pag.current ?? prev.current,
      pageSize: pag.pageSize ?? prev.pageSize,
    }));
  };

  const handleOpenCreate = () => {
    createForm.resetFields();
    setCreateModalVisible(true);
  };

  const handleOpenUpdate = (permission: PermissionItem) => {
    setActivePermission(permission);
    updateForm.setFieldsValue({ code: permission.code });
    setUpdateModalVisible(true);
  };

  const handleOpenDelete = (permission: PermissionItem) => {
    setActivePermission(permission);
    setDeleteModalVisible(true);
  };

  const handleCreatePermission = async (values: { code: string }) => {
    setCreateSubmitting(true);
    try {
      await api.post("/api/permission", {
        code: values.code.trim(),
      });
      message.success("Tạo quyền thành công.");
      setCreateModalVisible(false);
      await fetchPermissions(currentPage, currentPageSize, searchText);
    } catch (error) {
      console.error("Create permission failed", error);
      message.error("Không thể tạo quyền.");
    } finally {
      setCreateSubmitting(false);
    }
  };

  const handleUpdatePermission = async (values: { code: string }) => {
    if (!activePermission) {
      return;
    }

    setUpdateSubmitting(true);
    try {
      await api.put("/api/permission", {
        id: activePermission.id,
        code: values.code.trim(),
      });
      message.success("Cập nhật quyền thành công.");
      setUpdateModalVisible(false);
      setActivePermission(null);
      await fetchPermissions(currentPage, currentPageSize, searchText);
    } catch (error) {
      console.error("Update permission failed", error);
      message.error("Không thể cập nhật quyền.");
    } finally {
      setUpdateSubmitting(false);
    }
  };

  const handleDeletePermission = async () => {
    if (!activePermission) {
      return;
    }
    setDeleteSubmitting(true);
    try {
      await api.delete(`/api/permission/${activePermission.id}`);
      message.success("Xóa quyền thành công.");
      setDeleteModalVisible(false);
      setActivePermission(null);
      await fetchPermissions(currentPage, currentPageSize, searchText);
    } catch (error) {
      console.error("Delete permission failed", error);
      message.error("Không thể xóa quyền.");
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const columns: ColumnsType<PermissionItem> = [
    {
      title: "Mã quyền",
      dataIndex: "code",
      key: "code",
      render: (value: string) => <span className="font-semibold text-gray-800">{value}</span>,
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 160,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleOpenUpdate(record)}
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleOpenDelete(record)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      <PageBreadcrumb pageTitle="Quản lý quyền hạn" />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Tìm kiếm mã quyền..."
          prefix={<SearchOutlined />}
          allowClear
          value={searchText}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full sm:max-w-sm"
        />

        <div className="flex gap-2 flex-wrap">
          <Button icon={<ReloadOutlined />} onClick={() => fetchPermissions(currentPage, currentPageSize, searchText)}>
            Tải lại
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="w-full sm:w-auto"
            onClick={handleOpenCreate}
          >
            Tạo quyền
          </Button>
        </div>
      </div>

      <Table<PermissionItem>
        columns={columns}
        dataSource={permissions}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />

      <Modal
        open={createModalVisible}
        title="Tạo quyền mới"
        okText="Tạo"
        confirmLoading={createSubmitting}
        onCancel={() => setCreateModalVisible(false)}
        onOk={() => createForm.submit()}
      >
        <Form layout="vertical" form={createForm} onFinish={handleCreatePermission}>
          <Form.Item
            label="Mã quyền"
            name="code"
            rules={[
              { required: true, message: "Vui lòng nhập mã quyền" },
              { min: 3, message: "Mã quyền phải có ít nhất 3 ký tự" },
            ]}
          >
            <Input placeholder="VD: STOCK" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={updateModalVisible}
        title={activePermission ? `Cập nhật quyền: ${activePermission.code}` : "Cập nhật quyền"}
        okText="Lưu"
        confirmLoading={updateSubmitting}
        onCancel={() => {
          setUpdateModalVisible(false);
          setActivePermission(null);
        }}
        onOk={() => updateForm.submit()}
      >
        <Form layout="vertical" form={updateForm} onFinish={handleUpdatePermission}>
          <Form.Item
            label="Mã quyền"
            name="code"
            rules={[
              { required: true, message: "Vui lòng nhập mã quyền" },
              { min: 3, message: "Mã quyền phải có ít nhất 3 ký tự" },
            ]}
          >
            <Input placeholder="VD: STOCK_QUALITY" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={deleteModalVisible}
        title="Xác nhận xóa quyền"
        okText="Xóa"
        okButtonProps={{ danger: true }}
        confirmLoading={deleteSubmitting}
        onCancel={() => {
          setDeleteModalVisible(false);
          setActivePermission(null);
        }}
        onOk={handleDeletePermission}
      >
        Bạn có chắc chắn muốn xóa quyền{" "}
        <span className="font-semibold">{activePermission?.code}</span>? Hành động này không thể hoàn tác.
      </Modal>
    </div>
  );
}

