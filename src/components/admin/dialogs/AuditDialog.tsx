
import React, { useState, useEffect } from "react";
import { Audit, AssignedUser } from "@/types/audit";
import { User } from "@/types/user";
import { AUDIT_TYPES, AUDIT_STATUSES } from "@/utils/auditStorage";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface AuditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentAudit: Partial<Audit> | null;
  onAuditChange: (field: keyof Audit, value: any) => void;
  onSaveAudit: () => void;
  users: User[];
  onAssignUser: (userId: string) => void;
  onRemoveAssignedUser: (userId: string) => void;
}

const AuditDialog: React.FC<AuditDialogProps> = ({
  isOpen,
  onOpenChange,
  currentAudit,
  onAuditChange,
  onSaveAudit,
  users,
  onAssignUser,
  onRemoveAssignedUser
}) => {
  const [leadAuditorId, setLeadAuditorId] = useState<string>("");

  // Find all Lead Auditor users
  const leadAuditors = users.filter(user => user.role === "Lead Auditor");
  
  // Find all users who can be regular auditors (both Lead Auditors and Auditors)
  const potentialAuditors = users.filter(user => user.role === "Lead Auditor" || user.role === "Auditor");

  // Separate users who are already assigned
  useEffect(() => {
    // Find the lead auditor in the assigned users
    const existingLeadAuditor = currentAudit?.assignedUsers?.find(user => user.role === "Lead Auditor");
    if (existingLeadAuditor) {
      setLeadAuditorId(existingLeadAuditor.id);
    } else {
      setLeadAuditorId("");
    }
  }, [currentAudit]);

  // Handle adding a lead auditor
  const handleAddLeadAuditor = (userId: string) => {
    if (!userId) return;

    const userToAssign = users.find((user) => user.id === userId);
    if (!userToAssign) return;
    
    // First, check if there's already a lead auditor
    const existingLeadIndex = currentAudit?.assignedUsers?.findIndex(u => u.role === "Lead Auditor") ?? -1;
    
    let updatedAssignedUsers = [...(currentAudit?.assignedUsers || [])];
    
    if (existingLeadIndex >= 0) {
      // Replace existing lead auditor
      updatedAssignedUsers[existingLeadIndex] = {
        id: userId,
        username: userToAssign.username,
        role: "Lead Auditor"
      };
    } else {
      // Add new lead auditor
      updatedAssignedUsers = [
        {
          id: userId,
          username: userToAssign.username,
          role: "Lead Auditor"
        },
        ...updatedAssignedUsers
      ];
    }
    
    setLeadAuditorId(userId);
    onAuditChange("assignedUsers", updatedAssignedUsers);
  };

  // Handle adding a regular auditor
  const handleAddAuditor = (userId: string) => {
    if (!userId) return;

    const userToAssign = users.find((user) => user.id === userId);
    if (!userToAssign) return;
    
    // Check if user is already assigned
    const isUserAlreadyAssigned = currentAudit?.assignedUsers?.some(u => u.id === userId);
    
    if (isUserAlreadyAssigned) {
      toast.error("This user is already assigned to the audit");
      return;
    }
    
    const updatedAssignedUsers = [
      ...(currentAudit?.assignedUsers || []),
      {
        id: userId,
        username: userToAssign.username,
        role: "Auditor"  // Always assign as regular auditor
      }
    ];
    
    onAuditChange("assignedUsers", updatedAssignedUsers);
  };

  // Validate dates before saving
  const handleSave = () => {
    if (currentAudit?.startDate && currentAudit?.endDate) {
      const startDate = new Date(currentAudit.startDate);
      const endDate = new Date(currentAudit.endDate);
      
      if (endDate < startDate) {
        toast.error("End date cannot be earlier than start date");
        return;
      }
    }
    
    onSaveAudit();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {currentAudit && currentAudit.createdAt 
              ? "Edit Audit" 
              : "Add New Audit"}
          </DialogTitle>
          <DialogDescription>
            Enter the audit details below
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="pr-4 max-h-[70vh]">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reference" className="text-right">
                Reference
              </Label>
              <Input
                id="reference"
                value={currentAudit?.reference || ""}
                onChange={(e) => onAuditChange("reference", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={currentAudit?.name || ""}
                onChange={(e) => onAuditChange("name", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select 
                value={currentAudit?.type} 
                onValueChange={(value) => onAuditChange("type", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select audit type" />
                </SelectTrigger>
                <SelectContent>
                  {AUDIT_TYPES.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={currentAudit?.description || ""}
                onChange={(e) => onAuditChange("description", e.target.value)}
                className="col-span-3"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={currentAudit?.startDate || ""}
                onChange={(e) => onAuditChange("startDate", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                End Date
              </Label>
              <Input
                id="endDate"
                type="date"
                value={currentAudit?.endDate || ""}
                onChange={(e) => onAuditChange("endDate", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select 
                value={currentAudit?.status || "Not Started"} 
                onValueChange={(value) => onAuditChange("status", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {AUDIT_STATUSES.map(status => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Lead Auditor Section */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right">Lead Auditor</Label>
              <div className="col-span-3">
                <Select 
                  value={leadAuditorId} 
                  onValueChange={handleAddLeadAuditor}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Lead Auditor" />
                  </SelectTrigger>
                  <SelectContent>
                    {leadAuditors.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.username} ({user.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Regular Auditor Section */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right">Auditors</Label>
              <div className="col-span-3 space-y-4">
                <div className="flex gap-2">
                  <Select onValueChange={handleAddAuditor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add Auditor" />
                    </SelectTrigger>
                    <SelectContent>
                      {potentialAuditors.map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.username} ({user.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {currentAudit?.assignedUsers && currentAudit.assignedUsers.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(currentAudit.assignedUsers as AssignedUser[])
                        .sort((a, b) => a.role === "Lead Auditor" ? -1 : b.role === "Lead Auditor" ? 1 : 0)
                        .map(user => (
                        <TableRow key={user.id}>
                          <TableCell className={user.role === "Lead Auditor" ? "font-bold" : ""}>
                            {user.username}
                          </TableCell>
                          <TableCell>{user.role}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => onRemoveAssignedUser(user.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-sm text-gray-500">No users assigned</p>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuditDialog;
