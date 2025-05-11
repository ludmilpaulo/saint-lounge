import { baseAPI } from '@/utils/variables';
import API from './api';
import { Invite } from '@/types/invite';

export const getSentInvites = async (): Promise<Invite[]> => {
  const res = await API.get(`${baseAPI}/doc/invites/`);
  return res.data;
};

export const resendInvite = async (inviteId: number): Promise<void> => {
  await API.post(`${baseAPI}/doc/invites/${inviteId}/resend/`);
};

// inviteService.ts
export const sendInvite = async (payload: { email: string; documentId: number; user_id: number }) => {
  return await API.post(`${baseAPI}/doc/send-invite/`, payload);
};
