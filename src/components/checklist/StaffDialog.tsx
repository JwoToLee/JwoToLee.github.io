
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash } from 'lucide-react';

export interface StaffMember {
  id: string;
  staffNumber: string;
  staffName: string;
  staffScope: string;
}

interface StaffDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (staff: StaffMember[]) => void;
  initialStaff?: StaffMember[];
}

const StaffDialog: React.FC<StaffDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialStaff = []
}) => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(
    initialStaff.length > 0 ? initialStaff : [{ id: crypto.randomUUID(), staffNumber: '', staffName: '', staffScope: '' }]
  );

  const addStaffMember = () => {
    setStaffMembers([...staffMembers, { 
      id: crypto.randomUUID(), 
      staffNumber: '', 
      staffName: '', 
      staffScope: '' 
    }]);
  };

  const removeStaffMember = (id: string) => {
    setStaffMembers(staffMembers.filter(member => member.id !== id));
  };

  const updateStaffMember = (id: string, field: string, value: string) => {
    setStaffMembers(staffMembers.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const handleSave = () => {
    onSave(staffMembers);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Staff Members</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 my-4 max-h-[60vh] overflow-y-auto">
          {staffMembers.map((member, index) => (
            <div key={member.id} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 items-center p-3 bg-gray-50 rounded-md">
              <Input
                placeholder="Staff Number"
                value={member.staffNumber}
                onChange={(e) => updateStaffMember(member.id, 'staffNumber', e.target.value)}
              />
              <Input
                placeholder="Staff Name"
                value={member.staffName}
                onChange={(e) => updateStaffMember(member.id, 'staffName', e.target.value)}
              />
              <Input
                placeholder="Staff Scope"
                value={member.staffScope}
                onChange={(e) => updateStaffMember(member.id, 'staffScope', e.target.value)}
              />
              <Button
                type="button"
                size="icon"
                variant="destructive"
                onClick={() => removeStaffMember(member.id)}
                disabled={staffMembers.length === 1}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button onClick={addStaffMember} type="button" className="w-full" variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Add Staff Member
          </Button>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StaffDialog;
