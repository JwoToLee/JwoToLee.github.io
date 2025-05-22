
import React, { useState } from 'react';
import UserTable from '@/components/admin/UserTable';
import UserForm from '@/components/admin/UserForm';
import { User } from "@/types/user";

interface UsersTabProps {
  users: User[];
  onAddUser: (user: User) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
}

const UsersTab: React.FC<UsersTabProps> = ({ 
  users, 
  onAddUser, 
  onUpdateUser, 
  onDeleteUser 
}) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleUserSubmit = (user: User) => {
    if (selectedUser) {
      onUpdateUser(user);
    } else {
      onAddUser(user);
    }
    setSelectedUser(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="col-span-1">
        <h2 className="text-xl font-semibold mb-4">Users</h2>
        <UserTable
          users={users}
          onEdit={setSelectedUser}
          onDelete={onDeleteUser}
        />
      </div>
      <div className="col-span-1">
        <h2 className="text-xl font-semibold mb-4">Add/Edit User</h2>
        <UserForm
          onSubmit={handleUserSubmit}
          initialValues={selectedUser}
        />
      </div>
    </div>
  );
};

export default UsersTab;
