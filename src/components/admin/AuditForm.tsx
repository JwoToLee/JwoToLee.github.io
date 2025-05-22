
import React, { useState, useEffect } from 'react';
import { Audit, AssignedUser } from "@/types/audit";
import { User } from "@/types/user";
import { getUsers } from '@/utils/auditStorage';
import { AUDIT_TYPES, AUDIT_STATUSES, generateUniqueAuditRef } from '@/utils/auditStorage';

interface AuditFormProps {
  onSubmit: (audit: Audit) => void;
  initialValues: Audit | null;
}

const AuditForm: React.FC<AuditFormProps> = ({ onSubmit, initialValues }) => {
  const [reference, setReference] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState(AUDIT_TYPES[0]);
  const [subtype, setSubtype] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState(AUDIT_STATUSES[0]);
  const [assignedUsers, setAssignedUsers] = useState<AssignedUser[]>([]);
  const [objective, setObjective] = useState('');
  const [scope, setScope] = useState('');
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  
  useEffect(() => {
    setAvailableUsers(getUsers());
    
    if (!initialValues && !reference) {
      setReference(generateUniqueAuditRef());
    }
  }, []);

  useEffect(() => {
    if (initialValues) {
      setReference(initialValues.reference);
      setName(initialValues.name);
      setType(initialValues.type);
      setSubtype(initialValues.subtype || '');
      setDescription(initialValues.description);
      setStartDate(initialValues.startDate);
      setEndDate(initialValues.endDate);
      setStatus(initialValues.status);
      setAssignedUsers(initialValues.assignedUsers);
      setObjective(initialValues.objective || '');
      setScope(initialValues.scope || '');
    }
  }, [initialValues]);

  const handleAssignUser = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUserId = e.target.value;
    if (!selectedUserId) return;
    
    const user = availableUsers.find(u => u.id === selectedUserId);
    if (user && !assignedUsers.some(au => au.id === user.id)) {
      setAssignedUsers([
        ...assignedUsers,
        { id: user.id, username: user.username, role: user.role }
      ]);
    }
  };

  const removeAssignedUser = (userId: string) => {
    setAssignedUsers(assignedUsers.filter(au => au.id !== userId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const auditToSave: Audit = {
      id: initialValues?.id || crypto.randomUUID(),
      reference,
      name,
      type,
      subtype: subtype || undefined,
      description,
      startDate,
      endDate,
      status,
      assignedUsers,
      objective: objective || undefined,
      scope: scope || undefined,
      createdAt: initialValues?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      introduction: initialValues?.introduction || undefined
    };
    
    onSubmit(auditToSave);
    
    // Reset if it's a new audit
    if (!initialValues) {
      setName('');
      setType(AUDIT_TYPES[0]);
      setSubtype('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setStatus(AUDIT_STATUSES[0]);
      setAssignedUsers([]);
      setObjective('');
      setScope('');
      setReference(generateUniqueAuditRef());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-md">
      <div>
        <label className="block text-sm font-medium mb-1">Reference</label>
        <input
          type="text"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
          readOnly={!!initialValues}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        >
          {AUDIT_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Subtype (Optional)</label>
        <input
          type="text"
          value={subtype}
          onChange={(e) => setSubtype(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        >
          {AUDIT_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Objective</label>
        <textarea
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Scope</label>
        <textarea
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Assigned Users</label>
        <div className="flex gap-2">
          <select
            onChange={handleAssignUser}
            className="flex-grow p-2 border rounded-md"
            defaultValue=""
          >
            <option value="">Select User</option>
            {availableUsers.map(user => (
              <option key={user.id} value={user.id}>{user.username} ({user.role})</option>
            ))}
          </select>
        </div>
        
        <div className="mt-2 space-y-2">
          {assignedUsers.map(user => (
            <div key={user.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
              <span>{user.username} ({user.role})</span>
              <button
                type="button"
                onClick={() => removeAssignedUser(user.id)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {initialValues ? 'Update Audit' : 'Add Audit'}
      </button>
    </form>
  );
};

export default AuditForm;
