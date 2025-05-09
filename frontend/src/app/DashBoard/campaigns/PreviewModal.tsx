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
    <Dialog open={show} onClose={() => setShow(false)} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white max-w-2xl w-full rounded shadow-lg p-6">
          <Dialog.Title className="text-lg font-bold mb-4">{subject || 'Email Preview'}</Dialog.Title>
          <div
            className="border p-4 max-h-[400px] overflow-auto"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setShow(false)}
              className="px-4 py-2 bg-gray-700 text-white text-sm rounded"
            >
              Close
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
