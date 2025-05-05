"use client";
import React from "react";
import { Document } from "@/services/documentService";
import { sendInvite } from "@/services/inviteService";

interface Props {
  documents: Document[];
  onLoading: (state: boolean) => void;
}

const SendToSignSection: React.FC<Props> = ({ documents, onLoading }) => {
  const handleSend = async () => {
    const email = prompt("Enter recipient email:");
    const docId = Number(prompt("Enter document ID:"));
    if (!email || !docId) return;

    try {
      onLoading(true);
      await sendInvite({ email, documentId: docId });
      alert("Invite sent!");
    } catch {
      alert("Failed to send invite.");
    } finally {
      onLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-semibold">Send for Signature</h2>
      <p className="text-sm text-gray-600">Invite someone to sign a document.</p>
      <button onClick={handleSend} className="bg-indigo-600 text-white px-4 py-2 rounded">
        Send Invite
      </button>
    </div>
  );
};

export default SendToSignSection;
