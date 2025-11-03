"use client";
import { useMemo, useState, useEffect } from "react";
import { Radio, Dropdown, Button, DatePicker } from "antd";
import type { RadioChangeEvent } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import { RightOutlined } from "@ant-design/icons";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

type Payload = {
  mode: "preset" | "custom";
  value: [string, string]; // Luôn là mảng [from, to] dạng YYYY-MM-DD
  label?: string;
};

export default function DateFilter({
  onChange,
}: {
  onChange: (range: Payload) => void;
}) {
  const [mode, setMode] = useState<"preset" | "custom">("preset");
  const [preset, setPreset] = useState<string>("Tháng này");
  const [open, setOpen] = useState(false);
  const [customRange, setCustomRange] = useState<[Dayjs, Dayjs] | null>(null);

  // Hàm tính toán ngày từ preset - format YYYY-MM-DD
  const calculatePresetDates = (presetName: string): [string, string] => {
    const today = dayjs();
    const format = "YYYY-MM-DD";
    
    switch (presetName) {
      case "Hôm nay":
        return [today.format(format), today.format(format)];
      case "Hôm qua":
        const yesterday = today.subtract(1, 'day');
        return [yesterday.format(format), yesterday.format(format)];
      case "Tuần này":
        const startOfWeek = today.startOf('week');
        return [startOfWeek.format(format), today.format(format)];
      case "Tuần trước":
        const startOfLastWeek = today.subtract(1, 'week').startOf('week');
        const endOfLastWeek = today.subtract(1, 'week').endOf('week');
        return [startOfLastWeek.format(format), endOfLastWeek.format(format)];
      case "7 ngày qua":
        const sevenDaysAgo = today.subtract(7, 'day');
        return [sevenDaysAgo.format(format), today.format(format)];
      case "Tháng này":
        const startOfMonth = today.startOf('month');
        return [startOfMonth.format(format), today.format(format)];
      case "Tháng trước":
        const startOfLastMonth = today.subtract(1, 'month').startOf('month');
        const endOfLastMonth = today.subtract(1, 'month').endOf('month');
        return [startOfLastMonth.format(format), endOfLastMonth.format(format)];
      case "30 ngày qua":
        const thirtyDaysAgo = today.subtract(30, 'day');
        return [thirtyDaysAgo.format(format), today.format(format)];
      // case "Quý này":
      //   const startOfQuarter = today.startOf('quarter');
      //   return [startOfQuarter.format(format), today.format(format)];
      // case "Quý trước":
      //   const startOfLastQuarter = today.subtract(1, 'quarter').startOf('quarter');
      //   const endOfLastQuarter = today.subtract(1, 'quarter').endOf('quarter');
      //   return [startOfLastQuarter.format(format), endOfLastQuarter.format(format)];
      case "Năm này":
        const startOfYear = today.startOf('year');
        return [startOfYear.format(format), today.format(format)];
      case "Năm trước":
        const startOfLastYear = today.subtract(1, 'year').startOf('year');
        const endOfLastYear = today.subtract(1, 'year').endOf('year');
        return [startOfLastYear.format(format), endOfLastYear.format(format)];
      default:
        return [today.format(format), today.format(format)];
    }
  };

  // Gửi giá trị mặc định khi component mount
  useEffect(() => {
    const [from, to] = calculatePresetDates("Tháng này");
    onChange({ 
      mode: "preset", 
      value: [from, to],
      label: "Tháng này"
    });
  }, []);

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return current && current > dayjs().endOf('day');
  };

  const handlePreset = (label: string) => {
    setPreset(label);
    setOpen(false);
    const [from, to] = calculatePresetDates(label);
    onChange({ 
      mode: "preset", 
      value: [from, to],
      label 
    });
  };

  const handleCustomChange: RangePickerProps["onChange"] = (dates) => {
    if (!dates || !dates[0] || !dates[1]) return;
    const from = dates[0].format("YYYY-MM-DD");
    const to = dates[1].format("YYYY-MM-DD");
    setCustomRange([dates[0], dates[1]]);
    onChange({ 
      mode: "custom", 
      value: [from, to] 
    });
  };
  const handleModeChange = (e: RadioChangeEvent) => {
    const newMode = e.target.value as "preset" | "custom";
    // const newMode = e.target.value;
    setMode(newMode);
    
    // Khi chuyển mode, gửi giá trị hiện tại
    if (newMode === "preset") {
      const [from, to] = calculatePresetDates(preset);
      onChange({ 
        mode: "preset", 
        value: [from, to],
        label: preset
      });
    } else if (customRange) {
      const from = customRange[0].format("YYYY-MM-DD");
      const to = customRange[1].format("YYYY-MM-DD");
      onChange({ 
        mode: "custom", 
        value: [from, to] 
      });
    }
  };

  // Popup preset (bảng nút dạng KiotViet)
  const presetPanel = useMemo(
    () => (
      <div className="p-4 min-w-[720px] rounded-lg shadow bg-white grid grid-cols-5 gap-x-6 gap-y-2">
        <PresetColumn
          title="Theo ngày"
          items={["Hôm nay", "Hôm qua"]}
          active={preset}
          onPick={handlePreset}
        />
        <PresetColumn
          title="Theo tuần"
          items={["Tuần này", "Tuần trước", "7 ngày qua"]}
          active={preset}
          onPick={handlePreset}
        />
        <PresetColumn
          title="Theo tháng"
          items={["Tháng này", "Tháng trước", "30 ngày qua"]}
          active={preset}
          onPick={handlePreset}
        />
        {/* <PresetColumn
          title="Theo quý"
          items={["Quý này", "Quý trước"]}
          active={preset}
          onPick={handlePreset}
        /> */}
        <PresetColumn
          title="Theo năm"
          items={["Năm này", "Năm trước"]}
          active={preset}
          onPick={handlePreset}
        />
      </div>
    ),
    [preset]
  );

  return (
    <div className=" ">
      <Radio.Group
        value={mode}
        onChange={handleModeChange}
        className="flex flex-col space-y-2 w-full "
      >
        {/* Radio 1: Preset (bảng nút trong dropdown) */}
        <label className="flex items-center gap-2 w-full ">
          <Radio value="preset">
            <Dropdown
              open={open}
              onOpenChange={setOpen}
              placement="bottomLeft"
              trigger={["click"]}
              popupRender={() => presetPanel}
            >
              <Button className="w-[250px] h-9 rounded-lg border border-gray-300 
                           flex items-center justify-center  text-left
                           hover:border-blue-400 hover:bg-blue-50 transition">
                <p className="text-gray-500">{preset}</p>
                <RightOutlined className=" text-gray-400 text-[10px]" />
              </Button>
            </Dropdown>
          </Radio>
        </label>
        
        {/* Radio 2: Custom (RangePicker 2 lịch) */}
        <label className="flex items-center gap-2">
          <Radio value="custom">
            <div className="relative w-[250px] ">
              <RangePicker
                value={customRange ?? undefined}
                onChange={handleCustomChange}
                format="DD/MM/YYYY"
                allowEmpty={[false, false]}
                disabledDate={disabledDate}
                classNames={{
                  popup: { root: "rounded-lg" },
                }}
              />
            </div>
          </Radio>
        </label>
      </Radio.Group>
    </div>
  );
}

/* ===== Sub component: một cột trong bảng preset ===== */
function PresetColumn({
  title,
  items,
  active,
  onPick,
}: {
  title: string;
  items: string[];
  active: string;
  onPick: (label: string) => void;
}) {
  return (
    <div>
      <div className="font-medium mb-2 text-gray-700 text-sm">{title}</div>
      <div className="flex flex-col gap-2">
        {items.map((label) => (
          <Button
            key={label}
            size="small"
            type={active === label ? "primary" : "default"}
            shape="round"
            onClick={() => onPick(label)}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}