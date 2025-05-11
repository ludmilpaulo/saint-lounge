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
  created_at: string;
};

type EmailLog = {
  recipient: string;
  status: string;
  timestamp: string;
  opened: boolean;
};

export default function Campaign() {
  const [activeTab, setActiveTab] = useState<'create' | 'logs'>('create');

  // Campaign form state
  const [useBackendUsers, setUseBackendUsers] = useState(true);
  const [customEmails, setCustomEmails] = useState<string[]>([]);
  const [backendEmails, setBackendEmails] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | ''>('');

  // Logs
  const [logs, setLogs] = useState<EmailLog[]>([]);

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
    setSubject('');
    setBody('');
    setCustomEmails([]);
    setBackendEmails([]);
  };

  const fetchLogs = async (campaignId: number) => {
    const res = await axios.get(`${baseAPI}/email/campaigns/${campaignId}/logs/`);
    setLogs(res.data);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">📢 Email Campaign Manager</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2 rounded ${
            activeTab === 'create' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          ✍️ Create Campaign
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded ${
            activeTab === 'logs' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          📊 View Logs
        </button>
      </div>

      {activeTab === 'create' && (
        <>
          {/* Clone Dropdown */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              📂 Clone Previous Campaign
            </label>
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

          {/* Subject */}
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

          {/* Editor */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">HTML Body</label>
            <EmailEditor value={body} onChange={setBody} />
          </div>

          {/* Recipients */}
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
        </>
      )}

      {activeTab === 'logs' && (
        <div className="mt-6">
          <label className="block mb-2 font-medium text-sm text-gray-700">
            Select Campaign to View Logs
          </label>
          <select
            onChange={(e) => fetchLogs(Number(e.target.value))}
            className="w-full border border-gray-300 px-3 py-2 rounded text-sm mb-4"
          >
            <option value="">Choose a campaign</option>
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>

          {logs.length > 0 ? (
            <div className="overflow-auto max-h-[400px] border rounded shadow">
              <table className="w-full text-sm table-auto">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Recipient</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Opened</th>
                    <th className="p-2">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2">{log.recipient}</td>
                      <td className="p-2">{log.status}</td>
                      <td className="p-2">{log.opened ? '✅' : '—'}</td>
                      <td className="p-2">{new Date(log.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No logs available yet for this campaign.</p>
          )}
        </div>
      )}
    </div>
  );
}
