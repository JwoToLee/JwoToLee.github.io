
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CSVUploader from "@/components/CSVUploader";
import AuditMatrixPanel from "./AuditMatrixPanel";

const ImportPanel = () => {
  const handleMatrixImported = () => {
    // Refresh data if needed
    console.log("Matrix imported");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Import Historical Findings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Upload CSV files with historical audit findings. These will be used to pre-populate relevant fields during new audits.
          </p>
          <CSVUploader />
        </CardContent>
      </Card>
      
      <AuditMatrixPanel onMatrixImported={handleMatrixImported} />
    </div>
  );
};

export default ImportPanel;
