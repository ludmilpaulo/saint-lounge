'use client';

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Blockquote from '@tiptap/extension-blockquote';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import FontSize from '@tiptap/extension-font-size';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import axios from 'axios';
import sanitizeHtml from 'sanitize-html';
import ImageResize from 'tiptap-extension-resize-image';

type Props = {
  value: string;
  onChange: (html: string) => void;
};

export default function EmailEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Blockquote,
      HorizontalRule,
      Image,
      ImageResize,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      FontFamily,
      FontSize,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value || '<p>Your email content here...</p>',
    onUpdate: ({ editor }) => {
      const rawHtml = editor.getHTML();
      const cleanHtml = sanitizeHtml(rawHtml, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'table', 'thead', 'tbody', 'tr', 'th', 'td']),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          img: ['src', 'alt', 'width', 'height', 'style'],
          table: ['style'],
          th: ['style'],
          td: ['style'],
        },
        allowedStyles: {
          '*': {
            // Allow only inline styles that are safe for emails
            'color': [/^.*$/],
            'background-color': [/^.*$/],
            'text-align': [/^.*$/],
            'font-size': [/^.*$/],
            'font-family': [/^.*$/],
            'width': [/^.*$/],
            'height': [/^.*$/],
          },
        },
      });
      onChange(cleanHtml);
    },
    editorProps: {
      attributes: {
        spellcheck: 'true',
      },
      handlePaste(view, event) {
        const items = event.clipboardData?.items;
        if (items) {
          for (const item of items) {
            if (item.type.indexOf('image') === 0) {
              const file = item.getAsFile();
              if (file) uploadImage(file);
              return true;
            }
          }
        }
        return false;
      },
      handleDrop(view, event) {
        const file = event.dataTransfer?.files?.[0];
        if (file && file.type.startsWith('image/')) {
          uploadImage(file);
          return true;
        }
        return false;
      },
    },
  });

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/api/upload-image/', formData);
      const imageUrl = res.data.url;
      editor?.chain().focus().setImage({ src: imageUrl }).run();
    } catch (err) {
      console.error('Image upload failed:', err);
    }
  };

  const insertLink = () => {
    const url = prompt('Enter URL');
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="border rounded p-3 mb-6 bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 border-b pb-2 mb-2 text-sm">
        <button onClick={() => editor?.chain().focus().toggleBold().run()} className="px-2 font-semibold">B</button>
        <button onClick={() => editor?.chain().focus().toggleItalic().run()} className="px-2 italic">I</button>
        <button onClick={() => editor?.chain().focus().toggleUnderline().run()} className="px-2 underline">U</button>
        <button onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} className="px-2">H1</button>
        <button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className="px-2">H2</button>
        <button onClick={() => editor?.chain().focus().toggleBulletList().run()} className="px-2">• List</button>
        <button onClick={() => editor?.chain().focus().toggleOrderedList().run()} className="px-2">1. List</button>
        <button onClick={() => editor?.chain().focus().toggleBlockquote().run()} className="px-2">❝ Quote</button>
        <button onClick={() => editor?.chain().focus().setHorizontalRule().run()} className="px-2">─ Line</button>
        <button onClick={insertLink} className="px-2 text-blue-600">🔗 Link</button>
        <button onClick={() => editor?.chain().focus().undo().run()} className="px-2">↺ Undo</button>
        <button onClick={() => editor?.chain().focus().redo().run()} className="px-2">↻ Redo</button>
        <input
          type="color"
          onChange={(e) => editor?.chain().focus().setColor(e.target.value).run()}
          className="w-6 h-6 p-0 border"
        />
        <select
          onChange={(e) => editor?.chain().focus().setFontFamily(e.target.value).run()}
          className="border text-sm"
          defaultValue=""
        >
          <option value="">Font</option>
          <option value="Arial">Arial</option>
          <option value="Georgia">Georgia</option>
          <option value="Courier New">Courier</option>
          <option value="Tahoma">Tahoma</option>
        </select>
        <select
          onChange={(e) => editor?.chain().focus().setFontSize(e.target.value).run()}
          className="border text-sm"
          defaultValue=""
        >
          <option value="">Size</option>
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="24px">24px</option>
        </select>
        <select
          onChange={(e) => editor?.chain().focus().setTextAlign(e.target.value as 'left' | 'center' | 'right' | 'justify').run()}
          className="border text-sm"
          defaultValue=""
        >
          <option value="">Align</option>
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
          <option value="justify">Justify</option>
        </select>
      </div>

      {/* Editor content */}
      <EditorContent editor={editor} className="prose prose-sm max-w-none min-h-[180px]" />
    </div>
  );
}
