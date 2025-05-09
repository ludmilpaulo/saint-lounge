'use client';

import React, { useState } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import EmailUploader from './campaigns/EmailUploader';
import PreviewModal from './campaigns/PreviewModal';
import UserEmailSelector from './campaigns/UserEmailSelector';
import { baseAPI } from '@/utils/variables';

const EmailEditor = dynamic(() => import('./campaigns/EmailEditor'), { ssr: false });

export default function NewCampaignPage() {
  const [useBackendUsers, setUseBackendUsers] = useState(true);
  const [customEmails, setCustomEmails] = useState<string[]>([]);
  const [backendEmails, setBackendEmails] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const getRecipients = () => (useBackendUsers ? backendEmails : customEmails);

  const handleSubmit = async () => {
    const response = await axios.post(`${baseAPI}/email/campaigns/`, {
      title: subject,
      subject,
      body_html: body,
      recipient_list: getRecipients(),
    });
    const campaignId = response.data.id;
    await axios.post(`/api/campaigns/${campaignId}/send/`);
    alert('📬 Campaign sent!');
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Create New Email Campaign</h1>

      <label className="block mb-2 font-medium">Email Subject</label>
      <input
        className="w-full border px-3 py-2 rounded mb-6"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <label className="block mb-2 font-medium">Email Body (HTML)</label>
      <EmailEditor value={body} onChange={setBody} />

      <div className="my-6">
        <label className="block mb-2 font-medium">Recipient Source</label>
        <div className="flex gap-4 mb-4">
          <button
            className={`px-4 py-2 rounded ${useBackendUsers ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setUseBackendUsers(true)}
          >
            Use Registered Users
          </button>
          <button
            className={`px-4 py-2 rounded ${!useBackendUsers ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setUseBackendUsers(false)}
          >
            Upload My List
          </button>
        </div>

        {useBackendUsers ? (
          <UserEmailSelector emails={backendEmails} setEmails={setBackendEmails} />
        ) : (
          <EmailUploader emails={customEmails} setEmails={setCustomEmails} />
        )}
      </div>

      <div className="flex gap-4">
        <button onClick={() => setShowPreview(true)} className="px-4 py-2 bg-gray-700 text-white rounded">
          Preview
        </button>
        <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded">
          Send Campaign
        </button>
      </div>

      <PreviewModal show={showPreview} setShow={setShowPreview} subject={subject} html={body} />
    </div>
  );
}
