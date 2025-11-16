"use client";

import { message, Button,Tabs } from "antd";
import React, { useRef, useState } from 'react';
// Nhập (Import) TẤT CẢ các Icons từ thư mục "@/icons"
import {
  DownloadIcon,
  BellIcon,
  MoreDotIcon,
  FileIcon,
  GridIcon,
  AudioIcon,
  VideoIcon,
  BoltIcon,
  PlusIcon,
  BoxIcon,
  CloseIcon,
  CheckCircleIcon,
  AlertIcon,
  InfoIcon,
  ErrorIcon,
  ArrowUpIcon,
  FolderIcon,
  ArrowDownIcon,
  ArrowRightIcon,
  GroupIcon,
  BoxIconLine,
  ShootingStarIcon,
  DollarLineIcon,
  TrashBinIcon,
  AngleUpIcon,
  AngleDownIcon,
  PencilIcon,
  CheckLineIcon,
  CloseLineIcon,
  ChevronDownIcon,
  PaperPlaneIcon,
  EnvelopeIcon,
  LockIcon,
  UserIcon,
  CalenderIcon,
  EyeIcon,
  EyeCloseIcon,
  TimeIcon,
  CopyIcon,
  ChevronLeftIcon,
  UserCircleIcon,
  ListIcon,
  TableIcon,
  PageIcon,
  TaskIcon,
  PieChartIcon,
  BoxCubeIcon,
  PlugInIcon,
  DocsIcon,
  MailIcon,
  HorizontaLDots,
  ChevronUpIcon,
  ChatIcon,
} from "@/icons"; 
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;
const defaultPanes = Array.from({ length: 2 }).map((_, index) => {
  const id = String(index + 1);
  return { label: `Tab ${id}`, children: `Content of Tab Pane ${index + 1}`, key: id };
});
// Tập hợp các Icons thành một mảng để dễ dàng hiển thị
const AllIcons = [
  { name: "PlusIcon", Component: PlusIcon },
  { name: "CloseIcon", Component: CloseIcon },
  { name: "BoxIcon", Component: BoxIcon },
  { name: "CheckCircleIcon", Component: CheckCircleIcon },
  { name: "AlertIcon", Component: AlertIcon },
  { name: "InfoIcon", Component: InfoIcon },
  { name: "ErrorIcon (Info Hexa)", Component: ErrorIcon },
  { name: "BoltIcon", Component: BoltIcon },
  { name: "ArrowUpIcon", Component: ArrowUpIcon },
  { name: "ArrowDownIcon", Component: ArrowDownIcon },
  { name: "FolderIcon", Component: FolderIcon },
  { name: "VideoIcon", Component: VideoIcon },
  { name: "AudioIcon", Component: AudioIcon },
  { name: "GridIcon", Component: GridIcon },
  { name: "FileIcon", Component: FileIcon },
  { name: "DownloadIcon", Component: DownloadIcon },
  { name: "ArrowRightIcon", Component: ArrowRightIcon },
  { name: "GroupIcon", Component: GroupIcon },
  { name: "BoxIconLine", Component: BoxIconLine },
  { name: "ShootingStarIcon", Component: ShootingStarIcon },
  { name: "DollarLineIcon", Component: DollarLineIcon },
  { name: "TrashBinIcon", Component: TrashBinIcon },
  { name: "AngleUpIcon", Component: AngleUpIcon },
  { name: "AngleDownIcon", Component: AngleDownIcon },
  { name: "PencilIcon", Component: PencilIcon },
  { name: "CheckLineIcon", Component: CheckLineIcon },
  { name: "CloseLineIcon", Component: CloseLineIcon },
  { name: "ChevronDownIcon", Component: ChevronDownIcon },
  { name: "ChevronUpIcon", Component: ChevronUpIcon },
  { name: "PaperPlaneIcon", Component: PaperPlaneIcon },
  { name: "LockIcon", Component: LockIcon },
  { name: "EnvelopeIcon", Component: EnvelopeIcon },
  { name: "UserIcon (Line)", Component: UserIcon },
  { name: "CalenderIcon (Line)", Component: CalenderIcon },
  { name: "EyeIcon", Component: EyeIcon },
  { name: "EyeCloseIcon", Component: EyeCloseIcon },
  { name: "TimeIcon", Component: TimeIcon },
  { name: "CopyIcon", Component: CopyIcon },
  { name: "ChevronLeftIcon", Component: ChevronLeftIcon },
  { name: "UserCircleIcon", Component: UserCircleIcon },
  { name: "TaskIcon", Component: TaskIcon },
  { name: "ListIcon", Component: ListIcon },
  { name: "TableIcon", Component: TableIcon },
  { name: "PageIcon", Component: PageIcon },
  { name: "PieChartIcon", Component: PieChartIcon },
  { name: "BoxCubeIcon", Component: BoxCubeIcon },
  { name: "PlugInIcon", Component: PlugInIcon },
  { name: "DocsIcon", Component: DocsIcon },
  { name: "MailIcon (Line)", Component: MailIcon },
  { name: "HorizontaLDots", Component: HorizontaLDots },
  { name: "ChatIcon", Component: ChatIcon },
  { name: "MoreDotIcon", Component: MoreDotIcon },
  { name: "BellIcon", Component: BellIcon },
];

export default function Page() {
  const [activeKey, setActiveKey] = useState(defaultPanes[0].key);
  const [items, setItems] = useState(defaultPanes);
  const newTabIndex = useRef(0);

    const onChange = (key: string) => {
    setActiveKey(key);
  };

  const add = () => {
    const newActiveKey = `newTab${newTabIndex.current++}`;
    setItems([...items, { label: 'New Tab', children: 'New Tab Pane', key: newActiveKey }]);
    setActiveKey(newActiveKey);
  };

  const remove = (targetKey: TargetKey) => {
    const targetIndex = items.findIndex((pane) => pane.key === targetKey);
    const newPanes = items.filter((pane) => pane.key !== targetKey);
    if (newPanes.length && targetKey === activeKey) {
      const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex];
      setActiveKey(key);
    }
    setItems(newPanes);
  };
const onEdit = (targetKey: TargetKey, action: 'add' | 'remove') => {
    if (action === 'add') {
      add();
    } else {
      remove(targetKey);
    }
  };
  const handleTestMessage = () => {
    message.success("Xóa phiếu nhập thành công!");
  }

  // Tạo một component để hiển thị từng icon
  const IconCard = ({ name, Component }) => (
    <div 
      className="p-4 border border-gray-200 rounded-lg text-center shadow-sm hover:shadow-lg transition flex flex-col items-center justify-center space-y-2"
      style={{ minWidth: 120, maxWidth: 120 }}
    >
      {/* Icon hiển thị ở kích thước 32x32 */}
      <Component style={{ fontSize: '32px', color: '#1890ff' }} /> 
      {/* Tên icon */}
      <small className="text-gray-600 truncate w-full" title={name}>
        {name.replace('Icon', '')}
      </small>
    </div>
  );

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold border-b pb-3">Icon Preview Page</h1>

      {/* Button Test Message của bạn */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Ant Design Message Test</h2>
        <Button type="primary" onClick={handleTestMessage}>Test Message</Button>
      </div>
      
      {/* Khu vực hiển thị Icons */}
      <h2 className="text-xl font-semibold pt-4 border-t">All Custom Icons ({AllIcons.length})</h2>
      <div 
        className="grid gap-4"
        style={{ 
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))' 
        }}
      >
        {AllIcons.map(({ name, Component }) => (
          <IconCard key={name} name={name} Component={Component} />
        ))}
      </div>

      {/* tabs test */}
      <div>
      <div style={{ marginBottom: 16 }}>
        <Button onClick={add}>ADD</Button>
      </div>
  <Tabs
  hideAdd
  onChange={onChange}
  activeKey={activeKey}
  type="editable-card"
  onEdit={onEdit}
  items={items}
  style={{color:"white"}}
  className="
  bg-red-300
    [&_.ant-tabs-nav::before]:!border-none
    [&_.ant-tabs-content-holder]:!border-none

   

    [&_.ant-tabs-card>.ant-tabs-nav .ant-tabs-tab-active]:!border-none
    [&_.ant-tabs-card>.ant-tabs-nav .ant-tabs-tab-active]:!bg-transparent

    [&_.ant-tabs-card>.ant-tabs-nav .ant-tabs-nav-add]:!border-none
    [&_.ant-tabs-card>.ant-tabs-nav .ant-tabs-nav-add]:!bg-transparent
    [&_.ant-tabs-tab]:border-none
  [&_.ant-tabs-tab-with-remove]:border-none
  
  [&_.ant-tabs-tab-with-remove]:!bg-transparent
  [&_.ant-tabs-ink-bar]:!text-yellow-200
  "
  // [&_.ant-tabs-tab-with-remove]:!text-white
/>
    </div>
    </div>
  );
}