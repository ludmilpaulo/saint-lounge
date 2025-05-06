"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getDocuments, Document } from "@/services/documentService";
import { Transition } from "@headlessui/react";

// ✅ Import only SSR-safe components normally
import CreateSection from "./documents/CreateSection";

// ✅ Dynamically import the rest to disable SSR
const UploadSection = dynamic(() => import("./documents/UploadSection"), { ssr: false });
const SignSection = dynamic(() => import("./documents/SignSection"), { ssr: false });
const SendToSignSection = dynamic(() => import("./documents/SendToSignSection"), { ssr: false });
const SignedSection = dynamic(() => import("./documents/SignedSection"), { ssr: false });

const tabs = ["Upload", "Create", "Sign", "Send to Sign", "Signed"];

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Upload");

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const result = await getDocuments();
      setDocuments(result);
    } catch {
      alert("Failed to fetch documents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = (doc: Document) => {
    setDocuments((prev) => [doc, ...prev]);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Documents</h1>

      {/* Tabs */}
      <div className="mb-6 flex gap-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-t-lg border-b-2 font-medium transition ${
              activeTab === tab
                ? "bg-white border-blue-600 text-blue-600 shadow"
                : "bg-gray-100 border-transparent text-gray-500 hover:text-blue-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === "Upload" && (
          <>
            <UploadSection onUpload={handleUpload} />
            <ul className="space-y-3">
              {documents.map((doc) => (
                <li
                  key={doc.id}
                  className="p-4 bg-white rounded shadow flex justify-between"
                >
                  <span className="font-medium text-gray-700">{doc.title}</span>
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    View
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}

        {activeTab === "Create" && <CreateSection />}

        {activeTab === "Sign" && (
          <SignSection documents={documents} onLoading={setLoading} />
        )}

        {activeTab === "Send to Sign" && (
          <SendToSignSection documents={documents} onLoading={setLoading} />
        )}

        {activeTab === "Signed" && <SignedSection documents={documents} />}
      </div>

      {/* Loader */}
      <Transition
        show={loading}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="w-16 h-16 border-t-4 border-b-4 border-white rounded-full animate-spin" />
        </div>
      </Transition>
    </div>
  );
};

export default Documents;
