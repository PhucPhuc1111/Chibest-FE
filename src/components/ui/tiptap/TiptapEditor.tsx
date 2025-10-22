"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Blockquote from "@tiptap/extension-blockquote";
import { Button, Tooltip, Dropdown } from "antd";
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  BlockOutlined,
  LinkOutlined,
  PictureOutlined,
  DownOutlined,
} from "@ant-design/icons";
import React from "react";

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Image.configure({
        HTMLAttributes: { class: "max-w-full h-auto rounded-md" },
      }),
      Blockquote,
      Placeholder.configure({
        placeholder: "Nhập nội dung mô tả ở đây...",
      }),
    ],
    content,
    immediatelyRender: false, // ✅ fix SSR
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "min-h-[160px] border border-gray-300 rounded-md p-3 focus:border-blue-500 focus:ring-0 outline-none transition duration-150 ease-in-out bg-white",
      },
    },
  });

  if (!editor) return null;

  // Dropdown menu cho Format
  const formatMenu = [
    {
      key: "paragraph",
      label: (
        <div
          onClick={() => editor.chain().focus().setParagraph().run()}
          className="text-gray-700"
        >
          Paragraph
        </div>
      ),
    },
    {
      key: "quote",
      label: (
        <div
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className="text-gray-700"
        >
          Quotation
        </div>
      ),
    },
    {
      key: "h1",
      label: (
        <div
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className="font-bold text-[16px]"
        >
          Heading 1
        </div>
      ),
    },
    {
      key: "h2",
      label: (
        <div
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className="font-semibold text-[15px]"
        >
          Heading 2
        </div>
      ),
    },
    {
      key: "h3",
      label: (
        <div
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className="font-medium text-[14px]"
        >
          Heading 3
        </div>
      ),
    },
  ];

  // Hàm chèn link
  const addLink = () => {
    const url = window.prompt("Nhập URL:");
    if (url) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  // Hàm chèn ảnh
  const addImage = () => {
    const url = window.prompt("Dán link ảnh:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const MenuBar = (
    <div className="flex flex-wrap items-center gap-1 p-2 border border-b-0 border-gray-300 rounded-t-md bg-gray-50">
      {/* Format Dropdown */}
      <Dropdown menu={{ items: formatMenu }} trigger={["click"]}>
        <Button className="flex items-center">
          Format <DownOutlined className="ml-1 text-[10px]" />
        </Button>
      </Dropdown>

      {/* Bold */}
      <Tooltip title="In đậm (Ctrl + B)">
        <Button
          icon={<BoldOutlined />}
          onClick={() => editor.chain().focus().toggleBold().run()}
          type={editor.isActive("bold") ? "primary" : "default"}
        />
      </Tooltip>

      {/* Italic */}
      <Tooltip title="In nghiêng (Ctrl + I)">
        <Button
          icon={<ItalicOutlined />}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          type={editor.isActive("italic") ? "primary" : "default"}
        />
      </Tooltip>

      {/* Underline */}
      <Tooltip title="Gạch dưới (Ctrl + U)">
        <Button
          icon={<UnderlineOutlined />}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          type={editor.isActive("underline") ? "primary" : "default"}
        />
      </Tooltip>

      {/* Unordered List */}
      <Tooltip title="Danh sách không thứ tự">
        <Button
          icon={<UnorderedListOutlined />}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          type={editor.isActive("bulletList") ? "primary" : "default"}
        />
      </Tooltip>

      {/* Ordered List */}
      <Tooltip title="Danh sách có thứ tự">
        <Button
          icon={<OrderedListOutlined />}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          type={editor.isActive("orderedList") ? "primary" : "default"}
        />
      </Tooltip>

      {/* Quote */}
      <Tooltip title="Trích dẫn">
        <Button
          icon={<BlockOutlined />}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          type={editor.isActive("blockquote") ? "primary" : "default"}
        />
      </Tooltip>

      {/* Link */}
      <Tooltip title="Chèn liên kết">
        <Button icon={<LinkOutlined />} onClick={addLink} />
      </Tooltip>

      {/* Image */}
      <Tooltip title="Chèn hình ảnh">
        <Button icon={<PictureOutlined />} onClick={addImage} />
      </Tooltip>
    </div>
  );

  return (
    <div className="tiptap-editor-container">
      {MenuBar}
      <EditorContent
        editor={editor}
        className="border border-t-0 border-gray-300 rounded-b-md bg-white"
      />
    </div>
  );
}
