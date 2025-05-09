'use client';
import { useEffect } from 'react';
import axios from 'axios';
import { baseAPI } from '@/utils/variables';

type Props = {
  emails: string[];
  setEmails: (emails: string[]) => void;
};

export default function UserEmailSelector({ emails, setEmails }: Props) {
  useEffect(() => {
    const fetchEmails = async () => {
      const res = await axios.get(`${baseAPI}/email/campaigns/user_emails/`);
      setEmails(res.data);
    };
    fetchEmails();
  }, []);

  return (
    <div className="text-sm text-gray-700">
      ✅ {emails.length} registered user emails loaded.
    </div>
  );
}
