"use client";
import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import FontSize from "@tiptap/extension-font-size";
import html2pdf from "html2pdf.js";
import { uploadDocument } from "@/services/documentService";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const CreateSection: React.FC = () => {
  const [title, setTitle] = useState("");
  const auth_user = useSelector((state: RootState) => state.auth.user);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image,
      TextStyle,
      Color,
      FontFamily,
      FontSize,
    ],
    content: "<p>Start typing your document here...</p>",
  });

  const handleSave = async () => {
    if (!editor || !title.trim()) {
      alert("Title is required.");
      return;
    }
    if (typeof auth_user?.user_id !== "number") {
      alert("User ID is missing. Please log in again.");
      return;
    }

    const html = editor.getHTML();
    const blob = new Blob([html], { type: "text/html" });
    const file = new File([blob], `${title}.html`, { type: "text/html" });

    try {
      await uploadDocument({ title, file, user_id: auth_user?.user_id });
      alert("Document saved successfully!");
      editor.commands.setContent("<p>Start typing your document here...</p>");
      setTitle("");
    } catch {
      alert("Failed to save document.");
    }
  };

  const handlePDFExport = () => {
    if (!editor) return;
    const element = document.createElement("div");
    element.innerHTML = editor.getHTML();

    html2pdf()
      .set({
        margin: 0.5,
        filename: `${title || "document"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .from(element)
      .save();
  };

  return (
    <div className="space-y-6 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold">Create New Document</h2>

      <input
        type="text"
        placeholder="Document Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded"
      />

      {/* Toolbar */}
      {editor && (
        <div className="flex flex-wrap gap-2 bg-gray-100 p-3 border rounded text-sm">
          <button onClick={() => editor.chain().focus().toggleBold().run()} className="btn">Bold</button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()} className="btn">Italic</button>
          <button onClick={() => editor.chain().focus().toggleUnderline().run()} className="btn">Underline</button>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className="btn">H1</button>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="btn">H2</button>
          <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="btn">• List</button>
          <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className="btn">1. List</button>
          <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className="btn">― HR</button>
          <button onClick={() => editor.chain().focus().undo().run()} className="btn">↺ Undo</button>
          <button onClick={() => editor.chain().focus().redo().run()} className="btn">↻ Redo</button>
          <button onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} className="btn text-red-500">Clear</button>

          {/* Alignment */}
          <button onClick={() => editor.chain().focus().setTextAlign("left").run()} className="btn">Left</button>
          <button onClick={() => editor.chain().focus().setTextAlign("center").run()} className="btn">Center</button>
          <button onClick={() => editor.chain().focus().setTextAlign("right").run()} className="btn">Right</button>

          {/* Image */}
          <button
            onClick={() => {
              const url = prompt("Enter image URL:");
              if (url) editor.chain().focus().setImage({ src: url }).run();
            }}
            className="btn"
          >
            🖼 Image
          </button>

          {/* Font Family */}
          <select
            onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
            className="btn"
            defaultValue=""
          >
            <option value="" disabled>Font</option>
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
            <option value="serif">Serif</option>
            <option value="monospace">Monospace</option>
          </select>

          {/* Font Size */}
          <select
            onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
            className="btn"
            defaultValue=""
          >
            <option value="" disabled>Size</option>
            <option value="12px">12</option>
            <option value="14px">14</option>
            <option value="16px">16</option>
            <option value="18px">18</option>
            <option value="24px">24</option>
          </select>

          {/* Color Picker */}
          <input
            type="color"
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            className="w-8 h-8 border rounded"
            title="Text Color"
          />
        </div>
      )}

      {/* Editor + Preview Side-by-Side */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="border rounded bg-white p-2 min-h-[200px]">
          <EditorContent editor={editor} />
        </div>

        {/* Live Preview */}
        <div className="border rounded bg-gray-50 p-4">
          <h3 className="text-gray-700 font-semibold mb-2">Live Preview</h3>
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: editor?.getHTML() || "" }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">Save Document</button>
        <button onClick={handlePDFExport} className="bg-blue-600 text-white px-4 py-2 rounded">Export as PDF</button>
      </div>

      {/* Styling */}
      <style jsx>{`
        .btn {
          @apply px-3 py-1 border rounded bg-white hover:bg-gray-200;
        }
      `}</style>
    </div>
  );
};

export default CreateSection;
