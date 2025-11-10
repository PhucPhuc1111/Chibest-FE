"use client";
import { useEffect, useMemo, useState } from "react";
import { Radio, Dropdown, Button, DatePicker } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import { RightOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

type Payload =
  | { mode: "preset"; value: string }
  | { mode: "custom"; value: [string, string] };

export const DEFAULT_DATE_PRESET = "Toàn thời gian";

export type DateFilterValue =
  | { mode: "preset"; preset?: string | null }
  | { mode: "custom"; range?: [string | null, string | null] };

export default function DateFilter({
  value,
  onChange,
}: {
  value: DateFilterValue;
  onChange: (range: Payload) => void;
}) {
  const [mode, setMode] = useState<"preset" | "custom">(
    value.mode === "custom" ? "custom" : "preset"
  );
  const [preset, setPreset] = useState<string>(
    value.mode === "preset"
      ? value.preset ?? DEFAULT_DATE_PRESET
      : DEFAULT_DATE_PRESET
  );
  const [open, setOpen] = useState(false);
  const [customRange, setCustomRange] = useState<[Dayjs, Dayjs] | null>(() => {
    if (
      value.mode === "custom" &&
      value.range &&
      value.range[0] &&
      value.range[1]
    ) {
      return [dayjs(value.range[0]), dayjs(value.range[1])];
    }
    return null;
  });

  useEffect(() => {
    if (value.mode === "preset") {
      setMode("preset");
      setPreset(value.preset ?? DEFAULT_DATE_PRESET);
      setCustomRange(null);
      return;
    }

    setMode("custom");
    if (value.range && value.range[0] && value.range[1]) {
      setCustomRange([dayjs(value.range[0]), dayjs(value.range[1])]);
    } else {
      setCustomRange(null);
    }
  }, [value]);

  const handleModeChange = (nextMode: "preset" | "custom") => {
    setMode(nextMode);
    if (nextMode === "preset") {
      onChange({ mode: "preset", value: preset });
    } else if (customRange) {
      const [from, to] = customRange;
      onChange({
        mode: "custom",
        value: [from.format("YYYY-MM-DD"), to.format("YYYY-MM-DD")],
      });
    }
  };

  const handlePreset = (label: string) => {
    setMode("preset");
    setPreset(label);
    setOpen(false);
    onChange({ mode: "preset", value: label });
  };

  const handleCustomChange: RangePickerProps["onChange"] = (dates) => {
    if (!dates || !dates[0] || !dates[1]) return;
    const from = dates[0].format("YYYY-MM-DD");
    const to = dates[1].format("YYYY-MM-DD");
    setMode("custom");
    setCustomRange([dates[0], dates[1]]);
    onChange({ mode: "custom", value: [from, to] });
  };

  // ==== Popup preset (bảng nút dạng KiotViet) ====
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
        <PresetColumn
          title="Theo quý"
          items={["Quý này", "Quý trước"]}
          active={preset}
          onPick={handlePreset}
        />
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
      {/* <div className="text-[13px] font-semibold mb-1">Ngày tạo</div> */}

      <Radio.Group
        value={mode}
        onChange={(e) => handleModeChange(e.target.value)}
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
                    popupRender={() => presetPanel} // ✅ thay dropdownRender -> popupRender
          >
            <Button className="w-[250px] h-9 rounded-lg border border-gray-300 
                         flex items-center justify-center  text-left
                         hover:border-blue-400 hover:bg-blue-50 transition">
              <p className="">{preset}</p>
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
              classNames={{
                popup: { root: "rounded-lg" }, // ✅ thay popupClassName -> classNames.popup.root
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
