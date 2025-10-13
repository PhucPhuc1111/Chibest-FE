'use client';
import { Button, Image, Input, message, Select, Table, TableColumnsType, TableProps } from 'antd';
import React, { Key, useState } from 'react';
import { Account, updateChangeRole, updateStatus, useGetAllAccounts } from '@/app/data';
import Loader from '@/components/common/Loader';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { format, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
 // Import hàm updateStatus
 import * as XLSX from "xlsx";
// Hàm format ngày
function formatDate(dateString?: string): string {
  if (!dateString) return "";
  try {
    return format(parseISO(dateString), "hh:mm dd/MM/yyyy");
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}

const CustomerPage: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("");
  const pageIndex = 1;
  const pageSize = 500;
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editingRoleUserId, setRoleEditingUserId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [originalStatus, setOriginalStatus] = useState<string>(''); // Lưu trạng thái gốc
  const [isLoadingStatus, setIsLoadingStatus] = useState<boolean>(false); // State quản lý trạng thái loading
  const [errorMessage, setErrorMessage] = useState<string>(''); // State quản lý lỗi
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [originalRole, setOriginalRole] = useState<string>(''); // Lưu trạng thái gốc của role
  const [isLoadingRole, setIsLoadingRole] = useState<boolean>(false);
  const { data, isLoading, isError, error, refetch } = useGetAllAccounts(
    pageIndex,
    pageSize,
    searchText
  );

  const onChange: TableProps<Account>['onChange'] = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  // Hàm lưu trạng thái mới
  const handleSave = async (userId: number) => {
    try {
      setIsLoadingStatus(true); 
      setErrorMessage(''); 
      await updateStatus(userId, selectedStatus); 
      toast.success("Update status successfully")// Gọi API để cập nhật trạng thái
      setEditingUserId(null); 
      refetch();// Đóng chế độ chỉnh sửa
    } catch (error) {
      toast.error("Update status Unsuccessfully")
      setErrorMessage('Cập nhật trạng thái thất bại, vui lòng thử lại!'); // Cập nhật thông báo lỗi
    } finally {
      setIsLoadingStatus(false); // Kết thúc loading
    }
  };

  const handleCancel = () => {
    setEditingUserId(null); // Hủy chế độ chỉnh sửa
    setSelectedStatus(originalStatus); // Khôi phục trạng thái ban đầu
  };
  const handleSaveRole = async (userId: number) => {
    try {
      setIsLoadingRole(true); 
      setErrorMessage(''); 
      await updateChangeRole(userId, selectedRole);
      toast.success("Update role successfully") // Gọi API để cập nhật trạng thái
      setRoleEditingUserId(null); 
      refetch();// Đóng chế độ chỉnh sửa
    } catch (error) {
      toast.error("Update role unsuccessfully")
      setErrorMessage('Cập nhật trạng thái thất bại, vui lòng thử lại!'); // Cập nhật thông báo lỗi
    } finally {
      setIsLoadingRole(false); // Kết thúc loading
    }
  };

  

  const handleCancelRole = () => {
    setRoleEditingUserId(null);
    setSelectedRole(originalRole); // Khôi phục role ban đầu
  };

  const columns: TableColumnsType<Account> = [
    {
      title: "Id",
      dataIndex: "userId",
      sorter: (a, b) => a.userId - b.userId,
      render: (text) => text || "Chưa có dữ liệu",
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      render: (avatar) => avatar ? <Image src={avatar} height={40} width={40} alt="Avatar" className="w-6 h-6 rounded-full" /> : "Chưa có dữ liệu",
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
      render: (text) => text || "Chưa cập nhật",
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text) => text || "Chưa có dữ liệu",
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (role, record) => {
        if (editingRoleUserId === record.userId) {
          // Hiển thị dropdown khi đang chỉnh sửa
          return (
            <Select
              defaultValue={role || "Chưa có dữ liệu"}
              onChange={(value) => setSelectedRole(value)} // Cập nhật role khi chọn
              style={{ width: 120 }}
            >
              <Select.Option value="Admin">Admin</Select.Option>
              <Select.Option value="Nutritionist">Nutritionist</Select.Option>
              <Select.Option value="Customer">Customer</Select.Option>
            </Select>
          );
        } else {
          return role || "Chưa có dữ liệu";
        }
      },
      filters: [
              { text: "Admin", value: "Admin" },
              { text: "Nutritionist", value: "Nutritionist" },
              { text: "Customer", value: "Customer" },
            
             
            ],
            onFilter: (value: string | boolean | Key, record: Account): boolean => {
              if (typeof record.role === "string" && typeof value === "string") {
                return record.role.includes(value);
              }
              return false;
            },
    },
    {
      title: "Age",
      dataIndex: "age",
      sorter: (a, b) => a.age - b.age,
      render: (text) => (text !== null && text !== undefined ? text : "Chưa có dữ liệu"),
    },
    {
      title: "Address",
      dataIndex: "location",
      render: (text) => text || "Chưa có dữ liệu",
    },
    // {
    //   title: "Premium",
    //   dataIndex: "userPackages",
    //   render: (userPackages) => {
    //     if (userPackages && userPackages.length > 0) {
    //       const statusMapping: { [key: string]: string } = {
    //         active: "Active",
    //         expired: "Expired",
    //         default: "None",
    //       };
    
    //       // Kiểm tra nếu có gói hoạt động hay không
    //       const statusLabels = userPackages.map((pkg: any) => {
    //         const status = pkg.status.toLowerCase();
    //         // Dùng mapping để chuyển đổi trạng thái thành tiếng Việt
    //         return statusMapping[status] || statusMapping.default;
    //       }).join(", ");
    
    //       // Xác định màu sắc dựa trên trạng thái "active"
    //       const hasActivePackage = userPackages.some(
    //         (pkg: any) => pkg.status.toLowerCase() === "active"
    //       );
    //       const color = hasActivePackage ? "green" : "red";
    
    //       return <span style={{ fontWeight: "bold", color }}>{statusLabels}</span>;
    //     }
    //     return <span style={{ fontWeight: "bold", color: "red" }}>None</span>;
    //   },
    // },
    {
      title: "Premium",
      dataIndex: "userPackages",
      render: (userPackages) => {
        if (userPackages && userPackages.length > 0) {
          // Find the active package
          const activePackage = userPackages.find((pkg: any) => pkg.status.toLowerCase() === "active");
          
          if (activePackage) {
            return (
              <span style={{ fontWeight: "bold", color: "green" }}>
                {activePackage.packageName}
              </span>
            );
          }
        }
        return <span style={{ fontWeight: "bold", color: "red" }}>None</span>;
      },
    }
,    
    {
      title: "Status",
      dataIndex: "status",
      render: (status, record) => {
        const statusMapping: { [key: string]: string } = {
          active: "Active",
          inactive: "Inactive",
        };
    
        if (editingUserId === record.userId) {
          // Hiển thị dropdown khi đang chỉnh sửa
          return (
            <Select
              defaultValue={statusMapping[status.toLowerCase()] || "Chưa có dữ liệu"} // Chuyển trạng thái sang tiếng Việt
              onChange={(value) => setSelectedStatus(value)} // Cập nhật trạng thái mới khi chọn
              style={{ width: 120 }}
            >
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
            </Select>
          );
        } else {
          // Hiển thị trạng thái mặc định nếu không đang chỉnh sửa
          const normalizedStatus = status.toLowerCase();
          return normalizedStatus === "active" ? (
            <span className="text-green-500 font-bold">Active</span>
          ) : normalizedStatus === "inactive" ? (
            <span className="text-red-500 font-bold">Inactive</span>
          ) : (
            <span className="text-gray-500">None</span>
          );
        }
      },
      filters: [
        { text: "Active", value: "Active" },
        { text: "Inactive", value: "Inactive" },
    
      
       
      ],
      onFilter: (value: string | boolean | Key, record: Account): boolean => {
        if (typeof record.status === "string" && typeof value === "string") {
          return record.status.includes(value);
        }
        return false;
      },
    },
    {
      title: "Edit",
      dataIndex: "action",
      render: (_, record) => (
        <div className='space-y-2'>
          <div className=''>
          {editingUserId === record.userId ? (
            <div className='flex space-x-2'>
              <Button danger  onClick={handleCancel}>Cancel</Button>
              <Button
                type="primary"
                style={{ backgroundColor: "#2f855a", color: "white" }}
                loading={isLoadingStatus} // Hiển thị loading khi đang cập nhật
                onClick={() => handleSave(record.userId)}
              >
                Save 
              </Button>
            </div>
          ) : (
            <Button
            type='primary'
            style={{ backgroundColor: "#2f855a", color: "white" }}
              onClick={() => {
                setEditingUserId(record.userId); // Chế độ chỉnh sửa
                setOriginalStatus(record.status); // Lưu trạng thái ban đầu
                setSelectedStatus(record.status); // Chọn trạng thái hiện tại
              }}
            >
              Change Status
            </Button>
          )}</div>
          <div>
          {editingRoleUserId === record.userId ? (
            <div className='flex space-x-2'>
              <Button danger  onClick={handleCancelRole}>Cancel</Button>
              <Button
                type="primary"
                style={{ backgroundColor: "#2f855a", color: "white" }}
                loading={isLoadingRole} // Hiển thị loading khi đang cập nhật
                onClick={() => handleSaveRole(record.userId)}
              >
                Save 
              </Button>
            </div>
          ) : (
            <Button
            type="primary"
            style={{ backgroundColor: "orange", color: "white" }}
            onClick={() => {
              setRoleEditingUserId(record.userId); // Set user ID to be edited
              setOriginalRole(record.role); // Set original role to compare later
              setSelectedRole(record.role); // Set the current role as the selected role
            }}
          >
            Change Role
          </Button>
          
          )}
          </div>
        </div>
      ),
    },
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const filteredData = Array.isArray(data)
    ? data.filter((item) =>
        item.fullName.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];

    const handleFileExport = () => {
          const ws = XLSX.utils.aoa_to_sheet([
            ["Id", "Full name", "Email","Role", "Age","Address","Premium","Status"], // Header row
            ...filteredData.map((item) => [
              item.userId,
              item.fullName,
              item.email,
              item.role,
              item.age,
              item.location,
              
              // item.userPackages && item.userPackages.length > 0 
              // ? item.userPackages.map((pkg: any) => pkg.status).join(", ")
              // : "None", 
              item.userPackages && item.userPackages.length > 0
              ? item.userPackages.find((pkg: any) => pkg.status.toLowerCase() === "active")?.packageName || "None"
              : "None", // If no active package, display "None"
            
              item.status,
            ],
         
        
        ) // Data rows

          ]);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Account");
          XLSX.writeFile(wb, "account_export.xlsx");
        };
  return (
    <DefaultLayout>
      <div className="">
        <div className="flex justify-between">
          <div className="mb-2">Total: {data?.length}</div>
          <Input
            placeholder="Search customer name"
            value={searchText}
            onChange={handleSearch}
            style={{ marginBottom: 20, width: 300 }}
          />
           <div className="mb-2 flex space-x-3">
         
            
                        <Button onClick={handleFileExport}>Export Excel</Button>
            
          </div>
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          <Table<Account>
            columns={columns}
            dataSource={filteredData}
            onChange={onChange}
          />
        )}
        
      </div>
    </DefaultLayout>
  );
};

export default CustomerPage;
