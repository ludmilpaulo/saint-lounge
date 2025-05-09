'use client';
import { useState } from 'react';

type Props = {
  emails: string[];
  setEmails: (emails: string[]) => void;
};

export default function EmailUploader({ emails, setEmails }: Props) {
  const [input, setInput] = useState('');

  const handleParse = () => {
    const parsed = input
      .split(/[\n,]+/)
      .map((e) => e.trim())
      .filter((e) => e.includes('@'));
    setEmails(parsed);
  };

  return (
    <div>
      <textarea
        className="w-full h-32 border rounded p-2 text-sm"
        placeholder="Paste comma or line-separated emails"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleParse} className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded">
        Parse Emails
      </button>

      {emails.length > 0 && (
        <p className="mt-2 text-sm text-gray-700">✅ {emails.length} valid emails loaded</p>
      )}
    </div>
  );
}
