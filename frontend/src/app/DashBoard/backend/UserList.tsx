import React from 'react';
import { User } from '@/types/userTypes';

interface Props {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

const UserList: React.FC<Props> = ({ users, onEdit, onDelete }) => (
  <ul className="space-y-2">
    {users.map((user) => (
      <li key={user.id} className="border p-3 rounded flex justify-between items-center">
        <div>
          <p className="font-medium">{user.username}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
          <p className="text-xs text-gray-400">Groups: {user.groups.join(', ')}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onEdit(user)} className="text-blue-600">Edit</button>
          <button onClick={() => onDelete(user.id)} className="text-red-600">Delete</button>
        </div>
      </li>
    ))}
  </ul>
);

export default UserList;
