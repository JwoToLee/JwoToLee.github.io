import React, { useState, useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { exportToExcel } from '@/utils/excelExport';
import { AuditChecklistItem, getAuditChecklist } from '@/utils/auditMatrix';
import { getAuditByRef, getFindingsByAuditRef, saveFindings, getHistoricalFindings } from '@/utils/auditStorage';
import ChecklistItemCard from './checklist/ChecklistItemCard';
import StaffDialog from './checklist/StaffDialog';
import ToolsDialog from './checklist/ToolsDialog';
import ComponentsDialog from './checklist/ComponentsDialog';
import DataDialog from './checklist/DataDialog';
import ChecklistNavigation from './checklist/ChecklistNavigation';

interface AuditChecklistProps {
  auditRef: string;
  auditType: string;
  onComplete: (findings: Record<string, any>) => void;
}

const AuditChecklist = ({ auditRef, auditType, onComplete }: AuditChecklistProps) => {
  const [checklist, setChecklist] = useState<AuditChecklistItem[]>([]);
  const [findings, setFindings] = useState<Record<string, { 
    hasFinding: boolean; 
    finding: string; 
    observation: string;
    findingLevel?: 'Level 1' | 'Level 2' | 'Observation';
    staffData?: any[];
    toolData?: any[];
    componentData?: any[];
    maintenanceData?: any[];
    attachments?: {name: string, type: string, data: string}[];
  }>>({});
  
  const [currentDialogId, setCurrentDialogId] = useState<string | null>(null);
  const [isStaffDialogOpen, setIsStaffDialogOpen] = useState(false);
  const [isToolsDialogOpen, setIsToolsDialogOpen] = useState(false);
  const [isComponentsDialogOpen, setIsComponentsDialogOpen] = useState(false);
  const [isDataDialogOpen, setIsDataDialogOpen] = useState(false);
  const [audit, setAudit] = useState<any>(null);
  const [activeClauseId, setActiveClauseId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  
  const { toast } = useToast();
  
  useEffect(() => {
    const auditData = getAuditByRef(auditRef);
    setAudit(auditData);
    
    const subtype = auditData?.subtype;
    const items = getAuditChecklist(auditType, subtype);
    setChecklist(items);
    
    // Set the first clause as active by default
    if (items.length > 0) {
      setActiveClauseId(items[0].id);
    }
    
    // Get previous findings specifically for this audit
    const auditFindings = getFindingsByAuditRef(auditRef);
    
    // If we already have findings for this specific audit, use them
    if (auditFindings.length > 0) {
      const initialFindings: Record<string, any> = {};
      
      auditFindings.forEach(finding => {
        initialFindings[finding.checklistItemId] = {
          hasFinding: finding.finding ? true : false,
          finding: finding.finding || "",
          observation: finding.observation || "",
          findingLevel: finding.findingLevel || "Observation",
          staffData: finding.staffData || [],
          toolData: finding.toolData || [],
          componentData: finding.componentData || [],
          maintenanceData: finding.maintenanceData || [],
          attachments: finding.attachments || []
        };
      });
      
      // For any checklist items not in previous findings, initialize them
      items.forEach(item => {
        if (!initialFindings[item.id]) {
          initialFindings[item.id] = { 
            hasFinding: false, 
            finding: "", 
            observation: "",
            findingLevel: "Observation",
            attachments: []
          };
        }
      });
      
      setFindings(initialFindings);
      setInitialized(true);
      return;
    }
    
    // Otherwise initialize findings
    const initialFindings: Record<string, any> = {};
    items.forEach(item => {
      initialFindings[item.id] = { 
        hasFinding: false, 
        finding: "", 
        observation: "",
        findingLevel: "Observation",
        attachments: []
      };
    });

    // Check for historical findings from database
    const historicalFindings = getHistoricalFindings();
    let totalHistoricalCount = 0;
    
    // Pre-fill with historical findings if available
    items.forEach(item => {
      // Match CSV findings by comparing their clause/reference to the checklist item's clause
      const matchingHistoricalFindings = historicalFindings.filter(f => {
        // Both properties might be in the CSV data, so check both
        const csvClause = f.clause || f.reference || "";
        return csvClause.toLowerCase() === item.clause.toLowerCase();
      });
      
      if (matchingHistoricalFindings.length > 0) {
        totalHistoricalCount += matchingHistoricalFindings.length;
        
        // Take the most recent finding based on date if available
        const historicalFinding = matchingHistoricalFindings.sort((a, b) => {
          const dateA = a.date ? new Date(a.date).getTime() : 0;
          const dateB = b.date ? new Date(b.date).getTime() : 0;
          return dateB - dateA;
        })[0];
        
        initialFindings[item.id] = {
          ...initialFindings[item.id],
          finding: `[Previous finding from ${historicalFinding.year || new Date().getFullYear()}]: ${historicalFinding.finding || ""}`,
          observation: initialFindings[item.id].observation || historicalFinding.observation || "",
          findingLevel: historicalFinding.findingLevel || "Observation",
          isHistorical: true
        };
      }
    });
    
    if (totalHistoricalCount > 0) {
      toast({
        title: "Historical Findings Available",
        description: `${totalHistoricalCount} previous findings found for this audit.`,
      });
    }
    
    setFindings(initialFindings);
    setInitialized(true);
  }, [auditRef, auditType, toast]);

  const handleFindingChange = (id: string, checked: boolean) => {
    const updatedFindings = {
      ...findings,
      [id]: { ...findings[id], hasFinding: checked }
    };
    setFindings(updatedFindings);
    autoSaveFindings(updatedFindings);
  };

  const handleFindingTextChange = (id: string, value: string) => {
    const updatedFindings = {
      ...findings,
      [id]: { ...findings[id], finding: value }
    };
    setFindings(updatedFindings);
  };

  const handleObservationChange = (id: string, value: string) => {
    const updatedFindings = {
      ...findings,
      [id]: { ...findings[id], observation: value }
    };
    setFindings(updatedFindings);
  };
  
  const handleFindingLevelChange = (id: string, value: 'Level 1' | 'Level 2' | 'Observation') => {
    const updatedFindings = {
      ...findings,
      [id]: { ...findings[id], findingLevel: value }
    };
    setFindings(updatedFindings);
    autoSaveFindings(updatedFindings);
  };

  const handleAddAttachment = (id: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result as string;
      const updatedFindings = {
        ...findings,
        [id]: { 
          ...findings[id], 
          attachments: [
            ...(findings[id].attachments || []),
            { name: file.name, type: file.type, data: base64data }
          ]
        }
      };
      setFindings(updatedFindings);
      autoSaveFindings(updatedFindings);
      
      toast({
        title: "Attachment added",
        description: `${file.name} has been attached to the finding.`,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAttachment = (id: string, attachmentIndex: number) => {
    const updatedAttachments = [...(findings[id].attachments || [])];
    updatedAttachments.splice(attachmentIndex, 1);
    
    const updatedFindings = {
      ...findings,
      [id]: { 
        ...findings[id], 
        attachments: updatedAttachments
      }
    };
    setFindings(updatedFindings);
    autoSaveFindings(updatedFindings);
  };

  // Handle staff dialog open
  const handleOpenStaffDialog = (id: string) => {
    setCurrentDialogId(id);
    setIsStaffDialogOpen(true);
  };

  // Handle tools dialog open
  const handleOpenToolsDialog = (id: string) => {
    setCurrentDialogId(id);
    setIsToolsDialogOpen(true);
  };

  // Handle components dialog open
  const handleOpenComponentsDialog = (id: string) => {
    setCurrentDialogId(id);
    setIsComponentsDialogOpen(true);
  };

  // Handle data dialog open
  const handleOpenDataDialog = (id: string) => {
    setCurrentDialogId(id);
    setIsDataDialogOpen(true);
  };

  // Save staff data
  const handleSaveStaffData = (staffData: any[]) => {
    if (!currentDialogId) return;
    
    const updatedFindings = {
      ...findings,
      [currentDialogId]: { 
        ...findings[currentDialogId],
        staffData 
      }
    };
    setFindings(updatedFindings);
    autoSaveFindings(updatedFindings);
    setIsStaffDialogOpen(false);
  };

  // Save tools data
  const handleSaveToolData = (toolData: any[]) => {
    if (!currentDialogId) return;
    
    const updatedFindings = {
      ...findings,
      [currentDialogId]: { 
        ...findings[currentDialogId],
        toolData 
      }
    };
    setFindings(updatedFindings);
    autoSaveFindings(updatedFindings);
    setIsToolsDialogOpen(false);
  };

  // Save components data
  const handleSaveComponentData = (componentData: any[]) => {
    if (!currentDialogId) return;
    
    const updatedFindings = {
      ...findings,
      [currentDialogId]: { 
        ...findings[currentDialogId],
        componentData 
      }
    };
    setFindings(updatedFindings);
    autoSaveFindings(updatedFindings);
    setIsComponentsDialogOpen(false);
  };

  // Save maintenance data
  const handleSaveMaintenanceData = (maintenanceData: any[]) => {
    if (!currentDialogId) return;
    
    const updatedFindings = {
      ...findings,
      [currentDialogId]: { 
        ...findings[currentDialogId],
        maintenanceData 
      }
    };
    setFindings(updatedFindings);
    autoSaveFindings(updatedFindings);
    setIsDataDialogOpen(false);
  };

  // Auto save findings when a field loses focus
  const handleBlur = () => {
    autoSaveFindings(findings);
  };

  const autoSaveFindings = (currentFindings: typeof findings) => {
    // Only save findings if we're fully initialized
    if (!initialized) return;
    
    // Convert findings to the format expected by saveFindings
    const findingsToSave = Object.entries(currentFindings).map(([checklistItemId, finding]) => ({
      id: crypto.randomUUID(),
      auditRef,
      checklistItemId,
      finding: finding.finding?.startsWith('[Previous finding from') && !finding.hasFinding 
        ? '' // Clear historical findings if not marked as a finding
        : finding.finding,
      observation: finding.observation,
      findingLevel: finding.findingLevel || "Observation",
      year: new Date().getFullYear().toString(),
      isHistorical: false,
      staffData: finding.staffData || [],
      toolData: finding.toolData || [],
      componentData: finding.componentData || [],
      maintenanceData: finding.maintenanceData || [],
      attachments: finding.attachments || []
    }));
    
    saveFindings(findingsToSave);
  };

  const handleSubmit = () => {
    // Validate that all required items have findings details if finding is checked
    const incompleteItems = checklist
      .filter(item => item.required && findings[item.id].hasFinding && !findings[item.id].finding)
      .map(item => item.clause);
    
    if (incompleteItems.length > 0) {
      toast({
        title: "Incomplete Audit",
        description: `Please add finding details for: ${incompleteItems.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    // Auto save final state
    autoSaveFindings(findings);
    
    // Clean up historical findings text markers before passing to report
    const cleanFindings = { ...findings };
    Object.keys(cleanFindings).forEach(key => {
      const finding = cleanFindings[key];
      if (finding.finding?.startsWith('[Previous finding from') && !finding.hasFinding) {
        cleanFindings[key] = {
          ...finding,
          finding: '' // Remove historical finding text if not marked as a finding
        };
      }
    });
    
    onComplete(cleanFindings);
  };

  const handleExport = () => {
    const audit = getAuditByRef(auditRef);
    if (audit) {
      exportToExcel(auditRef, audit.name, checklist, findings);
      toast({
        title: "Export Successful",
        description: "The audit checklist has been exported to Excel.",
      });
    }
  };
  
  const scrollToClause = (id: string) => {
    setActiveClauseId(id);
    const element = document.getElementById(`checklist-item-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!initialized || checklist.length === 0 || !audit) {
    return <div className="p-6">Loading checklist...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            {auditType.charAt(0).toUpperCase() + auditType.slice(1)} Audit Checklist
          </h2>
          <p className="text-gray-600">
            Complete the checklist by identifying findings and adding observations
          </p>
          {audit && (
            <p className="text-sm font-medium text-blue-600 mt-1">
              Audit Reference: {auditRef} - {audit.name}
            </p>
          )}
        </div>
        <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export to Excel
        </Button>
      </div>

      <div className="flex">
        <ChecklistNavigation 
          clauses={checklist.map(item => ({ id: item.id, clause: item.clause }))}
          activeClauseId={activeClauseId}
          onClauseClick={scrollToClause}
        />
        
        <div className="flex-1 space-y-6 ml-4">
          {checklist.map((item) => {
            const finding = findings[item.id] || { 
              hasFinding: false, 
              finding: "", 
              observation: "", 
              findingLevel: "Observation",
              attachments: []
            };
            
            const hasHistoricalFinding = finding.finding?.startsWith('[Previous finding');
            
            // Determine the type of popup button to show
            const showStaffPopup = item.clause.includes("145.A.35");
            const showToolsPopup = item.clause.includes("145.A.40");
            const showComponentsPopup = item.clause.includes("145.A.42");
            const showDataPopup = item.clause.includes("145.A.45");
            
            return (
              <ChecklistItemCard
                key={item.id}
                id={`checklist-item-${item.id}`}
                item={item}
                finding={finding}
                hasHistoricalFinding={hasHistoricalFinding}
                onFindingChange={handleFindingChange}
                onFindingTextChange={handleFindingTextChange}
                onObservationChange={handleObservationChange}
                onFindingLevelChange={handleFindingLevelChange}
                onBlur={handleBlur}
                onAddAttachment={handleAddAttachment}
                onRemoveAttachment={handleRemoveAttachment}
                onOpenPopup={() => {
                  if (showStaffPopup) handleOpenStaffDialog(item.id);
                  if (showToolsPopup) handleOpenToolsDialog(item.id);
                  if (showComponentsPopup) handleOpenComponentsDialog(item.id);
                  if (showDataPopup) handleOpenDataDialog(item.id);
                }}
                showStaffPopup={showStaffPopup}
                showToolsPopup={showToolsPopup}
                showComponentsPopup={showComponentsPopup}
                showDataPopup={showDataPopup}
                isActive={activeClauseId === item.id}
              />
            );
          })}
        </div>
      </div>
      
      <div className="mt-8 flex justify-end">
        <Button onClick={handleSubmit} className="flex items-center gap-2">
          <Check className="h-4 w-4" />
          Complete Audit
        </Button>
      </div>

      {/* Staff Dialog */}
      <StaffDialog
        isOpen={isStaffDialogOpen}
        onClose={() => setIsStaffDialogOpen(false)}
        onSave={handleSaveStaffData}
        initialStaff={currentDialogId ? findings[currentDialogId]?.staffData : []}
      />
      
      {/* Tools Dialog */}
      <ToolsDialog
        isOpen={isToolsDialogOpen}
        onClose={() => setIsToolsDialogOpen(false)}
        onSave={handleSaveToolData}
        initialTools={currentDialogId ? findings[currentDialogId]?.toolData : []}
      />
      
      {/* Components Dialog */}
      <ComponentsDialog
        isOpen={isComponentsDialogOpen}
        onClose={() => setIsComponentsDialogOpen(false)}
        onSave={handleSaveComponentData}
        initialComponents={currentDialogId ? findings[currentDialogId]?.componentData : []}
      />
      
      {/* Data Dialog */}
      <DataDialog
        isOpen={isDataDialogOpen}
        onClose={() => setIsDataDialogOpen(false)}
        onSave={handleSaveMaintenanceData}
        initialData={currentDialogId ? findings[currentDialogId]?.maintenanceData : []}
      />
    </div>
  );
};

export default AuditChecklist;
