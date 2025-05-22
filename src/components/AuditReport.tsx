
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { exportToExcel } from "@/utils/excelExport";
import { getAuditByRef, getFindingsByAuditRef } from "@/utils/auditStorage";
import { AuditFinding, StaffData, ToolData, ComponentData, MaintenanceData } from "@/types/audit";
import { Download } from "lucide-react";

interface AuditReportProps {
  auditRef: string;
  auditType: string;
  findings: Record<string, any>;
  onNewAudit: () => void;
}

const AuditReport: React.FC<AuditReportProps> = ({
  auditRef,
  auditType,
  findings
}) => {
  const [auditFindings, setAuditFindings] = useState<AuditFinding[]>([]);
  const [audit, setAudit] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const auditData = getAuditByRef(auditRef);
    setAudit(auditData);

    const savedFindings = getFindingsByAuditRef(auditRef);
    setAuditFindings(savedFindings);
  }, [auditRef]);

  const handleExportReport = () => {
    if (!audit) return;

    try {
      exportToExcel(auditRef, audit.name, [], findings);
      toast({
        title: "Report Exported",
        description: "The audit report has been exported successfully.",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the report.",
        variant: "destructive",
      });
    }
  };

  // Helper function to display object details
  const displayItems = (items: any[] | undefined) => {
    if (!items || items.length === 0) return <p className="text-gray-500">No items found</p>;

    return (
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={item.id} className="bg-gray-50 p-3 rounded-md">
            <h4 className="text-sm font-semibold mb-1">Item {index + 1}</h4>
            {Object.entries(item)
              .filter(([key]) => key !== 'id') // Skip the ID field
              .map(([key, value]) => (
                <p key={key} className="text-sm">
                  <span className="font-medium">{key}: </span> 
                  {String(value)}
                </p>
              ))}
          </div>
        ))}
      </div>
    );
  };

  // Function to render staff data
  const renderStaffData = (finding: AuditFinding) => {
    if (!finding.staffData || finding.staffData.length === 0) return null;
    
    return (
      <div className="my-4">
        <h3 className="font-medium text-gray-700 mb-2">Staff Information:</h3>
        {displayItems(finding.staffData as StaffData[])}
      </div>
    );
  };

  // Function to render tool data
  const renderToolData = (finding: AuditFinding) => {
    if (!finding.toolData || finding.toolData.length === 0) return null;
    
    return (
      <div className="my-4">
        <h3 className="font-medium text-gray-700 mb-2">Tool Information:</h3>
        {displayItems(finding.toolData as ToolData[])}
      </div>
    );
  };

  // Function to render component data
  const renderComponentData = (finding: AuditFinding) => {
    if (!finding.componentData || finding.componentData.length === 0) return null;
    
    return (
      <div className="my-4">
        <h3 className="font-medium text-gray-700 mb-2">Component Information:</h3>
        {displayItems(finding.componentData as ComponentData[])}
      </div>
    );
  };

  // Function to render maintenance data
  const renderMaintenanceData = (finding: AuditFinding) => {
    if (!finding.maintenanceData || finding.maintenanceData.length === 0) return null;
    
    return (
      <div className="my-4">
        <h3 className="font-medium text-gray-700 mb-2">Maintenance Data:</h3>
        {displayItems(finding.maintenanceData as MaintenanceData[])}
      </div>
    );
  };

  if (!audit) return <div className="p-6">Loading audit details...</div>;

  const hasFindings = auditFindings.some(finding => finding.finding);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Audit Report</h2>
          <p className="text-gray-600">
            Review and export the audit results for {audit.name}
          </p>
        </div>
        <Button onClick={handleExportReport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Audit Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Audit Reference</p>
              <p className="text-gray-900">{auditRef}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Audit Name / Description</p>
              <p className="text-gray-900">{audit.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Type</p>
              <p className="text-gray-900">{audit.type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Start Date</p>
              <p className="text-gray-900">{audit.startDate ? new Date(audit.startDate).toLocaleDateString() : 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">End Date</p>
              <p className="text-gray-900">{audit.endDate ? new Date(audit.endDate).toLocaleDateString() : 'Not set'}</p>
            </div>
          </div>
          
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Audit Scope</p>
              <p className="text-gray-900 whitespace-pre-wrap">{audit.scope || "Not defined"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Audit Objective</p>
              <p className="text-gray-900 whitespace-pre-wrap">{audit.objective || "Not defined"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <h3 className="text-xl font-semibold text-gray-800 mb-4">Findings</h3>
      
      {!hasFindings && (
        <Alert className="mb-6">
          <AlertDescription>
            No findings were identified in this audit.
          </AlertDescription>
        </Alert>
      )}
      
      {auditFindings.map((finding) => (
        finding.finding ? (
          <Card key={finding.id} className="mb-4">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{finding.clause || finding.checklistItemId}</CardTitle>
                {finding.findingLevel && (
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    finding.findingLevel === 'Level 1' ? 'bg-red-100 text-red-800' : 
                    finding.findingLevel === 'Level 2' ? 'bg-amber-100 text-amber-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {finding.findingLevel}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-gray-700">Finding:</p>
                  <p className="text-gray-600">{finding.finding}</p>
                </div>
                {finding.observation && (
                  <div>
                    <p className="font-medium text-gray-700">Remark / Comments:</p>
                    <p className="text-gray-600">{finding.observation}</p>
                  </div>
                )}
                
                {renderStaffData(finding)}
                {renderToolData(finding)}
                {renderComponentData(finding)}
                {renderMaintenanceData(finding)}
              </div>
            </CardContent>
          </Card>
        ) : null
      ))}
    </div>
  );
};

export default AuditReport;
