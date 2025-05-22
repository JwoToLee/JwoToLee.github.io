
import React from "react";
import { Audit } from "@/types/audit";
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { FileEdit, Trash2, Plus } from "lucide-react";
import { format } from "date-fns";

interface AuditsListProps {
  audits: Audit[];
  onAddAudit: () => void;
  onEditAudit: (audit: Audit) => void;
  onDeleteAudit: (audit: Audit) => void;
}

const AuditsList: React.FC<AuditsListProps> = ({
  audits,
  onAddAudit,
  onEditAudit,
  onDeleteAudit,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manage Audits</h2>
        <Button onClick={onAddAudit}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Audit
        </Button>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {audits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                  No audits found
                </TableCell>
              </TableRow>
            ) : (
              audits.map((audit) => (
                <TableRow key={audit.reference}>
                  <TableCell className="font-medium">{audit.reference}</TableCell>
                  <TableCell>{audit.name}</TableCell>
                  <TableCell>{audit.type}</TableCell>
                  <TableCell>{audit.status}</TableCell>
                  <TableCell>
                    {audit.startDate ? format(new Date(audit.startDate), 'dd MMM yyyy') : 'Not set'}
                  </TableCell>
                  <TableCell>
                    {audit.endDate ? format(new Date(audit.endDate), 'dd MMM yyyy') : 'Not set'}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onEditAudit(audit)}
                      className="inline-flex items-center"
                    >
                      <FileEdit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onDeleteAudit(audit)}
                      className="inline-flex items-center text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AuditsList;
