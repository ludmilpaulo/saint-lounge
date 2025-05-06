import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { uploadDocument, DocumentUploadPayload, Document } from "@/services/documentService";
import { useState } from "react";

interface UploadSectionProps {
  onUpload: (doc: Document) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onUpload }) => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const auth_user = useSelector((state: RootState) => state.auth.user);
  const userID = auth_user?.user_id;

  const handleUpload = async () => {
    if (!file || !title.trim() || !userID) return alert("Missing data");

    const payload: DocumentUploadPayload = {
      title,
      file,
      user_id: userID,
    };

    try {
      const uploaded = await uploadDocument(payload);
      onUpload(uploaded);
      setTitle("");
      setFile(null);
    } catch  {
      alert("Failed to upload document.");
    }
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
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Upload Document
      </button>
    </div>
  );
};

export default UploadSection;
