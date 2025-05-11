export interface Invite {
    id: number;
    email: string;
    document: number;
    status: 'pending' | 'completed' | 'failed';
    sent_at: string;
    signed_file?: string; 
  }
  