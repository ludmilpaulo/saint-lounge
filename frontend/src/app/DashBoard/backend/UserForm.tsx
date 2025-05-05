import React from 'react';
import { Group, User } from '@/types/userTypes';

interface Props {
  form: Omit<User, 'id'>;
  groups: Group[];
  editing: boolean;
  onChange: (form: Omit<User, 'id'>) => void;
  onSave: () => void;
  onCancel: () => void;
}

const UserForm: React.FC<Props> = ({ form, groups, editing, onChange, onSave, onCancel }) => {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-2">{editing ? 'Edit User' : 'Create User'}</h2>
      <div className="flex flex-col md:flex-row md:items-center gap-2">
        <input
          className="border p-2 flex-1"
          placeholder="Username"
          value={form.username}
          onChange={(e) => onChange({ ...form, username: e.target.value })}
        />
        <input
          className="border p-2 flex-1"
          placeholder="Email"
          value={form.email}
          onChange={(e) => onChange({ ...form, email: e.target.value })}
        />
        <select
          multiple
          className="border p-2 flex-1"
          value={form.groups}
          onChange={(e) =>
            onChange({
              ...form,
              groups: Array.from(e.target.selectedOptions).map((opt) => Number(opt.value)),
            })
          }
        >
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
        <button onClick={onSave} className="bg-blue-600 text-white px-4 py-2 rounded">
          {editing ? 'Update' : 'Create'}
        </button>
        {editing && (
          <button onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded">
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default UserForm;
