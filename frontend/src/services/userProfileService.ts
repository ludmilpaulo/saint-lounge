import api from './api';
import { UserProfile } from '../types/userTypes';

export const getProfiles = () => api.get<UserProfile[]>('/account/user-profiles/');
export const getProfile = (id: number) => api.get<UserProfile>(`/account/user-profiles/${id}/`);
export const createProfile = (data: FormData) => api.post<UserProfile>('/account/user-profiles/', data, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const updateProfile = (id: number, data: FormData) => api.put<UserProfile>(`/account/user-profiles/${id}/`, data, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const deleteProfile = (id: number) => api.delete(`/account/user-profiles/${id}/`);
