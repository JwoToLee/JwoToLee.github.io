
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash } from 'lucide-react';

export interface MaintenanceData {
  id: string;
  reference: string;
  taskName: string;
  operationNumber: string;
  revisionIndicator: string;
}

interface DataDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: MaintenanceData[]) => void;
  initialData?: MaintenanceData[];
}

const DataDialog: React.FC<DataDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData = []
}) => {
  const [dataItems, setDataItems] = useState<MaintenanceData[]>(
    initialData.length > 0 ? initialData : [{ id: crypto.randomUUID(), reference: '', taskName: '', operationNumber: '', revisionIndicator: '' }]
  );

  const addDataItem = () => {
    setDataItems([...dataItems, { 
      id: crypto.randomUUID(), 
      reference: '', 
      taskName: '', 
      operationNumber: '', 
      revisionIndicator: ''
    }]);
  };

  const removeDataItem = (id: string) => {
    setDataItems(dataItems.filter(item => item.id !== id));
  };

  const updateDataItem = (id: string, field: string, value: string) => {
    setDataItems(dataItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSave = () => {
    onSave(dataItems);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Add Maintenance Data</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 my-4 max-h-[60vh] overflow-y-auto">
          {dataItems.map((item, index) => (
            <div key={item.id} className="grid grid-cols-[1fr_2fr_1fr_1fr_auto] gap-3 items-center p-3 bg-gray-50 rounded-md">
              <Input
                placeholder="PMO/WSO Ref"
                value={item.reference}
                onChange={(e) => updateDataItem(item.id, 'reference', e.target.value)}
              />
              <Input
                placeholder="Task Name"
                value={item.taskName}
                onChange={(e) => updateDataItem(item.id, 'taskName', e.target.value)}
              />
              <Input
                placeholder="OP No"
                value={item.operationNumber}
                onChange={(e) => updateDataItem(item.id, 'operationNumber', e.target.value)}
              />
              <Input
                placeholder="Revision"
                value={item.revisionIndicator}
                onChange={(e) => updateDataItem(item.id, 'revisionIndicator', e.target.value)}
              />
              <Button
                type="button"
                size="icon"
                variant="destructive"
                onClick={() => removeDataItem(item.id)}
                disabled={dataItems.length === 1}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button onClick={addDataItem} type="button" className="w-full" variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Add Data Item
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

export default DataDialog;
