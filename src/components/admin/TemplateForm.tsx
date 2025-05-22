
import React, { useState, useEffect } from 'react';
import { AuditTemplate } from "@/types/audit";
import { AUDIT_TYPES } from '@/utils/auditStorage';

interface TemplateFormProps {
  onSubmit: (template: AuditTemplate) => void;
  initialValues: AuditTemplate | null;
}

const TemplateForm: React.FC<TemplateFormProps> = ({ onSubmit, initialValues }) => {
  const [type, setType] = useState(AUDIT_TYPES[0]);
  const [subtype, setSubtype] = useState('');
  const [objective, setObjective] = useState('');
  const [scope, setScope] = useState('');
  const [introduction, setIntroduction] = useState('');
  
  useEffect(() => {
    if (initialValues) {
      setType(initialValues.type);
      setSubtype(initialValues.subtype || '');
      setObjective(initialValues.objective);
      setScope(initialValues.scope);
      setIntroduction(initialValues.introduction);
    } else {
      // Reset for new template
      setType(AUDIT_TYPES[0]);
      setSubtype('');
      setObjective('');
      setScope('');
      setIntroduction('');
    }
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const templateToSave: AuditTemplate = {
      type,
      subtype: subtype || undefined,
      objective,
      scope,
      introduction
    };
    
    onSubmit(templateToSave);
    
    // Reset if it's a new template
    if (!initialValues) {
      setObjective('');
      setScope('');
      setIntroduction('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-md">
      <div>
        <label className="block text-sm font-medium mb-1">Audit Type</label>
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
        <label className="block text-sm font-medium mb-1">Default Objective</label>
        <textarea
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
          rows={3}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Default Scope</label>
        <textarea
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
          rows={3}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Default Introduction</label>
        <textarea
          value={introduction}
          onChange={(e) => setIntroduction(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
          rows={3}
        />
      </div>
      
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {initialValues ? 'Update Template' : 'Add Template'}
      </button>
    </form>
  );
};

export default TemplateForm;
