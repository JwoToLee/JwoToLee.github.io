import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, FileCheck, FileX, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from 'xlsx';

interface AuditMatrixPanelProps {
  onMatrixImported: () => void;
}

const AuditMatrixPanel: React.FC<AuditMatrixPanelProps> = ({ onMatrixImported }) => {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setImporting(true);
    setError(null);

    try {
      const data = await readExcelFile(file);
      if (validateMatrixData(data)) {
        saveMatrixData(data);
        toast({
          title: "Matrix Imported Successfully",
          description: `Imported ${data.length} audit matrix items.`,
        });
        onMatrixImported();
        setFile(null);
      }
    } catch (err) {
      setError(`Import failed: ${err instanceof Error ? err.message : String(err)}`);
      toast({
        title: "Import Failed",
        description: "There was an issue with the matrix file format.",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  const readExcelFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          if (!data) throw new Error("Failed to read file");
          
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          resolve(jsonData);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const validateMatrixData = (data: any[]): boolean => {
    if (!data || data.length === 0) {
      setError("File contains no data");
      return false;
    }
    
    // Check for required fields in the first item
    const firstItem = data[0];
    const requiredFields = ['clause', 'auditType', 'description', 'objective'];
    const missingFields = requiredFields.filter(field => !firstItem.hasOwnProperty(field));
    
    if (missingFields.length > 0) {
      setError(`Missing required fields: ${missingFields.join(', ')}`);
      return false;
    }
    
    return true;
  };

  const saveMatrixData = (data: any[]) => {
    localStorage.setItem('auditMatrix', JSON.stringify(data));
  };

  const handleExport = () => {
    setExportLoading(true);
    try {
      // Retrieve the audit matrix data
      const matrixData = localStorage.getItem('auditMatrix');
      const data = matrixData ? JSON.parse(matrixData) : [];
      
      if (data.length === 0) {
        toast({
          title: "Export Failed",
          description: "No audit matrix data available to export.",
          variant: "destructive",
        });
        return;
      }
      
      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Audit Matrix');
      
      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
      
      // Create download link
      const fileName = `audit_matrix_${new Date().toISOString().split('T')[0]}.xlsx`;
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Successful",
        description: "Audit matrix has been exported to Excel.",
      });
    } catch (err) {
      toast({
        title: "Export Failed",
        description: `Error: ${err instanceof Error ? err.message : String(err)}`,
        variant: "destructive",
      });
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Audit Matrix Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Import or export the audit matrix to manage the checklist items that appear during audits.
          </p>
          
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-3">
            <div className="grid gap-2">
              <Label htmlFor="matrix-file">Import Audit Matrix</Label>
              <Input
                id="matrix-file"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
              />
              <p className="text-xs text-muted-foreground">
                Excel file with columns: clause, auditType, description, objective, required, subtype (optional)
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleImport} 
                disabled={importing || !file}
                className="flex items-center gap-2"
              >
                {importing ? "Importing..." : "Import Matrix"}
                {!importing && <Check className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleExport}
                disabled={exportLoading}
                className="flex items-center gap-2"
              >
                {exportLoading ? "Exporting..." : "Export Matrix"}
                {!exportLoading && <Check className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditMatrixPanel;
