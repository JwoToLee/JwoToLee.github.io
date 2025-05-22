
import React, { useState } from 'react';
import TemplateTable from '@/components/admin/TemplateTable';
import TemplateForm from '@/components/admin/TemplateForm';
import { AuditTemplate } from "@/types/audit";

interface TemplatesTabProps {
  templates: AuditTemplate[];
  onAddTemplate: (template: AuditTemplate) => void;
  onUpdateTemplate: (template: AuditTemplate) => void;
  onDeleteTemplate: (id: string) => void;
}

const TemplatesTab: React.FC<TemplatesTabProps> = ({ 
  templates, 
  onAddTemplate, 
  onUpdateTemplate, 
  onDeleteTemplate 
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<AuditTemplate | null>(null);

  const handleTemplateSubmit = (template: AuditTemplate) => {
    if (selectedTemplate) {
      onUpdateTemplate(template);
    } else {
      onAddTemplate(template);
    }
    setSelectedTemplate(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="col-span-1">
        <h2 className="text-xl font-semibold mb-4">Templates</h2>
        <TemplateTable
          templates={templates}
          onEdit={setSelectedTemplate}
          onDelete={onDeleteTemplate}
        />
      </div>
      <div className="col-span-1">
        <h2 className="text-xl font-semibold mb-4">Add/Edit Template</h2>
        <TemplateForm
          onSubmit={handleTemplateSubmit}
          initialValues={selectedTemplate}
        />
      </div>
    </div>
  );
};

export default TemplatesTab;
