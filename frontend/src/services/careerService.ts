import axios from 'axios';
import { Career } from '@/types/Career';
import { baseAPI } from '@/utils/variables';

export const fetchCareers = async (): Promise<Career[]> => {
  const res = await axios.get(`${baseAPI}/careers/careers/`);
  return res.data;
};

export const fetchCareerById = async (id: number): Promise<Career> => {
  const res = await axios.get(`${baseAPI}/careers/careers/${id}/`);
  return res.data;
};
