
import React from 'react';
import { Audit } from "@/types/audit";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AuditTableProps {
  audits: Audit[];
  onEdit: (audit: Audit) => void;
  onDelete: (id: string) => void;
}

const AuditTable: React.FC<AuditTableProps> = ({ audits, onEdit, onDelete }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Reference</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {audits.map((audit) => (
          <TableRow key={audit.id}>
            <TableCell>{audit.reference}</TableCell>
            <TableCell>{audit.name}</TableCell>
            <TableCell>{audit.type}</TableCell>
            <TableCell>{audit.status}</TableCell>
            <TableCell>
              <button 
                onClick={() => onEdit(audit)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
              >
                Edit
              </button>
              <button 
                onClick={() => onDelete(audit.id)}
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

export default AuditTable;
