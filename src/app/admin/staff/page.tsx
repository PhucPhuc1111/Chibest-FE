
"use client"
import AuthLayout from '@/components/Layouts/AuthLayout'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import { Pagination, PaginationProps } from 'antd'
import { format } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import React, { useMemo, useState } from 'react'
import { IoSearchOutline } from 'react-icons/io5'
import { isError } from 'react-query'



const StaffPage = () => {
   
    
  return (
      <DefaultLayout>
                
<main className="">
      <div className="flex flex-row items-center justify-between">
        {/* <div>{accounts.data?.length.toLocaleString() || 0} khách hàng</div> */}
        <div>100 khách hàng</div>
        <div className="relative">
          <IoSearchOutline className="absolute top-4 left-2 w-6 h-6" />
          <input
            type="search"
            className="rounded-md w-[463px] h-[57px] placeholder:pl-0 pl-10"
            placeholder="Tìm kiếm"
            name="Search"
            // value={searchTerm}
            // onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="my-2">
        <table className="w-full border-2">
          <thead className="bg-green-800 text-white text-center border-2">
            <tr>
              <th className="border-2 border-green-800">#ID</th>
              <th className="border-2 border-green-800">Tên nhân viên</th>
              <th className="border-2 border-green-800">Email</th>
              <th className="border-2 border-green-800">Ngày tạo</th>
              <th className="border-2 border-green-800">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="text-black text-center border-2">
           
                <tr >
                  <th className="border-2 border-green-800 py-3">
                    #1
                  </th>
                  <th className="border-2 border-green-800 py-3 space-x-4  ">
                    <div className="flex  justify-center items-center space-x-2">
                    <Image
                      src={"/images/logo/logo.png"}
                      alt="avatar"
                      width={32}
                      height={32}
                      className=" rounded-full object-cover"
                    />
                    
                      <span>Lee Nguyen Gia Bao</span>
                      </div>
                 
                  </th>
                  <td className="border-2 border-green-800">
                    bao@gmail.com
                  </td>
                  <td className="border-2 border-green-800">
                    {/* {format(new Date(customer.createAt), "HH:mm dd/MM/yyyy")} */}
                    05/12/2003
                  </td>
                  <td className="border-2 border-green-800">
                    {/* <Link href={`/admin/customer/${customer.accountId}`}> */}
                      <button className="border rounded-md w-24 h-8 bg-green-800 text-white hover:bg-white hover:text-green-800">
                        Chi tiết
                      </button>
                    {/* </Link> */}
                  </td>
                </tr>
                <tr >
                  <th className="border-2 border-green-800 py-3">
                    #1
                  </th>
                  <th className="border-2 border-green-800 py-3 space-x-4  ">
                    <div className="flex  justify-center items-center space-x-2">
                    <Image
                      src={"/images/logo/logo.png"}
                      alt="avatar"
                      width={32}
                      height={32}
                      className=" rounded-full object-cover"
                    />
                    
                      <span>Lee Nguyen Gia Bao</span>
                      </div>
                 
                  </th>
                  <td className="border-2 border-green-800">
                    bao@gmail.com
                  </td>
                  <td className="border-2 border-green-800">
                    {/* {format(new Date(customer.createAt), "HH:mm dd/MM/yyyy")} */}
                    05/12/2003
                  </td>
                  <td className="border-2 border-green-800">
                    {/* <Link href={`/admin/customer/${customer.accountId}`}> */}
                      <button className="border rounded-md w-24 h-8 bg-green-800 text-white hover:bg-white hover:text-green-800">
                        Chi tiết
                      </button>
                    {/* </Link> */}
                  </td>
                </tr>
            
         
          </tbody>
        </table>

        <Pagination
          className="mt-4"
          align="center"
          showSizeChanger
          // onChange={onChange}
          // onShowSizeChange={onShowSizeChange}
          // defaultCurrent={currentPage}
          total={500}
        />
      </div>
    </main>
               </DefaultLayout>
  )
}

export default StaffPage