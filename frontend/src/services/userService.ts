import api from './api';
import { User } from '../types/userTypes';

export const fetchUsers = () => api.get<User[]>('/account/users/');
export const createUser = (data: Omit<User, 'id'>) => api.post<User>('/account/users/', data);
export const updateUser = (id: number, data: Partial<User>) => api.put<User>(`/account/users/${id}/`, data);
export const deleteUser = (id: number) => api.delete<void>(`/account/users/${id}/`);
