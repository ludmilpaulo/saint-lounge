import { fetchGroups, updateGroup, createGroup, deleteGroup } from '@/services/groupService';
import { fetchUsers, updateUser, createUser, deleteUser } from '@/services/userService';
import { User, Group } from '@/types/userTypes';
import React, { useEffect, useState } from 'react';
import GroupForm from './backend/GroupForm';
import GroupList from './backend/GroupList';
import UserForm from './backend/UserForm';
import UserList from './backend/UserList';


const Backend: React.FC = () => {
  const [tab, setTab] = useState<'users' | 'groups'>('users');

const [users, setUsers] = useState<User[]>([]);
const [groups, setGroups] = useState<Group[]>([]);
const [userForm, setUserForm] = useState<Omit<User, 'id'>>({
  username: '',
  email: '',
  groups: [],
});
const [editingUserId, setEditingUserId] = useState<number | null>(null);

// ✅ Add these:
const [groupForm, setGroupForm] = useState<Omit<Group, 'id'>>({ name: '' });
const [editingGroupId, setEditingGroupId] = useState<number | null>(null);


  useEffect(() => {
    loadUsers();
    loadGroups();
  }, []);

  const loadUsers = async () => {
    const res = await fetchUsers();
    setUsers(res.data);
  };

  const loadGroups = async () => {
    const res = await fetchGroups();
    setGroups(res.data);
  };

  const handleUserSave = async () => {
    if (!userForm.username || !userForm.email) return;
    if (editingUserId !== null) {
      await updateUser(editingUserId, userForm);
    } else {
      await createUser(userForm);
    }
    setUserForm({ username: '', email: '', groups: [] });
    setEditingUserId(null);
    loadUsers();
  };

  const handleDeleteUser = async (id: number) => {
    await deleteUser(id);
    loadUsers();
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-6">
        <button
          className={`py-2 px-4 font-medium ${
            tab === 'users' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'
          }`}
          onClick={() => setTab('users')}
        >
          Users
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            tab === 'groups' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'
          }`}
          onClick={() => setTab('groups')}
        >
          Groups
        </button>
      </div>

      {/* Users Tab */}
      {tab === 'users' && (
        <>
          <UserForm
            form={userForm}
            groups={groups}
            editing={editingUserId !== null}
            onChange={setUserForm}
            onSave={handleUserSave}
            onCancel={() => {
              setEditingUserId(null);
              setUserForm({ username: '', email: '', groups: [] });
            }}
          />
          <UserList
            users={users}
            onEdit={(user) => {
              setEditingUserId(user.id);
              setUserForm({
                username: user.username,
                email: user.email,
                groups: user.groups,
              });
            }}
            onDelete={handleDeleteUser}
          />
        </>
      )}

{tab === 'groups' && (
  <>
    <GroupForm
      form={groupForm}
      editing={editingGroupId !== null}
      onChange={setGroupForm}
      onSave={async () => {
        if (groupForm.name.trim() === '') return;
        if (editingGroupId !== null) {
          await updateGroup(editingGroupId, groupForm);
        } else {
          await createGroup(groupForm);
        }
        setGroupForm({ name: '' });
        setEditingGroupId(null);
        loadGroups();
      }}
      onCancel={() => {
        setEditingGroupId(null);
        setGroupForm({ name: '' });
      }}
    />
    <GroupList
      groups={groups}
      onEdit={(group) => {
        setEditingGroupId(group.id);
        setGroupForm({ name: group.name });
      }}
      onDelete={async (id) => {
        await deleteGroup(id);
        loadGroups();
      }}
    />
  </>
)}

    </div>
  );
};

export default Backend;
