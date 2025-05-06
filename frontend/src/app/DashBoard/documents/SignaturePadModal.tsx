'use client';
import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

interface Props {
  onClose: () => void;
  onSave: (dataUrl: string) => void;
}

const SignaturePadModal: React.FC<Props> = ({ onClose, onSave }) => {
  const sigRef = useRef<SignatureCanvas>(null);

  const handleSave = () => {
    if (sigRef.current?.isEmpty()) return;
    const dataUrl = sigRef.current.getTrimmedCanvas().toDataURL();
    onSave(dataUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-lg font-semibold">Draw Signature</h2>
        <SignatureCanvas
          ref={sigRef}
          canvasProps={{ width: 400, height: 150, className: "border rounded" }}
        />
        <div className="flex justify-between">
          <button
            onClick={() => sigRef.current?.clear()}
            className="text-gray-600"
          >
            Clear
          </button>
          <div className="space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignaturePadModal;
