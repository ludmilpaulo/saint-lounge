export interface Career {
    id: number;
    title: string;
    location: string;
    description: string;
    requirements: string;
    created_at: string;
  }
  
  export interface JobApplication {
    id: number;
    full_name: string;
    email: string;
    resume: string;
    cover_letter: string;
    submitted_at: string;
    career: Career;
    status: 'submitted' | 'processing' | 'review' | 'approved' | 'rejected';
  }
  