"use client";
import { useEffect, useState } from "react";
import { Input } from "antd";
import { ProductMaster, ProductVariant } from "@/types/product";
interface Props {
  master: ProductMaster;
  variant: ProductVariant;
}

export default function ProductNoteTab({ master, variant }: Props) {
  const [descriptionValue, setDescriptionValue] = useState("");
  const [noteValue, setNoteValue] = useState("");

  useEffect(() => {
    const htmlToPlainText = (html?: string | null): string => {
      if (!html) return "";

      if (typeof window !== "undefined" && "DOMParser" in window) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        return doc.body.textContent ?? "";
      }

      return html.replace(/<[^>]+>/g, "");
    };

    setDescriptionValue(htmlToPlainText(variant.description));
    
    // Lấy note từ variant hoặc master
    const variantWithNote = variant as ProductVariant & { note?: string };
    const masterWithNote = master as ProductMaster & { note?: string };
    const note = variantWithNote.note || masterWithNote.note || "";
    setNoteValue(note);
  }, [variant.description, variant, master]);

  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-600">
        Ghi chú / mô tả cho <b>{variant.name}</b> ({master.name})
      </div>
      <Input.TextArea 
        rows={4} 
        placeholder="Nhập mô tả..." 
        value={descriptionValue}
        onChange={(e) => {
          const nextValue = e.target.value;
          setDescriptionValue(nextValue);
          console.log("Update description:", nextValue);
        }}
      />
      <Input.TextArea 
        rows={3} 
        placeholder="Nhập ghi chú..." 
        value={noteValue}
        readOnly
      />
    </div>
  );
}