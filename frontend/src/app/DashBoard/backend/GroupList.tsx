import React from 'react';
import { Group } from '@/types/userTypes';

interface Props {
  groups: Group[];
  onEdit: (group: Group) => void;
  onDelete: (id: number) => void;
}

const GroupList: React.FC<Props> = ({ groups, onEdit, onDelete }) => (
  <ul className="space-y-2">
    {groups.map((group) => (
      <li key={group.id} className="border p-3 rounded flex justify-between items-center">
        <span>{group.name}</span>
        <div className="flex gap-2">
          <button onClick={() => onEdit(group)} className="text-blue-600">Edit</button>
          <button onClick={() => onDelete(group.id)} className="text-red-600">Delete</button>
        </div>
      </li>
    ))}
  </ul>
);

export default GroupList;
