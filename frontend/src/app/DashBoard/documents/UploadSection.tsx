"use client";
import React, { useState } from "react";
import { uploadDocument, DocumentUploadPayload, Document } from "@/services/documentService";

interface Props {
  onUpload: (doc: Document) => void;
}

const UploadSection: React.FC<Props> = ({ onUpload }) => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file || !title.trim()) return alert("Provide title and file");

    const payload: DocumentUploadPayload = { title, file };
    const uploaded = await uploadDocument(payload);
    onUpload(uploaded);
    setTitle("");
    setFile(null);
  };

  return (
    <div className="space-y-4 bg-gray-50 p-4 rounded-lg border">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Document title"
        className="w-full p-2 border rounded"
      />
      <input type="file" 
      
      onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload} className="bg-blue-600 text-white px-4 py-2 rounded">
        Upload Document
      </button>
    </div>
  );
};

export default UploadSection;
