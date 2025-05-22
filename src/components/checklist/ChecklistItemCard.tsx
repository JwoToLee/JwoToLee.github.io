
import React, { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AuditChecklistItem } from '@/utils/auditMatrix';
import { Plus, PaperclipIcon, X, FileIcon, FileImage } from 'lucide-react';

interface ChecklistItemCardProps {
  id?: string;
  item: AuditChecklistItem;
  finding: {
    hasFinding: boolean;
    finding: string;
    observation: string;
    findingLevel?: 'Level 1' | 'Level 2' | 'Observation';
    staffData?: any[];
    toolData?: any[];
    componentData?: any[];
    maintenanceData?: any[];
    attachments?: {name: string, type: string, data: string}[];
  };
  hasHistoricalFinding: boolean;
  onFindingChange: (id: string, checked: boolean) => void;
  onFindingTextChange: (id: string, value: string) => void;
  onObservationChange: (id: string, value: string) => void;
  onFindingLevelChange?: (id: string, value: 'Level 1' | 'Level 2' | 'Observation') => void;
  onBlur: () => void;
  onOpenPopup?: () => void;
  onAddAttachment?: (id: string, file: File) => void;
  onRemoveAttachment?: (id: string, attachmentIndex: number) => void;
  showStaffPopup?: boolean;
  showToolsPopup?: boolean;
  showComponentsPopup?: boolean;
  showDataPopup?: boolean;
  isActive?: boolean;
}

const ChecklistItemCard: React.FC<ChecklistItemCardProps> = ({
  id,
  item,
  finding,
  hasHistoricalFinding,
  onFindingChange,
  onFindingTextChange,
  onObservationChange,
  onFindingLevelChange,
  onBlur,
  onOpenPopup,
  onAddAttachment,
  onRemoveAttachment,
  showStaffPopup = false,
  showToolsPopup = false,
  showComponentsPopup = false,
  showDataPopup = false,
  isActive = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0] && onAddAttachment) {
      onAddAttachment(item.id, files[0]);
      // Clear the input to allow the same file to be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <FileImage className="w-4 h-4 mr-1" />;
    } else if (fileType === "application/pdf") {
      return <FileIcon className="w-4 h-4 mr-1" />;
    } else {
      return <FileIcon className="w-4 h-4 mr-1" />;
    }
  };
  
  const renderAttachments = () => {
    if (!finding.attachments || finding.attachments.length === 0) return null;
    
    return (
      <div className="mt-2 space-y-2">
        <p className="text-sm font-medium text-gray-700">Attachments:</p>
        <div className="flex flex-wrap gap-2">
          {finding.attachments.map((attachment, index) => (
            <div 
              key={index} 
              className="flex items-center bg-gray-100 rounded px-2 py-1 text-xs"
            >
              {getFileIcon(attachment.type)}
              <span className="truncate max-w-[150px]">{attachment.name}</span>
              <button 
                className="ml-1 text-gray-500 hover:text-red-500"
                onClick={() => onRemoveAttachment && onRemoveAttachment(item.id, index)}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card 
      id={id}
      className={`border-l-4 ${hasHistoricalFinding ? 'border-l-amber-500' : isActive ? 'border-l-blue-600' : 'border-l-blue-500'} ${isActive ? 'ring-2 ring-blue-200' : ''}`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-start justify-between">
          <div>
            <span className="font-medium">{item.clause}</span>
            <span className="text-sm text-gray-500 ml-2">({item.required ? "Required" : "Optional"})</span>
          </div>
          <div className="flex space-x-2">
            {(showStaffPopup || showToolsPopup || showComponentsPopup || showDataPopup) && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1" 
                onClick={onOpenPopup}
              >
                <Plus className="h-4 w-4" />
                {showStaffPopup && "Add Staff"}
                {showToolsPopup && "Add Tools"}
                {showComponentsPopup && "Add Components"}
                {showDataPopup && "Add Data"}
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="font-medium text-gray-700">Objective:</p>
            <p className="text-gray-600">{item.objective}</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Description:</p>
            <p className="text-gray-600">{item.description}</p>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id={`finding-${item.id}`}
              checked={finding?.hasFinding || false}
              onCheckedChange={(checked) => onFindingChange(item.id, checked === true)}
            />
            <label
              htmlFor={`finding-${item.id}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Finding Identified
            </label>
          </div>
          
          {finding?.hasFinding && (
            <>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">
                    Finding Details{item.required ? "*" : ""}:
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Finding Level:</label>
                    <Select 
                      value={finding.findingLevel || "Observation"} 
                      onValueChange={(value) => onFindingLevelChange && onFindingLevelChange(item.id, value as 'Level 1' | 'Level 2' | 'Observation')}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Level 1">Level 1</SelectItem>
                        <SelectItem value="Level 2">Level 2</SelectItem>
                        <SelectItem value="Observation">Observation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Textarea
                  value={finding?.finding || ""}
                  onChange={(e) => onFindingTextChange(item.id, e.target.value)}
                  onBlur={onBlur}
                  placeholder="Describe the finding in detail"
                  className={`resize-none ${hasHistoricalFinding ? 'bg-amber-50' : ''}`}
                  rows={3}
                />
                
                {/* Attachment functionality */}
                <div className="flex items-center justify-between mt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 text-sm"
                  >
                    <PaperclipIcon className="h-4 w-4" />
                    Attach File
                  </Button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden"
                    onChange={handleFileUpload}
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                  />
                </div>
                
                {renderAttachments()}
              </div>
            </>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Remark / Comments:
            </label>
            <Textarea
              value={finding?.observation || ""}
              onChange={(e) => onObservationChange(item.id, e.target.value)}
              onBlur={onBlur}
              placeholder="Add any additional remarks or comments"
              className="resize-none"
              rows={2}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChecklistItemCard;
