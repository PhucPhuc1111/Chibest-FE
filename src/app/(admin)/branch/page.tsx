/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Table, Tag, Input, Button, Space, Modal, message } from 'antd';
import { useState, useEffect, useRef } from 'react';
import api from '@/api/axiosInstance';
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import CreateBranchModal from "@/components/branch/CreateBranchModal";
import UpdateBranchModal from "@/components/branch/UpdateBranchModal";
import { deleteBranch } from '@/api/branchApi';

interface BranchData {
  id: string;
  code: string;
  name: string;
  address: string;
  'phone-number': string;
  'is-franchise': boolean;
  status: string;
  'user-count': number;
}

interface BranchResponse {
  'status-code': number;
  message: string;
  data: BranchData[];
}

export default function Page() {
  const [data, setData] = useState<BranchData[]>([]);
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
  const [selectedBranch, setSelectedBranch] = useState<BranchData | null>(null);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);

  const fetchBranches = async (page: number, pageSize: number, search: string = '') => {
    setLoading(true);
    try {
      const response = await api.get<BranchResponse>(
        `/api/branch?pageIndex=${page}&pageSize=${pageSize}${search ? `&search=${encodeURIComponent(search)}` : ''}`
      );
      setData(response.data.data || []);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching branches:', error);
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
      fetchBranches(pagination.current, pagination.pageSize, searchText);
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

  const handleTableChange = (pag: any) => {
    setPagination(pag);
    fetchBranches(pag.current, pag.pageSize, searchText);
  };

  const handleDelete = async (record: BranchData) => {
    try {
      Modal.confirm({
        title: 'Xác nhận xóa',
        content: `Tất cả dữ liệu liên quan đến chi nhánh này sẽ bị xoá. Bạn có chắc chắn muốn xóa chi nhánh "${record.name}"?`,
        okText: 'Xóa',
        okType: 'danger',
        cancelText: 'Hủy',
        async onOk() {
          setLoading(true);
          await deleteBranch(record.id);
          message.success('Xóa chi nhánh thành công');
          await fetchBranches(pagination.current, pagination.pageSize, searchText);
          setLoading(false);
        },
      });
    } catch (error) {
      setLoading(false);
      message.error('Có lỗi xảy ra khi xóa chi nhánh');
      console.error('Error deleting branch:', error);
    }
  };

  const columns = [
    {
      title: 'Tên chi nhánh',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mã chi nhánh',
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
    },
    {
      title: 'Loại chi nhánh',
      dataIndex: 'is-franchise',
      key: 'is-franchise',
      render: (isFranchise: boolean) => (
        <Tag color={isFranchise ? 'blue' : 'green'}>
          {isFranchise ? 'Nhượng quyền' : 'Trực thuộc'}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Active' ? 'success' : 'error'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: BranchData) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedBranch(record);
              setIsUpdateModalVisible(true);
            }}
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      <PageBreadcrumb pageTitle="Chi nhánh" />
      
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Tìm kiếm chi nhánh..."
          prefix={<SearchOutlined />}
          onChange={(e) => handleSearch(e.target.value)}
          allowClear
          className="w-full sm:max-w-sm"
        />

        <Button 
          type="primary" 
          onClick={() => setIsCreateModalVisible(true)}
          className="w-full sm:w-auto"
        >
          Tạo chi nhánh mới
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
      <CreateBranchModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSuccess={() => {
          fetchBranches(pagination.current, pagination.pageSize, searchText);
        }}
      />
      {selectedBranch && (
        <UpdateBranchModal
          visible={isUpdateModalVisible}
          onClose={() => {
            setIsUpdateModalVisible(false);
            setSelectedBranch(null);
          }}
          onSuccess={() => {
            fetchBranches(pagination.current, pagination.pageSize, searchText);
            setIsUpdateModalVisible(false);
            setSelectedBranch(null);
          }}
          initialData={{
            ...selectedBranch,
            status: selectedBranch.status === 'Active' ? 'Hoạt động' : 'Ngưng hoạt động'
          }}
        />
      )}
    </div>
  );
}