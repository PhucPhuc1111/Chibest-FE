// pages/sale/index.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Tabs, Button, Input, Divider, Drawer } from 'antd';
// import { Radio, Select } from "antd";
import { SearchOutlined, MenuOutlined, PlusOutlined, MinusOutlined,PlusCircleOutlined,BarcodeOutlined,FilterOutlined ,UnorderedListOutlined ,PrinterFilled,ThunderboltOutlined} from '@ant-design/icons';
import { faReply,faBagShopping,faImage,faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useProductStore  } from '@/stores/useProductStore';
import type { Product } from '@/types/product';


type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

interface SaleTab {
  label: string;
  key: string;
  orderItems: OrderItem[];
}

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  total: number;
  variant?: string;
}

const SalePage: React.FC = () => {
  const { products, getProducts,  } = useProductStore();
  const [activeKey, setActiveKey] = useState('1');
  const [activeBottomTab, setActiveBottomTab] = useState<'quick' | 'normal'>('normal');
  //  const [selectedPayment, setSelectedPayment] = useState<"cash" | "transfer" | "card" | "wallet">("cash");
  // const recommendedCash = [300000, 500000, 1000000];
  // const demoCards = ["Vietcombank", "Techcombank", "ACB"];

  const [tabs, setTabs] = useState<SaleTab[]>([
    { 
      label: 'Hóa đơn 1', 
      key: '1', 
      orderItems: [] 
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, ] = useState('Phúc');
  const [paymentDrawerVisible, setPaymentDrawerVisible] = useState(false);
  const newTabIndex = useRef(2);

  useEffect(() => {
    getProducts({ IsMaster: true });
  }, []);

  const onTabChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
  };

  const addTab = () => {
    const newTabKey = `${newTabIndex.current++}`;
    const newTabs = [...tabs];
    newTabs.push({
      label: `Hóa đơn ${newTabIndex.current - 1}`,
      key: newTabKey,
      orderItems: []
    });
    setTabs(newTabs);
    setActiveKey(newTabKey);
  };

  const removeTab = (targetKey: TargetKey) => {
    if (tabs.length <= 1) return;

    let newActiveKey = activeKey;
    let lastIndex = -1;
    
    tabs.forEach((tab, i) => {
      if (tab.key === targetKey) {
        lastIndex = i - 1;
      }
    });

    const newTabs = tabs.filter(tab => tab.key !== targetKey);
    
    if (newTabs.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newTabs[lastIndex].key;
      } else {
        newActiveKey = newTabs[0].key;
      }
    }

    setTabs(newTabs);
    setActiveKey(newActiveKey);
  };

  const onEdit = (targetKey: TargetKey, action: 'add' | 'remove') => {
    if (action === 'add') {
      addTab();
    } else {
      removeTab(targetKey);
    }
  };

  const addToOrder = (product: Product) => {
    const currentTab = tabs.find(tab => tab.key === activeKey);
    if (!currentTab) return;

    const existingItem = currentTab.orderItems.find(item => item.productId === product.id);
    
    const newTabs = tabs.map(tab => {
      if (tab.key === activeKey) {
        if (existingItem) {
          return {
            ...tab,
            orderItems: tab.orderItems.map(item =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
                : item
            )
          };
        } else {
          const newItem: OrderItem = {
            id: `${product.id}-${Date.now()}`,
            productId: product.id,
            name: product.name,
            sku: product.sku,
            price: product.sellingPrice || 0,
            quantity: 1,
            total: product.sellingPrice || 0,
            variant: product.color || product.size ? `${product.color}${product.size ? ` - ${product.size}` : ''}` : undefined
          };
          return {
            ...tab,
            orderItems: [...tab.orderItems, newItem]
          };
        }
      }
      return tab;
    });

    setTabs(newTabs);
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 0) return;

    const newTabs = tabs.map(tab => {
      if (tab.key === activeKey) {
        return {
          ...tab,
          orderItems: tab.orderItems.map(item =>
            item.id === itemId
              ? { ...item, quantity: newQuantity, total: newQuantity * item.price }
              : item
          ).filter(item => item.quantity > 0)
        };
      }
      return tab;
    });

    setTabs(newTabs);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentTab = tabs.find(tab => tab.key === activeKey);
  const totalAmount = currentTab?.orderItems.reduce((sum, item) => sum + item.total, 0) || 0;
  const totalItems = currentTab?.orderItems.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
  const formattedTime = `${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}`;

  // Bottom tabs items
  const bottomTabItems = [
    {
      key: 'quick',
      label: 'Bán nhanh',
      icon: <ThunderboltOutlined />
    },
    {
      key: 'normal',
      label: 'Bán thường',
      icon: <FontAwesomeIcon icon={faClock} />
    },
    
  ];

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Header */}
      <div className="bg-blue-500 border-b px-2  flex items-center justify-between">
        <div className="flex items-end gap-4 w-full ">
          {/* Search Product */}
          <div className='py-2 w-[25%]'>
          <Input
            size="large"
            placeholder="Tìm hàng hóa (F3)"
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-10 "
            // style={{width:"25%"}}
     
            
          />
          </div>
          <div className='py-2'>
          <BarcodeOutlined style={{ fontSize: '24px', color: '#4e9cf7' }} />
          </div>
          {/* Tabs Hóa đơn */}
              <div className="flex-1 -py-4 flex items-end ">
              <Tabs
                type="editable-card"
                hideAdd={false}
                addIcon={<PlusCircleOutlined className="!text-white" />}
                activeKey={activeKey}
                onEdit={onEdit}
                onChange={onTabChange}
                items={tabs.map(tab => ({
                  label: tab.label,
                  key: tab.key,
                  closable: tabs.length > 1
                }))}
                className="
                  [&_.ant-tabs-nav]:!mb-0
                  [&_.ant-tabs-nav]:!border-none
                  [&_.ant-tabs-nav-wrap]:!border-none
                  [&_.ant-tabs-tab]:!border-none
                  [&_.ant-tabs-tab]:!text-white
                  [&_.ant-tabs-nav-add]:!border-none
                  [&_.ant-tabs-ink-bar]:!hidden
                   [&_.ant-tabs-card>.ant-tabs-nav .ant-tabs-tab]:!border-none
    [&_.ant-tabs-card>.ant-tabs-nav .ant-tabs-tab]:!text-transparent
                "
              />
            </div>
          {/* </div> */}
        </div>

        {/* Menu Icon */}

          <div className='mx-8 flex items-center gap-1'>
            <Button
              type="text"
              // 2. Sử dụng component FontAwesomeIcon làm prop icon
              icon={<FontAwesomeIcon icon={faBagShopping} className='!text-white !font-bold' />} 
              size="large"
            >
            </Button>
            <Button
              type="text"
              // 2. Sử dụng component FontAwesomeIcon làm prop icon
              icon={<FontAwesomeIcon icon={faReply} className='!text-white !font-bold' />} 
              size="large"
            >
            </Button>
            <Button type="text" icon={<PrinterFilled className='!text-white !font-bold'/>} size="large"  />

          </div>
         
          <p className='text-white whitespace-nowrap'>Viet le</p>
          <Button type="text" icon={<MenuOutlined className='!text-white'/>} size="large"  />
        
        
        
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-64px-48px)] ">
        {/* Left Side - Luôn hiển thị order items */}
        <div className="w-2/3 bg-[#ecedf0] border-r p-4 overflow-auto">
          <div className="space-y-2">
            {currentTab?.orderItems.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-3 bg-white">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{item.name}</div>
                    <div className="text-sm text-gray-600">{item.sku}</div>
                    {item.variant && (
                      <div className="text-xs text-gray-500">{item.variant}</div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-red-600 font-bold">+{item.total.toLocaleString()}₫</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Button 
                      size="small" 
                      icon={<MinusOutlined />}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    />
                    <span className="w-8 text-center text-gray-700">{item.quantity}</span>
                    <Button 
                      size="small" 
                      icon={<PlusOutlined />}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    />
                  </div>
                  <div className="text-gray-600 text-sm">
                    {item.quantity} x {item.price.toLocaleString()}₫
                  </div>
                </div>
              </div>
            ))}
            
            {(!currentTab?.orderItems || currentTab.orderItems.length === 0) && (
              <div className="text-center text-gray-500 py-20 border border-gray-200 rounded-lg bg-gray-50">
                <div className="text-lg mb-2">Chưa có sản phẩm trong đơn hàng</div>
                <div className="text-sm">Sử dụng thanh tìm kiếm để thêm sản phẩm</div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Hiển thị khác nhau theo tab */}
        <div className="w-1/3 bg-white p-4 flex flex-col ">
          {activeBottomTab === 'normal' ? (
            // Bán thường: Hiển thị list sản phẩm với ảnh
            <div className="h-full  overflow-none">
              <div className="mb-4 gap-4 flex items-center">
              <Input
                  size="large"
                  placeholder="Tìm khách hàng (F4)"
                  prefix={<SearchOutlined />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  
                  // className="w-64"
                />
                <UnorderedListOutlined />
                <FilterOutlined />
                <FontAwesomeIcon icon={faImage} />
                
                

                </div>
              <div className="grid grid-cols-3 gap-2">
                {filteredProducts.slice(0, 30).map((product) => (
                  <div  
                      key={product.id}
                      className="w-[200px] h-[83px] border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all duration-200 cursor-pointer flex bg-white"
                      onClick={() => addToOrder(product)}
                    >
                      <div className="w-1/3 h-full flex items-center justify-center overflow-hidden rounded-l-lg bg-gray-100">
                        {product.avartarUrl ? (
                          <img 
                            src={product.avartarUrl} 
                            alt={product.name}
                            className="h-16 w-16 object-cover rounded" 
                          />
                        ) : (
                          <div className="text-gray-400 text-xs text-center p-2">No Image</div>
                        )}
                      </div>
                      
                      {/* Thông tin sản phẩm - bên phải */}
                      <div className="w-2/3 p-2 flex flex-col justify-between">
                        {/* Tên sản phẩm */}
                        <div className="flex-1">
                          <div className="text-xs font-medium line-clamp-2 leading-tight mb-1">
                            {product.name}
                          </div>
                        </div>
                        
                        {/* Giá */}
                        <div className="text-red-600 font-bold text-sm">
                          {(product.sellingPrice || 0).toLocaleString()}₫
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
          ) : (
            // Bán nhanh: Hiển thị thanh toán
            <>
            
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-800">{selectedCustomer}</span>
                  <span className="text-gray-500 text-sm">{formattedDate} {formattedTime}</span>
                </div>
                <Input
                  size="large"
                  placeholder="Tìm khách hàng (F4)"
                  prefix={<SearchOutlined />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>

            
              <div className="space-y-3 mb-4 flex-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tổng tiền hàng</span>
                  <span className="text-gray-800">{totalItems}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tổng tiền hàng</span>
                  <span className="text-gray-800">{totalAmount.toLocaleString()}₫</span>
                </div>
                
                <Divider className="my-2" />
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Giảm giá</span>
                  <span className="text-gray-800">0</span>
                </div>
                
                <div className="mb-2">
                  <div className="text-sm text-gray-600 mb-1">Mã coupon</div>
                  <Input 
                    placeholder="Nhập mã" 
                    className="border-gray-300"
                    suffix={<span className="text-gray-400">0</span>}
                  />
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Thu khác</span>
                  <span className="text-gray-800">0</span>
                </div>
                
                <Divider className="my-2" />
                
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-800">Khách cần trả</span>
                  <span className="text-red-600">{totalAmount.toLocaleString()}₫</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Khách thanh toán</span>
                  <span className="text-gray-800">{totalAmount.toLocaleString()}₫</span>
                </div>
              </div>

            
              <div className="grid grid-cols-4 gap-2 mb-4">
                <Button 
                  type="default" 
                  size="small" 
                  className="border-gray-300 text-gray-700 hover:border-blue-500 text-xs h-8"
                >
                  Tiền mặt
                </Button>
                <Button 
                  type="default" 
                  size="small" 
                  className="border-gray-300 text-gray-700 hover:border-blue-500 text-xs h-8"
                >
                  Chuyển khoản
                </Button>
                <Button 
                  type="default" 
                  size="small" 
                  className="border-gray-300 text-gray-700 hover:border-blue-500 text-xs h-8"
                >
                  Thẻ
                </Button>
                <Button 
                  type="default" 
                  size="small" 
                  className="border-gray-300 text-gray-700 hover:border-blue-500 text-xs h-8"
                >
                  Ví
                </Button>
              </div>

            
              <Button 
                type="primary" 
                size="large" 
                block 
                className="mb-4 h-12 text-lg font-bold bg-red-500 hover:bg-red-600 border-red-500"
              >
                THANH TOÁN
              </Button>

             <div className='pb-2'>
              <Input.TextArea 
                placeholder="Ghi chú đơn hàng" 
                rows={2}
                className="mb-4  border-gray-300 text-sm"
              />
              </div>
          

            </>
          )}
        </div>

      </div>

      {/* Bottom Tabs */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-between">
        {/* Tabs bán thường/bán nhanh */}
       
        <div className="flex-1">
          <Tabs
            size="small"
            activeKey={activeBottomTab}
            onChange={(key) => setActiveBottomTab(key as 'quick' | 'normal')}
            items={bottomTabItems}
            className="[&_.ant-tabs-nav]:mb-0"
          />
        </div>

        {/* Hotline */}
        <div className="text-gray-600 text-sm font-medium">
          1900 6522
        </div>
      </div>

      {/* Drawer thanh toán cho bán thường */}
      <Drawer
        title="THANH TOÁN"
        placement="right"
        width={400}
        open={paymentDrawerVisible}
        onClose={() => setPaymentDrawerVisible(false)}
      >
        <div className="flex flex-col h-full">
          {/* Order Summary */}
          <div className="space-y-3 mb-4 flex-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tổng tiền hàng</span>
              <span className="text-gray-800">{totalItems}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tổng tiền hàng</span>
              <span className="text-gray-800">{totalAmount.toLocaleString()}₫</span>
            </div>
            
            <Divider className="my-2" />
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Giảm giá</span>
              <span className="text-gray-800">0</span>
            </div>
            
            <div className="mb-2">
              <div className="text-sm text-gray-600 mb-1">Mã coupon</div>
              <Input 
                placeholder="Nhập mã" 
                className="border-gray-300"
                suffix={<span className="text-gray-400">0</span>}
              />
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Thu khác</span>
              <span className="text-gray-800">0</span>
            </div>
            
            <Divider className="my-2" />
            
            <div className="flex justify-between text-lg font-bold">
              <span className="text-gray-800">Khách cần trả</span>
              <span className="text-red-600">{totalAmount.toLocaleString()}₫</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Khách thanh toán</span>
              <span className="text-gray-800">{totalAmount.toLocaleString()}₫</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <Button 
              type="default" 
              size="small" 
              className="border-gray-300 text-gray-700 hover:border-blue-500 text-xs h-8"
            >
              Tiền mặt
            </Button>
            <Button 
              type="default" 
              size="small" 
              className="border-gray-300 text-gray-700 hover:border-blue-500 text-xs h-8"
            >
              Chuyển khoản
            </Button>
            <Button 
              type="default" 
              size="small" 
              className="border-gray-300 text-gray-700 hover:border-blue-500 text-xs h-8"
            >
              Thẻ
            </Button>
            <Button 
              type="default" 
              size="small" 
              className="border-gray-300 text-gray-700 hover:border-blue-500 text-xs h-8"
            >
              Ví
            </Button>
          </div>

          {/* Payment Button */}
          <Button 
            type="primary" 
            size="large" 
            block 
            className="mb-4 h-12 text-lg font-bold bg-red-500 hover:bg-red-600 border-red-500"
            onClick={() => setPaymentDrawerVisible(false)}
          >
            HOÀN TẤT THANH TOÁN
          </Button>
        </div>
      </Drawer>

      {/* Nút thanh toán cho bán thường (nổi) */}
      {activeBottomTab === 'normal' && (
        <div className="fixed bottom-16 right-4">
          <Button 
            type="primary" 
            size="large"
            className="h-12 text-lg font-bold bg-red-500 hover:bg-red-600 border-red-500 shadow-lg"
            onClick={() => setPaymentDrawerVisible(true)}
          >
            THANH TOÁN
          </Button>
        </div>
      )}
    </div>
  );
};

export default SalePage;