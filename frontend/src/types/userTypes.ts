// types/userTypes.ts
export interface Group {
    id: number;
    name: string;
  }
  
  export interface User {
    id: number;
    username: string;
    email: string;
    groups: number[]; // department group IDs
  }
  
  export interface UserProfile {
    id: number;
    user: number;
    phone_number: string;
    address: string;
    city: string;
    country: string;
    job_title: string;
    hire_date: string;
    is_active: boolean;
    cv?: File | null;
    id_document?: File | null;
    certificate?: File | null;
    driver_license?: File | null;
  }
  