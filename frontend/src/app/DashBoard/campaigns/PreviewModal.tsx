'use client';
import { Dialog } from '@headlessui/react';

type Props = {
  show: boolean;
  setShow: (val: boolean) => void;
  subject: string;
  html: string;
};

export default function PreviewModal({ show, setShow, subject, html }: Props) {
  return (
    <Dialog open={show} onClose={() => setShow(false)} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40" />
        <div className="relative bg-white max-w-2xl w-full mx-auto rounded shadow p-6 z-10">
          <Dialog.Title className="text-lg font-bold mb-4">{subject || 'Email Preview'}</Dialog.Title>
          <div className="border p-4 max-h-[400px] overflow-auto" dangerouslySetInnerHTML={{ __html: html }} />
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setShow(false)}
              className="px-4 py-2 bg-gray-700 text-white text-sm rounded"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
