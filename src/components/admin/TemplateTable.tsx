
import React from 'react';
import { AuditTemplate } from "@/types/audit";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TemplateTableProps {
  templates: AuditTemplate[];
  onEdit: (template: AuditTemplate) => void;
  onDelete: (type: string) => void;
}

const TemplateTable: React.FC<TemplateTableProps> = ({ templates, onEdit, onDelete }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Subtype</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {templates.map((template) => (
          <TableRow key={template.type}>
            <TableCell>{template.type}</TableCell>
            <TableCell>{template.subtype || "-"}</TableCell>
            <TableCell>
              <button 
                onClick={() => onEdit(template)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
              >
                Edit
              </button>
              <button 
                onClick={() => onDelete(template.type)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
              >
                Delete
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TemplateTable;
