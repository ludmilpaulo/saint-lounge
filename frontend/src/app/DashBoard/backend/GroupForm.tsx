import React from 'react';
import { Group } from '@/types/userTypes';

interface Props {
  form: Omit<Group, 'id'>;
  editing: boolean;
  onChange: (form: Omit<Group, 'id'>) => void;
  onSave: () => void;
  onCancel: () => void;
}

const GroupForm: React.FC<Props> = ({ form, editing, onChange, onSave, onCancel }) => {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-2">{editing ? 'Edit Group' : 'Create Group'}</h2>
      <div className="flex flex-col md:flex-row md:items-center gap-2">
        <input
          className="border p-2 flex-1"
          placeholder="Group Name"
          value={form.name}
          onChange={(e) => onChange({ name: e.target.value })}
        />
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

export default GroupForm;
