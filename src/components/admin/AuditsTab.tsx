
import React, { useState } from 'react';
import AuditTable from '@/components/admin/AuditTable';
import AuditForm from '@/components/admin/AuditForm';
import { Audit } from "@/types/audit";

interface AuditsTabProps {
  audits: Audit[];
  onAddAudit: (audit: Audit) => void;
  onUpdateAudit: (audit: Audit) => void;
  onDeleteAudit: (id: string) => void;
}

const AuditsTab: React.FC<AuditsTabProps> = ({ 
  audits, 
  onAddAudit, 
  onUpdateAudit, 
  onDeleteAudit 
}) => {
  const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null);

  const handleAuditSubmit = (audit: Audit) => {
    if (selectedAudit) {
      onUpdateAudit(audit);
    } else {
      onAddAudit(audit);
    }
    setSelectedAudit(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="col-span-1">
        <h2 className="text-xl font-semibold mb-4">Audits</h2>
        <AuditTable
          audits={audits}
          onEdit={setSelectedAudit}
          onDelete={onDeleteAudit}
        />
      </div>
      <div className="col-span-1">
        <h2 className="text-xl font-semibold mb-4">Add/Edit Audit</h2>
        <AuditForm
          onSubmit={handleAuditSubmit}
          initialValues={selectedAudit}
        />
      </div>
    </div>
  );
};

export default AuditsTab;
