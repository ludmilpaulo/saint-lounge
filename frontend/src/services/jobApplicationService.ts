
import { JobApplication } from '@/types/Career';
import axios from 'axios';

export const submitJobApplication = async (data: JobApplication): Promise<void> => {
  const formData = new FormData();
  formData.append('full_name', data.full_name);
  formData.append('email', data.email);
  formData.append('resume', data.resume);
  formData.append('cover_letter', data.cover_letter);
  formData.append('career', String(data.career));

  await axios.post('/api/job-applications/', formData);
};
