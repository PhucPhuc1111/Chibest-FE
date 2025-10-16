"use client";
import React, { useRef, useState } from 'react';

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import type { InputRef, TableColumnsType, TableColumnType } from 'antd';
import { Button, Form, Input, Modal, Popconfirm, Space, Table } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { DataType } from '@/app/types';

type DataIndex = keyof DataType;

const data: DataType[] = [
  { key: '1', name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park' },
  { key: '2', name: 'Joe Black', age: 42, address: 'London No. 1 Lake Park' },
  { key: '3', name: 'Jim Green', age: 32, address: 'Sydney No. 1 Lake Park' },
  { key: '4', name: 'Jim Red', age: 32, address: 'London No. 2 Lake Park' },
];

export default function Page() {
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [modalText, setModalText] = useState('Content of the modal');
  const [formCreate] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [editingRecord, setEditingRecord] = useState<DataType | null>(null);

  // Modal tạo
  const showCreateModal = () => {
    setOpenCreate(true);
    formCreate.resetFields();
  };
 
  const handleCreateOk = () => {
    formCreate
      .validateFields()
      .then(() => {
        setModalText('Đã tạo thành công!');
        setConfirmLoading(true);
        setTimeout(() => {
          setOpenCreate(false);
          setConfirmLoading(false);
        }, 1000);
        
      })
      .catch(() => {});
  };

  const handleCreateCancel = () => {
    setOpenCreate(false);
  };

  // Modal edit
  const showEditModal = (record: DataType) => {
    setEditingRecord(record);
    formEdit.setFieldsValue(record);
    setOpenEdit(true);
  };

  const handleEditOk = () => {
    formEdit
      .validateFields()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .then(values => {
        setModalText('Đã lưu thành công!');
        setConfirmLoading(true);
        setTimeout(() => {
          setOpenEdit(false);
          setConfirmLoading(false);
        }, 1000);
        // Xử lý lưu dữ liệu chỉnh sửa ở đây
      })
      .catch(() => {});
  };

  const handleEditCancel = () => {
    setOpenEdit(false);
  };

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<DataType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      ...getColumnSearchProps('name'),
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      width: '20%',
      ...getColumnSearchProps('age'),
      sorter: (a, b) => a.age - b.age,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      ...getColumnSearchProps('address'),
      sorter: (a, b) => a.address.localeCompare(b.address),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => showEditModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Modal tạo */}
      <Modal
        title="Tạo chi nhánh"
        open={openCreate}
        onOk={handleCreateOk}
        confirmLoading={confirmLoading}
        onCancel={handleCreateCancel}
        style={{ top: 200 }}
        okText="Tạo"
        cancelText="Hủy"
      >
        <Form
          form={formCreate}
          layout="vertical"
          initialValues={{ name: '', age: '', address: '' }}
        >
          <Form.Item
            label="Tên"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Tuổi"
            name="age"
            rules={[{ required: true, message: 'Vui lòng nhập tuổi!' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal edit */}
      <Modal
        title="Chỉnh sửa chi nhánh"
        open={openEdit}
        onOk={handleEditOk}
        confirmLoading={confirmLoading}
        onCancel={handleEditCancel}
        style={{ top: 200 }}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form
          form={formEdit}
          layout="vertical"
          initialValues={editingRecord || { name: '', age: '', address: '' }}
        >
          <Form.Item
            label="Tên"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Tuổi"
            name="age"
            rules={[{ required: true, message: 'Vui lòng nhập tuổi!' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <PageBreadcrumb pageTitle="Chi nhánh" />
      <div className="bg-white p-4 rounded-lg shadow-md mt-4">
        <div className='flex justify-end m-4 space-x-5 '>
          <Button type='primary' onClick={showCreateModal}>Tạo</Button>
          <Button type='primary'>Export</Button>
        </div>
        <Table<DataType> columns={columns} dataSource={data} />
      </div>
    </div>
  );
}