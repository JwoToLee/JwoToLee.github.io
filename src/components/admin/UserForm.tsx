
import React, { useState, useEffect } from 'react';
import { User, UserRole } from "@/types/user";

interface UserFormProps {
  onSubmit: (user: User) => void;
  initialValues: User | null;
}

const UserForm: React.FC<UserFormProps> = ({ onSubmit, initialValues }) => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<UserRole>('General');
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    if (initialValues) {
      setUsername(initialValues.username);
      setRole(initialValues.role);
      setIsAdmin(initialValues.isAdmin);
    } else {
      // Reset form for new user
      setUsername('');
      setRole('General');
      setIsAdmin(false);
    }
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const userToSave: User = {
      id: initialValues?.id || crypto.randomUUID(),
      username,
      role,
      isAdmin,
    };
    
    onSubmit(userToSave);
    
    // Clear form if it was a new user
    if (!initialValues) {
      setUsername('');
      setRole('General');
      setIsAdmin(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-md">
      <div>
        <label className="block text-sm font-medium mb-1">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          className="w-full p-2 border rounded-md"
        >
          <option value="General">General</option>
          <option value="Auditor">Auditor</option>
          <option value="Lead Auditor">Lead Auditor</option>
          <option value="Admin">Admin</option>
        </select>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={isAdmin}
          onChange={(e) => setIsAdmin(e.target.checked)}
          className="mr-2"
        />
        <label>Admin Access</label>
      </div>
      
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {initialValues ? 'Update User' : 'Add User'}
      </button>
    </form>
  );
};

export default UserForm;
