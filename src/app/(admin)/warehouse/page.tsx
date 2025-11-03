/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Table, Tag, Input, Button, Space, Modal, message } from 'antd';
import type { TableProps } from 'antd';
import { useState, useEffect, useRef } from 'react';
import api from '@/api/axiosInstance';
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import CreateWarehouseModal from '@/components/warehouse/CreateWarehouseModal';
import {  deleteWarehouse } from '@/api/warehouseApi';

interface WarehouseData {
  id: string;
  name: string;
  code: string;
  address: string;
  'phone-number': string | null;
  'branch-name': string;
  'branch-id': string;
  'is-main-warehouse': boolean;
  status: string | null;
  'created-at': string;
  'updated-at': string;
}

interface WarehouseResponse {
  'status-code': number;
  message: string;
  data: WarehouseData[];
}

export default function Page() {
  const [data, setData] = useState<WarehouseData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const searchTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    pageSizeOptions: ['10', '20', '50', '100'],
    showSizeChanger: true,
  });

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseData | null>(null);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);

  const fetchWarehouses = async (page: number, pageSize: number, search: string = '') => {
    setLoading(true);
    try {
      const response = await api.get<WarehouseResponse>(
        `/warehouse?pageIndex=${page}&pageSize=${pageSize}${search ? `&search=${encodeURIComponent(search)}` : ''}`
      );
      setData(response.data.data || []);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching warehouses:', error);
      if (error.response?.status === 404) {
        setData([]);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      fetchWarehouses(pagination.current, pagination.pageSize, searchText);
    }, 500);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchText]);

  const handleSearch = (value: string) => {
    setSearchText(value);
    setPagination({
      ...pagination,
      current: 1,
    });
  };

  const handleTableChange: TableProps<WarehouseData>['onChange'] = (newPagination) => {
    setPagination({
      ...pagination,
      current: newPagination.current || 1,
      pageSize: newPagination.pageSize || 10,
    });
    fetchWarehouses(
      newPagination.current || 1,
      newPagination.pageSize || 10,
      searchText
    );
  };

  const handleDelete = async (record: WarehouseData) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa kho "${record.name}"?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await deleteWarehouse(record.id);
          message.success('Xóa kho thành công');
          fetchWarehouses(pagination.current, pagination.pageSize, searchText);
        } catch (error) {
          message.error('Có lỗi xảy ra khi xóa kho');
          console.error('Error deleting warehouse:', error);
        }
      },
    });
  };

  const handleUpdateSuccess = () => {
    fetchWarehouses(pagination.current, pagination.pageSize, searchText);
    setIsUpdateModalVisible(false);
    setSelectedWarehouse(null);
  };

  const columns = [
    {
      title: 'Tên kho',
      dataIndex: 'name',
      key: 'name',
    },{
      title: 'Mã kho',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone-number',
      key: 'phone-number',
      render: (phone: string | null) => phone || 'Chưa cập nhật',
    },
    {
      title: 'Chi nhánh',
      dataIndex: 'branch-name',
      key: 'branch-name',
    },
    {
      title: 'Loại kho',
      dataIndex: 'is-main-warehouse',
      key: 'is-main-warehouse',
      render: (isMain: boolean) => (
        <Tag color={isMain ? 'blue' : 'default'}>
          {isMain ? 'Kho chính' : 'Kho phụ'}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string | null) => (
        <Tag color={status === 'Hoạt Động' ? 'success' : 'error'}>
          {status || 'Chưa cập nhật'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created-at',
      key: 'created-at',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: WarehouseData) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedWarehouse(record);
              setIsUpdateModalVisible(true);
            }}
          >
            Sửa
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            Xóa
          </Button>
        </Space>
      ),
    }
  ];

  const handleCreateSuccess = () => {
    fetchWarehouses(pagination.current, pagination.pageSize, searchText);
  };

  return (
    <div className="space-y-3">
      <PageBreadcrumb pageTitle="Kho" />
      
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Tìm kiếm kho..."
          prefix={<SearchOutlined />}
          onChange={(e) => handleSearch(e.target.value)}
          allowClear
          className="max-w-xs"
        />
        <Button
          type="primary"
          onClick={() => setIsCreateModalVisible(true)}
        >
          Tạo kho mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
      <CreateWarehouseModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSuccess={handleCreateSuccess}
      />

      {selectedWarehouse && (
        <CreateWarehouseModal
          visible={isUpdateModalVisible}
          onClose={() => {
            setIsUpdateModalVisible(false);
            setSelectedWarehouse(null);
          }}
          onSuccess={handleUpdateSuccess}
          initialData={{
            ...selectedWarehouse,
            'phone-number': selectedWarehouse['phone-number'] || '',
            status: selectedWarehouse.status as "Hoạt động" | "Ngưng hoạt động" || "Hoạt động"
          }}
          mode="update"
        />
      )}
    </div>
  );
}