
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash } from 'lucide-react';

export interface Component {
  id: string;
  batchNumber: string;
  description: string;
  arc: string;
}

interface ComponentsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (components: Component[]) => void;
  initialComponents?: Component[];
}

const ComponentsDialog: React.FC<ComponentsDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialComponents = []
}) => {
  const [components, setComponents] = useState<Component[]>(
    initialComponents.length > 0 ? initialComponents : [{ id: crypto.randomUUID(), batchNumber: '', description: '', arc: '' }]
  );

  const addComponent = () => {
    setComponents([...components, { 
      id: crypto.randomUUID(), 
      batchNumber: '', 
      description: '', 
      arc: '' 
    }]);
  };

  const removeComponent = (id: string) => {
    setComponents(components.filter(component => component.id !== id));
  };

  const updateComponent = (id: string, field: string, value: string) => {
    setComponents(components.map(component => 
      component.id === id ? { ...component, [field]: value } : component
    ));
  };

  const handleSave = () => {
    onSave(components);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Components</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 my-4 max-h-[60vh] overflow-y-auto">
          {components.map((component, index) => (
            <div key={component.id} className="grid grid-cols-[1fr_2fr_1fr_auto] gap-3 items-center p-3 bg-gray-50 rounded-md">
              <Input
                placeholder="Component B/N"
                value={component.batchNumber}
                onChange={(e) => updateComponent(component.id, 'batchNumber', e.target.value)}
              />
              <Input
                placeholder="Component Description"
                value={component.description}
                onChange={(e) => updateComponent(component.id, 'description', e.target.value)}
              />
              <Input
                placeholder="Component ARC"
                value={component.arc}
                onChange={(e) => updateComponent(component.id, 'arc', e.target.value)}
              />
              <Button
                type="button"
                size="icon"
                variant="destructive"
                onClick={() => removeComponent(component.id)}
                disabled={components.length === 1}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button onClick={addComponent} type="button" className="w-full" variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Add Component
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

export default ComponentsDialog;
