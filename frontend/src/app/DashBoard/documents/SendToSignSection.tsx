'use client';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Document } from '@/services/documentService';
import { sendInvite } from '@/services/inviteService';
import { fetchUsers } from '@/services/userService';
import { User } from '@/types/userTypes';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface Props {
  documents: Document[];
  onLoading: (state: boolean) => void;
}

const SendToSignSection: React.FC<Props> = ({ documents, onLoading }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [emails, setEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState('');
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers()
      .then((res) => setUsers(res.data))
      .catch(() => {});
  }, []);

  const handleAddEmail = () => {
    const email = emailInput.trim();
    if (email && !emails.includes(email)) {
      setEmails([...emails, email]);
    }
    setEmailInput('');
  };
  const auth_user = useSelector((state: RootState) => state.auth.user);
  const userId = auth_user?.user_id;
  
  const handleSubmit = async () => {
    if (!selectedDocId) return alert('Please select a signed document.');
    if (selectedUsers.length === 0 && emails.length === 0) {
      return alert('Select at least one user or email.');
    }
  
    if (!userId) {
      alert('You must be logged in to send invites.');
      return;
    }
  
    const recipients = [...emails, ...selectedUsers.map((u) => u.email)];
  
    try {
      onLoading(true);
      for (const email of recipients) {
        await sendInvite({ email, documentId: selectedDocId, user_id: userId }); // ✅ added user_id
      }
      alert('Invites sent!');
      setSelectedUsers([]);
      setEmails([]);
      setSelectedDocId(null);
    } catch {
      alert('Failed to send invites.');
    } finally {
      onLoading(false);
    }
  };
  

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Send for Signature</h2>

      {/* Select Document */}
      <div>
        <label className="text-sm font-semibold block mb-1 text-gray-700">Signed Document</label>
        <select
          className="w-full p-2 border rounded"
          value={selectedDocId ?? ''}
          onChange={(e) => setSelectedDocId(Number(e.target.value))}
        >
          <option value="">-- Select a Signed Document --</option>
          {documents.filter((d) => d.signed_file).map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.title}
            </option>
          ))}
        </select>
        {documents.filter((d) => d.signed_file).length === 0 && (
          <p className="text-sm text-red-500 mt-1">No signed documents available.</p>
        )}
      </div>

      {/* Select Users */}
      <div>
        <label className="text-sm font-semibold block mb-1 text-gray-700">Select Users</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {users.map((user) => (
            <label key={user.id} className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={selectedUsers.some((u) => u.id === user.id)}
                onChange={(e) =>
                  setSelectedUsers((prev) =>
                    e.target.checked
                      ? [...prev, user]
                      : prev.filter((u) => u.id !== user.id)
                  )
                }
              />
              <span>{user.email}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Add Emails */}
      <div>
        <label className="text-sm font-semibold block mb-1 text-gray-700">Additional Emails</label>
        <div className="flex space-x-2">
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddEmail()}
            placeholder="Press Enter to add"
            className="flex-1 p-2 border rounded"
          />
          <button onClick={handleAddEmail} className="bg-indigo-600 text-white px-4 py-2 rounded">
            Add
          </button>
        </div>
        {emails.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {emails.map((email, idx) => (
              <span
                key={idx}
                className="bg-gray-200 text-sm px-3 py-1 rounded-full flex items-center gap-1"
              >
                {email}
                <XMarkIcon
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => setEmails(emails.filter((e) => e !== email))}
                />
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Send Invites
        </button>
      </div>
    </div>
  );
};

export default SendToSignSection;
