"use client";
import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Document } from "@/services/documentService";
import { submitSignature } from "@/services/signatureService";

interface Props {
  documents: Document[];
  onLoading: (state: boolean) => void;
}

const SignSection: React.FC<Props> = ({ documents, onLoading }) => {
  const [selectedDoc, setSelectedDoc] = useState<number | null>(null);
  const [page, setPage] = useState<number>(1);
  const [x, setX] = useState<number>(50);
  const [y, setY] = useState<number>(100);
  const sigRef = useRef<SignatureCanvas>(null);

  const handleSubmit = async () => {
    if (!selectedDoc || !sigRef.current) return alert("All fields required");

    const canvas = sigRef.current.getTrimmedCanvas();
    const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => b && resolve(b), "image/png")!);

    try {
      onLoading(true);
      await submitSignature({
        documentId: selectedDoc,
        signatureImage: blob,
        x,
        y,
        pageNumber: page,
      });
      alert("Signature submitted!");
      sigRef.current.clear();
    } catch {
      alert("Failed to submit signature.");
    } finally {
      onLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold">Sign Document</h2>

      <select
        value={selectedDoc ?? ""}
        onChange={(e) => setSelectedDoc(Number(e.target.value))}
        className="w-full p-2 border rounded"
      >
        <option value="">Select Document</option>
        {documents.map((doc) => (
          <option key={doc.id} value={doc.id}>
            {doc.title}
          </option>
        ))}
      </select>

      <div className="flex gap-4">
        <input
          type="number"
          placeholder="Page Number"
          value={page}
          onChange={(e) => setPage(Number(e.target.value))}
          className="w-1/3 p-2 border rounded"
        />
        <input
          type="number"
          placeholder="X Position"
          value={x}
          onChange={(e) => setX(Number(e.target.value))}
          className="w-1/3 p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Y Position"
          value={y}
          onChange={(e) => setY(Number(e.target.value))}
          className="w-1/3 p-2 border rounded"
        />
      </div>

      <div className="border rounded bg-white shadow-inner">
        <SignatureCanvas
          penColor="black"
          canvasProps={{ width: 400, height: 200, className: "rounded" }}
          ref={sigRef}
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => sigRef.current?.clear()}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
        >
          Clear
        </button>
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Submit Signature
        </button>
      </div>
    </div>
  );
};

export default SignSection;
