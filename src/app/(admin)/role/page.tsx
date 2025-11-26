"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Table, Input, Button, Tag, Space, Modal, Empty, message, Form, Checkbox, Spin } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { SearchOutlined, ReloadOutlined, PlusOutlined } from "@ant-design/icons";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import api from "@/api/axiosInstance";

interface RolePermission {
  id: string;
  code: string;
}

interface RoleItem {
  id: string;
  name: string;
  accountCount: number;
  permissions: RolePermission[];
}

interface PermissionItem {
  id: string;
  code: string;
}

interface RoleApiResponse {
  "status-code": number;
  message: string;
  data?: {
    "page-index": number;
    "page-size": number;
    "total-count": number;
    "total-page": number;
    "data-list": Array<{
      id: string;
      name: string;
      "account-count": number;
      permissions?: RolePermission[];
    }>;
  };
}

const DEFAULT_PAGINATION: TablePaginationConfig = {
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  pageSizeOptions: ["10", "20", "50", "100"],
};

export default function RoleManagement() {
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState<TablePaginationConfig>(DEFAULT_PAGINATION);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleItem | null>(null);
  const [allPermissions, setAllPermissions] = useState<PermissionItem[]>([]);
  const [permissionOptionsLoading, setPermissionOptionsLoading] = useState(false);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);
  const [assigningPermissions, setAssigningPermissions] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [updateSubmitting, setUpdateSubmitting] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null);
  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchRoles = useCallback(
    async (page = 1, pageSize = 10, search = "") => {
      setLoading(true);
      try {
        const response = await api.get<RoleApiResponse>("/api/role", {
          params: {
            pageNumber: page,
            pageSize,
            search: search || undefined,
          },
        });

        if (response.data["status-code"] !== 200 || !response.data.data) {
          setRoles([]);
          setPagination((prev) => ({
            ...prev,
            current: page,
            pageSize,
            total: 0,
          }));
          return;
        }

        const payload = response.data.data;
        const mappedRoles: RoleItem[] = payload["data-list"].map((item) => ({
          id: item.id,
          name: item.name,
          accountCount: item["account-count"],
          permissions: item.permissions ?? [],
        }));

        setRoles(mappedRoles);
        setPagination((prev) => ({
          ...prev,
          current: payload["page-index"],
          pageSize: payload["page-size"],
          total: payload["total-count"],
        }));
      } catch (error) {
        console.error("Failed to fetch roles", error);
        message.error("Không thể tải danh sách vai trò.");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const currentPage = pagination.current ?? DEFAULT_PAGINATION.current!;
  const currentPageSize = pagination.pageSize ?? DEFAULT_PAGINATION.pageSize!;

  // Fetch data when pagination or search changes (debounced)
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      fetchRoles(currentPage, currentPageSize, searchText);
    }, 400);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [fetchRoles, currentPage, currentPageSize, searchText]);

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

  const fetchAllPermissions = useCallback(async () => {
    setPermissionOptionsLoading(true);
    try {
      const response = await api.get<{
        "status-code": number;
        data?: {
          "data-list": PermissionItem[];
        };
      }>("/api/permission", {
        params: {
          pageNumber: 1,
          pageSize: 200,
        },
      });

      if (response.data["status-code"] === 200 && response.data.data) {
        setAllPermissions(response.data.data["data-list"] ?? []);
      } else {
        setAllPermissions([]);
      }
    } catch (error) {
      console.error("Failed to fetch permissions", error);
      message.error("Không thể tải danh sách quyền.");
    } finally {
      setPermissionOptionsLoading(false);
    }
  }, []);

  const handleOpenPermissions = (role: RoleItem) => {
    setSelectedRole(role);
    setSelectedPermissionIds(role.permissions.map((perm) => perm.id));
    setPermissionModalVisible(true);
    if (!allPermissions.length) {
      void fetchAllPermissions();
    }
  };

  const handleAssignPermissions = async () => {
    if (!selectedRole) {
      return;
    }

    setAssigningPermissions(true);
    try {
      await api.put(`/api/role/${selectedRole.id}/permissions`, selectedPermissionIds);
      message.success("Cập nhật quyền thành công.");
      setPermissionModalVisible(false);
      setSelectedRole(null);
      setSelectedPermissionIds([]);
      await fetchRoles(currentPage, currentPageSize, searchText);
    } catch (error) {
      console.error("Assign permissions failed", error);
      message.error("Không thể cập nhật quyền cho vai trò.");
    } finally {
      setAssigningPermissions(false);
    }
  };

  const handleOpenCreateModal = () => {
    createForm.resetFields();
    setCreateModalVisible(true);
  };

  const handleOpenUpdateModal = (role: RoleItem) => {
    setEditingRole(role);
    updateForm.setFieldsValue({ name: role.name });
    setUpdateModalVisible(true);
  };

  const handleCreateRole = async (values: { name: string }) => {
    setCreateSubmitting(true);
    try {
      await api.post("/api/role", {
        name: values.name.trim(),
      });
      message.success("Tạo vai trò thành công.");
      setCreateModalVisible(false);
      await fetchRoles(pagination.current, pagination.pageSize, searchText);
    } catch (error) {
      console.error("Create role failed", error);
      message.error("Không thể tạo vai trò.");
    } finally {
      setCreateSubmitting(false);
    }
  };

  const handleUpdateRole = async (values: { name: string }) => {
    if (!editingRole) {
      return;
    }
    setUpdateSubmitting(true);
    try {
      await api.put("/api/role", {
        id: editingRole.id,
        name: values.name.trim(),
      });
      message.success("Cập nhật vai trò thành công.");
      setUpdateModalVisible(false);
      setEditingRole(null);
      await fetchRoles(pagination.current, pagination.pageSize, searchText);
    } catch (error) {
      console.error("Update role failed", error);
      message.error("Không thể cập nhật vai trò.");
    } finally {
      setUpdateSubmitting(false);
    }
  };

  const permissionSummary = (permissions: RolePermission[]) => {
    if (!permissions.length) {
      return <Tag color="default">Chưa gán quyền</Tag>;
    }

    const maxVisible = 3;
    const visible = permissions.slice(0, maxVisible);
    const remaining = permissions.length - maxVisible;

    return (
      <Space wrap size={[4, 4]}>
        {visible.map((permission) => (
          <Tag color="blue" key={permission.id}>
            {permission.code}
          </Tag>
        ))}
        {remaining > 0 && (
          <Tag color="gold">+{remaining}</Tag>
        )}
      </Space>
    );
  };

  const columns: ColumnsType<RoleItem> = [
    {
      title: "Tên vai trò",
      dataIndex: "name",
      key: "name",
      render: (value: string) => <span className="font-medium text-gray-800">{value}</span>,
    },
    {
      title: "Số tài khoản",
      dataIndex: "accountCount",
      key: "accountCount",
      width: 140,
      sorter: (a, b) => a.accountCount - b.accountCount,
      align: "center",
    },
    {
      title: "Quyền được gán",
      dataIndex: "permissions",
      key: "permissions",
      render: permissionSummary,
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 160,
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleOpenPermissions(record)}>Phân quyền</Button>
          <Button
            type="link"
            onClick={() => handleOpenUpdateModal(record)}
          >
            Sửa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      <PageBreadcrumb pageTitle="Vai trò & Quyền hạn" />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Tìm kiếm vai trò..."
          prefix={<SearchOutlined />}
          allowClear
          value={searchText}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full sm:max-w-sm"
        />

        <div className="flex gap-2 flex-wrap">
          <Button icon={<ReloadOutlined />} onClick={() => fetchRoles(pagination.current, pagination.pageSize, searchText)}>
            Tải lại
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="w-full sm:w-auto"
            onClick={handleOpenCreateModal}
          >
            Tạo vai trò
          </Button>
        </div>
      </div>

      <Table<RoleItem>
        columns={columns}
        dataSource={roles}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        expandable={{
          expandedRowRender: (record) => (
            <div className="bg-gray-50 rounded-md p-3">
              <div className="text-sm font-semibold mb-2">Danh sách quyền</div>
              {record.permissions.length ? (
                <Space wrap size={[6, 6]}>
                  {record.permissions.map((permission) => (
                    <Tag color="blue" key={permission.id}>
                      {permission.code}
                    </Tag>
                  ))}
                </Space>
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa gán quyền" />
              )}
            </div>
          ),
        }}
      />

      <Modal
        open={permissionModalVisible}
        title={selectedRole ? `Phân quyền: ${selectedRole.name}` : "Phân quyền"}
        onCancel={() => {
          setPermissionModalVisible(false);
          setSelectedRole(null);
          setSelectedPermissionIds([]);
        }}
        width={520}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setPermissionModalVisible(false);
              setSelectedRole(null);
              setSelectedPermissionIds([]);
            }}
          >
            Hủy
          </Button>,
          <Button
            key="save"
            type="primary"
            loading={assigningPermissions}
            onClick={handleAssignPermissions}
          >
            Lưu
          </Button>,
        ]}
      >
        <div className="mb-3 text-sm text-gray-600">
          Chọn các quyền được phép sử dụng cho vai trò này. Mỗi quyền tương ứng với một khu vực chức năng trong hệ thống.
        </div>
        {permissionOptionsLoading ? (
          <Spin />
        ) : allPermissions.length ? (
          <Checkbox.Group
            className="w-full"
            value={selectedPermissionIds}
            onChange={(values) => setSelectedPermissionIds(values as string[])}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {allPermissions.map((permission) => (
                <Checkbox key={permission.id} value={permission.id}>
                  {permission.code}
                </Checkbox>
              ))}
            </div>
          </Checkbox.Group>
        ) : (
          <Empty description="Không có quyền nào" />
        )}
      </Modal>

      <Modal
        open={createModalVisible}
        title="Tạo vai trò mới"
        onCancel={() => setCreateModalVisible(false)}
        okText="Tạo"
        onOk={() => createForm.submit()}
        confirmLoading={createSubmitting}
      >
        <Form
          layout="vertical"
          form={createForm}
          onFinish={handleCreateRole}
        >
          <Form.Item
            label="Tên vai trò"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên vai trò" },
              { min: 3, message: "Tên phải có ít nhất 3 ký tự" },
            ]}
          >
            <Input placeholder="VD: Admin" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={updateModalVisible}
        title={editingRole ? `Cập nhật vai trò: ${editingRole.name}` : "Cập nhật vai trò"}
        onCancel={() => {
          setUpdateModalVisible(false);
          setEditingRole(null);
        }}
        okText="Lưu"
        onOk={() => updateForm.submit()}
        confirmLoading={updateSubmitting}
      >
        <Form
          layout="vertical"
          form={updateForm}
          onFinish={handleUpdateRole}
        >
          <Form.Item
            label="Tên vai trò"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên vai trò" },
              { min: 3, message: "Tên phải có ít nhất 3 ký tự" },
            ]}
          >
            <Input placeholder="VD: Supplier Manager" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

