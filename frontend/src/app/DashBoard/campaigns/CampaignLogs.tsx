import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseAPI } from '@/utils/variables';

type EmailLog = {
  recipient: string;
  status: string;
  timestamp: string;
  opened: boolean;
};

type Props = {
  campaignId: number;
};

const CampaignLogs: React.FC<Props> = ({ campaignId }) => {
  const [logs, setLogs] = useState<EmailLog[]>([]);

  useEffect(() => {
    axios
      .get(`${baseAPI}/email/campaigns/${campaignId}/logs/`)
      .then((res) => setLogs(res.data))
      .catch((err) => console.error(err));
  }, [campaignId]);

  return (
    <div>
      <h2>Email Logs</h2>
      <table>
        <thead>
          <tr>
            <th>Recipient</th>
            <th>Status</th>
            <th>Opened</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index}>
              <td>{log.recipient}</td>
              <td>{log.status}</td>
              <td>{log.opened ? 'Yes' : 'No'}</td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CampaignLogs;
