'use client';

import { useEffect, useRef, useState } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { Table, Input, Space, Tag, Button, Modal, message } from 'antd';
import type { TableProps } from 'antd';
import { SearchOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '@/api/axiosInstance';
import CreateAccountModal from '@/components/account/CreateAccountModal';
import { deleteAccount as deleteAccountApi } from '@/api/accountApi';

interface AccountRecord {
  id: string;
  'code': string;
  'email': string;
  'name': string;
  'phone-number': string | null;
  'address': string | null;
  'status': string;
  'created-at': string;
  'updated-at': string;
}

interface AccountListResponse {
  'status-code': number;
  message: string;
  data: {
    'page-index': number;
    'page-size': number;
    'total-count': number;
    'total-page': number;
    'data-list': AccountRecord[];
  };
}

export default function AccountPage() {
  const [accounts, setAccounts] = useState<AccountRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const isFirstSearchChange = useRef(true);
  const lastSearchRef = useRef('');
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    pageSizeOptions: ['10', '20', '50'],
    showSizeChanger: true,
  });

  const fetchAccounts = async (pageNumber: number, pageSize: number, search: string) => {
    lastSearchRef.current = search;
    setLoading(true);
    try {
      const response = await api.get<AccountListResponse>(
        `/account/list?pageNumber=${pageNumber}&pageSize=${pageSize}${search ? `&search=${encodeURIComponent(search)}` : ''}`
      );

      const payload = response.data.data;
      const dataList = payload?.['data-list'] ?? [];

      setAccounts(dataList);
      setPagination((prev) => ({
        ...prev,
        current: payload?.['page-index'] ?? pageNumber,
        pageSize: payload?.['page-size'] ?? pageSize,
        total: payload?.['total-count'] ?? prev.total,
      }));
    } catch (error: unknown) {
      console.error('Failed to fetch accounts:', error);
      message.error('Không thể tải danh sách tài khoản.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts(1, 10, '');
  }, []);

  useEffect(() => {
    if (isFirstSearchChange.current) {
      isFirstSearchChange.current = false;
      return;
    }

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      const keyword = searchText.trim();
      setPagination((prev) => {
        const next = {
          ...prev,
          current: 1,
        };
        fetchAccounts(1, prev.pageSize, keyword);
        return next;
      });
    }, 500);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchText]);

  const handleTableChange: TableProps<AccountRecord>['onChange'] = (pager) => {
    const current = pager?.current ?? 1;
    const pageSize = pager?.pageSize ?? pagination.pageSize;
    setPagination((prev) => ({
      ...prev,
      current,
      pageSize,
    }));
    fetchAccounts(current, pageSize, searchText.trim());
  };

  const handleDelete = (record: AccountRecord) => {
    Modal.confirm({
      title: 'Xác nhận xoá',
      content: `Bạn có chắc chắn muốn xoá tài khoản "${record.name}"?`,
      okText: 'Xoá',
      okType: 'danger',
      cancelText: 'Huỷ',
      autoFocusButton: 'cancel',
      onOk: async () => {
        try {
          await deleteAccountApi(record.id);
          message.success('Xoá tài khoản thành công.');
          await fetchAccounts(pagination.current, pagination.pageSize, lastSearchRef.current);
        } catch (error) {
          console.error('Failed to delete account:', error);
          message.error('Không thể xoá tài khoản.');
          throw error;
        }
      },
    });
  };

  const columns: TableProps<AccountRecord>['columns'] = [
    {
      title: 'Mã',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone-number',
      key: 'phone-number',
      render: (value: string | null) => value || 'Chưa cập nhật',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      render: (value: string | null) => value || 'Chưa cập nhật',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Hoạt động' ? 'green' : 'default'}>
          {status}
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
      title: 'Cập nhật',
      dataIndex: 'updated-at',
      key: 'updated-at',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: unknown, record) => (
        <Button danger type="primary" icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>
          Xoá
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="Tài khoản" />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Input
          placeholder="Tìm kiếm tài khoản..."
          prefix={<SearchOutlined />}
          allowClear
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          className="max-w-sm"
        />

        <Space>
          <Button onClick={() => fetchAccounts(pagination.current, pagination.pageSize, searchText.trim())}>
            Làm mới
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsCreateModalVisible(true)}
          >
            Tạo tài khoản
          </Button>
        </Space>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={accounts}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />

      <CreateAccountModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSuccess={() => {
          setIsCreateModalVisible(false);
          fetchAccounts(pagination.current, pagination.pageSize, lastSearchRef.current);
        }}
      />
    </div>
  );
}

