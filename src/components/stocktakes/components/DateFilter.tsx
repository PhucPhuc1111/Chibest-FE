import { useState } from "react";
import { Radio, Dropdown, Button, Space } from "antd";
import {
//   CalendarOutlined,
  DownOutlined,
} from "@ant-design/icons";

export default function DateFilter({
  onChange,
}: {
  onChange: (range: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>("Tháng này");

  const handleSelect = (label: string) => {
    setSelected(label);
    setOpen(false);
    onChange(label);
  };

  const menu = (
    <div className="p-4 grid grid-cols-5 gap-x-6 gap-y-2 min-w-[720px]">
      {/* ===== Theo ngày ===== */}
      <div>
        <div className="font-medium mb-2 text-gray-700 text-sm">Theo ngày</div>
        <Space direction="vertical" size={6}>
          <Button
            type={selected === "Hôm nay" ? "primary" : "default"}
            size="small"
            onClick={() => handleSelect("Hôm nay")}
          >
            Hôm nay
          </Button>
          <Button
            type={selected === "Hôm qua" ? "primary" : "default"}
            size="small"
            onClick={() => handleSelect("Hôm qua")}
          >
            Hôm qua
          </Button>
        </Space>
      </div>

      {/* ===== Theo tuần ===== */}
      <div>
        <div className="font-medium mb-2 text-gray-700 text-sm">Theo tuần</div>
        <Space direction="vertical" size={6}>
          <Button
            type={selected === "Tuần này" ? "primary" : "default"}
            size="small"
            onClick={() => handleSelect("Tuần này")}
          >
            Tuần này
          </Button>
          <Button
            type={selected === "Tuần trước" ? "primary" : "default"}
            size="small"
            onClick={() => handleSelect("Tuần trước")}
          >
            Tuần trước
          </Button>
          <Button
            type={selected === "7 ngày qua" ? "primary" : "default"}
            size="small"
            onClick={() => handleSelect("7 ngày qua")}
          >
            7 ngày qua
          </Button>
        </Space>
      </div>

      {/* ===== Theo tháng ===== */}
      <div>
        <div className="font-medium mb-2 text-gray-700 text-sm">Theo tháng</div>
        <Space direction="vertical" size={6}>
          <Button
            type={selected === "Tháng này" ? "primary" : "default"}
            size="small"
            onClick={() => handleSelect("Tháng này")}
          >
            Tháng này
          </Button>
          <Button
            type={selected === "Tháng trước" ? "primary" : "default"}
            size="small"
            onClick={() => handleSelect("Tháng trước")}
          >
            Tháng trước
          </Button>
          <Button
            type={selected === "30 ngày qua" ? "primary" : "default"}
            size="small"
            onClick={() => handleSelect("30 ngày qua")}
          >
            30 ngày qua
          </Button>
        </Space>
      </div>

      {/* ===== Theo quý ===== */}
      <div>
        <div className="font-medium mb-2 text-gray-700 text-sm">Theo quý</div>
        <Space direction="vertical" size={6}>
          <Button
            type={selected === "Quý này" ? "primary" : "default"}
            size="small"
            onClick={() => handleSelect("Quý này")}
          >
            Quý này
          </Button>
          <Button
            type={selected === "Quý trước" ? "primary" : "default"}
            size="small"
            onClick={() => handleSelect("Quý trước")}
          >
            Quý trước
          </Button>
        </Space>
      </div>

      {/* ===== Theo năm ===== */}
      <div>
        <div className="font-medium mb-2 text-gray-700 text-sm">Theo năm</div>
        <Space direction="vertical" size={6}>
          <Button
            type={selected === "Năm này" ? "primary" : "default"}
            size="small"
            onClick={() => handleSelect("Năm này")}
          >
            Năm này
          </Button>
          <Button
            type={selected === "Năm trước" ? "primary" : "default"}
            size="small"
            onClick={() => handleSelect("Năm trước")}
          >
            Năm trước
          </Button>
        </Space>
      </div>
    </div>
  );

  return (
    <div>
      <div className="text-[13px] font-semibold mb-1">Ngày tạo</div>
      <Radio.Group
        value={selected === "Tùy chỉnh" ? "custom" : "month"}
        className="flex flex-col space-y-1"
      >
        <Radio value="month" onClick={() => handleSelect("Tháng này")}>
          Tháng này
        </Radio>

        <Dropdown
          overlay={menu}
          placement="bottomLeft"
          open={open}
          onOpenChange={setOpen}
          trigger={["click"]}
        >
          <Radio value="custom" onClick={() => setOpen(!open)}>
            Tùy chỉnh <DownOutlined className="ml-1 text-gray-400" />
          </Radio>
        </Dropdown>
      </Radio.Group>
    </div>
  );
}
