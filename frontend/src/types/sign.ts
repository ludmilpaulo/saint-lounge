
  
  export interface SignatureInvite {
    id: number;
    email: string;
    token: string;
    signed: boolean;
    sent_at: string;
    document: Document;
  }
  