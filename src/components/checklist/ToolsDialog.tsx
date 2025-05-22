
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';
import { ToolData } from "@/types/audit";

interface ToolsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tools: ToolData[]) => void;
  initialTools?: ToolData[];
}

const ToolsDialog: React.FC<ToolsDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTools = []
}) => {
  const [tools, setTools] = useState<ToolData[]>(
    initialTools?.length > 0 ? initialTools : [{ id: crypto.randomUUID(), serialNumber: '', description: '', dueDate: '' }]
  );

  const addTool = () => {
    setTools([...tools, { 
      id: crypto.randomUUID(), 
      serialNumber: '', 
      description: '', 
      dueDate: '' 
    }]);
  };

  const removeTool = (id: string) => {
    setTools(tools.filter(tool => tool.id !== id));
  };

  const updateTool = (id: string, field: string, value: string) => {
    setTools(tools.map(tool => 
      tool.id === id ? { ...tool, [field]: value } : tool
    ));
  };

  const handleSave = () => {
    onSave(tools);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Tools</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 my-4 max-h-[60vh] overflow-y-auto">
          {tools.map((tool, index) => (
            <div key={tool.id} className="grid grid-cols-[1fr_2fr_1fr_auto] gap-3 items-center p-3 bg-gray-50 rounded-md">
              <Input
                placeholder="Tool S/N"
                value={tool.serialNumber}
                onChange={(e) => updateTool(tool.id, 'serialNumber', e.target.value)}
              />
              <Input
                placeholder="Tool Description"
                value={tool.description}
                onChange={(e) => updateTool(tool.id, 'description', e.target.value)}
              />
              <Input
                placeholder="Due Date"
                type="date"
                value={tool.dueDate}
                onChange={(e) => updateTool(tool.id, 'dueDate', e.target.value)}
              />
              <Button
                type="button"
                size="icon"
                variant="destructive"
                onClick={() => removeTool(tool.id)}
                disabled={tools.length === 1}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button onClick={addTool} type="button" className="w-full" variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Add Tool
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

export default ToolsDialog;
