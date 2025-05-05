"use client";
import React from "react";
import { Document } from "@/services/documentService";
import { downloadAuditReport } from "@/services/auditService";

interface Props {
  documents: Document[];
}

const SignedSection: React.FC<Props> = ({ documents }) => {
  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <div key={doc.id} className="p-4 border rounded bg-gray-50 flex justify-between">
          <span>{doc.title}</span>
          <button
            onClick={() => downloadAuditReport(doc.id)}
            className="text-blue-600 hover:underline"
          >
            Download Audit
          </button>
        </div>
      ))}
    </div>
  );
};

export default SignedSection;
