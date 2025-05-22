
import React from "react";
import { AuditTemplate } from "@/types/audit";
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { FileEdit, Plus } from "lucide-react";

interface TemplatesListProps {
  templates: AuditTemplate[];
  onAddTemplate: () => void;
  onEditTemplate: (template: AuditTemplate) => void;
}

const TemplatesList: React.FC<TemplatesListProps> = ({
  templates,
  onAddTemplate,
  onEditTemplate,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Audit Templates</h2>
        <Button onClick={onAddTemplate}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Template
        </Button>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Audit Type</TableHead>
              <TableHead>Objective</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                  No templates found
                </TableCell>
              </TableRow>
            ) : (
              templates.map((template, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{template.type}</TableCell>
                  <TableCell className="truncate max-w-xs">
                    {template.objective && template.objective.length > 100
                      ? `${template.objective.substring(0, 100)}...`
                      : template.objective}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onEditTemplate(template)}
                      className="inline-flex items-center"
                    >
                      <FileEdit className="h-4 w-4 mr-1" />
                      Edit
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

export default TemplatesList;
