
import React from "react";
import { AuditTemplate } from "@/types/audit";
import { AUDIT_TYPES } from "@/utils/auditStorage";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TemplateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentTemplate: AuditTemplate | null;
  onTemplateChange: (field: keyof AuditTemplate, value: string) => void;
  onSaveTemplate: () => void;
}

const TemplateDialog: React.FC<TemplateDialogProps> = ({
  isOpen,
  onOpenChange,
  currentTemplate,
  onTemplateChange,
  onSaveTemplate,
}) => {
  if (!currentTemplate) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {currentTemplate ? "Edit Audit Template" : "Add New Audit Template"}
          </DialogTitle>
          <DialogDescription>
            Customize the template for the selected audit type
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Audit Type
            </Label>
            <div className="col-span-3">
              <Select 
                value={currentTemplate.type} 
                onValueChange={(value) => onTemplateChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select audit type" />
                </SelectTrigger>
                <SelectContent>
                  {AUDIT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="objective" className="text-right">
              Objective
            </Label>
            <Textarea
              id="objective"
              value={currentTemplate.objective}
              onChange={(e) => onTemplateChange("objective", e.target.value)}
              className="col-span-3"
              rows={3}
              placeholder="Enter the standard objective for this audit type"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="scope" className="text-right">
              Scope
            </Label>
            <Textarea
              id="scope"
              value={currentTemplate.scope}
              onChange={(e) => onTemplateChange("scope", e.target.value)}
              className="col-span-3"
              rows={3}
              placeholder="Enter the standard scope for this audit type"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="introduction" className="text-right">
              Introduction
            </Label>
            <Textarea
              id="introduction"
              value={currentTemplate.introduction}
              onChange={(e) => onTemplateChange("introduction", e.target.value)}
              className="col-span-3"
              rows={4}
              placeholder="Enter the standard introduction for this audit type"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSaveTemplate}>Save Template</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateDialog;
