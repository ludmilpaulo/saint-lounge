
import { Career } from '@/types/Career';
import axios from 'axios';

export const fetchCareers = async (): Promise<Career[]> => {
    const res = await axios.get('/api/careers/');
    return res.data;
  };
  
  export const fetchCareerById = async (id: number): Promise<Career> => {
    const res = await axios.get(`/api/careers/${id}/`);
    return res.data;
  };