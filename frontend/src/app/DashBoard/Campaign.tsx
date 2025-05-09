'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import EmailUploader from './campaigns/EmailUploader';
import PreviewModal from './campaigns/PreviewModal';
import UserEmailSelector from './campaigns/UserEmailSelector';
import { baseAPI } from '@/utils/variables';

const EmailEditor = dynamic(() => import('./campaigns/EmailEditor'), { ssr: false });

type Campaign = {
  id: number;
  title: string;
  subject: string;
  body_html: string;
  recipient_list: string[];
};

export default function Campaign() {
  const [useBackendUsers, setUseBackendUsers] = useState(true);
  const [customEmails, setCustomEmails] = useState<string[]>([]);
  const [backendEmails, setBackendEmails] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | ''>('');

  useEffect(() => {
    axios.get(`${baseAPI}/email/campaigns/`).then((res) => {
      setCampaigns(res.data);
    });
  }, []);

  const handleCloneCampaign = (id: number) => {
    const campaign = campaigns.find((c) => c.id === id);
    if (campaign) {
      setSubject(campaign.subject);
      setBody(campaign.body_html);
      setCustomEmails(campaign.recipient_list || []);
      setUseBackendUsers(false);
    }
  };

  const getRecipients = () => (useBackendUsers ? backendEmails : customEmails);

  const handleSubmit = async () => {
    const response = await axios.post(`${baseAPI}/email/campaigns/`, {
      title: subject || 'Untitled Campaign',
      subject,
      body_html: body,
      recipient_list: getRecipients(),
    });
    const campaignId = response.data.id;
    await axios.post(`${baseAPI}/email/campaigns/${campaignId}/send/`);
    alert('📬 Campaign sent!');
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">📧 Create New Email Campaign</h1>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">📂 Clone Previous Campaign</label>
        <select
          value={selectedCampaignId}
          onChange={(e) => {
            const id = Number(e.target.value);
            setSelectedCampaignId(id);
            handleCloneCampaign(id);
          }}
          className="w-full border border-gray-300 px-3 py-2 rounded text-sm"
        >
          <option value="">Select previous campaign</option>
          {campaigns.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded text-sm shadow-sm"
          placeholder="Enter campaign subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">HTML Body</label>
        <EmailEditor value={body} onChange={setBody} />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Source</label>
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 rounded ${
              useBackendUsers ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setUseBackendUsers(true)}
          >
            Use Registered Users
          </button>
          <button
            className={`px-4 py-2 rounded ${
              !useBackendUsers ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setUseBackendUsers(false)}
          >
            Upload Custom List
          </button>
        </div>

        <div className="mt-4">
          {useBackendUsers ? (
            <UserEmailSelector emails={backendEmails} setEmails={setBackendEmails} />
          ) : (
            <EmailUploader emails={customEmails} setEmails={setCustomEmails} />
          )}
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => setShowPreview(true)}
          className="px-4 py-2 bg-gray-700 text-white rounded shadow"
        >
          🔍 Preview
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-600 text-white rounded shadow"
        >
          🚀 Send Campaign
        </button>
      </div>

      <PreviewModal show={showPreview} setShow={setShowPreview} subject={subject} html={body} />
    </div>
  );
}
